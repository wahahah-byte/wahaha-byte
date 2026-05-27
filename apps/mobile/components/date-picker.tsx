import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BackHandler,
  Keyboard,
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Portal } from "@/components/portal-host";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ±RANGE months around reference (13 total); year picker re-anchors for jumps.
const RANGE = 6;

const SHEET_OPEN_MS = 220;
const SHEET_CLOSE_MS = 300;
const SLIDE_MS = 240;
const DISMISS_VELOCITY = 1400;

interface Props {
  value: Date | null;
  onChange: (next: Date | null) => void;
  // Pill-shaped chip styling for new-task quick-add bar.
  compact?: boolean;
  // Override trigger label.
  triggerLabel?: string;
  // Placeholder when no date selected.
  placeholder?: string;
  // Fires on open/close so host can fade its UI for smooth handoff.
  onOpenChange?: (open: boolean) => void;
  // When true, actively suppress any keyboard that tries to appear after the
  // picker closes (RN's Modal unmount can briefly restore focus to the
  // previously focused TextInput). Use for hosts that never want the keyboard
  // back — e.g. the edit-task modal.
  suppressKeyboardAfterClose?: boolean;
}

interface MonthData {
  month: number;
  year: number;
  cells: (number | null)[];
}

function shiftedMonth(month: number, year: number, delta: number): { month: number; year: number } {
  let m = month + delta;
  let y = year;
  while (m < 0) { m += 12; y -= 1; }
  while (m > 11) { m -= 12; y += 1; }
  return { month: m, year: y };
}

function buildMonth(month: number, year: number): MonthData {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length < 42) cells.push(null);
  return { month, year, cells };
}

// Sheet padding; derives strip width from screenW for first-commit render.
const SHEET_H_PADDING = 12;

