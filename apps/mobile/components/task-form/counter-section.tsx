import { Pressable, View } from "react-native";

import { COUNTER_UNITS } from "@wahaha/shared";
import { CompactSelect } from "@/components/compact-select";
import { GoalStepper } from "@/components/goal-stepper";
import { ThemedText } from "@/components/themed-text";
import type { useColors } from "@/hooks/use-colors";
import { styles } from "@/components/task-form/styles";

interface Props {
  hasCounter: boolean;
  setHasCounter: React.Dispatch<React.SetStateAction<boolean>>;
  counterUnit: string;
  setCounterUnit: (v: string) => void;
  counterGoal: string;
  setCounterGoal: (v: string) => void;
  capLogAtGoal: boolean;
  setCapLogAtGoal: React.Dispatch<React.SetStateAction<boolean>>;
  recurrenceRule: string;
  c: ReturnType<typeof useColors>;
}

// Counter feature — recurring-only. Label itself is the expand toggle: tapping
// it sets hasCounter, freeing the row for unit + goal + cap-at-goal inline.
export function CounterSection({
  hasCounter,
  setHasCounter,
  counterUnit,
  setCounterUnit,
  counterGoal,
  setCounterGoal,
  capLogAtGoal,
  setCapLogAtGoal,
  recurrenceRule,
  c,
}: Props) {
  return (
    <View style={{ gap: 6 }}>
      <Pressable
        onPress={() => setHasCounter((v) => !v)}
        hitSlop={6}
        style={styles.counterDisclosure}
        accessibilityRole="button"
        accessibilityState={{ expanded: hasCounter }}
        accessibilityLabel={hasCounter ? "Hide counter settings" : "Show counter settings"}
      >
        <ThemedText
          style={{
            color: c.fgMuted,
            fontSize: 9,
            fontWeight: "600",
            letterSpacing: 1.8,
            textTransform: "uppercase",
          }}
        >
          Counter
        </ThemedText>
        <ThemedText
          style={{
            color: c.fgSubtle,
            fontSize: 9,
            lineHeight: 11,
          }}
        >
          {hasCounter ? "▾" : "▸"}
        </ThemedText>
      </Pressable>
      {hasCounter ? (
        <View style={styles.counterRow}>
          <View style={{ width: 140 }}>
            <CompactSelect
              value={counterUnit}
              onChange={setCounterUnit}
              options={[
                { value: "", label: "(no unit)" },
                ...COUNTER_UNITS.map((u) => ({ value: u, label: u })),
              ]}
            />
          </View>
          <View style={styles.goalCluster}>
            <ThemedText
              style={{
                fontSize: 10,
                letterSpacing: 1.8,
                textTransform: "uppercase",
                color: c.fgSubtle,
              }}
            >
              Goal
            </ThemedText>
            <GoalStepper value={counterGoal} onChange={setCounterGoal} />
            {counterGoal.trim() !== "" && Number(counterGoal) > 0 ? (
              <Pressable
                onPress={() => setCapLogAtGoal((v) => !v)}
                hitSlop={6}
                style={[
                  styles.capChip,
                  {
                    backgroundColor: capLogAtGoal ? c.activeHighlightBg : "transparent",
                    borderColor: capLogAtGoal ? c.activeHighlightBorder : c.borderHairline,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: capLogAtGoal }}
                accessibilityLabel="Cap logs at goal"
              >
                <ThemedText
                  style={{
                    fontSize: 11,
                    lineHeight: 12,
                    color: capLogAtGoal ? c.activeHighlight : c.fgSubtle,
                    fontWeight: "700",
                  }}
                >
                  ≤
                </ThemedText>
                <ThemedText
                  style={{
                    fontSize: 9,
                    color: capLogAtGoal ? c.activeHighlight : c.fgSubtle,
                    fontWeight: capLogAtGoal ? "600" : "400",
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  Cap
                </ThemedText>
              </Pressable>
            ) : null}
            {counterUnit && counterGoal.trim() !== "" ? (
              <ThemedText style={{ fontSize: 10, color: c.fgSubtle }}>
                {counterUnit} / {recurrenceRule === "weekly" ? "wk" : recurrenceRule === "monthly" ? "mo" : "day"}
              </ThemedText>
            ) : null}
          </View>
        </View>
      ) : null}
    </View>
  );
}
