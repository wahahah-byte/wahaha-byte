"use client";

import { TaskDto } from "@/lib/api/tasks";

type Props = {
  unsubmitted: TaskDto[];
  allSelected: boolean;
  onToggleSelectAll: () => void;
};

export default function UnsubmittedSummary({ unsubmitted, allSelected, onToggleSelectAll }: Props) {
  return (
    <div className="flex justify-between items-center px-1 mb-1" style={{ visibility: unsubmitted.length > 0 ? "visible" : "hidden" }}>
      <div className="flex items-center gap-1.5" title={`${unsubmitted.length} task${unsubmitted.length === 1 ? "" : "s"} pending submission`}>
        <svg width="9" height="11" viewBox="0 0 10 12" fill="none" shapeRendering="crispEdges">
          <path d="M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z" style={{ fill: "var(--color-warning)" }} opacity="0.85" />
          <rect x="4" y="5" width="2" height="2" style={{ fill: "var(--color-bg)" }} opacity="0.5" />
        </svg>
        <span style={{ color: "var(--color-warning)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em" }}>
          {unsubmitted.reduce((s, t) => s + t.pointValue, 0).toLocaleString()}
        </span>
        <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Unsubmitted
        </span>
      </div>
      <button
        onClick={onToggleSelectAll}
        className="text-[9px] tracking-widest uppercase cursor-pointer transition-colors"
        style={{ color: allSelected ? "rgba(245,158,11,0.7)" : "var(--color-fg-subtle)", background: "transparent", border: "none" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = allSelected ? "var(--color-warning)" : "var(--color-fg-muted)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = allSelected ? "rgba(245,158,11,0.7)" : "var(--color-fg-subtle)")}
      >
        {allSelected ? "Deselect All" : "Select All"}
      </button>
    </div>
  );
}
