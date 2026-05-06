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

const SWIPE_CYCLE_THRESHOLD = 36;

export default function MobileActionBar({
  filters, activeFilter, onFilterChange, getCount, badgeColor,
  sortMode, groupMode, onSortChange, onGroupChange,
  onNewTask, onQuickCreate, isAuthenticated, pagerRef,
}: Props) {
  const [trayOpen, setTrayOpen] = useState(true);
  const [cycleHint, setCycleHint] = useState<string | null>(null);
  const pullRef = useRef<{ startX: number; startY: number; startedOpen: boolean; locked: "v" | "h" | null } | null>(null);
  const trayElementRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);

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
    pullRef.current = { startX: t.clientX, startY: t.clientY, startedOpen: trayOpen, locked: null };
  }
  function onPullMove(e: React.TouchEvent) {
    const d = pullRef.current;
    if (!d || d.locked === "h") return;
    const t = e.touches[0];
    const dx = t.clientX - d.startX;
    const dy = t.clientY - d.startY;

    if (d.locked === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal — only commit cycle once it crosses the full threshold.
        if (Math.abs(dx) >= SWIPE_CYCLE_THRESHOLD) {
          d.locked = "h";
          cycleFilter(dx < 0 ? 1 : -1);
        }
        return;
      }
      d.locked = "v";
    }

    if (d.locked === "v") {
      const tray = trayElementRef.current;
      const handle = handleRef.current;
      if (!tray || !handle) return;
      const trayHeight = tray.offsetHeight;            // 56
      const trayHeightTotal = trayHeight + 8;          // 64 — matches "calc(100% + 8px)" closed offset
      const baseY = d.startedOpen ? 0 : trayHeightTotal;
      const targetY = Math.max(0, Math.min(trayHeightTotal, baseY + dy));
      // Tray follows finger.
      tray.style.transition = "none";
      tray.style.transform = `translateY(${targetY}px)`;
      // Handle rides on the tray's top edge: closed → 88px (44+44), open → 124px (44+44+36).
      const progress = 1 - targetY / trayHeightTotal;  // 0 closed, 1 open
      const handleBottom = 88 + (124 - 88) * progress;
      handle.style.transition = "none";
      handle.style.bottom = `calc(${handleBottom}px + env(safe-area-inset-bottom, 0px))`;
    }
  }
  function onPullEnd() {
    const d = pullRef.current;
    pullRef.current = null;
    if (!d || d.locked !== "v") return;

    const tray = trayElementRef.current;
    const handle = handleRef.current;
    if (!tray || !handle) return;

    const match = tray.style.transform.match(/translateY\((-?[\d.]+)px\)/);
    const currentY = match ? parseFloat(match[1]) : 0;
    const trayHeightTotal = tray.offsetHeight + 8;
    const willOpen = currentY < trayHeightTotal / 2;

    // Restore CSS transitions so both elements glide to their snapped positions.
    tray.style.transition = "transform 0.22s cubic-bezier(0.2, 0, 0, 1)";
    handle.style.transition = "bottom 0.22s cubic-bezier(0.2, 0, 0, 1)";

    if (willOpen) {
      tray.style.transform = "translateY(0)";
      handle.style.bottom = "calc(44px + 44px + 36px + env(safe-area-inset-bottom, 0px))";
      if (!trayOpen) setTrayOpen(true);
    } else {
      tray.style.transform = "translateY(calc(100% + 8px))";
      handle.style.bottom = "calc(44px + 44px + env(safe-area-inset-bottom, 0px))";
      if (trayOpen) setTrayOpen(false);
    }
  }

  return (
    <>
      {/* Standalone fixed handle — sits above the action bar by default, rides up to
          sit above the filter tray when the tray is open. */}
      <button
        ref={handleRef}
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
            ? "calc(44px + 44px + 36px + env(safe-area-inset-bottom, 0px))"
            : "calc(44px + 44px + env(safe-area-inset-bottom, 0px))",
          transform: "translateX(-50%)",
          padding: "6px 36px 4px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          touchAction: "none",
          WebkitTapHighlightColor: "transparent",
          zIndex: 34,
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
        className="fixed left-0 right-0 sm:hidden flex items-center gap-1.5 px-2 pb-px"
        style={{
          bottom: "calc(44px + env(safe-area-inset-bottom, 0px))",
          height: "44px",
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

      <FilterTray
        open={trayOpen}
        filters={filters}
        activeFilter={activeFilter}
        onChange={onFilterChange}
        onClose={() => setTrayOpen(false)}
        getCount={getCount}
        badgeColor={badgeColor}
        pagerRef={pagerRef}
        trayElementRef={trayElementRef}
      />
    </>
  );
}
