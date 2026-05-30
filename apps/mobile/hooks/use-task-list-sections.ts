import { useMemo } from "react";

import {
  buildListItems,
  chunkListItems,
  completedSort,
  isCheckedInThisCycle,
  sep,
  type GroupMode,
  type SortMode,
  type TaskDto,
} from "@wahaha/shared";

interface SectionsArgs {
  tasks: TaskDto[];
  activeFilter: "pending" | "in_progress" | "completed" | "all";
  groupMode: GroupMode;
  sortMode: SortMode;
  preFilter?: (task: TaskDto) => boolean;
  splitCheckedIn?: boolean;
  submittedTaskIds?: Set<string>;
  uncompletedCollapsed: boolean;
  recentCheckinTs: Map<string, number>;
  // One unsegmented list — no Active/Completed split or collapse toggle (Archive).
  flat?: boolean;
}

export interface TaskListSection {
  key: string;
  label: string;
  data: TaskDto[];
}

// Builds the SectionList sections (with Routines checked-in split, active-section
// collapse, and empty-group pruning). Pure derivation off `tasks` + view flags.
export function useTaskListSections({
  tasks,
  activeFilter,
  groupMode,
  sortMode,
  preFilter,
  splitCheckedIn,
  submittedTaskIds,
  uncompletedCollapsed,
  recentCheckinTs,
  flat,
}: SectionsArgs): { sections: TaskListSection[]; showCollapse: boolean; activeCount: number } {
  return useMemo(() => {
    const base = preFilter ? tasks.filter(preFilter) : tasks;

    // Flat mode (Archive): a single unlabeled section, no Active/Completed split.
    if (flat) {
      const sorted = [...base].sort(completedSort(submittedTaskIds ?? new Set()));
      return {
        sections: sorted.length ? [{ key: "__flat", label: "", data: sorted }] : [],
        showCollapse: false,
        activeCount: 0,
      };
    }

    const items = buildListItems({
      tasks: base,
      activeFilter,
      groupMode,
      sortMode,
      submittedTaskIds: submittedTaskIds ?? new Set(),
    });

    // Routines split: checked-in tasks under "Checked In" separator.
    let finalItems = items;
    if (splitCheckedIn) {
      const active: TaskDto[] = [];
      const checkedIn: TaskDto[] = [];
      for (const it of items) {
        if ("__sep" in it) {
          // Preserve any pre-existing separators.
          active.push(it as unknown as TaskDto);
          continue;
        }
        if (isCheckedInThisCycle(it)) checkedIn.push(it);
        else active.push(it);
      }
      // Most-recent check-in on top.
      const tsOf = (t: TaskDto): number => {
        const sessionTs = recentCheckinTs.get(t.taskId);
        if (sessionTs !== undefined) return sessionTs;
        const latestCycle = t.recentCycles?.find((c) => c.cycleType === "checkin");
        return latestCycle ? new Date(latestCycle.createdAt).getTime() : 0;
      };
      checkedIn.sort((a, b) => tsOf(b) - tsOf(a));
      // Layout cases: both → separator; only checkedIn → list directly.
      if (active.length > 0 && checkedIn.length > 0) {
        finalItems = [...active, sep("Checked In", "__sep-checked-in"), ...checkedIn];
      } else if (checkedIn.length > 0) {
        finalItems = [...checkedIn];
      }
    }

    const chunks = chunkListItems(finalItems);
    // Active-section collapse for "all" filter.
    const compIdx = chunks.findIndex((c) => c.sep?.sepKey === "__sep-completed");
    const hasComp = compIdx >= 0;
    const showCollapse = activeFilter === "all" && hasComp;
    const uncompChunks = hasComp ? chunks.slice(0, compIdx) : chunks;
    const activeCount = uncompChunks.reduce((s, c) => s + c.tasks.length, 0);
    const visibleChunks = showCollapse && uncompletedCollapsed ? chunks.slice(compIdx) : chunks;
    // Drop empty group chunks and suppress labels whose tasks are all checked-in this cycle.
    // The "Completed" and "Checked In" separators are preserved (their tasks define them).
    const isStructuralSep = (key: string | undefined) =>
      key === "__sep-completed" || key === "__sep-checked-in";
    const mapped = visibleChunks
      .filter((ch) => ch.tasks.length > 0)
      .map((ch, i) => {
        const allCheckedIn = ch.tasks.every((t) => isCheckedInThisCycle(t));
        const hideLabel = allCheckedIn && !isStructuralSep(ch.sep?.sepKey);
        return {
          key: ch.sep?.sepKey ?? `__nosep-${i}`,
          label: hideLabel ? "" : (ch.sep?.label ?? ""),
          data: ch.tasks,
        };
      });
    return { sections: mapped, showCollapse, activeCount };
  }, [tasks, activeFilter, groupMode, sortMode, preFilter, splitCheckedIn, submittedTaskIds, uncompletedCollapsed, recentCheckinTs, flat]);
}
