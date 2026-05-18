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
  /** Awarded points to display in the "+N pts" pop on commit. Omit/0 hides
   *  the pop (mirrors web BankBurstEffect skipping +0). */
  pointValue?: number;
  onConfirm: () => void;
}

const COMMIT_FRACTION = 0.78;
// Glide + landing + hold + fade-out are sequenced so the user clearly sees
// the puck travel to the end, land with a pulse, hold for a beat, then
// the whole slide fades out before onConfirm fires. The parent's unmount
// then aligns with the slide already being invisible — no abrupt cut.
const COMMIT_GLIDE_MS = 460;
const LANDING_PULSE_MS = 220;
const HOLD_MS = 140;
const FADE_OUT_MS = 260;
const COMMIT_FIRE_DELAY =
  COMMIT_GLIDE_MS + LANDING_PULSE_MS + HOLD_MS + FADE_OUT_MS;
const THUMB_SIZE = 48;
const TRACK_HEIGHT = 52;
const TRACK_PAD = 2;
// Total play-out for the post-commit point popup + border pulse. Matches
// the web app's `recurring-pts-popup` 1.1s + the outline pulse ~600ms tail.
const POPUP_TOTAL_MS = 1100;

export function SlideToCheckIn({ label = "Slide to check in", disabled, pointValue = 0, onConfirm }: Props) {
  const c = useColors();
  const [trackWidth, setTrackWidth] = useState(0);
  const [committed, setCommitted] = useState(false);

  const max = Math.max(0, trackWidth - THUMB_SIZE - TRACK_PAD * 2);
  const offset = useSharedValue(0);
  const dragStart = useSharedValue(0);
  // Gates the commit so a single threshold-crossing fires fireConfirm + the
  // arm haptic exactly once per drag, even if onUpdate fires more frames
  // before the `committed` state propagates and disables the gesture.
  const armed = useSharedValue(false);
  // Post-commit celebration. Mirrors web's TaskRow recurring-pts-popup
  // (rises + overshoots scale + fades) and checkin-outline (border draws
  // around the row + fades). The same beats render here over the track.
  const popupY = useSharedValue(0);
  const popupOpacity = useSharedValue(0);
  const popupScale = useSharedValue(0.55);
  const borderOpacity = useSharedValue(0);
  // Whole-slide opacity for the graceful fade-out at the end of commit, and
  // a transient scale-up on the thumb as it lands at the right edge.
  const slideOpacity = useSharedValue(1);
  const thumbScale = useSharedValue(1);

  function onLayout(e: LayoutChangeEvent) {
    setTrackWidth(e.nativeEvent.layout.width);
  }

  function notifyArm() {
    // Light "click" the moment you cross the commit threshold — pairs with
    // the auto-glide so the action feels like it latched.
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {
      /* haptics are best-effort */
    });
  }
  function notifyCommit() {
    // Success "thunk" when the glide finishes and onConfirm fires.
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {
      /* haptics are best-effort */
    });
  }

  function playPopup() {
    // "+N pts" rises, briefly overshoots scale, then keeps drifting while
    // fading. Numbers mirror web's keyframes (0% → 14% → 28% → 70% → 100%).
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
    // Border highlight pulses around the track for the same beat.
    borderOpacity.value = withSequence(
      withTiming(1, { duration: 180, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
      withDelay(500, withTiming(0, { duration: 600, easing: Easing.linear })),
    );
  }

  function fireConfirm() {
    setCommitted(true);
    playPopup();

    // After the glide lands at the right edge: pulse the thumb (so the user
    // sees a real "landing" beat) and fire the success haptic.
    setTimeout(() => {
      thumbScale.value = withSequence(
        withTiming(1.08, { duration: LANDING_PULSE_MS / 2, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
        withTiming(1, { duration: LANDING_PULSE_MS / 2, easing: Easing.bezier(0.22, 0.7, 0.4, 1) }),
      );
      notifyCommit();
    }, COMMIT_GLIDE_MS);

    // After the landing pulse + a brief hold: fade the whole slide out.
    // This is what fixes the "disappears suddenly" feel — the parent's
    // unmount happens after we've already animated the slide to opacity 0.
    setTimeout(() => {
      slideOpacity.value = withTiming(0, { duration: FADE_OUT_MS, easing: Easing.linear });
    }, COMMIT_GLIDE_MS + LANDING_PULSE_MS + HOLD_MS);

    // Once fade-out is complete: hand off to the parent. Reset internal
    // state on a delay so we're clean if the parent re-uses this instance,
    // but we deliberately leave slideOpacity at 0 — restoring it to 1 here
    // briefly flashes the slide back on between the reset firing and the
    // parent's next render unmounting us. Opacity gets reset on the next
    // drag (see onStart) or via a fresh mount.
    setTimeout(() => {
      onConfirm();
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
      // If the slide was faded out by a prior commit but the parent kept
      // us mounted, snap back to visible so the new drag is actually seen.
      // Normal first-mount case: opacity is already 1, this is a no-op.
      if (slideOpacity.value !== 1) slideOpacity.value = 1;
      dragStart.value = offset.value;
    })
    .onUpdate((e) => {
      "worklet";
      // Critical: once armed, bail out so the in-flight withTiming glide
      // isn't clobbered every frame by `offset.value = next` while the
      // finger is still down. Using armed.value (shared, immediate) instead
      // of `committed` (React state, stale in worklet closure) is what
      // makes the auto-glide actually run to the end.
      if (armed.value) return;
      const next = Math.max(0, Math.min(max, dragStart.value + e.translationX));
      offset.value = next;
      if (max > 0 && next / max >= COMMIT_FRACTION) {
        armed.value = true;
        runOnJS(notifyArm)();
        // Out-cubic decelerates as the thumb approaches the end — feels like
        // landing rather than snapping to the wall.
        offset.value = withTiming(max, {
          duration: COMMIT_GLIDE_MS,
          easing: Easing.out(Easing.cubic),
        });
        runOnJS(fireConfirm)();
      }
    })
    .onEnd(() => {
      "worklet";
      // Same rationale as above: armed.value (UI-thread truth) takes
      // priority over the React `committed` flag here. Without this guard,
      // lifting the finger after the threshold cross springs offset back
      // to 0 and the thumb visibly snaps back instead of completing.
      if (armed.value) return;
      // Spring back instead of timing — partial drags now bounce home, which
      // reads as "playful, not yet" instead of a flat slide.
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
  // Colored fill grows with the thumb so the user sees the strip filling up
  // instead of an isolated puck moving across an inert track. Width ends at
  // the thumb's center so the thumb's circular right half always covers the
  // fill's straight right edge — otherwise the rectangle pokes out around
  // the thumb's curve as a visible square shoulder.
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
      {/* +N pts popup — rises out of the track on commit. Mirrors web's
          recurring-pts-popup keyframe set. Skipped when pointValue is 0
          (e.g. counter-only tasks). */}
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

      {/* Border highlight — pill outline pulses over the track on commit,
          fading after the popup. Mirrors web's checkin-outline rect. */}
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
  // Host wraps the track + the popup so the popup can rise above the track
  // without being clipped by the track's overflow:hidden (which the fill
  // and thumb need to stay clipped to the pill shape).
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
    // Inset by TRACK_PAD so the fill matches the thumb's vertical extent
    // exactly — otherwise the 2 px strip above + below the thumb leaks the
    // fill colour around the puck's rounded edges.
    top: TRACK_PAD,
    bottom: TRACK_PAD,
    left: TRACK_PAD,
    // Round the fill so its left cap matches the thumb's curve when the
    // thumb is barely off the start position.
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
    // Exact pixel radius (THUMB_SIZE / 2, not 999) is what Android's
    // elevation shadow uses to compute the round shadow shape — using 999
    // is what makes elevation draw a square halo on some Android versions.
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.28)",
    // Android Material depth — keeps the puck reading as a raised pill
    // floating over the track instead of sitting flush with the fill.
    elevation: 6,
  },
});
