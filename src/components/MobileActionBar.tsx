"use client";

import FilterMenu from "@/components/FilterMenu";
import TaskListControls from "@/components/TaskListControls";
import type { GroupMode, SortMode } from "@/lib/taskList";

type Filter = { label: string; shortLabel: string; value: string };

interface Props {
  filters: readonly Filter[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  getCount?: (value: string) => number;
  badgeColor?: (value: string) => string | null;
  sortMode: SortMode;
  groupMode: GroupMode;
  onSortChange: (mode: SortMode) => void;
  onGroupChange: (mode: GroupMode) => void;
  onNewTask: () => void;
  isAuthenticated: boolean;
}

export default function MobileActionBar({
  filters, activeFilter, onFilterChange, getCount, badgeColor,
  sortMode, groupMode, onSortChange, onGroupChange,
  onNewTask, isAuthenticated,
}: Props) {
  return (
    <div
      className="fixed left-0 right-0 sm:hidden flex items-center gap-2 px-3"
      style={{
        bottom: "calc(56px + env(safe-area-inset-bottom, 0px))",
        height: "52px",
        background: "var(--color-header)",
        borderTop: "1px solid var(--color-border-soft)",
        boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.08)",
        zIndex: 35,
      }}
    >
      <FilterMenu
        filters={filters}
        activeFilter={activeFilter}
        onChange={onFilterChange}
        getCount={getCount}
        badgeColor={badgeColor}
        openAbove
      />
      <div className="flex-1" />
      <TaskListControls
        sortMode={sortMode}
        groupMode={groupMode}
        onSortChange={onSortChange}
        onGroupChange={onGroupChange}
        openAbove
      />
      <button
        onClick={() => !isAuthenticated ? undefined : onNewTask()}
        disabled={!isAuthenticated}
        title={!isAuthenticated ? "Sign in to create tasks" : undefined}
        className="pixel-btn"
        style={{ fontSize: "11px", padding: "6px 14px" }}
      >
        + New
      </button>
    </div>
  );
}
