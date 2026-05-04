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
        <svg width="9" height="11" viewBox="0 0 10 12" fill="none">
          <polygon points="5,0 10,4 5,12 0,4" style={{ fill: "var(--color-warning)" }} opacity="0.85" />
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
