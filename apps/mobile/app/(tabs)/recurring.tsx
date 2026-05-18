import { useCallback, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  canCheckInNow,
  isOverdue,
  RECURRING_FILTERS,
  recurringTabMatches,
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

  const preFilter = useCallback(
    (t: TaskDto) =>
      recurringTabMatches(t, activeFilter) &&
      (activeCategory === null || t.category === activeCategory),
    [activeFilter, activeCategory]
  );

  // Web's recurring page uses `{ isRecurring: true }` only — does NOT pass
  // isArchived: false. Match that exactly so the archived-routines visibility
  // matches what the backend returns by default.
  const listFilters = useMemo(() => ({ isRecurring: true }), []);

  const availableCategories = useMemo(() => {
    const seen = new Set<string>();
    for (const t of loadedTasks) if (t.category) seen.add(t.category);
    return [...seen].sort();
  }, [loadedTasks]);

  // Mirrors web's recurring page: dot the Today tab when something is
  // actionable right now, dot Missed when anything's overdue. Web uses
  // `--color-active-highlight-alt` for today and `--color-danger` for missed.
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
          // Match web's mobile recurring view: on the "all" filter, surface
          // tasks already checked-in this cycle under a "Checked In" section
          // beneath the still-actionable routines.
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
          // Per-filter counts derived from the already-loaded routine set.
          // For "all" we mean every recurring task in view; the other filters
          // narrow by recurringTabMatches.
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
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 64, paddingBottom: 10 },
  listWrap: { flex: 1, paddingHorizontal: 16 },
});
