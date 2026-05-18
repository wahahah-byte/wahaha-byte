"use client";

import { ReactNode } from "react";
import CategoryCapsTooltip from "@/components/CategoryCapsTooltip";

interface Props {
  // Drives both the tooltip content and the icon aria-label.
  capsVariant: "regular" | "recurring";
  // Pre-resolved active-filter label (e.g. "All", "Today", "Pending").
  filterLabel: string;
  // Optional category breadcrumb shown after the filter label.
  activeCategory: string | null;
  // Controls slot — render a TaskListControls / RoutineListControls here.
  controls: ReactNode;
  // "+" button copy (e.g. "New task", "New routine").
  newTaskLabel: string;
  isAuthenticated: boolean;
  onNewTask: () => void;
}

// Desktop main-panel header strip. Left: cap tooltip + filter label + optional
// active-category breadcrumb. Right: caller-provided controls + a "+" button.
export default function TaskPageHeader({
  capsVariant, filterLabel, activeCategory, controls, newTaskLabel,
  isAuthenticated, onNewTask,
}: Props) {
  const capsLabel = capsVariant === "recurring" ? "Show routine point caps" : "Show task point caps";

  return (
    <div
      className="flex items-center justify-between px-6 pt-4 pb-3"
      style={{ borderBottom: "1px solid var(--color-border-soft)" }}
    >
      <div className="flex items-center gap-2">
        <CategoryCapsTooltip variant={capsVariant}>
          <div
            tabIndex={0}
            aria-label={capsLabel}
            className="flex items-center justify-center"
            style={{ width: 26, height: 26, color: "var(--color-fg-muted)", cursor: "help" }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M9 16l2 2 4-4" />
            </svg>
          </div>
        </CategoryCapsTooltip>
        <span style={{ fontSize: 11, color: "var(--color-fg)", fontWeight: 600, letterSpacing: "0.16em", textTransform: "uppercase" }}>
          {filterLabel}
        </span>
        {activeCategory && (
          <>
            <span style={{ color: "var(--color-fg-subtle)", fontSize: 10 }}>·</span>
            <span style={{ fontSize: 11, color: "var(--color-fg-muted)", letterSpacing: "0.16em", textTransform: "uppercase" }}>
              {activeCategory}
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-1.5">
        {controls}
        <button
          onClick={() => isAuthenticated && onNewTask()}
          disabled={!isAuthenticated}
          title={!isAuthenticated ? "Sign in to create tasks" : newTaskLabel}
          aria-label={newTaskLabel}
          className="flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ml-1"
          style={{ width: 28, height: 28, fontSize: 18, lineHeight: 1, background: "transparent", border: "none", color: "var(--color-fg)" }}
        >
          +
        </button>
      </div>
    </div>
  );
}
