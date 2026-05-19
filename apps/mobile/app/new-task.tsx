import { useEffect, useMemo, useRef, useState } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CATEGORIES, COUNTER_UNITS, maxPointsFor, type CreateTaskRequest } from "@wahaha/shared";
import { tasksApi } from "@/lib/api";
import { DatePicker } from "@/components/date-picker";
import { GoalStepper } from "@/components/goal-stepper";
import {
  InlineChipDropdown,
  InlineDropdownBody,
  inlineChipDropdownStyles,
} from "@/components/inline-chip-dropdown";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

// TickTick-style quick-add. A compact bar anchored just above the keyboard:
// title input + send button on top, chip row underneath for priority, due
// date, category, and repeat. The bar's translateY is driven by the live
// keyboard height (via Keyboard.addListener) so it rides up with the keyboard
// the same way the OS animates it. No sheet, no scroll, no overlap math.

type Priority = "low" | "medium" | "high";

const PRIORITY_CYCLE: Priority[] = ["low", "medium", "high"];
const PRIORITY_LABEL: Record<Priority, string> = { low: "Low", medium: "Med", high: "High" };
const PRIORITY_API: Record<Priority, string> = { low: "Low", medium: "Medium", high: "High" };

const REPEAT_OPTIONS: { value: string; label: string; rule: string | null }[] = [
  { value: "once", label: "Once", rule: null },
  { value: "daily", label: "Daily", rule: "daily" },
  { value: "weekdays", label: "Weekdays", rule: "weekdays" },
  { value: "weekly", label: "Weekly", rule: "weekly" },
  { value: "biweekly", label: "Biweekly", rule: "biweekly" },
  { value: "monthly", label: "Monthly", rule: "monthly" },
];

// How far the bar drops offscreen for the mount/dismiss slide. Larger than
// any realistic bar height so the bar is fully hidden during the transition.
const SLIDE_OFFSCREEN = 240;
const ANIM_MS = 240;

