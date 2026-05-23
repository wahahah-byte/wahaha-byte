import { StyleSheet, View } from "react-native";

import { TapSlideCheckIn } from "@/components/tap-slide-check-in";

interface Props {
  // Current persisted total (excludes pendingLog).
  cycleSum: number;
  pendingLog: number;
  counterGoal: number | null;
  pointValue: number;
  disabled?: boolean;
  // Increment pendingLog by 1 (debounced flush handles persistence).
  onLog: () => void;
  // Commit cycle; touchValue is +1 absorbed when overshoot-tap triggers commit, 0 for slide-commit.
  onCheckInWithCounter: (touchValue: number) => void;
}

export function LogCheckinButton({
  cycleSum,
  pendingLog,
  counterGoal,
  pointValue,
  disabled,
  onLog,
  onCheckInWithCounter,
}: Props) {
  const sumWithPending = cycleSum + pendingLog;
  const wouldOvershoot =
    counterGoal != null && sumWithPending + 1 >= counterGoal;

  // Overshoot: a tap-log would hit the goal — collapse to commit-only.
  // Tap is disabled; only a slide commits the cycle (+1 absorbed).
  if (wouldOvershoot) {
    return (
      <View style={styles.host}>
        <View style={styles.sliderWrap}>
          <TapSlideCheckIn
            label="Slide to check in"
            pendingCount={pendingLog}
            onCommit={() => onCheckInWithCounter(1)}
            pointValue={pointValue}
            disabled={disabled}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.host}>
      <View style={styles.sliderWrap}>
        <TapSlideCheckIn
          label="Slide to check in"
          pendingCount={pendingLog}
          onTapLog={onLog}
          onCommit={() => onCheckInWithCounter(0)}
          pointValue={pointValue}
          disabled={disabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    width: "100%",
    alignItems: "center",
  },
  // Shorter than the footer's content width — centered by host's alignItems.
  sliderWrap: {
    width: "100%",
    maxWidth: 280,
  },
});
