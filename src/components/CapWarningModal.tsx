"use client";

interface CapWarningModalProps {
  selectedPts: number;
  willAward: number;
  remaining: number;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CapWarningModal({ selectedPts, willAward, remaining, onClose, onConfirm }: CapWarningModalProps) {
  return (
    <div
      data-edge-drawer-block
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm p-6 flex flex-col gap-4"
        style={{ background: "var(--color-surface)", border: "1px solid rgba(239,68,68,0.45)", borderRadius: "4px", boxShadow: "var(--shadow-popover)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
            <path d="M10 2L18 17H2L10 2Z" style={{ stroke: "var(--color-danger)" }} strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="10" y1="8" x2="10" y2="12" style={{ stroke: "var(--color-danger)" }} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="14.5" r="0.75" style={{ fill: "var(--color-danger)" }} />
          </svg>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold tracking-wide" style={{ color: "var(--color-danger)" }}>Daily Cap Exceeded</p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
              You&apos;re submitting <span style={{ color: "var(--color-fg)", fontWeight: 600 }}>{selectedPts.toLocaleString()} pts</span> but only{" "}
              <span style={{ color: "var(--color-fg)", fontWeight: 600 }}>{remaining} pts</span> of your 150 pt regular daily limit remain.
            </p>
            <p className="text-xs font-semibold" style={{ color: "var(--color-danger)" }}>
              {(selectedPts - willAward).toLocaleString()} pts will be lost.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs tracking-widest uppercase cursor-pointer transition-colors"
            style={{ color: "var(--color-fg-muted)", background: "transparent", border: "1px solid var(--color-border)", borderRadius: "3px" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--color-button-border)"; e.currentTarget.style.color = "var(--color-fg)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--color-border)"; e.currentTarget.style.color = "var(--color-fg-muted)"; }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onClose(); onConfirm(); }}
            className="px-4 py-2 text-xs tracking-widest uppercase cursor-pointer transition-colors"
            style={{ color: "var(--color-danger)", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.45)", borderRadius: "3px" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
          >
            Submit anyway ({willAward} pts)
          </button>
        </div>
      </div>
    </div>
  );
}
