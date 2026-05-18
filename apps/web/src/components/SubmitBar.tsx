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

const transition = "transform 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.18s ease-out";

const CoinIcon = ({ size = 11 }: { size?: number }) => (
  <svg width={size * 9 / 11} height={size} viewBox="0 0 10 12" fill="none" shapeRendering="crispEdges">
    <path d="M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z" style={{ fill: "var(--color-warning)" }} opacity="0.9" />
    <rect x="4" y="5" width="2" height="2" style={{ fill: "var(--color-bg)" }} opacity="0.45" />
  </svg>
);

export default function SubmitBar({
  visible, selectedCount, selectedPts, willAward, remaining,
  recurringRemaining, isSubmitting, limitReached, capped, onSubmit,
}: SubmitBarProps) {
  const buttonLabel = isSubmitting
    ? "Submitting…"
    : limitReached
      ? "Limit Reached"
      : `File ${selectedCount} task${selectedCount !== 1 ? "s" : ""} ▶`;

  const mobileButtonLabel = isSubmitting
    ? "…"
    : limitReached
      ? "Limit"
      : `File ${willAward}p ▶`;

  return (
    <>
      {/* Desktop: bar pinned to bottom of the main column. left/right are
          set entirely in CSS (.submit-bar-desktop) — putting them inline
          would override the @media-query left/right values the class
          uses to skip the sidebar + detail columns at desktop-shell
          breakpoints, so the bar would still paint over the sidebar's
          user/balance strip. */}
      <div
        className="hidden sm:block submit-bar-desktop"
        style={{
          position: "fixed",
          bottom: 0,
          zIndex: 50,
          transform: visible ? "translateY(0)" : "translateY(100%)",
          opacity: visible ? 1 : 0,
          transition,
          pointerEvents: visible ? "auto" : "none",
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-warning-border)",
          // Top shadow only — the box-shadow blur (originally 32px) bled
          // to the right past the bar's edge and onto the detail panel
          // underneath. clip-path inset(top right bottom left) with
          // negative top lets the shadow expand upward by 16px while
          // clipping the other three sides flush with the bar. Blur and
          // opacity also dialed down for a less heavy drop.
          boxShadow: "0 -3px 14px rgba(0, 0, 0, 0.28)",
          clipPath: "inset(-16px 0 0 0)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          <div className="flex flex-col gap-0.5">
            <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Pending Submission
            </span>
            <div className="flex items-center gap-1.5">
              <CoinIcon />
              <span style={{ color: "var(--color-warning)", fontSize: "13px", fontWeight: 600 }}>
                {selectedCount} task{selectedCount !== 1 ? "s" : ""} · {selectedPts.toLocaleString()} pts selected
              </span>
            </div>
            {limitReached ? (
              <span style={{ color: "var(--color-danger)", fontSize: "10px", letterSpacing: "0.05em" }}>
                Regular limit reached (150 pts/day)
              </span>
            ) : capped ? (
              <span style={{ color: "var(--color-danger)", opacity: 0.85, fontSize: "10px", letterSpacing: "0.05em" }}>
                {(selectedPts - willAward).toLocaleString()} pts will be lost · only {remaining} regular remaining today
              </span>
            ) : (
              <span style={{ color: "var(--color-fg-subtle)", fontSize: "10px", letterSpacing: "0.05em" }}>
                Regular: {remaining} pts left · Routines: {recurringRemaining} pts left
              </span>
            )}
          </div>
          <button
            onClick={onSubmit}
            disabled={isSubmitting || limitReached}
            className="flex-shrink-0 text-[10px] tracking-widest uppercase px-4 py-2.5 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed submit-btn"
            style={{ color: "var(--color-warning)", border: "1px solid var(--color-warning-border)", background: "var(--color-warning-bg)" }}
            onMouseEnter={(e) => { if (!isSubmitting && !limitReached) e.currentTarget.style.background = "color-mix(in srgb, var(--color-warning) 18%, transparent)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-warning-bg)"; }}
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      {/* Mobile: compact bar that takes over the action-bar slot at the bottom */}
      <div
        className="sm:hidden flex items-center gap-2 px-3 pb-px"
        style={{
          position: "fixed",
          bottom: "env(safe-area-inset-bottom, 0px)",
          left: 0, right: 0,
          height: "50px",
          zIndex: 35,
          transform: visible ? "translateY(0)" : "translateY(calc(100% + 8px))",
          opacity: visible ? 1 : 0,
          transition,
          pointerEvents: visible ? "auto" : "none",
          background: "var(--color-surface)",
          borderTop: "1px solid var(--color-warning-border)",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
        }}
      >
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <CoinIcon size={11} />
          <span className="truncate" style={{ color: "var(--color-warning)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.02em" }}>
            {selectedCount} · {selectedPts.toLocaleString()}p
          </span>
          {limitReached ? (
            <span className="truncate" style={{ color: "var(--color-danger)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Limit
            </span>
          ) : capped ? (
            <span className="truncate" style={{ color: "var(--color-danger)", fontSize: "9px", letterSpacing: "0.05em" }}>
              −{(selectedPts - willAward).toLocaleString()}p
            </span>
          ) : null}
        </div>
        <button
          onClick={onSubmit}
          disabled={isSubmitting || limitReached}
          className="submit-btn flex-shrink-0 text-[10px] tracking-widest uppercase cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            color: "var(--color-warning)",
            border: "1px solid var(--color-warning-border)",
            background: "var(--color-warning-bg)",
            borderRadius: "2px",
            padding: "6px 10px",
            height: 30,
          }}
        >
          {mobileButtonLabel}
        </button>
      </div>
    </>
  );
}
