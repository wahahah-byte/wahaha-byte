"use client";

import { useEffect, useState } from "react";

interface Props {
  open: boolean;
  // True while the parent's deleteAccount request is in flight — disables actions to prevent double-fire.
  busy: boolean;
  // Required for the typed confirmation — user must type this string verbatim before delete enables.
  requiredText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Two-step deletion modal — typed confirmation prevents accidental clicks on a destructive action.
// Used by the Settings page's danger zone; mirrors the mobile equivalent for parity.
export default function DeleteAccountModal({ open, busy, requiredText, onConfirm, onCancel }: Props) {
  const [typed, setTyped] = useState("");

  // Reset the typed value any time the modal opens so a previous attempt doesn't pre-arm the button.
  useEffect(() => {
    if (open) setTyped("");
  }, [open]);

  // Esc dismisses when not in-flight.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !busy) onCancel();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, busy, onCancel]);

  if (!open) return null;
  const confirmed = typed.trim() === requiredText;

  return (
    <div
      data-edge-drawer-block
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.65)" }}
      onClick={busy ? undefined : onCancel}
    >
      <div
        className="w-full max-w-sm p-6 flex flex-col gap-4"
        style={{
          background: "var(--color-surface)",
          border: "1px solid rgba(239,68,68,0.45)",
          borderRadius: 4,
          boxShadow: "var(--shadow-popover)",
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
      >
        <div className="flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
            <path d="M10 2L18 17H2L10 2Z" style={{ stroke: "var(--color-danger)" }} strokeWidth="1.5" strokeLinejoin="round" />
            <line x1="10" y1="8" x2="10" y2="12" style={{ stroke: "var(--color-danger)" }} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="10" cy="14.5" r="0.75" style={{ fill: "var(--color-danger)" }} />
          </svg>
          <div className="flex flex-col gap-1">
            <p id="delete-account-title" className="text-sm font-semibold tracking-wide" style={{ color: "var(--color-danger)" }}>
              Delete account
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
              This permanently deletes your account, all tasks, streaks, inventory, points history, and profile picture.{" "}
              <span style={{ color: "var(--color-fg)", fontWeight: 600 }}>This cannot be undone.</span>
            </p>
          </div>
        </div>

        <label className="flex flex-col gap-1.5 text-[10px] tracking-widest uppercase font-semibold" style={{ color: "var(--color-fg-muted)" }}>
          Type <span style={{ color: "var(--color-danger)", fontFamily: "monospace", fontSize: 11 }}>{requiredText}</span> to confirm
          <input
            type="text"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            disabled={busy}
            autoFocus
            spellCheck={false}
            autoComplete="off"
            className="w-full px-3 py-2.5 text-sm focus:outline-none transition-colors"
            style={{
              background: "var(--color-input)",
              color: "var(--color-input-fg)",
              border: `1px solid ${confirmed ? "rgba(239,68,68,0.45)" : "var(--color-border)"}`,
              borderRadius: 3,
              fontFamily: "monospace",
              letterSpacing: "0.04em",
              textTransform: "none",
            }}
          />
        </label>

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2 text-xs tracking-widest uppercase cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              color: "var(--color-fg-muted)",
              background: "transparent",
              border: "1px solid var(--color-border)",
              borderRadius: 3,
            }}
            onMouseEnter={(e) => {
              if (!busy) {
                e.currentTarget.style.borderColor = "var(--color-button-border)";
                e.currentTarget.style.color = "var(--color-fg)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--color-border)";
              e.currentTarget.style.color = "var(--color-fg-muted)";
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy || !confirmed}
            className="px-4 py-2 text-xs tracking-widest uppercase cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              color: "var(--color-danger)",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.45)",
              borderRadius: 3,
            }}
            onMouseEnter={(e) => {
              if (!busy && confirmed) e.currentTarget.style.background = "rgba(239,68,68,0.18)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(239,68,68,0.08)";
            }}
          >
            {busy ? "Deleting…" : "Delete forever"}
          </button>
        </div>
      </div>
    </div>
  );
}
