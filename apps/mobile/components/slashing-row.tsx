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

/**
 * Total duration of the slash animation. Phases scale with this value:
 * underline draw at the front, row holds full height for 55%, then
 * collapses + fades over the remaining 45%. Trimmed from web's 1.6s to a
 * snappier 650ms — feels decisive on mobile without skipping the read of
 * the danger underline.
 */
export const SLASH_MS = 650;

interface Props {
  isSlashing: boolean;
  children: ReactNode;
}

/**
 * Mobile port of web's `.task-row-deleting` + `.row-delete-underline` pair.
 * Wrap a task row in this; when `isSlashing` flips to true:
 *
 *   1. A red 1px underline draws left-to-right across the row's bottom edge
 *      over 0.9s (cubic-bezier 0.65, 0, 0.35, 1), then fades over the
 *      remaining time with a 3px upward drift — matches the BankBurstEffect
 *      submit underline's motion vocabulary.
 *   2. The row holds full height + opacity for 55% of the duration so the
 *      user can read the danger underline, then collapses height to 0 and
 *      opacity to 0 over the remaining 45%.
 *
 * The parent is expected to keep the row mounted for SLASH_MS before
 * pulling it from the list, so the collapse plays to completion.
 */
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

    // Underline draws L→R for ~56% of the total slash duration — that
    // ratio matches web's 0.9s-of-1.6s pacing so the draw still completes
    // before the row begins collapsing at 55%.
    underlineProgress.value = withTiming(1, {
      duration: Math.round(SLASH_MS * 0.56),
      easing: Easing.bezier(0.65, 0, 0.35, 1),
    });
    // Opacity: 0→0.55 over 14%, hold to 28%, fade to 0 over the remainder
    // (linear keeps the fade rate constant — matches web's bank-stamp tail).
    underlineOpacity.value = withSequence(
      withTiming(0.55, { duration: SLASH_MS * 0.14, easing: Easing.linear }),
      withTiming(0.55, { duration: SLASH_MS * (0.28 - 0.14), easing: Easing.linear }),
      withTiming(0, { duration: SLASH_MS * (1 - 0.28), easing: Easing.linear }),
    );
    // 3px upward drift starts when the fade-out begins.
    underlineY.value = withDelay(
      SLASH_MS * 0.28,
      withTiming(-3, { duration: SLASH_MS * (1 - 0.28), easing: Easing.linear }),
    );

    // Row collapse: hold for 55%, then collapse over the remaining 45%.
    // scaleY from origin top so the row crumples toward the row above
    // rather than from the center.
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
      // Apply the animated style + transformOrigin ONLY when slashing.
      // Leaving them on always (with scaleY=1 at rest) is technically a
      // no-op but it forces a render layer on every row, which can throw
      // off layout-sensitive children (e.g. the avatar pager that measures
      // its parent) and creates a transform context on a row that's just
      // sitting in the list.
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