function fmtDate(d: Date | null): string | null {
  if (!d) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dateChipLabel(d: Date | null): string {
  if (!d) return "Date";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tmrw";
  if (diffDays === -1) return "Yest";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}


export default function NewTaskScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ recurring?: string }>();
  const initialRecurring = params.recurring === "1" || params.recurring === "true";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [repeatValue, setRepeatValue] = useState<string>(initialRecurring ? "daily" : "once");
  const [dueDate, setDueDate] = useState<Date | null>(initialRecurring ? new Date() : null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Which chip's inline dropdown is currently open. The Category, Repeat,
  // Points, and Counter-unit chips use an inline overlay (not <Modal>) so
  // the keyboard stays up while the user picks. Date uses the full
  // DatePicker modal which DOES dismiss the keyboard — the calendar needs
  // the screen, and the title re-focuses on close to bring the keyboard back.
  const [openChip, setOpenChip] = useState<"category" | "repeat" | "points" | "unit" | null>(null);
  // Points value: starts at the per-recurrence default and the user can
  // override via the inline chip dropdown. Recurring tasks use the 1-5
  // scale; one-shot tasks use 5/10/15/20/25 capped by the category's max.
  const [pointValue, setPointValue] = useState<number>(initialRecurring ? 1 : 10);

  // Counter is recurring-only — same constraint as web NewTaskModal and the
  // edit-task form. Cleared automatically when the user picks "Once".
  const [hasCounter, setHasCounter] = useState(false);
  const [counterUnit, setCounterUnit] = useState<string>("");
  const [counterGoal, setCounterGoal] = useState<string>("");
  const [capLogAtGoal, setCapLogAtGoal] = useState(false);

  // Detached chip dropdowns: render the dropdown body at root level (sibling
  // of the bar) instead of nesting it inside the chip. Why: on Android, a
  // child rendered with position:absolute that extends past its parent's
  // bounds doesn't receive touches in the outside-parent area, even though
  // it's visually painted there. Nesting the dropdown inside the bar made
  // the upper option rows un-scrollable — the swipe-up gesture passed into
  // territory above the bar and was dropped. Lifting it out gives the
  // dropdown its own hit-test bounds. barHeight + per-chip x are measured
  // via onLayout so the overlay sits just above the bar, horizontally
  // aligned with the open chip.
  const [barHeight, setBarHeight] = useState(0);
  // The chipRow's Y offset *within* the bar — measured separately because
  // each chip's `y` is reported relative to the chipRow, not the bar. We
  // sum them (rowY + chip.y) to get the chip's top within the bar.
  const [chipRowY, setChipRowY] = useState(0);
  const [counterRowY, setCounterRowY] = useState(0);
  const [chipRects, setChipRects] = useState<
    Record<string, { x: number; y: number; width: number; height: number }>
  >({});
  function updateChipRect(
    name: string,
    rect: { x: number; y: number; width: number; height: number },
  ) {
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

  // Allowed point values: 1-5 for recurring, 5/10/15/20/25 for one-shot
  // capped by the category limit. Mirrors web NewTaskModal + task-form.
  const pointOptions = useMemo(
    () => (isRecurring
      ? [1, 2, 3, 4, 5]
      : [5, 10, 15, 20, 25].filter((v) => v <= maxPointsFor(category))),
    [isRecurring, category],
  );

  // Whenever the rule or category changes the point set can shift (e.g.
  // jumping from one-shot to recurring leaves the user at 10 which isn't a
  // valid recurring value, or switching to a category with a lower cap).
  // Snap to the nearest allowed value so the chip never displays a stale
  // out-of-range number.
  useEffect(() => {
    if (pointOptions.length === 0) return;
    if (!pointOptions.includes(pointValue)) {
      setPointValue(isRecurring ? 1 : pointOptions[pointOptions.length - 1]);
    }
  }, [pointOptions, pointValue, isRecurring]);

  const titleRef = useRef<TextInput>(null);

  // Shared values for the bar's transform and the backdrop's opacity.
  // kbHeight = live soft keyboard height; slideOff = 1 (mounted/hidden) → 0 (open).
  const kbHeight = useSharedValue(0);
  const slideOff = useSharedValue(1);
  const dim = useSharedValue(0);
  // barOpacity is faded to 0 while the DatePicker modal is open so the
  // user doesn't see the bar dropping when the keyboard dismisses — the
  // calendar handoff reads as a single coordinated animation.
  const barOpacity = useSharedValue(1);

  // Track live keyboard height. We use addListener so the value is plain JS
  // state-friendly (not a worklet-only sharedValue) — works fine for our
  // 200 ms ease animation.
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

  // Mount: animate the bar up from offscreen, fade the dim in, then focus
  // the title (which opens the keyboard, which slides the bar further up).
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
    // After the animation, pop the route.
    setTimeout(() => router.back(), ANIM_MS + 10);
  }

  // The dim backdrop closes an open chip dropdown first; only a tap with
  // no dropdown open dismisses the whole modal. That makes "tap outside"
  // a normal close-the-dropdown action without nuking the user's input.
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

  const priorityColor =
    priority === "low" ? c.success : priority === "high" ? c.danger : c.warning;
  const priorityBg =
    priority === "low" ? c.successBg : priority === "high" ? c.dangerBg : c.warningBg;

  const canSubmit = title.trim().length > 0 && !submitting;

  return (
    <View style={styles.root}>
      {/* Dim backdrop — opaque enough to hide any movement on the underlying
          (tabs) screen caused by Android's adjustResize. Tap dismisses. */}
      <Animated.View
        style={[StyleSheet.absoluteFillObject, { backgroundColor: "#000" }, dimStyle]}
      >
        <Pressable style={{ flex: 1 }} onPress={handleBackdropPress} />
      </Animated.View>

      {/* Bar — position absolute at the very bottom of the screen, animated
          up by the keyboard height via translateY. */}
      <Animated.View
        style={[
          styles.bar,
          {
            backgroundColor: c.panel,
            borderTopColor: c.border,
            paddingBottom: 10 + insets.bottom,
          },
          barStyle,
        ]}
        onLayout={(e) => {
          const h = e.nativeEvent.layout.height;
          if (h && h !== barHeight) setBarHeight(h);
        }}
      >
        <View style={styles.titleRow}>
          <TextInput
            ref={titleRef}
            value={title}
            onChangeText={setTitle}
            placeholder="New task"
            placeholderTextColor={c.fgSubtle}
            onSubmitEditing={handleSubmit}
            // Tapping the title or description while a chip dropdown is open
            // collapses the dropdown — the focus event still fires so the
            // keyboard stays up; we're just dismissing the overlay.
            onFocus={() => setOpenChip(null)}
            returnKeyType="done"
            blurOnSubmit={false}
            style={[styles.titleInput, { color: c.fg }]}
          />
          <Pressable
            onPress={() => { setOpenChip(null); handleSubmit(); }}
            disabled={!canSubmit}
            style={[
              styles.submitBtn,
              {
                backgroundColor: canSubmit ? c.activeHighlight : c.input,
                opacity: submitting ? 0.5 : 1,
              },
            ]}
          >
            <ThemedText
              style={{
                color: canSubmit ? c.bg : c.fgSubtle,
                fontSize: 16,
                fontWeight: "700",
                lineHeight: 18,
              }}
            >
              ↑
            </ThemedText>
          </Pressable>
        </View>

        {/* Optional notes/description — always shown, small font, no border.
            Auto-grows up to ~4 lines. Empty value is fine, gets stripped on
            submit. */}
        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Notes (optional)"
          placeholderTextColor={c.fgSubtle}
          multiline
          onFocus={() => setOpenChip(null)}
          style={[styles.descInput, { color: c.fgMuted }]}
        />

        <View
          style={styles.chipRow}
          onLayout={(e) => {
            const y = e.nativeEvent.layout.y;
            if (y !== chipRowY) setChipRowY(y);
          }}
        >
          {/* Priority — tap cycles low → med → high. */}
          <Pressable
            onPress={cyclePriority}
            style={[
              styles.chip,
              { borderColor: priorityColor, backgroundColor: priorityBg },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: priorityColor }]} />
            <ThemedText style={[styles.chipText, { color: priorityColor }]}>
              {PRIORITY_LABEL[priority]}
            </ThemedText>
          </Pressable>

          {/* Due date — full calendar via DatePicker's Modal. The Modal
              dismisses the keyboard while the calendar is open; we fade
              the bar out on open and back in on close so the keyboard-down
              + calendar-up sequence reads as one smooth handoff, and
              re-focus the title to bring the keyboard back. */}
          <DatePicker
            value={dueDate}
            compact
            triggerLabel={dateChipLabel(dueDate)}
            onChange={(d) => {
              setDueDate(d);
              setTimeout(() => titleRef.current?.focus(), 60);
            }}
            onOpenChange={(open) => {
              barOpacity.value = withTiming(open ? 0 : 1, {
                // Faster fade-out so the bar is gone before the calendar
                // arrives; slower fade-in so it reappears as the keyboard
                // is sliding up after close.
                duration: open ? 140 : 220,
              });
            }}
          />

          {/* Category. */}
          <InlineChipDropdown
            value={category}
            options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
            open={openChip === "category"}
            onOpenChange={(open) => setOpenChip(open ? "category" : null)}
            onChange={setCategory}
            detachedDropdown
            onChipLayout={(r) => updateChipRect("category", r)}
          />

          {/* Repeat. */}
          <InlineChipDropdown
            value={repeatValue}
            options={REPEAT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            open={openChip === "repeat"}
            onOpenChange={(open) => setOpenChip(open ? "repeat" : null)}
            onChange={setRepeatValue}
            detachedDropdown
            onChipLayout={(r) => updateChipRect("repeat", r)}
          />

          {/* Points — sits inline with Category + Repeat so it stays
              visible above the keyboard (the form below the bar was
              previously where points lived, hidden by the soft keyboard). */}
          <InlineChipDropdown
            value={String(pointValue)}
            options={pointOptions.map((v) => ({ value: String(v), label: `${v} pt${v === 1 ? "" : "s"}` }))}
            open={openChip === "points"}
            onOpenChange={(open) => setOpenChip(open ? "points" : null)}
            onChange={(v) => setPointValue(Number(v))}
            detachedDropdown
            onChipLayout={(r) => updateChipRect("points", r)}
          />

          {/* Counter — recurring-only. Tapping the pill toggles the counter
              section below. Hidden entirely for non-recurring tasks to match
              the web new-task modal and the edit form. */}
          {isRecurring ? (
            <Pressable
              onPress={() => { setOpenChip(null); setHasCounter((v) => !v); }}
              style={[
                styles.chip,
                {
                  borderColor: hasCounter ? c.activeHighlightBorder : c.borderSoft,
                  backgroundColor: hasCounter ? c.activeHighlightBg : "transparent",
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.chipText,
                  { color: hasCounter ? c.activeHighlight : c.inputFg },
                ]}
              >
                {hasCounter ? "Counter" : "+ Counter"}
              </ThemedText>
            </Pressable>
          ) : null}
        </View>

        {/* Counter sub-row — unit dropdown + goal stepper + cap-at-goal pill. */}
        {isRecurring && hasCounter ? (
          <View
            style={styles.counterRow}
            onLayout={(e) => {
              const y = e.nativeEvent.layout.y;
              if (y !== counterRowY) setCounterRowY(y);
            }}
          >
            <InlineChipDropdown
              value={counterUnit}
              triggerLabel={counterUnit || "no unit"}
              options={[
                { value: "", label: "no unit" },
                ...COUNTER_UNITS.map((u) => ({ value: u, label: u })),
              ]}
              open={openChip === "unit"}
              onOpenChange={(open) => setOpenChip(open ? "unit" : null)}
              onChange={setCounterUnit}
              detachedDropdown
              onChipLayout={(r) => updateChipRect("unit", r)}
            />
            <ThemedText
              style={{
                fontSize: 10,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                color: c.fgSubtle,
              }}
            >
              Goal
            </ThemedText>
            <GoalStepper value={counterGoal} onChange={setCounterGoal} />
            {counterUnit && counterGoal.trim() !== "" && Number(counterGoal) > 0 ? (
              <ThemedText style={{ fontSize: 10, color: c.fgSubtle }}>
                {counterUnit} /{" "}
                {repeatValue === "weekly"
                  ? "wk"
                  : repeatValue === "monthly"
                    ? "mo"
                    : "day"}
              </ThemedText>
            ) : null}
            {counterGoal.trim() !== "" && Number(counterGoal) > 0 ? (
              <Pressable
                onPress={() => setCapLogAtGoal((v) => !v)}
                style={[
                  styles.chip,
                  {
                    borderColor: capLogAtGoal ? c.activeHighlightBorder : c.borderSoft,
                    backgroundColor: capLogAtGoal ? c.activeHighlightBg : "transparent",
                  },
                ]}
              >
                <ThemedText
                  style={[
                    styles.chipText,
                    { color: capLogAtGoal ? c.activeHighlight : c.fgSubtle },
                  ]}
                >
                  Cap at goal
                </ThemedText>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {error ? (
          <ThemedText style={{ color: c.danger, fontSize: 11, marginTop: 6 }}>
            {error}
          </ThemedText>
        ) : null}
      </Animated.View>

      {/* Detached chip-dropdown overlay — rendered as a sibling of the bar
          (NOT a child) so its hit-test bounds are independent. The
          Animated.View shares the bar's `barStyle` transform so the overlay
          tracks the bar as the soft keyboard slides it up — without this,
          the overlay stayed at the screen bottom and got covered by the
          keyboard. Position is computed to sit *directly* above the open
          chip: the chip's top inside the bar = (rowY within bar) +
          (chip.y within row), and `bottom: barHeight - chipTopInBar + 6`
          puts the dropdown's bottom edge 6 px above the chip's top edge.
          The bar's horizontal padding (14) plus chip.x gives the left. */}
      {openChip && chipRects[openChip] ? (() => {
        const rect = chipRects[openChip];
        // Only the unit chip lives in the counter row; everything else is
        // in the main chip row. Pick the right row Y so the dropdown lands
        // on whichever row the chip is actually on.
        const rowY = openChip === "unit" ? counterRowY : chipRowY;
        const chipTopInBar = rowY + rect.y;
        return (
        <Animated.View
          style={[
            inlineChipDropdownStyles.detachedDropdown,
            {
              backgroundColor: c.input,
              borderColor: c.border,
              bottom: Math.max(0, barHeight - chipTopInBar + 6),
              left: 14 + rect.x,
              maxWidth: 240,
            },
            barStyle,
          ]}
        >
          {openChip === "category" ? (
            <InlineDropdownBody
              options={CATEGORIES.map((cat) => ({ value: cat, label: cat }))}
              value={category}
              onChange={(v) => { setCategory(v); setOpenChip(null); }}
            />
          ) : openChip === "repeat" ? (
            <InlineDropdownBody
              options={REPEAT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
              value={repeatValue}
              onChange={(v) => { setRepeatValue(v); setOpenChip(null); }}
            />
          ) : openChip === "points" ? (
            <InlineDropdownBody
              options={pointOptions.map((v) => ({ value: String(v), label: `${v} pt${v === 1 ? "" : "s"}` }))}
              value={String(pointValue)}
              onChange={(v) => { setPointValue(Number(v)); setOpenChip(null); }}
            />
          ) : openChip === "unit" ? (
            <InlineDropdownBody
              options={[{ value: "", label: "no unit" }, ...COUNTER_UNITS.map((u) => ({ value: u, label: u }))]}
              value={counterUnit}
              onChange={(v) => { setCounterUnit(v); setOpenChip(null); }}
            />
          ) : null}
        </Animated.View>
        );
      })() : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  bar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    boxShadow: "0px -8px 24px rgba(0, 0, 0, 0.35)",
    elevation: 18,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  titleInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.2,
    paddingVertical: 4,
  },
  descInput: {
    fontSize: 13,
    lineHeight: 18,
    paddingTop: 4,
    paddingBottom: 2,
    paddingHorizontal: 0,
    minHeight: 22,
    textAlignVertical: "top",
  },
  submitBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  counterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
