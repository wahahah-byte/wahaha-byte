"use client";

interface SubmitBarProps {
  visible: boolean;
  selectedCount: number;
  selectedPts: number;
  willAward: number;
  remaining: number;
  recurringRemaining: number;
  isSubmitting: boolean;
  limitReached: boolean;
  capped: boolean;
  onSubmit: () => void;
}

export default function SubmitBar({
  visible, selectedCount, selectedPts, willAward, remaining,
  recurringRemaining, isSubmitting, limitReached, capped, onSubmit,
}: SubmitBarProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 50,
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.18s ease-out",
        pointerEvents: visible ? "auto" : "none",
        background: "var(--color-surface)",
        borderTop: "1px solid rgba(245,158,11,0.35)",
        boxShadow: "0 -6px 32px rgba(0,0,0,0.55)",
      }}
    >
      <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
        <div className="flex flex-col gap-0.5">
          <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
            Pending Submission
          </span>
          <div className="flex items-center gap-1.5">
            <svg width="9" height="11" viewBox="0 0 10 12" fill="none" shapeRendering="crispEdges">
              <path d="M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z" style={{ fill: "var(--color-warning)" }} opacity="0.9" />
              <rect x="4" y="5" width="2" height="2" style={{ fill: "var(--color-bg)" }} opacity="0.45" />
            </svg>
            <span style={{ color: "var(--color-warning)", fontSize: "13px", fontWeight: 600 }}>
              {selectedCount} task{selectedCount !== 1 ? "s" : ""} · {selectedPts.toLocaleString()} pts selected
            </span>
          </div>
          {limitReached ? (
            <span style={{ color: "var(--color-danger)", fontSize: "10px", letterSpacing: "0.05em" }}>
              Regular limit reached (150 pts/day)
            </span>
          ) : capped ? (
            <span style={{ color: "rgba(239,68,68,0.8)", fontSize: "10px", letterSpacing: "0.05em" }}>
              {(selectedPts - willAward).toLocaleString()} pts will be lost · only {remaining} regular remaining today
            </span>
          ) : (
            <span style={{ color: "var(--color-fg-subtle)", fontSize: "10px", letterSpacing: "0.05em" }}>
              Regular: {remaining} pts left · Recurring: {recurringRemaining} pts left
            </span>
          )}
        </div>
        <button
          onClick={onSubmit}
          disabled={isSubmitting || limitReached}
          className="flex-shrink-0 text-[10px] tracking-widest uppercase px-4 py-2.5 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed submit-btn"
          style={{ color: "var(--color-warning)", border: "1px solid rgba(245,158,11,0.5)", background: "rgba(245,158,11,0.08)" }}
          onMouseEnter={(e) => { if (!isSubmitting && !limitReached) e.currentTarget.style.background = "rgba(245,158,11,0.18)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(245,158,11,0.08)"; }}
        >
          {isSubmitting ? "Submitting…" : limitReached ? "Limit Reached" : `File ${selectedCount} task${selectedCount !== 1 ? "s" : ""} ▶`}
        </button>
      </div>
    </div>
  );
}
