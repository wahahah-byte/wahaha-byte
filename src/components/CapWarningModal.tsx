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
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm p-6 flex flex-col gap-4"
        style={{ background: "#1e1f22", border: "1px solid rgba(239,68,68,0.45)", borderRadius: "4px", boxShadow: "0 16px 48px rgba(0,0,0,0.7)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
            <path d="M10 2L18 17H2L10 2Z" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="10" y1="8" x2="10" y2="12" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="14.5" r="0.75" fill="#ef4444" />
          </svg>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold tracking-wide" style={{ color: "#ef4444" }}>Daily Cap Exceeded</p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              You&apos;re submitting <span style={{ color: "#fff", fontWeight: 600 }}>{selectedPts.toLocaleString()} pts</span> but only{" "}
              <span style={{ color: "#fff", fontWeight: 600 }}>{remaining} pts</span> of your 150 pt regular daily limit remain.
            </p>
            <p className="text-xs font-semibold" style={{ color: "#ef4444" }}>
              {(selectedPts - willAward).toLocaleString()} pts will be lost.
            </p>
          </div>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs tracking-widest uppercase cursor-pointer transition-colors"
            style={{ color: "rgba(255,255,255,0.5)", background: "transparent", border: "1px solid #3a3b3f", borderRadius: "3px" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3b3f"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onClose(); onConfirm(); }}
            className="px-4 py-2 text-xs tracking-widest uppercase cursor-pointer transition-colors"
            style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.45)", borderRadius: "3px" }}
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
