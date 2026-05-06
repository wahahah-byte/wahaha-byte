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

const PULL_OPEN_THRESHOLD = 14;
const SWIPE_CYCLE_THRESHOLD = 36;

export default function MobileActionBarRecurring({
  filters, activeFilter, onFilterChange, getCount, badgeColor,
  sortMode, groupMode, onSortChange, onGroupChange,
  onNewTask, isAuthenticated,
}: Props) {
  const [showSort, setShowSort] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
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
        {/* Grab handle */}
        <button
          onClick={() => setTrayOpen(true)}
          onTouchStart={onPullStart}
          onTouchMove={onPullMove}
          onTouchEnd={onPullEnd}
          onTouchCancel={onPullEnd}
          aria-label="Open filter"
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "6px 32px 4px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            touchAction: "none",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          <span
            aria-hidden
            style={{
              display: "block",
              width: 32, height: 3,
              borderRadius: 2,
              background: "var(--color-border)",
            }}
          />
        </button>

        {/* Active-filter chip — funnel icon */}
        <div className="relative flex-shrink-0" style={{ marginTop: 4 }}>
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

        <div className="flex-1" style={{ marginTop: 4 }} />

        <div className="flex items-center" style={{ marginTop: 4 }}>
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
            title={!isAuthenticated ? "Sign in to create tasks" : undefined}
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
