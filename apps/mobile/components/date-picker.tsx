import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
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

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Months rendered around the strip's reference: ±RANGE. 13 months total.
// User can swipe ±RANGE months freely with no re-render of the day-grid
// strip and therefore no flicker. The year picker is the path for jumps
// larger than this — it re-anchors the strip in one explicit user action.
const RANGE = 6;

const SHEET_OPEN_MS = 220;
const SHEET_CLOSE_MS = 300;
const SLIDE_MS = 240;
const DISMISS_VELOCITY = 1400;

interface Props {
  value: Date | null;
  onChange: (next: Date | null) => void;
  /** Pill-shaped chip styling (used in the new-task quick-add bar). */
  compact?: boolean;
  /** Override the trigger label (e.g. "Today", "Tmrw"). */
  triggerLabel?: string;
  /** Placeholder shown when no date is selected. */
  placeholder?: string;
  /** Fires whenever the picker modal opens or closes. Lets the host fade
   *  its own UI so the keyboard-down / sheet-up sequence reads as a single
   *  smooth handoff instead of two competing animations. */
  onOpenChange?: (open: boolean) => void;
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

export function DatePicker({ value, onChange, compact, triggerLabel, placeholder, onOpenChange }: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { height: screenH } = useWindowDimensions();

  const [open, setOpen] = useState(false);
  // Stable today snapshot — recomputed only when the picker (re)opens, not
  // on every render. Previously `const today = new Date()` ran every render,
  // producing a fresh reference each time; that cascaded into every
  // MonthGrid re-rendering on every parent state change (swipe progress,
  // layout, sheet drag), which is the bulk of the perceived stutter when
  // the sheet slides in.
  const { today, todayMidnight } = useMemo(() => {
    const t = new Date();
    return {
      today: t,
      todayMidnight: new Date(t.getFullYear(), t.getMonth(), t.getDate()),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);
  const [showYearSelect, setShowYearSelect] = useState(false);

  // Reference month/year — anchors the strip. Doesn't change while
  // swiping; only the year picker shifts it. centerOffset is the visible
  // month relative to reference (-RANGE..+RANGE).
  const [reference, setReference] = useState(() => ({
    month: value?.getMonth() ?? today.getMonth(),
    year: value?.getFullYear() ?? today.getFullYear(),
  }));
  const [centerOffset, setCenterOffset] = useState(0);

  const [yearPage, setYearPage] = useState(today.getFullYear() - 1);
  const [pendingValue, setPendingValue] = useState<Date | null>(value);
  const [containerW, setContainerW] = useState(0);

  // Stable picker handler — passing an inline `(d) => setPendingValue(d)`
  // to every MonthGrid would defeat React.memo (new ref each render). The
  // setState updater is itself stable across renders, so we can hand it
  // through directly.
  const handlePick = useCallback((d: Date) => setPendingValue(d), []);

  const sheetY = useSharedValue(screenH);
  const dragStart = useSharedValue(0);
  const axisLock = useSharedValue<"h" | "v" | "">("");
  const trioX = useSharedValue(0);
  const trioStart = useSharedValue(0);
  const containerWShared = useSharedValue(0);
  const snapIdx = useSharedValue(RANGE); // current centered idx in monthList

  // Build the fixed strip of months around reference. Stable for the
  // lifetime of `reference` — swiping never invalidates this list.
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

  // Notify the host whenever the picker opens or closes. Stored in a ref so
  // we don't refire when the callback identity changes between renders.
  const onOpenChangeRef = useRef(onOpenChange);
  onOpenChangeRef.current = onOpenChange;
  useEffect(() => {
    onOpenChangeRef.current?.(open);
  }, [open]);

  const finishClose = useCallback(() => {
    setOpen(false);
    setShowYearSelect(false);
    sheetY.value = screenH;
  }, [screenH, sheetY]);

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

  // Arrow-tap helpers — animate trioX and bump centerOffset on completion.
  // monthList is unchanged so there's no re-render of the strip.
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

  return (
    <View>
      <Pressable
        onPress={() => setOpen(true)}
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

      <Modal
        transparent
        animationType="none"
        visible={open}
        onRequestClose={() => animateClose(true)}
      >
        <GestureHandlerRootView style={{ flex: 1 }}>
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
                    // Pre-position the month strip BEFORE the re-render
                    // triggered by setContainerW. Otherwise the strip
                    // renders for one frame at translateX 0 (the first of
                    // its 13 months), then the centering effect snaps it
                    // to the reference month — visible as a jump near the
                    // end of the sheet's slide-in.
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
                      {monthList.map((m) => (
                        <View
                          key={`${m.year}-${m.month}`}
                          style={{ width: containerW }}
                        >
                          <MonthGrid
                            data={m}
                            pendingValue={pendingValue}
                            todayMidnight={todayMidnight}
                            today={today}
                            onPick={handlePick}
                            c={c}
                          />
                        </View>
                      ))}
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
                              // Re-anchor the strip on the picked year. This
                              // *does* re-render the monthList, but it only
                              // happens on explicit year selection, never
                              // during a swipe.
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
      </Modal>
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

// memo'd: parent re-renders constantly while the sheet animates and the user
// swipes between months, but only the month containing `pendingValue` (and
// any neighbour the user just swiped onto) actually needs to repaint. `c` is
// referentially stable per theme; `data`, `todayMidnight`, `today`, `onPick`
// are all stabilized by the parent. pendingValue is the only frequent
// changer, and the default shallow comparison handles it correctly.
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
  // Pill-shaped chip used by the new-task quick-add bar — sized to match the
  // priority chip alongside it.
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
