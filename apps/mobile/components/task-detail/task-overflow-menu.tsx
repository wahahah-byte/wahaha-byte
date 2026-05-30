import { Pressable, StyleSheet, View } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";

import type { TaskDto } from "@wahaha/shared";
import type { useColors } from "@/hooks/use-colors";
import { ThemedText } from "@/components/themed-text";
import { styles } from "@/components/task-detail/styles";

interface Props {
  task: TaskDto;
  c: ReturnType<typeof useColors>;
  insets: EdgeInsets;
  showEdit: boolean;
  showArchive: boolean;
  onClose: () => void;
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}

// Overflow popover — Edit / Archive / Delete management actions.
export function TaskOverflowMenu({
  task,
  c,
  insets,
  showEdit,
  showArchive,
  onClose,
  onEdit,
  onArchive,
  onDelete,
}: Props) {
  return (
    <>
      <Pressable
        style={StyleSheet.absoluteFillObject}
        onPress={onClose}
      />
      <View
        style={[
          styles.overflowMenu,
          {
            backgroundColor: c.surface,
            borderColor: c.border,
            // Sit just above the floating ⋮ trigger; the trigger lives
            // inside the footer with paddingBottom = 68 + insets.bottom,
            // and is ~36px tall + a 12px gap = ~116px above the safe area.
            bottom: insets.bottom + 116,
          },
        ]}
      >
        {showEdit ? (
          <Pressable
            onPress={() => { onClose(); onEdit(); }}
            style={({ pressed }) => [
              styles.overflowMenuItem,
              { backgroundColor: pressed ? c.overlayHover : "transparent" },
            ]}
          >
            <ThemedText style={[styles.overflowMenuLabel, { color: c.fgMuted }]}>
              Edit
            </ThemedText>
          </Pressable>
        ) : null}
        {showArchive ? (
          <Pressable
            onPress={() => { onClose(); onArchive(); }}
            style={({ pressed }) => [
              styles.overflowMenuItem,
              { backgroundColor: pressed ? c.overlayHover : "transparent" },
            ]}
          >
            <ThemedText style={[styles.overflowMenuLabel, { color: c.fgMuted }]}>
              {task.isArchived ? "Unarchive" : "Archive"}
            </ThemedText>
          </Pressable>
        ) : null}
        <Pressable
          onPress={() => { onClose(); onDelete(); }}
          style={({ pressed }) => [
            styles.overflowMenuItem,
            { backgroundColor: pressed ? c.overlayHover : "transparent" },
          ]}
        >
          <ThemedText style={[styles.overflowMenuLabel, { color: c.danger }]}>
            Delete
          </ThemedText>
        </Pressable>
      </View>
    </>
  );
}
