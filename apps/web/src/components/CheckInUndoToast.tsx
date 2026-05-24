"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  taskTitle: string;
  onUndo: () => void;
  onDismiss: () => void;
  durationMs?: number;
  /** Leading label, e.g. "Checked in" or "Deleted". Default: "Checked in". */
  prefix?: string;
}

// Dismissible 5-second undo toast (used for check-ins and deletes).
export default function CheckInUndoToast({ taskTitle, onUndo, onDismiss, durationMs = 5000, prefix = "Checked in" }: Props) {
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(1);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 1 - elapsed / durationMs);
      setProgress(remaining);
      if (remaining <= 0) clearInterval(id);
    }, 60);
    return () => clearInterval(id);
  }, [durationMs]);

  if (!mounted) return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        left: "50%",
        bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
        transform: "translateX(-50%)",
        zIndex: 70,
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: 6,
        boxShadow: "var(--shadow-popover)",
        padding: "10px 12px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        minWidth: 260,
        maxWidth: "calc(100vw - 24px)",
        animation: "checkin-toast-in 0.18s ease-out",
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontSize: 11,
          color: "var(--color-fg)",
          fontWeight: 600,
          letterSpacing: "0.04em",
          flex: 1,
          minWidth: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {prefix}: {taskTitle}
      </span>
      <button
        onClick={onUndo}
        className="cursor-pointer"
        style={{
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "var(--color-active-highlight)",
          background: "transparent",
          border: "1px solid var(--color-active-highlight-border)",
          borderRadius: 999,
          padding: "4px 10px",
          flexShrink: 0,
        }}
      >
        Undo
      </button>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="cursor-pointer"
        style={{
          fontSize: 14,
          lineHeight: 1,
          color: "var(--color-fg-subtle)",
          background: "transparent",
          border: "none",
          padding: "4px 6px",
          flexShrink: 0,
        }}
      >
        ×
      </button>
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          background: "var(--color-active-highlight)",
          transform: `scaleX(${progress})`,
          transformOrigin: "left",
          transition: "transform 0.06s linear",
        }}
      />
    </div>,
    document.body
  );
}
