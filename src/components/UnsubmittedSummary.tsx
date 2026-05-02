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
          <polygon points="5,0 10,4 5,12 0,4" fill="#f59e0b" opacity="0.85" />
        </svg>
        <span style={{ color: "rgba(245,158,11,0.9)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em" }}>
          {unsubmitted.reduce((s, t) => s + t.pointValue, 0).toLocaleString()}
        </span>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Unsubmitted
        </span>
      </div>
      <button
        onClick={onToggleSelectAll}
        className="text-[9px] tracking-widest uppercase cursor-pointer transition-colors"
        style={{ color: allSelected ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.35)", background: "transparent", border: "none" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = allSelected ? "#f59e0b" : "rgba(255,255,255,0.6)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = allSelected ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.35)")}
      >
        {allSelected ? "Deselect All" : "Select All"}
      </button>
    </div>
  );
}
