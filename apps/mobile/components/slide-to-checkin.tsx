import { useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Svg, { Line, Polyline } from "react-native-svg";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  label?: string;
  disabled?: boolean;
  // Pts for "+N pts" pop on commit; 0 hides pop.
  pointValue?: number;
  onConfirm: () => void;
}

const COMMIT_FRACTION = 0.78;
// Sequenced beats: glide → landing pulse → hold → fade out, then unmount.
const COMMIT_GLIDE_MS = 460;
const LANDING_PULSE_MS = 220;
const HOLD_MS = 140;
const FADE_OUT_MS = 260;
const COMMIT_FIRE_DELAY =
  COMMIT_GLIDE_MS + LANDING_PULSE_MS + HOLD_MS + FADE_OUT_MS;
const THUMB_SIZE = 48;
const TRACK_HEIGHT = 52;
const TRACK_PAD = 2;
// Post-commit pts popup + border pulse total duration.
const POPUP_TOTAL_MS = 1100;

export function SlideToCheckIn({ label = "Slide to check in", disabled, pointValue = 0, onConfirm }: Props) {
  const c = useColors();
  const [trackWidth, setTrackWidth] = useState(0);
  const [committed, setCommitted] = useState(false);

  const max = Math.max(0, trackWidth - THUMB_SIZE - TRACK_PAD * 2);
  const offset = useSharedValue(0);
  const dragStart = useSharedValue(0);
  // Gate so threshold-cross fires fireConfirm + arm haptic once per drag.
  const armed = useSharedValue(false);
  // Post-commit celebration: pts popup rises + border pulses around track.
  const popupY = useSharedValue(0);
  const popupOpacity = useSharedValue(0);
  const popupScale = useSharedValue(0.55);
  const borderOpacity = useSharedValue(0);
  // Whole-slide fade + thumb landing pulse.
  const slideOpacity = useSharedValue(1);
  const thumbScale = useSharedValue(1);

  function onLayout(e: LayoutChangeEvent) {
    setTrackWidth(e.nativeEvent.layout.width);
  }

  function notifyArm() {
    // Light click on threshold cross — pairs with auto-glide latch.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
      /* haptics best-effort */
    });
  }
  function notifyCommit() {
    // Success thunk when glide finishes.
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
      /* haptics best-effort */
    });
  }

  function playPopup() {
    // +N pts rises, overshoots scale, then drifts while fading.
    popupOpacity.value = 0;
    popupScale.value = 0.55;
    popupY.value = 2;
    popupOpacity.value = withSequence(
      withTiming(1, { duration: 150, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
      withDelay(600, withTiming(0, { duration: 350, easing: Easing.linear })),
    );
    popupScale.value = withSequence(
      withTiming(1.28, { duration: 150, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
      withTiming(1.0, { duration: 200 }),
      withDelay(400, withTiming(0.92, { duration: 350 })),
    );
    popupY.value = withTiming(-28, {
      duration: POPUP_TOTAL_MS,
      easing: Easing.bezier(0.22, 0.7, 0.4, 1),
    });
    // Border highlight pulses around track for same beat.
    borderOpacity.value = withSequence(
      withTiming(1, { duration: 180, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
      withDelay(500, withTiming(0, { duration: 600, easing: Easing.linear })),
    );
  }

  function fireConfirm() {
    setCommitted(true);
    playPopup();

    // Fire onConfirm immediately so list optimistic patch lands at threshold-cross.
    onConfirm();

    // After glide lands: pulse thumb + fire success haptic.
    setTimeout(() => {
      thumbScale.value = withSequence(
        withTiming(1.08, { duration: LANDING_PULSE_MS / 2, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
        withTiming(1, { duration: LANDING_PULSE_MS / 2, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
      );
      notifyCommit();
    }, COMMIT_GLIDE_MS);

    // After landing+hold: fade the whole slide out before unmount.
    setTimeout(() => {
      slideOpacity.value = withTiming(0, { duration: FADE_OUT_MS, easing: Easing.linear });
    }, COMMIT_GLIDE_MS + LANDING_PULSE_MS + HOLD_MS);

    // Reset slider state at celebration end (purely visual).
    setTimeout(() => {
      setTimeout(() => {
        offset.value = withSpring(0, { mass: 1, damping: 18, stiffness: 140 });
        thumbScale.value = 1;
        popupY.value = 0;
        popupScale.value = 0.55;
        popupOpacity.value = 0;
        borderOpacity.value = 0;
        armed.value = false;
        setCommitted(false);
      }, 60);
    }, COMMIT_FIRE_DELAY);
  }

  const pan = Gesture.Pan()
    .enabled(!disabled && !committed && max > 0)
    .activeOffsetX([-4, 4])
    .failOffsetY([-12, 12])
    .onStart(() => {
      "worklet";
      // Snap back to visible if prior commit faded us out.
      if (slideOpacity.value !== 1) slideOpacity.value = 1;
      dragStart.value = offset.value;
    })
    .onUpdate((e) => {
      "worklet";
      // Bail once armed so in-flight glide isn't clobbered each frame.
      if (armed.value) return;
      const next = Math.max(0, Math.min(max, dragStart.value + e.translationX));
      offset.value = next;
      if (max > 0 && next / max >= COMMIT_FRACTION) {
        armed.value = true;
        runOnJS(notifyArm)();
        // Out-cubic so the end feels like landing, not snapping.
        offset.value = withTiming(max, {
          duration: COMMIT_GLIDE_MS,
          easing: Easing.out(Easing.cubic),
        });
        runOnJS(fireConfirm)();
      }
    })
    .onEnd(() => {
      "worklet";
      // armed.value (UI truth) takes priority over committed state.
      if (armed.value) return;
      // Spring back on partial drag — playful "not yet".
      offset.value = withSpring(0, { mass: 1, damping: 18, stiffness: 160 });
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offset.value },
      { scale: thumbScale.value },
    ],
  }));
  const hostStyle = useAnimatedStyle(() => ({
    opacity: slideOpacity.value,
  }));
  // Fill grows with thumb; width ends at thumb center to hide square shoulder.
  const fillStyle = useAnimatedStyle(() => ({
    width: offset.value + THUMB_SIZE / 2,
  }));
  const labelStyle = useAnimatedStyle(() => {
    const progress = max > 0 ? offset.value / max : 0;
    return { opacity: committed ? 0 : Math.max(0, 1 - progress * 1.4) };
  });
  const popupStyle = useAnimatedStyle(() => ({
    opacity: popupOpacity.value,
    transform: [{ translateY: popupY.value }, { scale: popupScale.value }],
  }));
  const borderHighlightStyle = useAnimatedStyle(() => ({
    opacity: borderOpacity.value,
  }));

  return (
    <Animated.View style={[styles.host, hostStyle]}>
      {/* +N pts popup — rises out of track on commit; skip when pts=0. */}
      {pointValue > 0 ? (
        <Animated.View pointerEvents="none" style={[styles.popup, popupStyle]}>
          <ThemedText
            style={{
              color: c.activeHighlightAlt,
              fontSize: 13,
              fontWeight: "700",
              letterSpacing: 1.2,
              textShadow: "0px 0px 8px rgba(167, 139, 250, 0.45)",
            }}
          >
            +{pointValue.toLocaleString()} pts
          </ThemedText>
        </Animated.View>
      ) : null}

    <View
      onLayout={onLayout}
      style={[
        styles.track,
        {
          backgroundColor: c.input,
          borderColor: c.borderHairline,
          opacity: disabled ? 0.4 : 1,
        },
      ]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          styles.fill,
          { backgroundColor: c.activeHighlightBg },
          fillStyle,
        ]}
      />

      <Animated.View style={[styles.labelWrap, labelStyle, { pointerEvents: "none" }]}>
        <ThemedText
          style={{
            fontSize: 11,
            letterSpacing: 2.2,
            textTransform: "uppercase",
            fontWeight: "600",
            color: c.fgMuted,
            paddingLeft: THUMB_SIZE / 2,
          }}
        >
          {label}
        </ThemedText>
      </Animated.View>

      <GestureDetector gesture={pan}>
        <Animated.View
          style={[
            styles.thumb,
            {
              backgroundColor: c.activeHighlightAlt,
              top: TRACK_PAD,
              left: TRACK_PAD,
            },
            thumbStyle,
          ]}
        >
          {committed ? (
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Polyline
                points="3,8 7,12 13,4"
                stroke={c.onActiveHighlightAlt}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          ) : (
            <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <Line
                x1={3.5}
                y1={8}
                x2={11.5}
                y2={8}
                stroke={c.onActiveHighlightAlt}
                strokeWidth={1.8}
                strokeLinecap="round"
              />
              <Polyline
                points="8,4.5 12,8 8,11.5"
                stroke={c.onActiveHighlightAlt}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            </Svg>
          )}
        </Animated.View>
      </GestureDetector>

      {/* Border highlight — pill outline pulses on commit, fades after. */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.borderHighlight,
          { borderColor: c.activeHighlightAlt },
          borderHighlightStyle,
        ]}
      />
    </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  // Host wraps track + popup so popup isn't clipped by track's overflow:hidden.
  host: {
    position: "relative",
    width: "100%",
  },
  popup: {
    position: "absolute",
    top: -2,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 30,
  },
  track: {
    position: "relative",
    width: "100%",
    height: TRACK_HEIGHT,
    borderRadius: 999,
    borderWidth: 1,
    overflow: "hidden",
  },
  fill: {
    position: "absolute",
    // Inset by TRACK_PAD to match thumb's vertical extent exactly.
    top: TRACK_PAD,
    bottom: TRACK_PAD,
    left: TRACK_PAD,
    // Round so left cap matches thumb curve.
    borderRadius: (TRACK_HEIGHT - TRACK_PAD * 2) / 2,
  },
  borderHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  labelWrap: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  thumb: {
    position: "absolute",
    // THUMB_SIZE/2 (not 999) so Android elevation shadow is round.
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.28)",
    // Android Material depth so puck reads as raised pill.
    elevation: 6,
  },
});
