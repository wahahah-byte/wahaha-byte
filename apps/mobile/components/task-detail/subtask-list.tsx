import type { MutableRefObject, RefObject } from "react";
import { Pressable, View } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Svg, { Polyline } from "react-native-svg";

import type { Subtask, TaskDto } from "@wahaha/shared";
import type { useColors } from "@/hooks/use-colors";
import { DeleteIcon } from "@/components/action-icons";
import { SwipeableRow } from "@/components/swipeable-row";
import { SwipeRowProvider } from "@/components/swipe-row-context";
import { ThemedText } from "@/components/themed-text";
import { styles } from "@/components/task-detail/styles";

type ChipBounds = { left: number; top: number; right: number; bottom: number };

interface Props {
  task: TaskDto;
  c: ReturnType<typeof useColors>;
  scrollRef: RefObject<React.ComponentRef<typeof BottomSheetScrollView> | null>;
  chipBoundsRef: MutableRefObject<Map<number, ChipBounds>>;
  addingSubtaskOpen: boolean;
  error: string | null;
  onToggleSubtask: (sub: Subtask) => void;
  onDeleteSubtask: (sub: Subtask) => void;
  onStartEditSubtask: (sub: Subtask) => void;
  onAddOpen: () => void;
}

export function SubtaskList({
  task,
  c,
  scrollRef,
  chipBoundsRef,
  addingSubtaskOpen,
  error,
  onToggleSubtask,
  onDeleteSubtask,
  onStartEditSubtask,
  onAddOpen,
}: Props) {
  return (
    <View style={styles.subtasksPanel}>
      <BottomSheetScrollView
        ref={scrollRef}
        style={styles.subtasksScroll}
        contentContainerStyle={styles.subtasksContent}
        // "always" so taps on scroll don't dismiss keyboard.
        keyboardShouldPersistTaps="always"
      >
        {/* SwipeRowProvider scopes auto-close to subtask list. */}
        <SwipeRowProvider>
          {(task.subtasks ?? []).map((sub, idx, arr) => {
            const isFitness = task.category === "Fitness";
            const hasSetsReps = (sub.setsTarget ?? 0) > 0 || (sub.repsTarget ?? 0) > 0;
            return (
            <SwipeableRow
              key={sub.subtaskId}
              rowId={String(sub.subtaskId)}
              prevId={arr[idx - 1]?.subtaskId != null ? String(arr[idx - 1].subtaskId) : undefined}
              nextId={arr[idx + 1]?.subtaskId != null ? String(arr[idx + 1].subtaskId) : undefined}
              // Row bg matches sheet; wrapper keeps surfaceDeep on swipe.
              backgroundColor={c.bg}
              actions={[
                {
                  key: "delete",
                  icon: <DeleteIcon color={c.danger} />,
                  pressBg: c.dangerBg,
                  onPress: () => onDeleteSubtask(sub),
                },
              ]}
              // Full-swipe past half row → slides off + deletes.
              fullSwipeAction={() => onDeleteSubtask(sub)}
              fullSwipeThreshold={0.5}
              fullSwipeColor={c.danger}
              // Hit-test the chip area on tap; SwipeableRow blocks Pressable children, so we route taps manually.
              onTap={(e) => {
                const b = chipBoundsRef.current.get(sub.subtaskId);
                if (isFitness && b && e.x >= b.left && e.x <= b.right && e.y >= b.top && e.y <= b.bottom) {
                  onStartEditSubtask(sub);
                  return;
                }
                onToggleSubtask(sub);
              }}
            >
              <View style={[styles.subRow, styles.subRowPadded]}>
                <View
                  style={[
                    styles.subCheckbox,
                    {
                      borderColor: sub.completed ? c.success : c.border,
                      backgroundColor: sub.completed ? c.successBg : "transparent",
                    },
                  ]}
                >
                  {sub.completed ? (
                    <Svg width={8} height={6} viewBox="0 0 8 6" fill="none">
                      <Polyline
                        points="1,3 3,5 7,1"
                        stroke={c.success}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                  ) : null}
                </View>
                <ThemedText
                  numberOfLines={2}
                  style={[
                    { flex: 1, fontSize: 12, color: sub.completed ? c.fgMuted : c.fg },
                    sub.completed ? { textDecorationLine: "line-through" } : null,
                  ]}
                >
                  {sub.title}
                </ThemedText>
                {isFitness ? (
                  <View
                    onLayout={(ev) => {
                      const { x, y, width, height } = ev.nativeEvent.layout;
                      chipBoundsRef.current.set(sub.subtaskId, { left: x, top: y, right: x + width, bottom: y + height });
                    }}
                    style={[styles.setsChip, {
                      borderColor: hasSetsReps ? c.borderSoft : c.borderHairline,
                    }]}
                  >
                    <ThemedText style={{
                      fontSize: 10,
                      fontWeight: "600",
                      color: hasSetsReps ? c.fgMuted : c.fgSubtle,
                      letterSpacing: 0.2,
                      fontVariant: ["tabular-nums"],
                    }}>
                      {hasSetsReps
                        ? `${sub.setsTarget ?? "—"}×${sub.repsTarget ?? "—"}`
                        : "+ sets"}
                    </ThemedText>
                  </View>
                ) : null}
              </View>
            </SwipeableRow>
            );
          })}
        </SwipeRowProvider>

        {/* Opens floating SubtaskAddBar (sibling of BottomSheet). */}
        {!addingSubtaskOpen ? (
          <Pressable
            onPress={onAddOpen}
            style={({ pressed }) => [styles.subRow, { opacity: pressed ? 0.5 : 1 }]}
          >
            <View style={[styles.subCheckbox, { borderColor: c.borderHairline }]} />
            <ThemedText style={{ color: c.fgSubtle, fontSize: 12 }}>
              + Add subtask
            </ThemedText>
          </Pressable>
        ) : null}

        {error ? <ThemedText style={{ color: c.danger, fontSize: 12 }}>{error}</ThemedText> : null}
      </BottomSheetScrollView>
    </View>
  );
}
