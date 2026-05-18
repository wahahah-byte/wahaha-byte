import { useMemo, useState } from "react";
import { Platform, Pressable, StyleSheet, TextInput, View } from "react-native";
import { router } from "expo-router";

import {
  CATEGORIES,
  formatParsedHint,
  parseQuickTask,
  type GroupMode,
  type SortMode,
} from "@wahaha/shared";
import { tasksApi } from "@/lib/api";
import { TaskListControls } from "@/components/task-list-controls";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

const PRIORITY_MAP: Record<string, string> = { low: "Low", medium: "Medium", high: "High" };

interface ActionBarProps {
  onCreated?: () => void;
  sortMode?: SortMode;
  groupMode?: GroupMode;
  onSortChange?: (m: SortMode) => void;
  onGroupChange?: (m: GroupMode) => void;
}

export function MobileActionBar({
  onCreated,
  sortMode,
  groupMode,
  onSortChange,
  onGroupChange,
}: ActionBarProps = {}) {
  const c = useColors();
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  const parsed = useMemo(() => parseQuickTask(value, CATEGORIES), [value]);
  const hint = formatParsedHint(parsed);
  const canSubmit = !!parsed.title && !busy;

  async function commit() {
    if (!canSubmit) return;
    setBusy(true);
    try {
      const res = await tasksApi.create({
        title: parsed.title,
        category: parsed.category ?? "Other",
        priority: PRIORITY_MAP[parsed.priority],
        pointValue: 10,
        dueDate: parsed.dueDate
          ? `${parsed.dueDate.getFullYear()}-${String(parsed.dueDate.getMonth() + 1).padStart(2, "0")}-${String(parsed.dueDate.getDate()).padStart(2, "0")}`
          : undefined,
        isRecurring: false,
      });
      if (!res.error) {
        setValue("");
        onCreated?.();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: c.header,
          borderTopColor: c.borderSoft,
        },
      ]}
    >
      <View
        style={[
          styles.inputWrap,
          {
            backgroundColor: c.input,
            borderColor: value ? c.activeHighlightBorder : c.borderHairline,
          },
        ]}
      >
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Add task…  (try: gym tomorrow !high)"
          placeholderTextColor={c.fgSubtle}
          onSubmitEditing={commit}
          returnKeyType="done"
          // Android's <EditText> reserves vertical space for font ascenders/
          // descenders that often clips a 13 px placeholder. textAlignVertical
          // belongs on TextInput as a prop; includeFontPadding=false moves to
          // the style block. Together with paddingVertical: 0 they let the
          // placeholder use its full glyph height without lineHeight.
          textAlignVertical="center"
          style={[styles.input, { color: c.inputFg, includeFontPadding: false }]}
        />
        {value && hint ? (
          <ThemedText
            style={{
              fontSize: 9,
              color: c.activeHighlight,
              letterSpacing: 1,
              textTransform: "uppercase",
              paddingRight: 6,
              opacity: 0.85,
            }}
          >
            {hint}
          </ThemedText>
        ) : null}
        {value ? (
          <Pressable
            onPress={commit}
            disabled={!canSubmit}
            style={({ pressed }) => [
              styles.submitBtn,
              { opacity: !canSubmit ? 0.3 : pressed ? 0.6 : 1 },
            ]}
          >
            <ThemedText style={{ fontSize: 16, color: c.activeHighlight }}>↵</ThemedText>
          </Pressable>
        ) : null}
      </View>
      {sortMode !== undefined && groupMode !== undefined && onSortChange && onGroupChange ? (
        <TaskListControls
          sortMode={sortMode}
          groupMode={groupMode}
          onSortChange={onSortChange}
          onGroupChange={onGroupChange}
        />
      ) : null}
      <Pressable
        onPress={() => router.push("/new-task")}
        style={({ pressed }) => [styles.plusBtn, { opacity: pressed ? 0.6 : 1 }]}
      >
        <ThemedText style={{ fontSize: 20, color: c.fg, lineHeight: Platform.OS === "web" ? 22 : 24 }}>+</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 8,
    height: 64,
    borderTopWidth: 1,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    borderWidth: 1,
    // Pill — half-height radius. Switched from the angular 2 px to match
    // the rounder visual language of the chips and slide-to-checkin track.
    borderRadius: 999,
    paddingLeft: 6,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 13,
    letterSpacing: 0.3,
    height: "100%",
  },
  submitBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  plusBtn: {
    width: 44,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
