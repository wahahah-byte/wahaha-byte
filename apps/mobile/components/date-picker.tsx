import {
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Portal } from "@/components/portal-host";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";
import { styles } from "@/components/date-picker/styles";
import { MonthGrid } from "@/components/date-picker/month-grid";
import { YearOverlay } from "@/components/date-picker/year-overlay";
import { RANGE, useDatePicker } from "@/hooks/use-date-picker";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

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

export function DatePicker({ value, onChange, compact, triggerLabel, placeholder, onOpenChange, suppressKeyboardAfterClose }: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const d = useDatePicker({ value, onChange, onOpenChange, suppressKeyboardAfterClose });

  const defaultLabel = value
    ? value.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : (placeholder ?? "Select a date");
  const labelText = triggerLabel ?? defaultLabel;

  return (
    <View>
      <Pressable
        onPress={d.handleTriggerPress}
        style={[
          compact ? styles.triggerCompact : styles.trigger,
          {
            backgroundColor: compact ? "transparent" : c.input,
            borderColor: d.open
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

      {d.open ? (
        <Portal>
          <GestureHandlerRootView style={StyleSheet.absoluteFillObject}>
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: "#000" },
              d.backdropStyle,
            ]}
          >
            <Pressable style={{ flex: 1 }} onPress={() => d.animateClose(true)} />
          </Animated.View>

          <Animated.View
            style={[
              styles.sheet,
              {
                backgroundColor: c.input,
                borderTopColor: c.border,
                paddingBottom: 12 + insets.bottom,
              },
              d.sheetStyle,
            ]}
          >
            <View style={styles.headerRow}>
              <Pressable onPress={d.arrowPrev} hitSlop={16} style={styles.navBtn}>
                <ThemedText style={[styles.navArrow, { color: c.fgMuted }]}>{"<"}</ThemedText>
              </Pressable>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <ThemedText style={[styles.headerLabel, { color: c.fgMuted }]}>
                  {MONTHS[d.calMonth]}
                </ThemedText>
                <Pressable onPress={() => d.setShowYearSelect((v) => !v)} hitSlop={10}>
                  <ThemedText style={[styles.headerLabel, { color: c.fgMuted }]}>
                    {d.calYear}
                  </ThemedText>
                </Pressable>
              </View>
              <Pressable onPress={d.arrowNext} hitSlop={16} style={styles.navBtn}>
                <ThemedText style={[styles.navArrow, { color: c.fgMuted }]}>{">"}</ThemedText>
              </Pressable>
            </View>

            <GestureDetector gesture={d.pan}>
              <View>
                <View style={[styles.dragHandle, { backgroundColor: c.border }]} />

                <View style={styles.daysRow}>
                  {DAYS.map((day) => (
                    <ThemedText
                      key={day}
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
                      {day}
                    </ThemedText>
                  ))}
                </View>

                <View
                  onLayout={(e) => {
                    const w = e.nativeEvent.layout.width;
                    if (w <= 0 || w === d.containerW) return;
                    // Pre-position strip before re-render to avoid first-frame jump.
                    const idx = RANGE + d.centerOffset;
                    d.trioX.value = -idx * w;
                    d.snapIdx.value = idx;
                    d.containerWShared.value = w;
                    d.setContainerW(w);
                  }}
                  style={{ width: "100%", overflow: "hidden" }}
                >
                  {d.containerW > 0 ? (
                    <Animated.View
                      style={[
                        { flexDirection: "row", width: d.containerW * d.monthList.length },
                        d.stripStyle,
                      ]}
                    >
                      {d.monthList.map((m, i) => {
                        // Centre+neighbours first paint; rest mount after slide-in.
                        const visible = d.fullyMounted
                          || Math.abs(i - (RANGE + d.centerOffset)) <= 1;
                        return (
                          <View
                            key={`${m.year}-${m.month}`}
                            style={{ width: d.containerW }}
                          >
                            {visible ? (
                              <MonthGrid
                                data={m}
                                pendingValue={d.pendingValue}
                                todayMidnight={d.todayMidnight}
                                today={d.today}
                                onPick={d.handlePick}
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

            {d.showYearSelect ? (
              <YearOverlay
                yearPage={d.yearPage}
                setYearPage={d.setYearPage}
                value={value}
                today={d.today}
                onSelectYear={(yr) => {
                  // Re-anchor strip on year pick; only fires on explicit selection.
                  d.setReference({ month: d.calMonth, year: yr });
                  d.setCenterOffset(0);
                  d.setShowYearSelect(false);
                }}
                onClose={() => d.setShowYearSelect(false)}
                c={c}
              />
            ) : null}

            <View style={styles.footer}>
              {d.pendingValue ? (
                <Pressable
                  onPress={() => {
                    onChange(null);
                    d.setPendingValue(null);
                    d.finishClose();
                  }}
                  style={[styles.footerBtn, { borderColor: c.border }]}
                >
                  <ThemedText style={[styles.footerBtnText, { color: c.fgSubtle }]}>Clear</ThemedText>
                </Pressable>
              ) : null}
              <Pressable
                onPress={() => d.animateClose(true)}
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
