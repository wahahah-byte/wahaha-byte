"use client";

import { useEffect, useRef, useState } from "react";
import FilterTray from "@/components/FilterTray";

type Filter = { label: string; shortLabel: string; value: string };

export type RecurringSortMode = "due" | "streak" | "priority" | "title" | "points";
export type RecurringGroupMode = "none" | "frequency" | "category";

interface Props {
  filters: readonly Filter[];
  activeFilter: string;
  onFilterChange: (value: string) => void;
  getCount?: (value: string) => number;
  badgeColor?: (value: string) => string | null;
  sortMode: RecurringSortMode;
  groupMode: RecurringGroupMode;
  onSortChange: (mode: RecurringSortMode) => void;
  onGroupChange: (mode: RecurringGroupMode) => void;
  onNewTask: () => void;
  isAuthenticated: boolean;
  /** When provided, the FilterTray will mirror its scroll position to this element's transform. */
  pagerRef?: React.RefObject<HTMLElement | null>;
}

const SORT_OPTIONS: [RecurringSortMode, string][] = [
  ["due", "Next"],
  ["streak", "Streak"],
  ["priority", "Priority"],
  ["title", "Title"],
  ["points", "Points"],
];

const GROUP_OPTIONS: [RecurringGroupMode, string][] = [
  ["none", "None"],
  ["frequency", "Frequency"],
  ["category", "Category"],
];

const SWIPE_CYCLE_THRESHOLD = 36;

export default function MobileActionBarRecurring({
  filters, activeFilter, onFilterChange, getCount, badgeColor,
  sortMode, groupMode, onSortChange, onGroupChange,
  onNewTask, isAuthenticated, pagerRef,
}: Props) {
  const [showSort, setShowSort] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [trayOpen, setTrayOpen] = useState(true);
  const [cycleHint, setCycleHint] = useState<string | null>(null);
  const pullRef = useRef<{ startX: number; startY: number; startedOpen: boolean; locked: "v" | "h" | null } | null>(null);
  const trayElementRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLButtonElement>(null);

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
      const trayHeight = tray.offsetHeight;
      const trayHeightTotal = trayHeight + 8;
      const baseY = d.startedOpen ? 0 : trayHeightTotal;
      const targetY = Math.max(0, Math.min(trayHeightTotal, baseY + dy));
      tray.style.transition = "none";
      tray.style.transform = `translateY(${targetY}px)`;
      const progress = 1 - targetY / trayHeightTotal;
      const handleBottom = 88 + (116 - 88) * progress;
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

    tray.style.transition = "transform 0.22s cubic-bezier(0.2, 0, 0, 1)";
    handle.style.transition = "bottom 0.22s cubic-bezier(0.2, 0, 0, 1)";

    if (willOpen) {
      tray.style.transform = "translateY(0)";
      handle.style.bottom = "calc(44px + 44px + 28px + env(safe-area-inset-bottom, 0px))";
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
            ? "calc(44px + 44px + 28px + env(safe-area-inset-bottom, 0px))"
            : "calc(44px + 44px + env(safe-area-inset-bottom, 0px))",
          transform: "translateX(-50%)",
          padding: "5px 28px 5px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          touchAction: "none",
          WebkitTapHighlightColor: "transparent",
          zIndex: 36,
          transition: "bottom 0.22s cubic-bezier(0.2, 0, 0, 1)",
        }}
      >
        {cycleHint && (
          <div
            aria-live="polite"
            style={{
              position: "absolute",
              bottom: "calc(100% + 4px)",
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
        <span
          aria-hidden
          style={{
            display: "block",
            width: 22, height: 3,
            borderRadius: 1.5,
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
        <div className="flex-1" />

        <div className="flex items-center">
          <div className="relative mb-px mr-1">
            {showSort && <div className="fixed inset-0 z-[15]" onClick={() => setShowSort(false)} />}
            <button
              onClick={() => { setShowGroup(false); setShowSort((v) => !v); }}
              className="text-[9px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5"
              style={{
                color: sortMode !== "due" ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                background: sortMode !== "due" ? "var(--color-active-highlight-bg)" : "transparent",
                border: `1px solid ${sortMode !== "due" ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                borderRadius: "2px",
                position: "relative",
                zIndex: 16,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <line x1="1" y1="2" x2="9" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="1" y1="5" x2="7" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="1" y1="8" x2="5" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <svg width="7" height="5" viewBox="0 0 7 5" fill="none" style={{ opacity: 0.6 }}>
                <polyline points="0.5,1 3.5,4 6.5,1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {showSort && (
              <Menu>
                {SORT_OPTIONS.map(([value, label]) => (
                  <MenuItem
                    key={value}
                    active={sortMode === value}
                    onClick={() => { onSortChange(value); setShowSort(false); }}
                    label={label}
                  />
                ))}
              </Menu>
            )}
          </div>

          <div className="relative mb-px mr-0.5">
            {showGroup && <div className="fixed inset-0 z-[15]" onClick={() => setShowGroup(false)} />}
            <button
              onClick={() => { setShowSort(false); setShowGroup((v) => !v); }}
              className="text-[9px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5"
              style={{
                color: groupMode !== "none" ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                background: groupMode !== "none" ? "var(--color-active-highlight-bg)" : "transparent",
                border: `1px solid ${groupMode !== "none" ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                borderRadius: "2px",
                position: "relative",
                zIndex: 16,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <line x1="1" y1="2" x2="9" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="1" y1="5" x2="6" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="1" y1="8" x2="7.5" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <svg width="7" height="5" viewBox="0 0 7 5" fill="none" style={{ opacity: 0.6 }}>
                <polyline points="0.5,1 3.5,4 6.5,1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {showGroup && (
              <Menu>
                {GROUP_OPTIONS.map(([value, label]) => (
                  <MenuItem
                    key={value}
                    active={groupMode === value}
                    onClick={() => { onGroupChange(value); setShowGroup(false); }}
                    label={label}
                  />
                ))}
              </Menu>
            )}
          </div>

          <button
            onClick={() => !isAuthenticated ? undefined : onNewTask()}
            disabled={!isAuthenticated}
            title={!isAuthenticated ? "Sign in to create tasks" : "New task"}
            aria-label="New task"
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

function Menu({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "calc(100% + 4px)",
        right: 0,
        zIndex: 20,
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "3px",
        boxShadow: "var(--shadow-popover)",
        minWidth: "120px",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

function MenuItem({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2 cursor-pointer"
      style={{
        padding: "8px 12px",
        background: "transparent",
        border: "none",
        color: active ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
        fontSize: "9px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        textAlign: "left",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-overlay-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: active ? "var(--color-active-highlight)" : "var(--color-border-faint)", display: "inline-block" }} />
      {label}
    </button>
  );
}
