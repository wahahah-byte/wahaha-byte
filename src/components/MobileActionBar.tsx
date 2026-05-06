"use client";

import { useEffect, useRef, useState } from "react";
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
}

const PULL_OPEN_THRESHOLD = 14;
const SWIPE_CYCLE_THRESHOLD = 36;

export default function MobileActionBar({
  filters, activeFilter, onFilterChange, getCount, badgeColor,
  sortMode, groupMode, onSortChange, onGroupChange,
  onNewTask, onQuickCreate, isAuthenticated, pagerRef,
}: Props) {
  const [trayOpen, setTrayOpen] = useState(false);
  const [cycleHint, setCycleHint] = useState<string | null>(null);
  const pullRef = useRef<{ startX: number; startY: number; locked: "v" | "h" | null } | null>(null);

  const active = filters.find((f) => f.value === activeFilter) ?? filters[0];
  const activeBadge = badgeColor?.(active.value) ?? null;
  const filterIsDefault = filters[0]?.value === active.value;

  useEffect(() => {
    if (!cycleHint) return;
    const t = window.setTimeout(() => setCycleHint(null), 900);
    return () => window.clearTimeout(t);
  }, [cycleHint]);

  function cycleFilter(direction: -1 | 1) {
    const idx = filters.findIndex((f) => f.value === activeFilter);
    if (idx < 0) return;
    const next = Math.max(0, Math.min(filters.length - 1, idx + direction));
    if (next === idx) return;
    onFilterChange(filters[next].value);
    setCycleHint(filters[next].label);
  }

  function onPullStart(e: React.TouchEvent) {
    const t = e.touches[0];
    pullRef.current = { startX: t.clientX, startY: t.clientY, locked: null };
  }
  function onPullMove(e: React.TouchEvent) {
    const d = pullRef.current;
    if (!d || d.locked) return;
    const t = e.touches[0];
    const dx = t.clientX - d.startX;
    const dy = t.clientY - d.startY;
    if (Math.abs(dx) >= SWIPE_CYCLE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      d.locked = "h";
      cycleFilter(dx < 0 ? 1 : -1);
    } else if (dy < -PULL_OPEN_THRESHOLD && Math.abs(dy) >= Math.abs(dx)) {
      d.locked = "v";
      setTrayOpen(true);
    }
  }
  function onPullEnd() { pullRef.current = null; }

  return (
    <>
      {/* Standalone fixed handle — sits above the action bar by default, rides up to
          sit above the filter tray when the tray is open. */}
      <button
        onClick={() => setTrayOpen((v) => !v)}
        onTouchStart={onPullStart}
        onTouchMove={onPullMove}
        onTouchEnd={onPullEnd}
        onTouchCancel={onPullEnd}
        aria-label={trayOpen ? "Close filter" : "Open filter"}
        className="sm:hidden"
        style={{
          position: "fixed",
          left: "50%",
          bottom: trayOpen
            ? "calc(56px + 56px + 56px + env(safe-area-inset-bottom, 0px))"
            : "calc(56px + 56px + env(safe-area-inset-bottom, 0px))",
          transform: "translateX(-50%)",
          padding: "6px 36px 4px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          touchAction: "none",
          WebkitTapHighlightColor: "transparent",
          zIndex: 36,
          transition: "bottom 0.22s cubic-bezier(0.2, 0, 0, 1)",
        }}
      >
        <span
          aria-hidden
          style={{
            display: "block",
            width: 36, height: 4,
            borderRadius: 2,
            background: trayOpen ? "var(--color-active-highlight)" : "var(--color-border)",
            transition: "background 0.18s",
          }}
        />
      </button>

      <div
        className="fixed left-0 right-0 sm:hidden flex items-center gap-1.5 px-2"
        style={{
          bottom: "calc(56px + env(safe-area-inset-bottom, 0px))",
          height: "56px",
          background: "var(--color-header)",
          borderTop: "1px solid var(--color-border-soft)",
          boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.08)",
          zIndex: 35,
        }}
      >

        {/* Active-filter chip — funnel icon. Tap → tray, swipe-up → tray. */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setTrayOpen(true)}
            onTouchStart={onPullStart}
            onTouchMove={onPullMove}
            onTouchEnd={onPullEnd}
            onTouchCancel={onPullEnd}
            aria-haspopup="menu"
            aria-expanded={trayOpen}
            aria-label={`Filter: ${active.label}`}
            className="flex items-center justify-center cursor-pointer"
            style={{
              position: "relative",
              width: 36, height: 30,
              background: filterIsDefault ? "transparent" : "var(--color-active-highlight-bg)",
              border: `1px solid ${filterIsDefault ? "var(--color-border-hairline)" : "var(--color-active-highlight-border)"}`,
              borderRadius: 2,
              color: filterIsDefault ? "var(--color-fg-subtle)" : "var(--color-active-highlight)",
              padding: 0,
              touchAction: "pan-y",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
              <path d="M1.5 2.5h11l-4 5v4l-3-1.2v-2.8l-4-5z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" fill="none" />
            </svg>
            {!filterIsDefault && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  top: 4, right: 5,
                  width: 5, height: 5,
                  borderRadius: "50%",
                  background: activeBadge ?? "var(--color-active-highlight)",
                  border: "1px solid var(--color-header)",
                }}
              />
            )}
          </button>
          {cycleHint && (
            <div
              aria-live="polite"
              style={{
                position: "absolute",
                bottom: "calc(100% + 8px)",
                left: "50%",
                transform: "translateX(-50%)",
                background: "var(--color-surface)",
                color: "var(--color-active-highlight)",
                border: "1px solid var(--color-active-highlight-border)",
                borderRadius: 3,
                padding: "4px 10px",
                fontSize: "10px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontWeight: 600,
                whiteSpace: "nowrap",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                pointerEvents: "none",
                animation: "filter-cycle-hint 0.9s ease-out forwards",
              }}
            >
              {cycleHint}
            </div>
          )}
        </div>

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
            className="pixel-btn flex-shrink-0 flex items-center justify-center"
            style={{ width: 36, height: 30, padding: 0, fontSize: "16px", lineHeight: 1 }}
          >
            +
          </button>
        </div>
      </div>

      <FilterTray
        open={trayOpen}
        filters={filters}
        activeFilter={activeFilter}
        onChange={onFilterChange}
        onClose={() => setTrayOpen(false)}
        getCount={getCount}
        badgeColor={badgeColor}
        pagerRef={pagerRef}
      />
    </>
  );
}
