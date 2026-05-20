import { useEffect, useRef, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

export interface FilterOption {
  value: string;
  label: string;
}

interface Props {
  options: FilterOption[];
  value: string;
  onChange: (next: string) => void;
  // Optional per-filter task count rendered after the label.
  getCount?: (value: string) => number;
  // Optional dot before the label (e.g. unsubmitted-pts indicator).
  badgeColor?: (value: string) => string | null;
}

const TRAY_HEIGHT = 28;
const HORIZONTAL_PAD = 8;
const PILL_AREA_HEIGHT = 12;
const TRAY_HEIGHT_TOTAL = TRAY_HEIGHT + 8;
const CYCLE_HINT_DURATION_MS = 900;
const SWIPE_CYCLE_THRESHOLD = 36;
const HANDLE_HITBOX_HEIGHT = 26;

// Bottom filter strip — tap/pan via gesture-handler; pill toggles + cycles.
export function FilterStrip({ options, value, onChange, getCount, badgeColor }: Props) {
  const c = useColors();
  const slotPx = useSharedValue(0);

  const activeIdx = Math.max(0, options.findIndex((o) => o.value === value));
  const offset = useSharedValue(activeIdx);
  const dragStart = useSharedValue(0);

  // Tray open/closed — collapse slides strip down; handle stays floating.
  const [open, setOpen] = useState(true);
  const trayY = useSharedValue(0);

  // Floating cycle hint — brief label above pill on swipe-cycle.
  const [cycleHint, setCycleHint] = useState<string | null>(null);
  const cycleHintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (cycleHintTimer.current) clearTimeout(cycleHintTimer.current);
  }, []);
  function flashCycleHint(label: string) {
    setCycleHint(label);
    if (cycleHintTimer.current) clearTimeout(cycleHintTimer.current);
    cycleHintTimer.current = setTimeout(() => setCycleHint(null), CYCLE_HINT_DURATION_MS);
  }

  function snapTo(nextOpen: boolean) {
    setOpen(nextOpen);
    trayY.value = withTiming(nextOpen ? 0 : TRAY_HEIGHT_TOTAL, {
      duration: 220,
      easing: Easing.bezier(0.2, 0, 0, 1),
    });
  }

  function cycleFilter(direction: -1 | 1) {
    const idx = options.findIndex((o) => o.value === value);
    if (idx < 0) return;
    const next = Math.max(0, Math.min(options.length - 1, idx + direction));
    if (next === idx) return;
    onChange(options[next].value);
    flashCycleHint(options[next].label);
  }

  // Sync indicator on external active change.
  useEffect(() => {
    offset.value = withTiming(activeIdx, { duration: 220, easing: Easing.bezier(0.2, 0, 0, 1) });
  }, [activeIdx, offset]);

  function onLayout(e: LayoutChangeEvent) {
    const w = e.nativeEvent.layout.width;
    slotPx.value = (w - HORIZONTAL_PAD * 2) / options.length;
  }

  // Strip pan: drags highlight + selected filter horizontally.
  const pan = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .failOffsetY([-12, 12])
    .onStart(() => {
      dragStart.value = offset.value;
    })
    .onUpdate((e) => {
      if (slotPx.value === 0) return;
      const delta = e.translationX / slotPx.value;
      offset.value = Math.max(0, Math.min(options.length - 1, dragStart.value + delta));
    })
    .onEnd(() => {
      const snapped = Math.max(0, Math.min(options.length - 1, Math.round(offset.value)));
      offset.value = withTiming(snapped, { duration: 220, easing: Easing.bezier(0.2, 0, 0, 1) });
      if (options[snapped] && options[snapped].value !== value) {
        runOnJS(onChange)(options[snapped].value);
        runOnJS(flashCycleHint)(options[snapped].label);
      }
    });

  const tap = Gesture.Tap()
    .maxDistance(8)
    .onEnd((e) => {
      if (slotPx.value === 0) return;
      const x = e.x - HORIZONTAL_PAD;
      const idx = Math.floor(x / slotPx.value);
      const clamped = Math.max(0, Math.min(options.length - 1, idx));
      if (options[clamped] && options[clamped].value !== value) {
        runOnJS(onChange)(options[clamped].value);
      }
    });

  const composed = Gesture.Race(pan, tap);

  // Handle pill: tap toggle, v-drag opens/closes, h-swipe cycles.
  const handleStartedOpen = useSharedValue(true);
  const handleAxis = useSharedValue<"v" | "h" | null>(null);
  const handleCycled = useSharedValue(false);

  const handlePan = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .activeOffsetY([-8, 8])
    .onStart(() => {
      handleStartedOpen.value = open;
      handleAxis.value = null;
      handleCycled.value = false;
    })
    .onUpdate((e) => {
      if (handleAxis.value === null) {
        const ax = Math.abs(e.translationX);
        const ay = Math.abs(e.translationY);
        if (ax < 8 && ay < 8) return;
        handleAxis.value = ax > ay ? "h" : "v";
      }
      if (handleAxis.value === "v") {
        const base = handleStartedOpen.value ? 0 : TRAY_HEIGHT_TOTAL;
        trayY.value = Math.max(0, Math.min(TRAY_HEIGHT_TOTAL, base + e.translationY));
      } else if (handleAxis.value === "h") {
        if (!handleCycled.value && Math.abs(e.translationX) >= SWIPE_CYCLE_THRESHOLD) {
          handleCycled.value = true;
          runOnJS(cycleFilter)(e.translationX < 0 ? 1 : -1);
        }
      }
    })
    .onEnd(() => {
      if (handleAxis.value === "v") {
        const willOpen = trayY.value < TRAY_HEIGHT_TOTAL / 2;
        runOnJS(snapTo)(willOpen);
      }
      handleAxis.value = null;
    });

  const handleTap = Gesture.Tap()
    .maxDistance(8)
    .onEnd(() => {
      runOnJS(snapTo)(!open);
    });

  const handleGesture = Gesture.Race(handlePan, handleTap);

  const highlightStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value * slotPx.value }],
    width: slotPx.value || 0,
  }));

  const trayStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: trayY.value }],
  }));

  // Handle tracks tray top (clamped at TRAY_HEIGHT) so it sticks to action bar.
  const handleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: Math.min(trayY.value, TRAY_HEIGHT) }],
  }));

  return (
    <View>
      {/* Handle pill — follows tray top so it feels physically connected. */}
      <GestureDetector gesture={handleGesture}>
        <Animated.View style={[styles.pillRow, handleStyle]}>
          {cycleHint ? (
            <View
              style={[
                styles.cycleHint,
                {
                  backgroundColor: c.surface,
                  borderColor: c.activeHighlightBorder,
                  pointerEvents: "none",
                },
              ]}
            >
              <ThemedText
                style={{
                  color: c.activeHighlight,
                  fontSize: 11,
                  letterSpacing: 1.8,
                  textTransform: "uppercase",
                  fontWeight: "700",
                }}
              >
                {cycleHint}
              </ThemedText>
            </View>
          ) : null}
          <View
            style={[
              styles.pill,
              { backgroundColor: open ? c.activeHighlight : c.border },
            ]}
          />
        </Animated.View>
      </GestureDetector>

      <Animated.View style={trayStyle}>
        <View
          onLayout={onLayout}
          style={[
            styles.tray,
            {
              backgroundColor: c.header,
              borderTopColor: c.borderSoft,
              borderBottomColor: c.borderHairline,
            },
          ]}
        >
          <GestureDetector gesture={composed}>
            <View style={styles.inner}>
              <Animated.View
                style={[
                  styles.highlight,
                  {
                    backgroundColor: c.activeHighlightBg,
                    borderColor: c.activeHighlightBorder,
                    pointerEvents: "none",
                  },
                  highlightStyle,
                ]}
              />
              {options.map((opt) => {
                const isActive = opt.value === value;
                const count = getCount?.(opt.value);
                const dot = badgeColor?.(opt.value) ?? null;
                return (
                  <View key={opt.value} style={[styles.cell, { pointerEvents: "none" }]}>
                    {dot ? (
                      <View
                        style={[styles.dot, { backgroundColor: dot, pointerEvents: "none" }]}
                      />
                    ) : null}
                    <ThemedText
                      numberOfLines={1}
                      style={{
                        fontSize: 10,
                        letterSpacing: 1.4,
                        textTransform: "uppercase",
                        fontWeight: isActive ? "700" : "500",
                        color: isActive ? c.activeHighlight : c.fgMuted,
                      }}
                    >
                      {opt.label}
                    </ThemedText>
                    {count !== undefined ? (
                      <ThemedText
                        style={{
                          fontSize: 10,
                          marginLeft: 4,
                          color: isActive ? c.activeHighlight : c.fgMuted,
                          opacity: 0.6,
                          fontWeight: "500",
                        }}
                      >
                        {count}
                      </ThemedText>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </GestureDetector>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  tray: {
    height: TRAY_HEIGHT,
    borderTopWidth: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  inner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "stretch",
    paddingHorizontal: HORIZONTAL_PAD,
    position: "relative",
  },
  highlight: {
    position: "absolute",
    top: 1,
    bottom: 1,
    left: HORIZONTAL_PAD,
    borderWidth: 1,
    borderRadius: 3,
  },
  cell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    gap: 5,
    zIndex: 1,
  },
  pillRow: {
    // Larger hitbox than visible pill for reliable tap.
    height: HANDLE_HITBOX_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  pill: {
    width: 50,
    height: 3,
    borderRadius: 1.5,
  },
  cycleHint: {
    position: "absolute",
    bottom: PILL_AREA_HEIGHT + 16,
    // Generous padding/minWidth so short labels (e.g. "All") aren't squished.
    minWidth: 64,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.28)",
    elevation: 6,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
});