export function DatePicker({ value, onChange, compact, triggerLabel, placeholder, onOpenChange, suppressKeyboardAfterClose }: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();
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

  const years = Array.from({ length: 6 }, (_, i) => yearPage + i + 1);

  const defaultLabel = value
    ? value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : (placeholder ?? "Select a date");
  const labelText = triggerLabel ?? defaultLabel;

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

  return (
    <View>
      <Pressable
        onPress={handleTriggerPress}
        style={[
          compact ? styles.triggerCompact : styles.trigger,
          {
            backgroundColor: compact ? "transparent" : c.input,
            borderColor: open
              ? c.activeHighlight
              : compact
                ? c.borderSoft
                : c.border,
          },
        ]}
      >
        <ThemedText
          style={{
            fontSize: compact ? 11 : 13,
            fontWeight: compact ? "500" : "400",
            letterSpacing: compact ? 0.2 : 0,
            color: value ? c.inputFg : c.fgSubtle,
          }}
        >
          {labelText}
        </ThemedText>
      </Pressable>

      {open ? (
        <Portal>
          <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: "#000" },
              backdropStyle,
            ]}
          >
            <Pressable style={{ flex: 1 }} onPress={() => animateClose(true)} />
          </Animated.View>

          <Animated.View
            style={[
              styles.sheet,
              {
                backgroundColor: c.input,
                borderTopColor: c.border,
                paddingBottom: 12 + insets.bottom,
              },
              sheetStyle,
            ]}
          >
            <View style={styles.headerRow}>
              <Pressable onPress={arrowPrev} hitSlop={16} style={styles.navBtn}>
                <ThemedText style={[styles.navArrow, { color: c.fgMuted }]}>{"<"}</ThemedText>
              </Pressable>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <ThemedText style={[styles.headerLabel, { color: c.fgMuted }]}>
                  {MONTHS[calMonth]}
                </ThemedText>
                <Pressable onPress={() => setShowYearSelect((v) => !v)} hitSlop={10}>
                  <ThemedText style={[styles.headerLabel, { color: c.fgMuted }]}>
                    {calYear}
                  </ThemedText>
                </Pressable>
              </View>
              <Pressable onPress={arrowNext} hitSlop={16} style={styles.navBtn}>
                <ThemedText style={[styles.navArrow, { color: c.fgMuted }]}>{">"}</ThemedText>
              </Pressable>
            </View>

            <GestureDetector gesture={pan}>
              <View>
                <View style={[styles.dragHandle, { backgroundColor: c.border }]} />

                <View style={styles.daysRow}>
                  {DAYS.map((d) => (
                    <ThemedText
                      key={d}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        fontSize: 10,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                        color: c.fgSubtle,
                        paddingVertical: 6,
                      }}
                    >
                      {d}
                    </ThemedText>
                  ))}
                </View>

                <View
                  onLayout={(e) => {
                    const w = e.nativeEvent.layout.width;
                    if (w <= 0 || w === containerW) return;
                    // Pre-position strip before re-render to avoid first-frame jump.
                    const idx = RANGE + centerOffset;
                    trioX.value = -idx * w;
                    snapIdx.value = idx;
                    containerWShared.value = w;
                    setContainerW(w);
                  }}
                  style={{ width: "100%", overflow: "hidden" }}
                >
                  {containerW > 0 ? (
                    <Animated.View
                      style={[
                        { flexDirection: "row", width: containerW * monthList.length },
                        stripStyle,
                      ]}
                    >
                      {monthList.map((m, i) => {
                        // Centre+neighbours first paint; rest mount after slide-in.
                        const visible = fullyMounted
                          || Math.abs(i - (RANGE + centerOffset)) <= 1;
                        return (
                          <View
                            key={`${m.year}-${m.month}`}
                            style={{ width: containerW }}
                          >
                            {visible ? (
                              <MonthGrid
                                data={m}
                                pendingValue={pendingValue}
                                todayMidnight={todayMidnight}
                                today={today}
                                onPick={handlePick}
                                c={c}
                              />
                            ) : null}
                          </View>
                        );
                      })}
                    </Animated.View>
                  ) : null}
                </View>
              </View>
            </GestureDetector>

            {showYearSelect ? (
              <>
                <Pressable
                  style={StyleSheet.absoluteFillObject}
                  onPress={() => setShowYearSelect(false)}
                />
                <View
                  style={[
                    styles.yearOverlay,
                    { backgroundColor: c.input, borderColor: c.border },
                  ]}
                >
                  <View style={styles.yearHeader}>
                    <Pressable
                      onPress={() => setYearPage((y) => y - 6)}
                      disabled={yearPage <= today.getFullYear() - 6}
                      hitSlop={16}
                      style={styles.navBtn}
                    >
                      <ThemedText
                        style={[
                          styles.navArrow,
                          {
                            color: c.fgMuted,
                            opacity: yearPage <= today.getFullYear() - 6 ? 0.3 : 1,
                          },
                        ]}
                      >
                        {"<"}
                      </ThemedText>
                    </Pressable>
                    <View style={styles.yearGrid}>
                      {years.map((yr) => {
                        const selected = value !== null && value.getFullYear() === yr;
                        const isCurrent = today.getFullYear() === yr;
                        return (
                          <Pressable
                            key={yr}
                            onPress={() => {
                              // Re-anchor strip on year pick; only fires on explicit selection.
                              setReference({ month: calMonth, year: yr });
                              setCenterOffset(0);
                              setShowYearSelect(false);
                            }}
                            style={[
                              styles.yearCell,
                              selected ? { borderColor: c.activeHighlight, borderWidth: 1 } : null,
                            ]}
                          >
                            <ThemedText
                              style={{
                                fontSize: 12,
                                color: selected || isCurrent ? c.activeHighlight : c.fgMuted,
                                fontWeight: selected || isCurrent ? "600" : "400",
                              }}
                            >
                              {yr}
                            </ThemedText>
                          </Pressable>
                        );
                      })}
                    </View>
                    <Pressable
                      onPress={() => setYearPage((y) => y + 6)}
                      hitSlop={16}
                      style={styles.navBtn}
                    >
                      <ThemedText style={[styles.navArrow, { color: c.fgMuted }]}>{">"}</ThemedText>
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => setYearPage(today.getFullYear() - 1)}
                    disabled={yearPage === today.getFullYear() - 1}
                    style={{ paddingVertical: 6, alignItems: "center" }}
                  >
                    <ThemedText
                      style={{
                        fontSize: 9,
                        letterSpacing: 1.8,
                        textTransform: "uppercase",
                        color: c.fgSubtle,
                        opacity: yearPage === today.getFullYear() - 1 ? 0.3 : 1,
                      }}
                    >
                      Today
                    </ThemedText>
                  </Pressable>
                </View>
              </>
            ) : null}

            <View style={styles.footer}>
              {pendingValue ? (
                <Pressable
                  onPress={() => {
                    onChange(null);
                    setPendingValue(null);
                    finishClose();
                  }}
                  style={[styles.footerBtn, { borderColor: c.border }]}
                >
                  <ThemedText style={[styles.footerBtnText, { color: c.fgSubtle }]}>Clear</ThemedText>
                </Pressable>
              ) : null}
              <Pressable
                onPress={() => animateClose(true)}
                style={[
                  styles.footerBtn,
                  {
                    backgroundColor: c.activeHighlightBg,
                    borderColor: c.activeHighlightBorder,
                  },
                ]}
              >
                <ThemedText style={[styles.footerBtnText, { color: c.fg }]}>Done</ThemedText>
              </Pressable>
            </View>
          </Animated.View>
          </GestureHandlerRootView>
        </Portal>
      ) : null}
    </View>
  );
}

