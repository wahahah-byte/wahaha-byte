import { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  canCheckInNow,
  isOverdue,
  RECURRING_FILTERS,
  recurringTabMatches,
  type GroupMode,
  type SortMode,
  type TaskDto,
} from "@wahaha/shared";

import { FilterStrip } from "@/components/filter-strip";
import { RoutinesActionBar } from "@/components/routines-action-bar";
import { TaskList } from "@/components/task-list";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";

type RecurringFilter = "all" | "today" | "upcoming" | "missed";

export default function RoutinesScreen() {
  const c = useColors();
  const [activeFilter, setActiveFilter] = useState<RecurringFilter>("all");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loadedTasks, setLoadedTasks] = useState<TaskDto[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("due");
  const [groupMode, setGroupMode] = useState<GroupMode>("none");

  const preFilter = useCallback(
    (t: TaskDto) =>
      recurringTabMatches(t, activeFilter) &&
      (activeCategory === null || t.category === activeCategory),
    [activeFilter, activeCategory]
  );

  // Match web: { isRecurring: true } only, no isArchived filter.
  const listFilters = useMemo(() => ({ isRecurring: true }), []);

  const availableCategories = useMemo(() => {
    const seen = new Set<string>();
    for (const t of loadedTasks) if (t.category) seen.add(t.category);
    return [...seen].sort();
  }, [loadedTasks]);

  // Dot Today when actionable; dot Missed when overdue.
  const todayCount = useMemo(
    () => loadedTasks.filter(
      (t) => canCheckInNow(t.dueDate, t.recurrenceRule, t.lastCheckInDate) && !isOverdue(t.dueDate),
    ).length,
    [loadedTasks],
  );
  const missedCount = useMemo(
    () => loadedTasks.filter((t) => isOverdue(t.dueDate)).length,
    [loadedTasks],
  );

  const emptyText =
    activeFilter === "today" ? "Nothing due today"
    : activeFilter === "upcoming" ? "Nothing upcoming"
    : activeFilter === "missed" ? "Nothing missed"
    : "No routines.";

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText
          style={{
            fontSize: 11, color: c.fg, fontWeight: "600",
            letterSpacing: 2, textTransform: "uppercase",
          }}
        >
          {RECURRING_FILTERS.find((f) => f.value === activeFilter)?.label ?? "Routines"}
          {activeCategory ? (
            <ThemedText style={{ color: c.fgMuted, letterSpacing: 2 }}>
              {"  ·  "}{activeCategory.toUpperCase()}
            </ThemedText>
          ) : null}
        </ThemedText>
      </View>

      <View style={styles.listWrap}>
        <TaskList
          filters={listFilters}
          activeFilter="all"
          preFilter={preFilter}
          sortMode={sortMode}
          groupMode={groupMode}
          // On "all" filter, split checked-in routines under their own section.
          splitCheckedIn={activeFilter === "all"}
          onTasksLoaded={setLoadedTasks}
          emptyText={emptyText}
          useCheckinCheckbox
        />
      </View>

      <FilterStrip
        options={RECURRING_FILTERS.map((f) => ({ value: f.value, label: f.shortLabel }))}
        value={activeFilter}
        onChange={(v) => setActiveFilter(v as RecurringFilter)}
        getCount={(v) =>
          // Per-filter counts from already-loaded routine set.
          v === "all"
            ? loadedTasks.length
            : loadedTasks.filter((t) => recurringTabMatches(t, v)).length
        }
        badgeColor={(v) => {
          if (v === "today" && todayCount > 0) return c.activeHighlightAlt;
          if (v === "missed" && missedCount > 0) return c.danger;
          return null;
        }}
      />
      <RoutinesActionBar
        availableCategories={availableCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        sortMode={sortMode}
        groupMode={groupMode}
        onSortChange={setSortMode}
        onGroupChange={setGroupMode}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 64, paddingBottom: 10 },
  listWrap: { flex: 1, paddingHorizontal: 16 },
});
