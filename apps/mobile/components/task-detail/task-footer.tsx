import { Pressable, View } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";

import type { TaskDto } from "@wahaha/shared";
import type { useColors } from "@/hooks/use-colors";
import type { useQuickLog } from "@/hooks/use-quick-log";
import { CheckIcon, PauseIcon, StartIcon, UndoIcon } from "@/components/action-icons";
import { LogCheckinButton } from "@/components/log-checkin-button";
import { QuickLogStepper } from "@/components/quick-log-stepper";
import { TapSlideCheckIn } from "@/components/tap-slide-check-in";
import { ThemedText } from "@/components/themed-text";
import { styles } from "@/components/task-detail/styles";

interface Props {
  task: TaskDto;
  renderSlider: boolean;
  canCheckIn: boolean;
  canUndo: boolean;
  checkingIn: boolean;
  quickLog: ReturnType<typeof useQuickLog>;
  insets: EdgeInsets;
  c: ReturnType<typeof useColors>;
  onToggleMenu: () => void;
  onCustomLogOpen: () => void;
  onCheckIn: () => void;
  onCheckInWithCounter: (touchValue: number) => void;
  onStart: () => void;
  onComplete: () => void;
  onPause: () => void;
  onUndoComplete: () => void;
}

export function TaskFooter({
  task,
  renderSlider,
  canCheckIn,
  canUndo,
  checkingIn,
  quickLog,
  insets,
  c,
  onToggleMenu,
  onCustomLogOpen,
  onCheckIn,
  onCheckInWithCounter,
  onStart,
  onComplete,
  onPause,
  onUndoComplete,
}: Props) {
  // Vertical-dot management menu trigger. Lives inline beside whatever the
  // current primary action is (slider for recurring, CTA for non-recurring),
  // so it stays at the lower right without taking its own row.
  const overflowTrigger = (
    <Pressable
      onPress={onToggleMenu}
      hitSlop={8}
      style={styles.overflowBtn}
      accessibilityLabel="Task actions"
    >
      <ThemedText style={{ fontSize: 20, lineHeight: 20, color: c.fgMuted, fontWeight: "700" }}>⋮</ThemedText>
    </Pressable>
  );

  return (
    <View
      style={[
        styles.footerStack,
        {
          borderColor: c.borderHairline,
          backgroundColor: c.bg,
          paddingBottom: 68 + insets.bottom,
        },
      ]}
    >
      {renderSlider ? (
        task.hasCounter ? (
          <View style={{ gap: 10 }}>
            <QuickLogStepper
              cycleSum={quickLog.cycleSumToday}
              pendingLog={quickLog.pendingLog}
              showStepper={false}
              counterUnit={task.counterUnit ?? null}
              counterGoal={task.counterGoal ?? null}
              capAtGoal={task.capLogAtGoal ?? undefined}
              onIncrement={quickLog.handleStepperIncrement}
              onDecrement={quickLog.handleStepperDecrement}
              onPress={onCustomLogOpen}
              disabled={checkingIn || !canCheckIn}
            />
            <View style={styles.actionRow}>
              <View style={{ flex: 1 }}>
                <LogCheckinButton
                  // No key on lastCheckInDate — the slider stays mounted through
                  // commit so it can puff itself away after a check-in.
                  cycleSum={quickLog.cycleSumToday}
                  pendingLog={quickLog.pendingLog}
                  counterGoal={task.counterGoal ?? null}
                  pointValue={task.pointValue}
                  disabled={checkingIn || !canCheckIn}
                  onLog={quickLog.handleStepperIncrement}
                  onCheckInWithCounter={onCheckInWithCounter}
                />
              </View>
              {overflowTrigger}
            </View>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <View style={styles.sliderHost}>
              <View style={styles.sliderWrap}>
                {/* No key on lastCheckInDate — the slider stays mounted through
                    commit so it can puff itself away (and holds its height, so
                    the ⋮ trigger never shifts). */}
                <TapSlideCheckIn
                  pointValue={task.pointValue}
                  onCommit={() => onCheckIn()}
                  disabled={checkingIn || !canCheckIn}
                />
              </View>
            </View>
            {overflowTrigger}
          </View>
        )
      ) : task.status === "pending" && !task.isRecurring ? (
        <View style={styles.actionRow}>
          <Pressable
            onPress={onStart}
            style={({ pressed }) => [
              styles.primaryCta,
              {
                flex: 1,
                backgroundColor: pressed ? c.activeHighlightBg : c.activeHighlight,
                borderColor: c.activeHighlight,
              },
            ]}
          >
            <StartIcon color={c.onActiveHighlight} />
            <ThemedText style={[styles.primaryCtaLabel, { color: c.onActiveHighlight }]}>
              Start
            </ThemedText>
          </Pressable>
          {overflowTrigger}
        </View>
      ) : task.status === "in_progress" ? (
        <View style={styles.actionRow}>
          <Pressable
            onPress={onComplete}
            style={({ pressed }) => [
              styles.primaryCta,
              {
                flex: 2,
                backgroundColor: pressed ? c.successBg : c.success,
                borderColor: c.success,
              },
            ]}
          >
            <CheckIcon color={c.bg} />
            <ThemedText style={[styles.primaryCtaLabel, { color: c.bg }]}>
              Complete
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={onPause}
            style={({ pressed }) => [
              styles.secondaryCta,
              {
                flex: 1,
                backgroundColor: pressed ? c.warningBg : "transparent",
                borderColor: c.warning,
              },
            ]}
          >
            <PauseIcon color={c.warning} />
            <ThemedText style={[styles.primaryCtaLabel, { color: c.warning }]}>
              Pause
            </ThemedText>
          </Pressable>
          {overflowTrigger}
        </View>
      ) : canUndo && !task.isRecurring ? (
        <View style={styles.actionRow}>
          <Pressable
            onPress={onUndoComplete}
            style={({ pressed }) => [
              styles.primaryCta,
              {
                flex: 1,
                backgroundColor: pressed ? c.warningBg : c.warning,
                borderColor: c.warning,
              },
            ]}
          >
            <UndoIcon color={c.bg} />
            <ThemedText style={[styles.primaryCtaLabel, { color: c.bg }]}>
              Undo
            </ThemedText>
          </Pressable>
          {overflowTrigger}
        </View>
      ) : (
        // No primary action available (e.g. completed + submitted/awarded);
        // ⋮ alone, right-aligned.
        <View style={{ alignItems: "flex-end" }}>{overflowTrigger}</View>
      )}
    </View>
  );
}