interface MonthGridProps {
  data: MonthData;
  pendingValue: Date | null;
  todayMidnight: Date;
  today: Date;
  onPick: (d: Date) => void;
  c: ReturnType<typeof useColors>;
}

// memo'd — only month with pendingValue repaints during sheet animation.
const MonthGrid = memo(function MonthGrid({ data, pendingValue, todayMidnight, today, onPick, c }: MonthGridProps) {
  return (
    <View style={styles.grid}>
      {data.cells.map((day, i) => {
        const isPast = day !== null && new Date(data.year, data.month, day) < todayMidnight;
        const isSelected = day !== null && pendingValue !== null
          && pendingValue.getDate() === day
          && pendingValue.getMonth() === data.month
          && pendingValue.getFullYear() === data.year;
        const isToday = day !== null
          && today.getDate() === day
          && today.getMonth() === data.month
          && today.getFullYear() === data.year;

        const dayColor = day === null
          ? "transparent"
          : isPast
            ? c.fgSubtle
            : isSelected || isToday
              ? c.activeHighlight
              : c.fgMuted;

        return (
          <Pressable
            key={i}
            disabled={day === null || isPast}
            onPress={() => {
              if (!day) return;
              onPick(new Date(data.year, data.month, day));
            }}
            style={[
              styles.cell,
              isSelected
                ? { backgroundColor: c.activeHighlightBg, borderColor: c.activeHighlight }
                : null,
            ]}
          >
            <ThemedText
              style={{
                fontSize: 13,
                color: dayColor,
                fontWeight: isSelected || isToday ? "600" : "400",
              }}
            >
              {day ?? ""}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  trigger: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 3,
  },
  // Pill chip for new-task quick-add bar (sized to match priority chip).
  triggerCompact: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderTopWidth: 1,
    padding: 12,
    boxShadow: "0px -8px 32px rgba(0, 0, 0, 0.4)",
    elevation: 18,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerLabel: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  navBtn: {
    width: 40,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  navArrow: {
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 22,
  },
  daysRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  yearOverlay: {
    position: "absolute",
    left: 12,
    right: 12,
    top: 30,
    borderWidth: 1,
    borderRadius: 3,
    padding: 12,
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.4)",
  },
  yearHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  yearGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 4,
    flex: 1,
  },
  yearCell: {
    width: "30%",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "transparent",
  },
  footer: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  footerBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 3,
  },
  footerBtnText: {
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
