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
  // Rising edge re-plays the animation.
  active: boolean;
  // Points awarded — drives the "+N" popup floating above the row.
  amount?: number;
}

// Bank burst: success underline sweeps L→R, then +N pill floats up above row.
const TOTAL_MS = 1900;

export function BankBurstEffect({ active, amount = 0 }: Props) {
  const c = useColors();

  // 0=idle; rising to 1 plays underline+popup, falling to 0 resets.
  const progress = useSharedValue(0);
  // Captured at trigger so re-renders don't read a cleared value.
  const snapshot = useSharedValue(0);

  useEffect(() => {
    if (!active) return;
    snapshot.value = amount;
    // Restart cleanly even if previous run hasn't tailed off.
    progress.value = 0;
    progress.value = withSequence(
      withTiming(1, { duration: TOTAL_MS, easing: Easing.linear }),
      withTiming(0, { duration: 0 }),
    );
  }, [active, amount, progress, snapshot]);

  // Underline: 0–0.16 sweep, 0.16–0.7 hold @0.55, 0.7–1 lift + fade.
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

  // +N popup: delayed start (~0.18), rises 28px, triangle fade.
  const popupStyle = useAnimatedStyle(() => {
    const p = progress.value;
    if (p <= 0 || p >= 1 || snapshot.value <= 0) return { opacity: 0 };
    const start = 0.18;
    if (p < start) return { opacity: 0, transform: [{ translateY: 0 }] };
    const f = Math.min(1, (p - start) / (1 - start));
    // Triangle fade: 0 → 0.7 → 0.
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
