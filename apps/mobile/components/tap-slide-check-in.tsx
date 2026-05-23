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
  // Tap on the thumb fires onTapLog. If omitted, taps are inert (commit-only mode).
  onTapLog?: () => void;
  // Slide-to-end fires onCommit.
  onCommit: () => void;
  // Locked-in tap count displayed on the thumb.
  pendingCount?: number;
  pointValue?: number;
  label?: string;
  disabled?: boolean;
}

const COMMIT_FRACTION = 0.78;
const COMMIT_GLIDE_MS = 460;
const LANDING_PULSE_MS = 220;
const HOLD_MS = 140;
const FADE_OUT_MS = 260;
const COMMIT_FIRE_DELAY = COMMIT_GLIDE_MS + LANDING_PULSE_MS + HOLD_MS + FADE_OUT_MS;
const THUMB_SIZE = 48;
const TRACK_HEIGHT = 52;
const TRACK_PAD = 2;
const POPUP_TOTAL_MS = 1100;
// Small "+1" pop on tap — shorter beat than the commit pts popup.
const TAP_POP_MS = 700;

export function TapSlideCheckIn({
  onTapLog,
  onCommit,
  pendingCount = 0,
  pointValue = 0,
  label = "Slide to check in",
  disabled,
}: Props) {
  const c = useColors();
  const [trackWidth, setTrackWidth] = useState(0);
  const [committed, setCommitted] = useState(false);
  const [committedPointValue, setCommittedPointValue] = useState(0);

  const max = Math.max(0, trackWidth - THUMB_SIZE - TRACK_PAD * 2);

  const offset = useSharedValue(0);
  const dragStart = useSharedValue(0);
  const armed = useSharedValue(false);
  // Commit celebration.
  const popupY = useSharedValue(0);
  const popupOpacity = useSharedValue(0);
  const popupScale = useSharedValue(0.55);
  const borderOpacity = useSharedValue(0);
  const slideOpacity = useSharedValue(1);
  const thumbScale = useSharedValue(1);
  // Tap-log mini popup (+1 rising from thumb).
  const tapPopOpacity = useSharedValue(0);
  const tapPopY = useSharedValue(0);
  const tapPopScale = useSharedValue(0.8);

  function onLayout(e: LayoutChangeEvent) {
    setTrackWidth(e.nativeEvent.layout.width);
  }

  function hapticTap() {
    Haptics.selectionAsync().catch(() => {});
  }
  function hapticArmCommit() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
  }
  function hapticCommitLanded() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }

  function playTapPop() {
    // +1 rises briefly from the thumb on tap.
    tapPopOpacity.value = 0;
    tapPopY.value = 0;
    tapPopScale.value = 0.8;
    tapPopOpacity.value = withSequence(
      withTiming(1, { duration: 110, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
      withDelay(280, withTiming(0, { duration: 280, easing: Easing.linear })),
    );
    tapPopScale.value = withSequence(
      withTiming(1.15, { duration: 120, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
      withTiming(1.0, { duration: 160 }),
    );
    tapPopY.value = withTiming(-22, {
      duration: TAP_POP_MS,
      easing: Easing.bezier(0.22, 0.7, 0.4, 1),
    });
  }

  function playCommitPopup() {
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
    borderOpacity.value = withSequence(
      withTiming(1, { duration: 180, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
      withDelay(500, withTiming(0, { duration: 600, easing: Easing.linear })),
    );
  }

  function fireTapLog() {
    onTapLog?.();
    hapticTap();
    // Thumb pulse + +1 rise.
    thumbScale.value = withSequence(
      withTiming(1.14, { duration: 90, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
      withTiming(1, { duration: 140, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
    );
    playTapPop();
  }

  function fireCommit() {
    setCommitted(true);
    setCommittedPointValue(pointValue);
    playCommitPopup();
    onCommit();

    setTimeout(() => {
      thumbScale.value = withSequence(
        withTiming(1.08, { duration: LANDING_PULSE_MS / 2, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
        withTiming(1, { duration: LANDING_PULSE_MS / 2, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
      );
      hapticCommitLanded();
    }, COMMIT_GLIDE_MS);

    setTimeout(() => {
      slideOpacity.value = withTiming(0, { duration: FADE_OUT_MS, easing: Easing.linear });
    }, COMMIT_GLIDE_MS + LANDING_PULSE_MS + HOLD_MS);

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
        setCommittedPointValue(0);
        slideOpacity.value = 1;
      }, 60);
    }, COMMIT_FIRE_DELAY);
  }

  // Tap gesture on the thumb. maxDistance gates it from competing with pan.
  const tap = Gesture.Tap()
    .enabled(!disabled && !committed && !!onTapLog)
    .maxDuration(280)
    .maxDistance(10)
    .onEnd((_, success) => {
      "worklet";
      if (success) runOnJS(fireTapLog)();
    });

  const pan = Gesture.Pan()
    .enabled(!disabled && !committed && max > 0)
    .activeOffsetX([-4, 4])
    .failOffsetY([-12, 12])
    .onStart(() => {
      "worklet";
      if (slideOpacity.value !== 1) slideOpacity.value = 1;
      dragStart.value = offset.value;
    })
    .onUpdate((e) => {
      "worklet";
      if (armed.value) return;
      const next = Math.max(0, Math.min(max, dragStart.value + e.translationX));
      offset.value = next;
      if (max > 0 && next / max >= COMMIT_FRACTION) {
        armed.value = true;
        runOnJS(hapticArmCommit)();
        offset.value = withTiming(max, {
          duration: COMMIT_GLIDE_MS,
          easing: Easing.out(Easing.cubic),
        });
        runOnJS(fireCommit)();
      }
    })
    .onEnd(() => {
      "worklet";
      if (armed.value) return;
      offset.value = withSpring(0, { mass: 1, damping: 18, stiffness: 160 });
    });

  // Race: tap wins if user lifts quickly within distance; pan wins on real drag.
  const composed = Gesture.Race(tap, pan);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }, { scale: thumbScale.value }],
  }));
  const hostStyle = useAnimatedStyle(() => ({
    opacity: slideOpacity.value,
  }));
  const fillStyle = useAnimatedStyle(() => ({
    width: offset.value + THUMB_SIZE / 2,
  }));
  // Track label fades out as user drags toward commit threshold.
  const labelStyle = useAnimatedStyle(() => {
    const progress = max > 0 ? offset.value / max : 0;
    return { opacity: committed ? 0 : Math.max(0, 1 - progress * 1.6) };
  });
  // Tap pop tracks the thumb's x so +1 floats up directly above it.
  const tapPopStyle = useAnimatedStyle(() => ({
    opacity: tapPopOpacity.value,
    transform: [
      { translateX: offset.value + TRACK_PAD + THUMB_SIZE / 2 },
      { translateY: tapPopY.value },
      { scale: tapPopScale.value },
    ],
  }));
  const popupStyle = useAnimatedStyle(() => ({
    opacity: popupOpacity.value,
    transform: [{ translateY: popupY.value }, { scale: popupScale.value }],
  }));
  const borderHighlightStyle = useAnimatedStyle(() => ({
    opacity: borderOpacity.value,
  }));

  return (
    <Animated.View style={[styles.host, hostStyle]}>
      {/* Commit pts popup — center-top of slider. */}
      {committedPointValue > 0 ? (
        <Animated.View pointerEvents="none" style={[styles.popup, popupStyle]}>
          <ThemedText
            style={{
              color: c.activeHighlightAlt,
              fontSize: 13,
              fontWeight: "700",
              letterSpacing: 1.2,
              textShadowColor: "rgba(167, 139, 250, 0.45)",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: 8,
            }}
          >
            +{committedPointValue.toLocaleString()} pts
          </ThemedText>
        </Animated.View>
      ) : null}

      {/* Tap-log mini "+1" rising from thumb. */}
      <Animated.View
        pointerEvents="none"
        style={[styles.tapPopAnchor, tapPopStyle]}
      >
        <ThemedText
          style={{
            color: c.activeHighlightAlt,
            fontSize: 11,
            fontWeight: "700",
            letterSpacing: 0.4,
          }}
        >
          +1
        </ThemedText>
      </Animated.View>

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
          style={[styles.fill, { backgroundColor: c.activeHighlightBg }, fillStyle]}
        />

        <Animated.View
          style={[styles.labelWrap, labelStyle, { pointerEvents: "none" }]}
        >
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

        <GestureDetector gesture={composed}>
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
            ) : pendingCount > 0 ? (
              <ThemedText
                style={{
                  color: c.onActiveHighlightAlt,
                  fontSize: pendingCount > 9 ? 12 : 14,
                  fontWeight: "800",
                  letterSpacing: 0,
                }}
              >
                +{pendingCount}
              </ThemedText>
            ) : onTapLog ? (
              // Idle (tap mode): "+" hint that the thumb is tappable to add a log.
              <ThemedText
                style={{
                  color: c.onActiveHighlightAlt,
                  fontSize: 18,
                  fontWeight: "700",
                  lineHeight: 18,
                }}
              >
                +
              </ThemedText>
            ) : (
              // Idle (commit-only): slide arrow indicating drag-to-the-right.
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
  // Anchor for tap "+1" pop — translateX tracks the thumb x.
  tapPopAnchor: {
    position: "absolute",
    top: -4,
    left: -8,
    width: 16,
    alignItems: "center",
    zIndex: 25,
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
    top: TRACK_PAD,
    bottom: TRACK_PAD,
    left: TRACK_PAD,
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
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.28)",
    elevation: 6,
  },
});
