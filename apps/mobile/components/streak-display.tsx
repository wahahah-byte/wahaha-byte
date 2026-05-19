import { View } from "react-native";

import { currentStreakTier } from "@wahaha/shared";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  currentStreakCount?: number;
  longestStreakCount?: number;
}

export function StreakDisplay({ currentStreakCount, longestStreakCount }: Props) {
  const c = useColors();
  const count = currentStreakCount ?? 0;
  // Hide only when there's no streak at all. For counts 1-2 (below the
  // tier-1 threshold) the panel still renders with a "STREAK" label and
  // a progress segment toward tier 1 — hiding it entirely read as "the
  // streak vanished" when an undo dropped the count back under 3.
  if (count < 1) return null;

  const multiplier = count >= 30 ? 2.0 : count >= 14 ? 1.8 : count >= 7 ? 1.5 : count >= 3 ? 1.2 : 1.0;
  const nextTier =
    count >= 30 ? null :
    count >= 14 ? { at: 30, mult: 2.0 } :
    count >= 7 ? { at: 14, mult: 1.8 } :
    count >= 3 ? { at: 7, mult: 1.5 } :
    { at: 3, mult: 1.2 };
  const tierStart = count >= 14 ? 14 : count >= 7 ? 7 : count >= 3 ? 3 : 0;
  const SEGMENTS = 12;
  const filled = nextTier
    ? Math.max(1, Math.min(SEGMENTS, Math.round(((count - tierStart) / (nextTier.at - tierStart)) * SEGMENTS)))
    : SEGMENTS;
  const fmt = (m: number) => (Number.isInteger(m) ? m.toFixed(0) : m.toFixed(1));

  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}>
          <ThemedText style={{
            fontSize: 9, letterSpacing: 1.8, textTransform: "uppercase",
            fontWeight: "700", color: c.secondaryAccent,
          }}>
            {currentStreakTier(count)?.label ?? "STREAK"}
          </ThemedText>
          <ThemedText style={{ opacity: 0.5, color: c.secondaryAccent }}>·</ThemedText>
          <ThemedText style={{
            fontWeight: "600", color: c.secondaryAccent,
            fontVariant: ["tabular-nums"],
          }}>
            {count}
          </ThemedText>
          {longestStreakCount != null && longestStreakCount > count ? (
            <ThemedText style={{
              opacity: 0.55, color: c.secondaryAccent,
              fontVariant: ["tabular-nums"], fontSize: 11,
            }}>
              / {longestStreakCount}
            </ThemedText>
          ) : null}
          <ThemedText style={{
            marginLeft: 6, fontWeight: "600", color: c.secondaryAccent,
          }}>
            {fmt(multiplier)}×
          </ThemedText>
        </View>
        {nextTier ? (
          <ThemedText style={{
            color: c.fgSubtle, fontSize: 10, fontVariant: ["tabular-nums"],
          }}>
            {nextTier.at - count} → {fmt(nextTier.mult)}×
          </ThemedText>
        ) : (
          <ThemedText style={{
            fontSize: 10, letterSpacing: 1.8, textTransform: "uppercase",
            fontWeight: "700", color: c.secondaryAccent,
          }}>
            Max
          </ThemedText>
        )}
      </View>
      <View style={{ flexDirection: "row", gap: 2 }}>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1, height: 6,
              backgroundColor: i < filled ? c.secondaryAccent : c.borderSoft,
            }}
          />
        ))}
      </View>
    </View>
  );
}
