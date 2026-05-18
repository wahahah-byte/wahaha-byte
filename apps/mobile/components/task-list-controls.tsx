import { useState } from "react";
import { Modal, Pressable, StyleSheet, View } from "react-native";
import Svg, { Line, Polyline } from "react-native-svg";

import type { GroupMode, SortMode } from "@wahaha/shared";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

type SortOption = readonly [SortMode, string];
type GroupOption = readonly [GroupMode, string];

const SORT_OPTIONS: SortOption[] = [
  ["due", "Due Date"],
  ["priority", "Priority"],
  ["title", "Title"],
  ["points", "Points"],
];

const GROUP_OPTIONS: GroupOption[] = [
  ["none", "None"],
  ["due", "Due Date"],
  ["category", "Category"],
];

interface Props {
  sortMode: SortMode;
  groupMode: GroupMode;
  onSortChange: (m: SortMode) => void;
  onGroupChange: (m: GroupMode) => void;
}

function SortIcon({ color }: { color: string }) {
  return (
    <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
      <Line x1={1} y1={2} x2={9} y2={2} stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1={1} y1={5} x2={7} y2={5} stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1={1} y1={8} x2={5} y2={8} stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

function GroupIcon({ color }: { color: string }) {
  return (
    <Svg width={10} height={10} viewBox="0 0 10 10" fill="none">
      <Line x1={1} y1={2} x2={9} y2={2} stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1={1} y1={5} x2={6} y2={5} stroke={color} strokeWidth={1.2} strokeLinecap="round" />
      <Line x1={1} y1={8} x2={7.5} y2={8} stroke={color} strokeWidth={1.2} strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Sort + group controls — mirrors web TaskListControls. Lives in the
 * action-bar slot beside the quick-add input. Menus render in a Modal
 * anchored to the bottom of the screen so they don't get clipped by
 * the action bar's height-50 container.
 */
export function TaskListControls({
  sortMode, groupMode, onSortChange, onGroupChange,
}: Props) {
  const c = useColors();
  const [open, setOpen] = useState<null | "sort" | "group">(null);

  const sortActive = sortMode !== "due";
  const groupActive = groupMode !== "none";
  const sortTint = sortActive ? c.activeHighlight : c.fgSubtle;
  const groupTint = groupActive ? c.activeHighlight : c.fgSubtle;

  return (
    <>
      <View style={styles.row}>
        <Pressable
          onPress={() => setOpen("sort")}
          style={({ pressed }) => [
            styles.pill,
            {
              borderColor: sortActive ? c.activeHighlightBorder : c.borderHairline,
              backgroundColor: sortActive ? c.activeHighlightBg : "transparent",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <SortIcon color={sortTint} />
        </Pressable>
        <Pressable
          onPress={() => setOpen("group")}
          style={({ pressed }) => [
            styles.pill,
            {
              borderColor: groupActive ? c.activeHighlightBorder : c.borderHairline,
              backgroundColor: groupActive ? c.activeHighlightBg : "transparent",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <GroupIcon color={groupTint} />
        </Pressable>
      </View>

      <Modal
        visible={open !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(null)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(null)}>
          <Pressable
            onPress={(e) => e.stopPropagation?.()}
            style={[
              styles.menu,
              { backgroundColor: c.surface, borderTopColor: c.border },
            ]}
          >
            <View style={styles.menuHeader}>
              <ThemedText
                style={{
                  fontSize: 9,
                  color: c.fgSubtle,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  fontWeight: "600",
                }}
              >
                {open === "sort" ? "Sort by" : "Group by"}
              </ThemedText>
            </View>
            {(open === "sort" ? SORT_OPTIONS : GROUP_OPTIONS).map(([value, label]) => {
              const isActive =
                open === "sort" ? sortMode === value : groupMode === value;
              return (
                <Pressable
                  key={value}
                  onPress={() => {
                    if (open === "sort") onSortChange(value as SortMode);
                    else onGroupChange(value as GroupMode);
                    setOpen(null);
                  }}
                  style={({ pressed }) => [
                    styles.menuItem,
                    { backgroundColor: pressed ? c.surfaceHover : "transparent" },
                  ]}
                >
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: isActive ? c.activeHighlight : c.borderHairline },
                    ]}
                  />
                  <ThemedText
                    style={{
                      fontSize: 11,
                      color: isActive ? c.activeHighlight : c.fgMuted,
                      letterSpacing: 1.4,
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </ThemedText>
                  {isActive ? (
                    <Svg
                      width={10}
                      height={7}
                      viewBox="0 0 8 6"
                      fill="none"
                      style={{ marginLeft: "auto" }}
                    >
                      <Polyline
                        points="1,3 3,5 7,1"
                        stroke={c.activeHighlight}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </Svg>
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 6 },
  pill: {
    // Circular tap target — matches the routines category icon buttons
    // (36×36) and the quick-add pill's vocabulary on the same bar.
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
  },
  menu: {
    borderTopWidth: 1,
    paddingBottom: 32,
  },
  menuHeader: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
