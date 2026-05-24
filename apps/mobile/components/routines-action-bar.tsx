import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { CATEGORY_COLOR, type GroupMode, type SortMode } from "@wahaha/shared";

import { CategoryIcon } from "@/components/category-icon";
import { TaskListControls } from "@/components/task-list-controls";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  availableCategories: string[];
  activeCategory: string | null;
  onCategoryChange: (next: string | null) => void;
  sortMode?: SortMode;
  groupMode?: GroupMode;
  onSortChange?: (m: SortMode) => void;
  onGroupChange?: (m: GroupMode) => void;
}

// Hex-with-alpha helper; passes through non-hex strings.
function alphaHex(hex: string, percent: number): string {
  const a = Math.round((percent / 100) * 255).toString(16).padStart(2, "0");
  if (!hex.startsWith("#")) return hex;
  // Expand 3-digit hex.
  const clean = hex.length === 4
    ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
    : hex;
  return `${clean}${a}`;
}

// Routines tab bottom bar — category filter strip + new-task plus button.
export function RoutinesActionBar({
  availableCategories,
  activeCategory,
  onCategoryChange,
  sortMode,
  groupMode,
  onSortChange,
  onGroupChange,
}: Props) {
  const c = useColors();
  const showControls =
    sortMode !== undefined && groupMode !== undefined && !!onSortChange && !!onGroupChange;

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: c.header, borderTopColor: c.borderSoft },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scroll}
      >
        {availableCategories.map((cat) => {
          const active = activeCategory === cat;
          const color = CATEGORY_COLOR[cat] ?? c.fgMuted;
          const bg = active ? alphaHex(color, 18) : "transparent";
          const border = active ? alphaHex(color, 50) : "transparent";
          const opacity = !activeCategory || active ? 1 : 0.4;
          return (
            <Pressable
              key={cat}
              onPress={() => onCategoryChange(active ? null : cat)}
              style={[
                styles.iconBtn,
                { backgroundColor: bg, borderColor: border, opacity },
              ]}
            >
              <CategoryIcon category={cat} size={26} color={color} />
            </Pressable>
          );
        })}
      </ScrollView>

      {showControls ? (
        <TaskListControls
          sortMode={sortMode!}
          groupMode={groupMode!}
          onSortChange={onSortChange!}
          onGroupChange={onGroupChange!}
        />
      ) : null}

      <Pressable
        onPress={() => router.push("/new-task?recurring=1")}
        style={({ pressed }) => [styles.plusBtn, { opacity: pressed ? 0.6 : 1 }]}
      >
        <ThemedText style={{ fontSize: 20, color: c.fg, lineHeight: 22 }}>+</ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 62,
    paddingHorizontal: 8,
    borderTopWidth: 1,
  },
  scroll: { flex: 1 },
  scrollContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 2,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 1,
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
