import { useEffect, type ReactNode } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/use-colors";

// Total slash animation duration; phases scale from this.
export const SLASH_MS = 650;

interface Props {
  isSlashing: boolean;
  children: ReactNode;
}

// Slash-to-delete row animation: danger underline draw, hold, then collapse.
export function SlashingRow({ isSlashing, children }: Props) {
  const c = useColors();
  const scaleY = useSharedValue(1);
  const opacity = useSharedValue(1);
  const containerWidth = useSharedValue(0);
  const underlineProgress = useSharedValue(0);
  const underlineOpacity = useSharedValue(0);
  const underlineY = useSharedValue(0);

  useEffect(() => {
    if (!isSlashing) return;

    // Underline draws L→R for ~56% of slash duration.
    underlineProgress.value = withTiming(1, {
      duration: Math.round(SLASH_MS * 0.56),
      easing: Easing.bezier(0.65, 0, 0.35, 1),
    });
    // Opacity: 0→0.55 over 14%, hold to 28%, fade to 0.
    underlineOpacity.value = withSequence(
      withTiming(0.55, { duration: SLASH_MS * 0.14, easing: Easing.linear }),
      withTiming(0.55, { duration: SLASH_MS * (0.28 - 0.14), easing: Easing.linear }),
      withTiming(0, { duration: SLASH_MS * (1 - 0.28), easing: Easing.linear }),
    );
    // 3px upward drift starts with fade-out.
    underlineY.value = withDelay(
      SLASH_MS * 0.28,
      withTiming(-3, { duration: SLASH_MS * (1 - 0.28), easing: Easing.linear }),
    );

    // Row collapse: hold 55%, then collapse 45% from top origin.
    scaleY.value = withDelay(
      SLASH_MS * 0.55,
      withTiming(0, {
        duration: SLASH_MS * 0.45,
        easing: Easing.bezier(0.65, 0, 0.35, 1),
      }),
    );
    opacity.value = withDelay(
      SLASH_MS * 0.55,
      withTiming(0, {
        duration: SLASH_MS * 0.45,
        easing: Easing.bezier(0.65, 0, 0.35, 1),
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSlashing]);

  const wrapperStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: scaleY.value }],
    opacity: opacity.value,
  }));

  const underlineStyle = useAnimatedStyle(() => ({
    width: underlineProgress.value * containerWidth.value,
    opacity: underlineOpacity.value,
    transform: [{ translateY: underlineY.value }],
  }));

  return (
    <Animated.View
      pointerEvents={isSlashing ? "none" : "auto"}
      onLayout={(e) => {
        containerWidth.value = e.nativeEvent.layout.width;
      }}
      // Apply animated style + transformOrigin only when slashing (avoids unnecessary render layer).
      style={isSlashing
        ? [wrapperStyle, { transformOrigin: "top" } as never]
        : undefined}
    >
      {children}
      {isSlashing ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: "absolute",
              left: 0,
              bottom: 0,
              height: 1,
              backgroundColor: c.danger,
              boxShadow: "0px 0px 3px rgba(239, 68, 68, 0.28)",
            },
            underlineStyle,
          ]}
        />
      ) : null}
    </Animated.View>
  );
}
