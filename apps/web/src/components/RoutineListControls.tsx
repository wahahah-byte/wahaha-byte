"use client";

import { useState } from "react";

export type RoutineSortMode = "due" | "streak" | "priority" | "title" | "points";
export type RoutineGroupMode = "none" | "frequency" | "category";

const SORT_OPTIONS: [RoutineSortMode, string][] = [
  ["due", "Next"],
  ["streak", "Streak"],
  ["priority", "Priority"],
  ["title", "Title"],
  ["points", "Points"],
];

const GROUP_OPTIONS: [RoutineGroupMode, string][] = [
  ["none", "None"],
  ["frequency", "Frequency"],
  ["category", "Category"],
];

const sortLabel = (m: RoutineSortMode): string =>
  m === "due" ? "Sort"
  : m === "streak" ? "Streak"
  : m === "priority" ? "Priority"
  : m === "title" ? "Title"
  : "Points";

const groupLabel = (m: RoutineGroupMode): string =>
  m === "frequency" ? "Frequency"
  : m === "category" ? "Category"
  : "Group";

interface Props {
  sortMode: RoutineSortMode;
  groupMode: RoutineGroupMode;
  onSortChange: (m: RoutineSortMode) => void;
  onGroupChange: (m: RoutineGroupMode) => void;
  // Hide label below sm breakpoint when set.
  compactLabel?: boolean;
}

export default function RoutineListControls({
  sortMode, groupMode, onSortChange, onGroupChange, compactLabel = false,
}: Props) {
  const [showSort, setShowSort] = useState(false);
  const [showGroup, setShowGroup] = useState(false);

  const labelClass = compactLabel ? "hidden sm:inline" : undefined;

  const triggerStyle = (active: boolean) => ({
    color: active ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
    background: active ? "var(--color-active-highlight-bg)" : "transparent",
    border: `1px solid ${active ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
    borderRadius: 2,
    position: "relative" as const,
    zIndex: 16,
  });

  const menuStyle: React.CSSProperties = {
    position: "absolute",
    top: "calc(100% + 4px)",
    right: 0,
    zIndex: 20,
    background: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: 3,
    boxShadow: "var(--shadow-popover)",
    minWidth: 120,
    overflow: "hidden",
  };

  const menuItemStyle = (active: boolean): React.CSSProperties => ({
    padding: "8px 12px",
    background: "transparent",
    border: "none",
    color: active ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
    fontSize: 9,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    textAlign: "left",
  });

  return (
    <>
      <div className="relative mr-1">
        {showSort && <div className="fixed inset-0 z-[15]" onClick={() => setShowSort(false)} />}
        <button
          onClick={() => { setShowGroup(false); setShowSort((v) => !v); }}
          title="Sort"
          aria-label="Sort"
          className="text-[9px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5"
          style={triggerStyle(sortMode !== "due")}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <line x1="1" y1="2" x2="9" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="1" y1="5" x2="7" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="1" y1="8" x2="5" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className={labelClass}>{sortLabel(sortMode)}</span>
          <svg width="7" height="5" viewBox="0 0 7 5" fill="none" style={{ opacity: 0.6 }}>
            <polyline points="0.5,1 3.5,4 6.5,1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {showSort && (
          <div style={menuStyle}>
            {SORT_OPTIONS.map(([value, label]) => (
              <button
                key={value}
                onClick={() => { onSortChange(value); setShowSort(false); }}
                className="w-full flex items-center gap-2 cursor-pointer"
                style={menuItemStyle(sortMode === value)}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-overlay-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: sortMode === value ? "var(--color-active-highlight)" : "var(--color-border-faint)", display: "inline-block" }} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative mr-0.5">
        {showGroup && <div className="fixed inset-0 z-[15]" onClick={() => setShowGroup(false)} />}
        <button
          onClick={() => { setShowSort(false); setShowGroup((v) => !v); }}
          title="Group"
          aria-label="Group"
          className="text-[9px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5"
          style={triggerStyle(groupMode !== "none")}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <line x1="1" y1="2" x2="9" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="1" y1="5" x2="6" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="1" y1="8" x2="7.5" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <span className={labelClass}>{groupLabel(groupMode)}</span>
          <svg width="7" height="5" viewBox="0 0 7 5" fill="none" style={{ opacity: 0.6 }}>
            <polyline points="0.5,1 3.5,4 6.5,1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {showGroup && (
          <div style={menuStyle}>
            {GROUP_OPTIONS.map(([value, label]) => (
              <button
                key={value}
                onClick={() => { onGroupChange(value); setShowGroup(false); }}
                className="w-full flex items-center gap-2 cursor-pointer"
                style={menuItemStyle(groupMode === value)}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-overlay-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: groupMode === value ? "var(--color-active-highlight)" : "var(--color-border-faint)", display: "inline-block" }} />
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
