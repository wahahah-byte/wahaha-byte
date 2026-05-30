import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { BackHandler, Keyboard, TextInput, useWindowDimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { buildMonth, shiftedMonth, type MonthData } from "@/components/date-picker/month-grid";

// ±RANGE months around reference (13 total); year picker re-anchors for jumps.
export const RANGE = 6;

const SHEET_OPEN_MS = 220;
const SHEET_CLOSE_MS = 300;
const SLIDE_MS = 240;
const DISMISS_VELOCITY = 1400;
// Sheet padding; derives strip width from screenW for first-commit render.
const SHEET_H_PADDING = 12;

interface Args {
  value: Date | null;
  onChange: (next: Date | null) => void;
  onOpenChange?: (open: boolean) => void;
  suppressKeyboardAfterClose?: boolean;
}

// All state, animation, gesture, and lifecycle for the DatePicker sheet.
export function useDatePicker({ value, onChange, onOpenChange, suppressKeyboardAfterClose }: Args) {
  const { width: screenW, height: screenH } = useWindowDimensions();

  const [open, setOpen] = useState(false);
  // Stable today snapshot — recomputed only on re-open, not every render.
  const { today, todayMidnight } = useMemo(() => {
    const t = new Date();
    return {
      today: t,
      todayMidnight: new Date(t.getFullYear(), t.getMonth(), t.getDate()),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const [showYearSelect, setShowYearSelect] = useState(false);

  // Reference month/year anchors strip; only year picker shifts it.
  const [reference, setReference] = useState(() => ({
    month: value?.getMonth() ?? today.getMonth(),
    year: value?.getFullYear() ?? today.getFullYear(),
  }));
  const [centerOffset, setCenterOffset] = useState(0);

  const [yearPage, setYearPage] = useState(today.getFullYear() - 1);
  const [pendingValue, setPendingValue] = useState<Date | null>(value);
  // ContainerW derived synchronously from screen so calendar paints first frame.
  const [containerW, setContainerW] = useState(() => Math.max(0, screenW - SHEET_H_PADDING * 2));
  // Defers off-screen grid mount until after slide-in to avoid mid-slide hang.
  const [fullyMounted, setFullyMounted] = useState(false);

  // Stable picker handler keeps MonthGrid memo intact.
  const handlePick = useCallback((d: Date) => setPendingValue(d), []);

  const sheetY = useSharedValue(screenH);
  const dragStart = useSharedValue(0);
  const axisLock = useSharedValue<"h" | "v" | "">("");
  // Initialize translateX so first frame centres correctly.
  const trioX = useSharedValue(-RANGE * containerW);
  const trioStart = useSharedValue(0);
  const containerWShared = useSharedValue(containerW);
  const snapIdx = useSharedValue(RANGE); // current centered idx in monthList

  // Fixed strip of months around reference; swipes don't invalidate.
  const monthList = useMemo<MonthData[]>(() => {
    const arr: MonthData[] = [];
    for (let i = -RANGE; i <= RANGE; i++) {
      const { month, year } = shiftedMonth(reference.month, reference.year, i);
      arr.push(buildMonth(month, year));
    }
    return arr;
  }, [reference]);

  const currentCenter = monthList[RANGE + centerOffset];
  const calMonth = currentCenter.month;
  const calYear = currentCenter.year;

  // Snap trioX when containerW first arrives or reference changes.
  useEffect(() => {
    containerWShared.value = containerW;
    if (containerW > 0) {
      const idx = RANGE + centerOffset;
      trioX.value = -idx * containerW;
      snapIdx.value = idx;
    }
  }, [containerW, centerOffset, reference, containerWShared, trioX, snapIdx]);

  useEffect(() => {
    if (open) {
      setPendingValue(value);
      sheetY.value = withTiming(0, { duration: SHEET_OPEN_MS, easing: Easing.bezier(0.2, 0, 0, 1) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Flip gate after slide-in so deferred grids mount; reset on close.
  useEffect(() => {
    if (!open) {
      setFullyMounted(false);
      return;
    }
    const t = setTimeout(() => setFullyMounted(true), SHEET_OPEN_MS + 40);
    return () => clearTimeout(t);
  }, [open]);

  // Re-derive containerW on rotation/split-screen.
  useEffect(() => {
    setContainerW(Math.max(0, screenW - SHEET_H_PADDING * 2));
  }, [screenW]);

  // Ref-stored so identity change doesn't refire. We fire this synchronously
  // from handleTriggerPress and finishClose (NOT via useEffect on `open`) so
  // hosts can pre-emptively view-swap their TextInputs BEFORE Modal mounts —
  // otherwise RN captures the focused TextInput as "previous responder" and
  // briefly tries to restore it on Modal unmount, producing the keyboard
  // flicker.
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;

  const finishClose = useCallback(() => {
    // Notify host BEFORE Modal unmounts, so the host's suppression grace
    // (view-swap window) starts in sync with the Modal close transition.
    onOpenChangeRef.current?.(false);
    setOpen(false);
    setShowYearSelect(false);
    sheetY.value = screenH;
    // Opt-in keyboard suppression for hosts that never want it back (edit
    // modal). Even without RN's Modal, something can occasionally re-assert
    // focus on a TextInput after close — be aggressive about killing it:
    //   1. Dismiss immediately and via TextInput.State.blurTextInput.
    //   2. Listen for keyboardWillShow/keyboardDidShow and dismiss on either.
    //   3. Run a short interval that re-dismisses every 50ms.
    // After the suppression window all hooks tear down so future taps on
    // TextInputs work normally.
    if (suppressKeyboardAfterClose) {
      const aggressiveDismiss = () => {
        Keyboard.dismiss();
        const tiState = (TextInput as unknown as {
          State?: {
            currentlyFocusedInput?: () => unknown;
            blurTextInput?: (h: unknown) => void;
          };
        }).State;
        const focused = tiState?.currentlyFocusedInput?.();
        if (focused && tiState?.blurTextInput) {
          tiState.blurTextInput(focused);
        }
      };
      aggressiveDismiss();
      const willSub = Keyboard.addListener("keyboardWillShow", aggressiveDismiss);
      const didSub = Keyboard.addListener("keyboardDidShow", aggressiveDismiss);
      const interval = setInterval(aggressiveDismiss, 50);
      setTimeout(() => {
        willSub.remove();
        didSub.remove();
        clearInterval(interval);
      }, 1500);
    }
  }, [screenH, sheetY, suppressKeyboardAfterClose]);

  const closeWithCommit = useCallback(() => {
    onChange(pendingValue);
    finishClose();
  }, [onChange, pendingValue, finishClose]);

  const animateClose = useCallback(
    (commit: boolean) => {
      sheetY.value = withTiming(
        screenH,
        { duration: SHEET_CLOSE_MS, easing: Easing.bezier(0.22, 1, 0.36, 1) },
        (finished) => {
          if (finished) runOnJS(commit ? closeWithCommit : finishClose)();
        },
      );
    },
    [closeWithCommit, finishClose, screenH, sheetY],
  );

  // Android back button — Portal replaces Modal, so we wire BackHandler
  // manually to match Modal's onRequestClose behavior.
  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      animateClose(true);
      return true;
    });
    return () => sub.remove();
  }, [open, animateClose]);

  // Arrow-tap helpers — animate trioX, bump centerOffset on completion.
  const goTo = useCallback((newIdx: number) => {
    const w = containerWShared.value;
    if (w <= 0) return;
    const clamped = Math.max(0, Math.min(monthList.length - 1, newIdx));
    if (clamped === snapIdx.value) return;
    snapIdx.value = clamped;
    trioX.value = withTiming(
      -clamped * w,
      { duration: SLIDE_MS, easing: Easing.bezier(0.2, 0, 0, 1) },
      (finished) => {
        if (finished) runOnJS(setCenterOffset)(clamped - RANGE);
      },
    );
  }, [containerWShared, monthList.length, snapIdx, trioX]);

  const arrowPrev = useCallback(() => goTo(snapIdx.value - 1), [goTo, snapIdx]);
  const arrowNext = useCallback(() => goTo(snapIdx.value + 1), [goTo, snapIdx]);

  const pan = Gesture.Pan()
    .onStart(() => {
      "worklet";
      dragStart.value = sheetY.value;
      trioStart.value = trioX.value;
      axisLock.value = "";
    })
    .onUpdate((e) => {
      "worklet";
      if (axisLock.value === "") {
        if (Math.abs(e.translationX) < 8 && Math.abs(e.translationY) < 8) return;
        axisLock.value = Math.abs(e.translationX) > Math.abs(e.translationY) ? "h" : "v";
      }
      if (axisLock.value === "v") {
        if (e.translationY > 0) sheetY.value = Math.max(0, dragStart.value + e.translationY);
      } else {
        trioX.value = trioStart.value + e.translationX;
      }
    })
    .onEnd((e) => {
      "worklet";
      const lock = axisLock.value;
      axisLock.value = "";

      if (lock === "v") {
        const past = sheetY.value > screenH * 0.18 || e.velocityY > DISMISS_VELOCITY;
        if (past) {
          sheetY.value = withTiming(
            screenH,
            { duration: SHEET_CLOSE_MS, easing: Easing.bezier(0.22, 1, 0.36, 1) },
            (finished) => {
              if (finished) runOnJS(closeWithCommit)();
            },
          );
        } else {
          sheetY.value = withTiming(0, { duration: 220, easing: Easing.bezier(0.22, 1, 0.36, 1) });
        }
        return;
      }

      if (lock === "h") {
        const w = containerWShared.value || 320;
        const threshold = w * 0.28;
        const currentSnap = snapIdx.value;
        let newSnap = currentSnap;
        if (e.translationX < -threshold) newSnap = Math.min(2 * RANGE, currentSnap + 1);
        else if (e.translationX > threshold) newSnap = Math.max(0, currentSnap - 1);

        snapIdx.value = newSnap;
        trioX.value = withTiming(
          -newSnap * w,
          { duration: SLIDE_MS, easing: Easing.bezier(0.2, 0, 0, 1) },
          (finished) => {
            if (finished && newSnap !== currentSnap) {
              runOnJS(setCenterOffset)(newSnap - RANGE);
            }
          },
        );
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: sheetY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => {
    const frac = 1 - Math.min(1, sheetY.value / screenH);
    return { opacity: 0.5 * frac };
  });

  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: trioX.value }],
  }));

  // Dismiss keyboard first, then open modal for clean slide-in.
  const handleTriggerPress = useCallback(() => {
    // Synchronously notify host BEFORE Modal mounts. Hosts that view-swap
    // their TextInputs need this to happen first; otherwise the Modal
    // captures the focused TextInput as previous-responder and tries to
    // restore it on unmount, causing the keyboard flicker.
    onOpenChangeRef.current?.(true);

    // Aggressively blur whatever TextInput is focused. Keyboard.dismiss alone
    // doesn't fully clear RN's internal "last focused" state, so calling
    // blurTextInput on the focused handle clears that state.
    const state = (TextInput as unknown as { State?: {
      currentlyFocusedInput?: () => unknown;
      blurTextInput?: (h: unknown) => void;
    } }).State;
    const focused = state?.currentlyFocusedInput?.();
    if (focused && state?.blurTextInput) {
      state.blurTextInput(focused);
    }

    if (!Keyboard.isVisible()) {
      setOpen(true);
      return;
    }
    let fired = false;
    const sub = Keyboard.addListener("keyboardDidHide", () => {
      if (fired) return;
      fired = true;
      sub.remove();
      clearTimeout(fallback);
      setOpen(true);
    });
    const fallback = setTimeout(() => {
      if (fired) return;
      fired = true;
      sub.remove();
      setOpen(true);
    }, 400);
    Keyboard.dismiss();
  }, []);

  return {
    open,
    today,
    todayMidnight,
    showYearSelect,
    setShowYearSelect,
    setReference,
    centerOffset,
    setCenterOffset,
    yearPage,
    setYearPage,
    pendingValue,
    setPendingValue,
    containerW,
    setContainerW,
    fullyMounted,
    monthList,
    calMonth,
    calYear,
    trioX,
    snapIdx,
    containerWShared,
    sheetStyle,
    backdropStyle,
    stripStyle,
    handlePick,
    arrowPrev,
    arrowNext,
    pan,
    animateClose,
    finishClose,
    handleTriggerPress,
  };
}
