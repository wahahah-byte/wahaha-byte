import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/use-colors";

const PARTICLE_COUNT = 12;
const DURATION_MS = 900;

interface Particle {
  dx: number;
  dy: number;
  size: number;
  delay: number;
  color: string;
  rot: number;
}

interface Props {
  active: boolean;
}

// Particle burst on recurring check-in — 12 particles spray upward, fade ~900ms.
export function CheckInBurstEffect({ active }: Props) {
  const c = useColors();
  const [particles, setParticles] = useState<Particle[] | null>(null);

  // Burst palette — alt highlight, success, warning.
  const colors = useMemo(
    () => [c.activeHighlightAlt, c.success, c.warning],
    [c.activeHighlightAlt, c.success, c.warning],
  );

  useEffect(() => {
    if (!active) {
      setParticles(null);
      return;
    }
    setParticles(
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        // Upward cone — base −π/2, spread ±0.475·π.
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.95);
        const dist = 36 + Math.random() * 28;
        return {
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          size: i % 3 === 0 ? 4 : 3,
          delay: Math.floor(Math.random() * 60),
          color: colors[i % colors.length],
          rot: (Math.random() - 0.5) * 90,
        };
      }),
    );
    const t = setTimeout(() => setParticles(null), DURATION_MS);
    return () => clearTimeout(t);
  }, [active, colors]);

  if (!particles) return null;

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        { pointerEvents: "none", overflow: "visible", zIndex: 27 },
      ]}
    >
      {particles.map((p, i) => (
        <BurstParticle key={i} particle={p} />
      ))}
    </View>
  );
}

function BurstParticle({ particle }: { particle: Particle }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      particle.delay,
      withTiming(1, { duration: DURATION_MS - particle.delay, easing: Easing.out(Easing.cubic) }),
    );
  }, [particle.delay, progress]);

  const style = useAnimatedStyle(() => {
    const t = progress.value;
    // Translate to (dx, dy); scale → 0.4; opacity fades in second half.
    const tx = particle.dx * t;
    const ty = particle.dy * t;
    const scale = 1 - 0.6 * t;
    const rotate = particle.rot * t * 2;
    const opacity = t < 0.5 ? 1 : 1 - (t - 0.5) * 2;
    return {
      transform: [
        { translateX: tx },
        { translateY: ty },
        { rotate: `${rotate}deg` },
        { scale },
      ],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: "50%",
          top: "50%",
          marginLeft: -particle.size / 2,
          marginTop: -particle.size / 2,
          width: particle.size,
          height: particle.size,
          backgroundColor: particle.color,
          borderRadius: 1,
        },
        style,
      ]}
    />
  );
}
