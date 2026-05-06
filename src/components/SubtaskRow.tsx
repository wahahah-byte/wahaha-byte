"use client";

import { useRef, useState } from "react";
import type { Subtask } from "@/lib/api/tasks";

type Props = {
  subtask: Subtask;
  onToggle: () => void;
  onDelete: () => void;
};

const COMMIT_THRESHOLD = 80;
const MAX_DRAG = 160;

export default function SubtaskRow({ subtask, onToggle, onDelete }: Props) {
  const [dragX, setDragX] = useState(0);
  const swipeRef = useRef<{ startX: number; startY: number; locked: "h" | "v" | null } | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    swipeRef.current = { startX: t.clientX, startY: t.clientY, locked: null };
  }

  function onTouchMove(e: React.TouchEvent) {
    const s = swipeRef.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = t.clientX - s.startX;
    const dy = t.clientY - s.startY;
    if (s.locked === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      s.locked = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }
    if (s.locked === "h") {
      // Only allow left swipe (delete direction). Right swipe is ignored.
      const leftAmount = Math.max(0, -dx);
      const damped = leftAmount <= COMMIT_THRESHOLD
        ? leftAmount
        : COMMIT_THRESHOLD + (leftAmount - COMMIT_THRESHOLD) * 0.4;
      setDragX(Math.min(damped, MAX_DRAG));
    }
  }

  function onTouchEnd() {
    const s = swipeRef.current;
    swipeRef.current = null;
    if (!s || s.locked !== "h") {
      setDragX(0);
      return;
    }
    if (dragX >= COMMIT_THRESHOLD) {
      // Commit: parent will remove this row from the list. We don't snap back.
      onDelete();
      // In the rare rollback case, the row remounts fresh with dragX = 0.
    } else {
      setDragX(0);
    }
  }

  const ready = dragX >= COMMIT_THRESHOLD;

  return (
    <div className="relative overflow-hidden" style={{ borderRadius: 2 }}>
      {/* Red delete action behind the row, revealed by the swipe */}
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 flex items-center justify-end"
        style={{
          width: Math.max(dragX, 0),
          paddingRight: 14,
          background: ready ? "rgba(239,68,68,0.9)" : "rgba(239,68,68,0.55)",
          color: "white",
          transition: dragX === 0 ? "width 0.18s cubic-bezier(0.2,0,0,1), background 0.12s" : "background 0.12s",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        {dragX > 28 && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3V2.2h4V3" />
            <line x1="2" y1="3.5" x2="12" y2="3.5" />
            <path d="M3.5 4l0.7 7.5h5.6L10.5 4" fill="none" />
            <line x1="6" y1="6" x2="6" y2="10" />
            <line x1="8" y1="6" x2="8" y2="10" />
          </svg>
        )}
      </div>

      {/* Foreground row content */}
      <div
        className="flex items-center gap-2"
        style={{
          position: "relative",
          background: "var(--color-panel)",
          transform: dragX > 0 ? `translateX(-${dragX}px)` : undefined,
          transition: dragX === 0 ? "transform 0.18s cubic-bezier(0.2,0,0,1)" : "none",
          touchAction: "pan-y",
          willChange: dragX > 0 ? "transform" : undefined,
          padding: "2px 0",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <button
          onClick={onToggle}
          className="w-6 h-6 flex-shrink-0 flex items-center justify-center cursor-pointer"
          style={{ background: "transparent", border: "none" }}
          aria-label={subtask.completed ? "Uncheck subtask" : "Check subtask"}
        >
          <span
            className="flex items-center justify-center"
            style={{
              width: 14, height: 14,
              border: `1px solid ${subtask.completed ? "var(--color-success)" : "var(--color-border)"}`,
              borderRadius: 2,
              background: subtask.completed ? "rgba(74,222,128,0.12)" : "transparent",
            }}
          >
            {subtask.completed && (
              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                <polyline points="1,3 3,5 7,1" style={{ stroke: "var(--color-success)" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
        </button>

        <span
          className="flex-1 text-xs select-none"
          style={{
            color: subtask.completed ? "var(--color-fg-muted)" : "var(--color-fg)",
            textDecoration: subtask.completed ? "line-through" : "none",
          }}
        >
          {subtask.title}
        </span>

        <button
          onClick={onDelete}
          className="flex-shrink-0 flex items-center justify-center cursor-pointer transition-colors"
          style={{
            width: 32, height: 32,
            background: "transparent",
            border: "none",
            color: "var(--color-fg-subtle)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-danger)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
          aria-label="Delete subtask"
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3V2.2h4V3" />
            <line x1="2" y1="3.5" x2="12" y2="3.5" />
            <path d="M3.5 4l0.7 7.5h5.6L10.5 4" fill="none" />
            <line x1="6" y1="6" x2="6" y2="10" />
            <line x1="8" y1="6" x2="8" y2="10" />
          </svg>
        </button>
      </div>
    </div>
  );
}
