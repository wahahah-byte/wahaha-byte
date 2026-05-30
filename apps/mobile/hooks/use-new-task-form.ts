import { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Platform, TextInput } from "react-native";
import { router } from "expo-router";
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { CATEGORIES, maxPointsFor, type CreateTaskRequest } from "@wahaha/shared";
import { tasksApi } from "@/lib/api";
import { fmtDate } from "@/lib/task-form-helpers";
import {
  ANIM_MS,
  PRIORITY_API,
  PRIORITY_CYCLE,
  REPEAT_OPTIONS,
  SLIDE_OFFSCREEN,
  type Priority,
} from "@/lib/new-task-helpers";

type ChipRect = { x: number; y: number; width: number; height: number };
type OpenChip = "category" | "repeat" | "points" | "unit" | null;

// All state, animation, and submit logic for the new-task quick-add bar.
export function useNewTaskForm(initialRecurring: boolean) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [repeatValue, setRepeatValue] = useState<string>(initialRecurring ? "daily" : "once");
  const [dueDate, setDueDate] = useState<Date | null>(initialRecurring ? new Date() : null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Currently open chip dropdown — inline overlay keeps keyboard up.
  const [openChip, setOpenChip] = useState<OpenChip>(null);
  // Points: 1-5 recurring, 5/10/15/20/25 one-shot (capped by category).
  const [pointValue, setPointValue] = useState<number>(initialRecurring ? 1 : 10);

  // Counter is recurring-only; cleared when user picks "Once".
  const [hasCounter, setHasCounter] = useState(false);
  const [counterUnit, setCounterUnit] = useState<string>("");
  const [counterGoal, setCounterGoal] = useState<string>("");
  const [capLogAtGoal, setCapLogAtGoal] = useState(false);

  // Detached dropdowns rendered as bar siblings so Android hit-testing works.
  const [barHeight, setBarHeight] = useState(0);
  // chipRow Y within bar; chips report y relative to row, not bar.
  const [chipRowY, setChipRowY] = useState(0);
  const [counterRowY, setCounterRowY] = useState(0);
  const [chipRects, setChipRects] = useState<Record<string, ChipRect>>({});
  function updateChipRect(name: string, rect: ChipRect) {
    setChipRects((prev) => {
      const cur = prev[name];
      if (cur && cur.x === rect.x && cur.y === rect.y && cur.width === rect.width && cur.height === rect.height) {
        return prev;
      }
      return { ...prev, [name]: rect };
    });
  }

  const isRecurring = useMemo(
    () => REPEAT_OPTIONS.find((o) => o.value === repeatValue)?.rule != null,
    [repeatValue],
  );

  useEffect(() => {
    if (!isRecurring && hasCounter) setHasCounter(false);
  }, [isRecurring, hasCounter]);

  // Allowed point values: 1-5 recurring, 5/10/15/20/25 one-shot.
  const pointOptions = useMemo(
    () => (isRecurring
      ? [1, 2, 3, 4, 5]
      : [5, 10, 15, 20, 25].filter((v) => v <= maxPointsFor(category))),
    [isRecurring, category],
  );

  // Snap to nearest allowed value when point set shifts.
  useEffect(() => {
    if (pointOptions.length === 0) return;
    if (!pointOptions.includes(pointValue)) {
      setPointValue(isRecurring ? 1 : pointOptions[pointOptions.length - 1]);
    }
  }, [pointOptions, pointValue, isRecurring]);

  const titleRef = useRef<TextInput>(null);

  // Shared values: kbHeight, slideOff (1=hidden, 0=open), dim, barOpacity.
  const kbHeight = useSharedValue(0);
  const slideOff = useSharedValue(1);
  const dim = useSharedValue(0);
  // Faded to 0 while DatePicker open so bar-drop isn't visible.
  const barOpacity = useSharedValue(1);

  // Track live keyboard height.
  useEffect(() => {
    const showEvt = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvt, (e) => {
      kbHeight.value = withTiming(e.endCoordinates.height, { duration: 200 });
    });
    const hide = Keyboard.addListener(hideEvt, () => {
      kbHeight.value = withTiming(0, { duration: 200 });
    });
    return () => { show.remove(); hide.remove(); };
  }, [kbHeight]);

  // Mount: animate bar up, fade dim, then focus title.
  useEffect(() => {
    slideOff.value = withTiming(0, { duration: ANIM_MS, easing: Easing.bezier(0.2, 0, 0, 1) });
    dim.value = withTiming(0.6, { duration: ANIM_MS });
    const t = setTimeout(() => titleRef.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [slideOff, dim]);

  const barStyle = useAnimatedStyle(() => ({
    opacity: barOpacity.value,
    transform: [
      { translateY: slideOff.value * SLIDE_OFFSCREEN - kbHeight.value },
    ],
  }));

  const dimStyle = useAnimatedStyle(() => ({
    opacity: dim.value,
  }));

  function dismiss() {
    Keyboard.dismiss();
    slideOff.value = withTiming(1, { duration: ANIM_MS, easing: Easing.bezier(0.22, 1, 0.36, 1) });
    dim.value = withTiming(0, { duration: ANIM_MS });
    // Pop route after animation.
    setTimeout(() => router.back(), ANIM_MS + 10);
  }

  // Backdrop closes open dropdown first; only dismisses modal when no dropdown.
  function handleBackdropPress() {
    if (openChip) {
      setOpenChip(null);
      return;
    }
    dismiss();
  }

  async function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed || submitting) return;
    setSubmitting(true);
    setError(null);
    const repeat = REPEAT_OPTIONS.find((o) => o.value === repeatValue);
    const recurring = repeat?.rule != null;
    const trimmedDesc = description.trim();
    const goalNum = counterGoal.trim() === "" ? null : Number(counterGoal);
    const hasValidGoal = goalNum !== null && Number.isFinite(goalNum) && goalNum > 0;
    const counterOn = recurring && hasCounter;
    const dto: CreateTaskRequest = {
      title: trimmed,
      description: trimmedDesc.length > 0 ? trimmedDesc : undefined,
      category,
      priority: PRIORITY_API[priority],
      pointValue: pointValue,
      isRecurring: recurring,
      recurrenceRule: recurring ? repeat!.rule! : undefined,
      dueDate: fmtDate(dueDate) ?? undefined,
      hasCounter: counterOn,
      counterUnit: counterOn && counterUnit ? counterUnit : null,
      counterGoal: counterOn && hasValidGoal ? goalNum : null,
      capLogAtGoal: counterOn && hasValidGoal ? capLogAtGoal : false,
    };
    const res = await tasksApi.create(dto);
    setSubmitting(false);
    if (!res.data) {
      setError(res.error ?? "Failed to create.");
      return;
    }
    dismiss();
  }

  function cyclePriority() {
    setOpenChip(null);
    const idx = PRIORITY_CYCLE.indexOf(priority);
    setPriority(PRIORITY_CYCLE[(idx + 1) % PRIORITY_CYCLE.length]);
  }

  return {
    title, setTitle,
    description, setDescription,
    priority,
    category, setCategory,
    repeatValue, setRepeatValue,
    dueDate, setDueDate,
    submitting,
    error,
    openChip, setOpenChip,
    pointValue, setPointValue,
    hasCounter, setHasCounter,
    counterUnit, setCounterUnit,
    counterGoal, setCounterGoal,
    capLogAtGoal, setCapLogAtGoal,
    barHeight, setBarHeight,
    chipRowY, setChipRowY,
    counterRowY, setCounterRowY,
    chipRects,
    updateChipRect,
    isRecurring,
    pointOptions,
    titleRef,
    barOpacity,
    barStyle,
    dimStyle,
    dismiss,
    handleBackdropPress,
    handleSubmit,
    cyclePriority,
  };
}
