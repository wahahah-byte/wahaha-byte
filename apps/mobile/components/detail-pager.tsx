import { useState, type ReactNode } from "react";
import { LayoutChangeEvent, Pressable, StyleSheet, View } from "react-native";
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

interface Card {
  key: string;
  content: ReactNode;
}

interface Props {
  cards: Card[];
  height?: number;
  labels?: string[];
}

const SWIPE_COMMIT_PX = 56;
const RUBBER_EDGE = 0.15;

// Horizontal swipe pager with axis-lock, rubber-band edges, and tab strip.
export function DetailPager({ cards, height = 220, labels }: Props) {
  const c = useColors();
  const [active, setActive] = useState(0);
  const [wrapWidth, setWrapWidth] = useState(0);

  // Continuous page index (0=first, 1=second…) for animated style reads.
  const offset = useSharedValue(0);
  const dragStart = useSharedValue(0);

  function snapTo(idx: number) {
    setActive(idx);
    offset.value = withTiming(idx, { duration: 260, easing: Easing.bezier(0.22, 1, 0.36, 1) });
  }

  function onLayout(e: LayoutChangeEvent) {
    setWrapWidth(e.nativeEvent.layout.width);
  }

  // Activate after 8px horizontal so inner Pressables get taps; failOffsetY lets sheet dismiss win vertically.
  const pan = Gesture.Pan()
    .activeOffsetX([-8, 8])
    .failOffsetY([-12, 12])
    .onStart(() => {
      "worklet";
      dragStart.value = offset.value;
    })
    .onUpdate((e) => {
      "worklet";
      if (wrapWidth === 0) return;
      // Horizontal only — modal can't be dismissed by swiping down on pager.
      const deltaIdx = -e.translationX / wrapWidth;
      let next = dragStart.value + deltaIdx;
      // Rubber-band past edges.
      const last = cards.length - 1;
      if (next < 0) next = -RUBBER_EDGE * Math.min(1, -next);
      else if (next > last) next = last + RUBBER_EDGE * Math.min(1, next - last);
      offset.value = next;
    })
    .onEnd(() => {
      "worklet";
      if (wrapWidth === 0) return;
      const commitFraction = SWIPE_COMMIT_PX / wrapWidth;
      let target = Math.round(offset.value);
      // Low snap-threshold so a decisive flick commits.
      if (offset.value - dragStart.value > commitFraction && target <= dragStart.value) {
        target = Math.min(cards.length - 1, Math.floor(dragStart.value) + 1);
      } else if (dragStart.value - offset.value > commitFraction && target >= dragStart.value) {
        target = Math.max(0, Math.ceil(dragStart.value) - 1);
      }
      target = Math.max(0, Math.min(cards.length - 1, target));
      offset.value = withTiming(target, { duration: 260, easing: Easing.bezier(0.22, 1, 0.36, 1) });
      if (target !== Math.round(dragStart.value)) runOnJS(setActive)(target);
    });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -offset.value * wrapWidth }],
  }));

  return (
    <View>
      <View
        onLayout={onLayout}
        style={{ overflow: "hidden", height }}
      >
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              {
                flexDirection: "row",
                width: wrapWidth * cards.length,
                height: "100%",
              },
              rowStyle,
            ]}
          >
            {cards.map((card) => (
              <View
                key={card.key}
                style={{
                  width: wrapWidth,
                  height: "100%",
                }}
              >
                {card.content}
              </View>
            ))}
          </Animated.View>
        </GestureDetector>
      </View>

      {cards.length > 1 ? (
        <View style={[styles.tabStrip, { borderBottomColor: c.borderFaint }]}>
          {cards.map((_, i) => {
            const isActive = i === active;
            const label = labels?.[i] ?? `Card ${i + 1}`;
            return (
              <Pressable
                key={i}
                onPress={() => snapTo(i)}
                style={[
                  styles.tab,
                  {
                    borderBottomColor: isActive ? c.activeHighlightAlt : "transparent",
                  },
                ]}
              >
                <ThemedText
                  style={{
                    fontSize: 9,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                    fontWeight: isActive ? "600" : "500",
                    color: isActive ? c.activeHighlightAlt : c.fgSubtle,
                  }}
                >
                  {label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  tabStrip: {
    flexDirection: "row",
    justifyContent: "center",
    borderBottomWidth: 1,
    gap: 4,
    marginTop: 8,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderBottomWidth: 2,
    marginBottom: -1,
  },
});
