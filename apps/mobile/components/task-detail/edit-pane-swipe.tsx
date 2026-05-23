import { Dimensions } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

interface Props {
  onDismiss: () => void;
  children: React.ReactNode;
}

// Edit-mode swipe-right-to-dismiss. Uses manualActivation so vertical scrolls fail
// the gesture and hand off to inner ScrollViews, while a horizontal-dominant swipe
// activates and slides the pane off-screen. Commit on either distance (25% of width)
// or velocity (700 dp/s) thresholds.
export function EditPaneSwipeWrapper({ onDismiss, children }: Props) {
  const screenWidth = Dimensions.get("window").width;
  const COMMIT_DISTANCE = screenWidth * 0.25;
  const COMMIT_VELOCITY = 700;
  const SWIPE_THRESHOLD = 12;
  const tx = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);

  const pan = Gesture.Pan()
    .manualActivation(true)
    .onBegin((e) => {
      "worklet";
      startX.value = e.x;
      startY.value = e.y;
    })
    .onTouchesMove((e, state) => {
      "worklet";
      const t = e.allTouches[0];
      if (!t) return;
      const dx = t.x - startX.value;
      const dy = t.y - startY.value;
      // Horizontal-dominant rightward past threshold → activate.
      if (dx > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
        state.activate();
      } else if (Math.abs(dy) > SWIPE_THRESHOLD) {
        // Vertical → hand off to ScrollView.
        state.fail();
      }
    })
    .onUpdate((e) => {
      "worklet";
      // Subtract threshold so position starts at 0 on activation.
      tx.value = Math.max(0, e.translationX - SWIPE_THRESHOLD);
    })
    .onEnd((e) => {
      "worklet";
      const commit = e.translationX > COMMIT_DISTANCE || e.velocityX > COMMIT_VELOCITY;
      if (commit) {
        // Slide off-screen, then flip state to avoid jarring underlying reveal.
        tx.value = withTiming(screenWidth, { duration: 220 }, (done) => {
          if (done) runOnJS(onDismiss)();
        });
      } else {
        tx.value = withTiming(0, { duration: 200 });
      }
    });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }));

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[{ flex: 1 }, animStyle]}>{children}</Animated.View>
    </GestureDetector>
  );
}
