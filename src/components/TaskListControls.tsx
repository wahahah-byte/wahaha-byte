"use client";

import { useState } from "react";
import type { GroupMode, SortMode } from "@/lib/taskList";

type Props = {
  sortMode: SortMode;
  groupMode: GroupMode;
  onSortChange: (mode: SortMode) => void;
  onGroupChange: (mode: GroupMode) => void;
};

const SORT_OPTIONS: [SortMode, string][] = [
  ["due", "Due Date"],
  ["priority", "Priority"],
  ["title", "Title"],
  ["points", "Points"],
];

const GROUP_OPTIONS: [GroupMode, string][] = [
  ["none", "None"],
  ["due", "Due Date"],
  ["category", "Category"],
];

const sortLabel = (m: SortMode) =>
  m === "due" ? "Sort" : m === "priority" ? "Priority" : m === "title" ? "Title" : "Points";
const groupLabel = (m: GroupMode) =>
  m === "due" ? "Due Date" : m === "category" ? "Category" : "Group";

export default function TaskListControls({ sortMode, groupMode, onSortChange, onGroupChange }: Props) {
  const [showSort, setShowSort] = useState(false);
  const [showGroup, setShowGroup] = useState(false);

  return (
    <>
      <div className="relative mb-px mr-1">
        {showSort && <div className="fixed inset-0 z-[15]" onClick={() => setShowSort(false)} />}
        <button
          onClick={() => { setShowGroup(false); setShowSort((v) => !v); }}
          className="text-[9px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5"
          style={{
            color: sortMode !== "due" ? "var(--color-accent)" : "var(--color-fg-subtle)",
            background: sortMode !== "due" ? "rgba(91,184,224,0.08)" : "transparent",
            border: `1px solid ${sortMode !== "due" ? "rgba(91,184,224,0.3)" : "var(--color-border-hairline)"}`,
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
          <span className="hidden sm:inline">{sortLabel(sortMode)}</span>
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
            color: groupMode !== "none" ? "var(--color-accent)" : "var(--color-fg-subtle)",
            background: groupMode !== "none" ? "rgba(91,184,224,0.08)" : "transparent",
            border: `1px solid ${groupMode !== "none" ? "rgba(91,184,224,0.3)" : "var(--color-border-hairline)"}`,
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
          <span className="hidden sm:inline">{groupLabel(groupMode)}</span>
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
    </>
  );
}

function Menu({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "calc(100% + 4px)",
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
        color: active ? "var(--color-accent)" : "var(--color-fg-muted)",
        fontSize: "9px",
        letterSpacing: "0.15em",
        textTransform: "uppercase",
        textAlign: "left",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-overlay-hover)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: active ? "var(--color-accent)" : "var(--color-border-faint)", display: "inline-block" }} />
      {label}
    </button>
  );
}
