import { StyleSheet } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from "react-native-reanimated";

// A ring of particles that bursts outward as `progress` animates 0 → 1.
// Absolute-fill overlay (no layout impact) — drop it over whatever is poofing.

const SPREAD = 42;
const PARTICLES = Array.from({ length: 8 }, (_, i) => {
  const a = (Math.PI * 2 * i) / 8;
  return { dx: Math.cos(a), dy: Math.sin(a) };
});

export function PoofBurst({ progress, color }: { progress: SharedValue<number>; color: string }) {
  return (
    <Animated.View pointerEvents="none" style={styles.layer}>
      {PARTICLES.map((pt, i) => (
        <Particle key={i} p={progress} dx={pt.dx} dy={pt.dy} color={color} />
      ))}
    </Animated.View>
  );
}

function Particle({
  p,
  dx,
  dy,
  color,
}: {
  p: SharedValue<number>;
  dx: number;
  dy: number;
  color: string;
}) {
  const style = useAnimatedStyle(() => ({
    opacity: interpolate(p.value, [0, 0.18, 1], [0, 1, 0]),
    transform: [
      { translateX: dx * SPREAD * p.value },
      { translateY: dy * SPREAD * p.value },
      { scale: interpolate(p.value, [0, 1], [1, 0.3]) },
    ],
  }));
  return <Animated.View pointerEvents="none" style={[styles.particle, { backgroundColor: color }, style]} />;
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 40,
  },
  particle: {
    position: "absolute",
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
