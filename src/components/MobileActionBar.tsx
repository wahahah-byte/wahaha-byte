"use client";

import { useRef, useState } from "react";
import TaskListControls from "@/components/TaskListControls";
import QuickAddInput from "@/components/QuickAddInput";
import FilterTray from "@/components/FilterTray";
import type { GroupMode, SortMode } from "@/lib/taskList";

type Filter = { label: string; shortLabel: string; value: string };

type QuickTaskFields = {
  title: string;
  dueDate: Date | null;
  priority: "low" | "medium" | "high";
  category: string | null;
};

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
  onQuickCreate?: (fields: QuickTaskFields) => Promise<void> | void;
  isAuthenticated: boolean;
  /** When provided, the FilterTray will mirror its scroll position to this element's transform. */
  pagerRef?: React.RefObject<HTMLElement | null>;
  /** When true, hides the action-bar row (quick-add + controls) — used while the
   *  mobile SubmitBar takes over that slot. FilterTray stays rendered. */
  submitMode?: boolean;
}

export default function MobileActionBar({
  filters, activeFilter, onFilterChange, getCount, badgeColor,
  sortMode, groupMode, onSortChange, onGroupChange,
  onNewTask, onQuickCreate, isAuthenticated, pagerRef, submitMode,
}: Props) {
  const [trayOpen, setTrayOpen] = useState(true);
  const trayElementRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {!submitMode && (
        <div
          className="fixed left-0 right-0 sm:hidden flex items-center gap-1.5 px-2 pb-px"
          style={{
            bottom: "calc(50px + env(safe-area-inset-bottom, 0px))",
            height: "50px",
            background: "var(--color-header)",
            borderTop: "1px solid var(--color-border-soft)",
            boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.08)",
            zIndex: 35,
          }}
        >
          <div className="flex-1 flex items-center">
            {onQuickCreate ? (
              <QuickAddInput disabled={!isAuthenticated} onSubmit={onQuickCreate} />
            ) : (
              <div className="flex-1" />
            )}
          </div>

          <div className="flex items-center">
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
              title={!isAuthenticated ? "Sign in to create tasks" : "Open full task form"}
              aria-label="Open full new task form"
              className="flex-shrink-0 flex items-center justify-center"
              style={{
                width: 36, height: 30,
                padding: 0,
                fontSize: "20px",
                lineHeight: 1,
                background: "transparent",
                border: "none",
                color: "var(--color-fg)",
                cursor: !isAuthenticated ? "not-allowed" : "pointer",
                opacity: !isAuthenticated ? 0.3 : 1,
                WebkitTapHighlightColor: "transparent",
              }}
            >
              +
            </button>
          </div>
        </div>
      )}

      <FilterTray
        open={trayOpen}
        filters={filters}
        activeFilter={activeFilter}
        onChange={onFilterChange}
        onClose={() => setTrayOpen(false)}
        onToggle={() => setTrayOpen((v) => !v)}
        getCount={getCount}
        badgeColor={badgeColor}
        pagerRef={pagerRef}
        trayElementRef={trayElementRef}
      />
    </>
  );
}
