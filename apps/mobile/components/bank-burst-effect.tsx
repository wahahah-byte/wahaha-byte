import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/use-colors";

interface Props {
  /** Toggle the animation on. Each rising edge re-plays it. */
  active: boolean;
  /** Points awarded — drives the "+N" popup that floats up above the row. */
  amount?: number;
}

// Mobile port of web's BankBurstEffect. Plays when a row is "banked" (its
// points submitted). Two overlays inside the row's position-relative parent:
//   1) A 1px success-coloured underline glides L→R across the row's bottom
//      edge, then drifts up and fades — a quiet "ledger stamp" stroke.
//   2) A "+N" pill floats up out of the row's bottom-right and tapers to 0.
//
// We don't try to portal a +N to a header balance chip the way web does —
// mobile has no always-visible balance chip; the drawer is the only place
// it lives. The inline +N stays near the row where the change happens.
const TOTAL_MS = 1900;

export function BankBurstEffect({ active, amount = 0 }: Props) {
  const c = useColors();

  // 0 = idle. Rising to 1 plays the underline + popup; falling to 0 resets.
  const progress = useSharedValue(0);
  // Captured at trigger so re-renders during play don't read a cleared value.
  const snapshot = useSharedValue(0);

  useEffect(() => {
    if (!active) return;
    snapshot.value = amount;
    // Restart cleanly even if the previous run hasn't fully tailed off.
    progress.value = 0;
    progress.value = withSequence(
      withTiming(1, { duration: TOTAL_MS, easing: Easing.linear }),
      withTiming(0, { duration: 0 }),
    );
  }, [active, amount, progress, snapshot]);

  // Underline:
  // 0   – 0.16: grows from 0% to 100% width (the L→R sweep).
  // 0.16 – 0.7:  holds width, peak opacity 0.55.
  // 0.7  – 1.0:  lifts up 18 px and fades to 0.
  const underlineStyle = useAnimatedStyle(() => {
    const p = progress.value;
    if (p <= 0 || p >= 1) return { opacity: 0 };
    const width = Math.min(1, p / 0.16);
    let opacity = 0;
    let translateY = 0;
    if (p < 0.16) opacity = 0.55 * (p / 0.16);
    else if (p < 0.7) opacity = 0.55;
    else {
      const f = (p - 0.7) / 0.3;
      opacity = 0.55 * (1 - f);
      translateY = -18 * f;
    }
    return {
      width: `${width * 100}%`,
      opacity,
      transform: [{ translateY }],
    };
  });

  // +N popup:
  // delayed start (~0.18), rises 28 px, fades from 0 → 0.7 → 0 over ~1.45 s.
  const popupStyle = useAnimatedStyle(() => {
    const p = progress.value;
    if (p <= 0 || p >= 1 || snapshot.value <= 0) return { opacity: 0 };
    const start = 0.18;
    if (p < start) return { opacity: 0, transform: [{ translateY: 0 }] };
    const f = Math.min(1, (p - start) / (1 - start));
    // Triangle fade: 0 → 0.7 at the midpoint → 0 at the end.
    const opacity = f < 0.5 ? 0.7 * (f / 0.5) : 0.7 * (1 - (f - 0.5) / 0.5);
    const translateY = -28 * f;
    return { opacity, transform: [{ translateY }] };
  });

  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.underline,
          { backgroundColor: c.success },
          underlineStyle,
        ]}
      />
      {amount > 0 ? (
        <Animated.Text
          pointerEvents="none"
          style={[
            styles.popup,
            { color: c.success },
            popupStyle,
          ]}
        >
          +{amount.toLocaleString()}
        </Animated.Text>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  underline: {
    position: "absolute",
    left: 0,
    bottom: 0,
    height: 1,
  },
  popup: {
    position: "absolute",
    right: 8,
    bottom: 4,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
