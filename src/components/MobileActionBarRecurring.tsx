"use client";

import { useRef, useState } from "react";
import FilterTray from "@/components/FilterTray";
import { CategoryIcon } from "@/lib/categoryIcons";
import { CATEGORY_COLOR } from "@/lib/constants";

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
  /** Categories present among recurring tasks — only those render in the icon strip. */
  availableCategories?: string[];
  /** Currently active category filter, or null when none selected. */
  activeCategory?: string | null;
  onCategoryChange?: (category: string | null) => void;
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

export default function MobileActionBarRecurring({
  filters, activeFilter, onFilterChange, getCount, badgeColor,
  sortMode, groupMode, onSortChange, onGroupChange,
  onNewTask, isAuthenticated, pagerRef,
  availableCategories = [], activeCategory = null, onCategoryChange,
}: Props) {
  const [showSort, setShowSort] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [trayOpen, setTrayOpen] = useState(true);
  const trayElementRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        data-edge-drawer-block
        className="fixed left-0 right-0 sm:hidden flex items-center gap-1.5 px-2 pb-px"
        style={{
          bottom: "env(safe-area-inset-bottom, 0px)",
          height: "50px",
          background: "var(--color-header)",
          borderTop: "1px solid var(--color-border-soft)",
          boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.08)",
          zIndex: 35,
        }}
      >
        <div
          className="flex-1 flex items-center gap-1 overflow-x-auto min-w-0"
          style={{ scrollbarWidth: "none" }}
        >
          {availableCategories.map((cat) => {
            const active = activeCategory === cat;
            const color = CATEGORY_COLOR[cat] ?? "var(--color-fg-muted)";
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange?.(active ? null : cat)}
                aria-label={`Filter by ${cat}`}
                aria-pressed={active}
                title={cat}
                className="flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors"
                style={{
                  width: 26,
                  height: 26,
                  background: active ? `color-mix(in srgb, ${color} 18%, transparent)` : "transparent",
                  border: `1px solid ${active ? `color-mix(in srgb, ${color} 50%, transparent)` : "transparent"}`,
                  borderRadius: 4,
                  color,
                  opacity: !activeCategory || active ? 1 : 0.4,
                  padding: 0,
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <CategoryIcon category={cat} size={14} />
              </button>
            );
          })}
        </div>

        <div className="flex items-center flex-shrink-0">
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
        onToggle={() => setTrayOpen((v) => !v)}
        getCount={getCount}
        badgeColor={badgeColor}
        bottomOffsetPx={50}
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
