import { useRef, useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";
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

// Popover layout: width is fixed so right-edge alignment with the anchor stays
// stable across rerenders; height is item-count × row + header so we can offset
// above the button without measuring the menu itself.
const MENU_WIDTH = 168;
const MENU_GAP_FROM_BUTTON = 8;

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

// Sort + group controls — popover menus anchored to each button.
export function TaskListControls({
  sortMode, groupMode, onSortChange, onGroupChange,
}: Props) {
  const c = useColors();
  const [open, setOpen] = useState<null | "sort" | "group">(null);
  const [anchor, setAnchor] = useState<{ x: number; y: number; w: number } | null>(null);
  const sortRef = useRef<View>(null);
  const groupRef = useRef<View>(null);

  const sortActive = sortMode !== "due";
  const groupActive = groupMode !== "none";
  const sortTint = sortActive ? c.activeHighlight : c.fgSubtle;
  const groupTint = groupActive ? c.activeHighlight : c.fgSubtle;

  function openMenu(which: "sort" | "group") {
    const ref = which === "sort" ? sortRef : groupRef;
    ref.current?.measureInWindow((x, y, w) => {
      setAnchor({ x, y, w });
      setOpen(which);
    });
  }

  const items = open === "sort" ? SORT_OPTIONS : GROUP_OPTIONS;
  // Right-align the menu to the button so it never clips off-screen on the right,
  // and stay 6px inside the viewport on the left.
  const screenW = Dimensions.get("window").width;
  const rawRight = anchor ? screenW - (anchor.x + anchor.w) : 0;
  const right = Math.max(6, rawRight);
  // Sit just above the button; flip downward if there isn't room (e.g. top of screen).
  const screenH = Dimensions.get("window").height;
  const bottom = anchor ? screenH - anchor.y + MENU_GAP_FROM_BUTTON : 0;

  return (
    <>
      <View style={styles.row}>
        <Pressable
          ref={sortRef}
          onPress={() => openMenu("sort")}
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
          ref={groupRef}
          onPress={() => openMenu("group")}
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
          {anchor ? (
            <Pressable
              onPress={(e) => e.stopPropagation?.()}
              style={[
                styles.menu,
                {
                  width: MENU_WIDTH,
                  right,
                  bottom,
                  backgroundColor: c.surface,
                  borderColor: c.border,
                },
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
              {items.map(([value, label]) => {
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
                        letterSpacing: 1,
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
          ) : null}
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 6 },
  pill: {
    // Circular tap target — matches routines category buttons (36×36).
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "transparent",
  },
  menu: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 6,
    overflow: "hidden",
    // Subtle elevation so the popover lifts off the action bar.
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  menuHeader: {
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 6,
  },
  menuItem: {
    paddingHorizontal: 12,
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
