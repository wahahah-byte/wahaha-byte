import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  cycleSum: number;
  pendingLog: number;
  showStepper: boolean;
  counterUnit?: string | null;
  counterGoal?: number | null;
  capAtGoal?: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
}

// Mobile port of QuickLogStepper. Mirrors the web layout: an inline +/- chip
// with the running total in the middle, plus an optional progress bar when a
// counterGoal is set.
export function QuickLogStepper({
  cycleSum,
  pendingLog,
  showStepper,
  counterUnit,
  counterGoal,
  capAtGoal,
  onIncrement,
  onDecrement,
}: Props) {
  const c = useColors();
  const sum = cycleSum + pendingLog;
  const goal = counterGoal ?? null;
  const capped = !!capAtGoal && goal != null && sum >= goal;

  if (cycleSum === 0 && pendingLog === 0 && goal == null && !showStepper) return null;

  const unit = counterUnit ? ` ${counterUnit}` : "";
  const reached = goal != null && sum >= goal;
  const innerText = goal != null
    ? `${sum.toLocaleString()} / ${goal.toLocaleString()}${unit}`
    : `${sum.toLocaleString()}${unit}`;

  const decDisabled = sum <= 0;
  const incDisabled = capped;

  const chip = showStepper ? (
    <View style={[styles.chip, { borderColor: c.borderHairline, backgroundColor: c.input }]}>
      <Pressable
        onPress={onDecrement}
        disabled={decDisabled}
        hitSlop={8}
        style={({ pressed }) => [
          styles.btn,
          { opacity: decDisabled ? 0.3 : pressed ? 0.55 : 1 },
        ]}
      >
        <ThemedText style={[styles.btnText, { color: c.fg }]}>−</ThemedText>
      </Pressable>
      <View style={styles.valueWrap}>
        <ThemedText
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: c.fg,
            fontVariant: ["tabular-nums"],
          }}
        >
          {innerText}
        </ThemedText>
        {reached ? (
          <ThemedText style={{ marginLeft: 6, color: c.success, fontSize: 12 }}>✓</ThemedText>
        ) : null}
      </View>
      <Pressable
        onPress={onIncrement}
        disabled={incDisabled}
        hitSlop={8}
        style={({ pressed }) => [
          styles.btn,
          { opacity: incDisabled ? 0.3 : pressed ? 0.55 : 1 },
        ]}
      >
        <ThemedText style={[styles.btnText, { color: c.fg }]}>+</ThemedText>
      </Pressable>
    </View>
  ) : (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <ThemedText style={{ fontSize: 12, fontWeight: "600", color: c.fg, fontVariant: ["tabular-nums"] }}>
        {innerText}
      </ThemedText>
      {reached ? (
        <ThemedText style={{ marginLeft: 6, color: c.success, fontSize: 12 }}>✓</ThemedText>
      ) : null}
    </View>
  );

  if (goal == null) {
    return (
      <View style={styles.row}>
        <ThemedText style={[styles.label, { color: c.fg }]}>Today</ThemedText>
        {chip}
      </View>
    );
  }

  const pct = Math.min(100, Math.round((sum / goal) * 100));
  return (
    // Matches web's `flex flex-col items-center gap-1.5` — the Today + stepper
    // row sits centered above a full-width progress meter.
    <View style={{ gap: 6, minWidth: 180, alignItems: "center" }}>
      <View style={styles.row}>
        <ThemedText style={[styles.label, { color: c.fg }]}>Today</ThemedText>
        {chip}
      </View>
      <View style={[styles.barTrack, { backgroundColor: c.track }]}>
        <View
          style={{
            width: `${pct}%`,
            height: "100%",
            backgroundColor: reached ? c.success : c.activeHighlightAlt,
            borderRadius: 2,
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { fontSize: 11, fontWeight: "600" },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    height: 24,
    overflow: "hidden",
  },
  btn: {
    width: 26,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 16,
  },
  valueWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    minWidth: 50,
    justifyContent: "center",
  },
  barTrack: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
});
