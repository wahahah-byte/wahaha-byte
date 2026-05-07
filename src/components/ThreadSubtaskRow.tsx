"use client";

import { useRef, useState } from "react";
import type { Subtask } from "@/lib/api/tasks";

type Props = {
  subtask: Subtask;
  isLast: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

const COMMIT_THRESHOLD = 80;
const MAX_DRAG = 160;
const ROW_HEIGHT = 36;
const THREAD_GUTTER = 22;

export default function ThreadSubtaskRow({ subtask, isLast, onToggle, onDelete }: Props) {
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
      onDelete();
    } else {
      setDragX(0);
    }
  }

  const ready = dragX >= COMMIT_THRESHOLD;

  return (
    <div
      style={{
        position: "relative",
        height: ROW_HEIGHT,
        overflow: "hidden",
      }}
    >
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

      {/* Foreground sliding row */}
      <div
        className="flex items-center"
        style={{
          position: "absolute",
          inset: 0,
          paddingLeft: THREAD_GUTTER,
          gap: 8,
          background: "var(--color-bg)",
          transform: dragX > 0 ? `translateX(-${dragX}px)` : undefined,
          transition: dragX === 0 ? "transform 0.18s cubic-bezier(0.2,0,0,1)" : "none",
          touchAction: "pan-y",
          willChange: dragX > 0 ? "transform" : undefined,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="flex-shrink-0 flex items-center justify-center cursor-pointer"
          style={{
            width: 28, height: 28,
            background: "transparent",
            border: "none",
            padding: 0,
          }}
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
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="flex-1 text-xs cursor-pointer select-none truncate"
          style={{
            color: subtask.completed ? "var(--color-fg-muted)" : "var(--color-fg)",
            textDecoration: subtask.completed ? "line-through" : "none",
          }}
        >
          {subtask.title}
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete subtask"
          aria-label="Delete subtask"
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: 32, height: 32,
            marginRight: -6,
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "var(--color-fg-subtle)",
            opacity: 0.55,
            transition: "opacity 0.15s ease, color 0.15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.color = "var(--color-danger)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.55"; e.currentTarget.style.color = "var(--color-fg-subtle)"; }}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3V2.2h4V3" />
            <line x1="2" y1="3.5" x2="12" y2="3.5" />
            <path d="M3.5 4l0.7 7.5h5.6L10.5 4" fill="none" />
            <line x1="6" y1="6" x2="6" y2="10" />
            <line x1="8" y1="6" x2="8" y2="10" />
          </svg>
        </button>
      </div>

      {/* Static thread connector — rendered last so it paints on top of the
          foreground row's background. Sits in the gutter (0..THREAD_GUTTER),
          which doesn't visually overlap the row content (paddingLeft = THREAD_GUTTER). */}
      <svg
        aria-hidden
        width={THREAD_GUTTER}
        height={ROW_HEIGHT}
        viewBox={`0 0 ${THREAD_GUTTER} ${ROW_HEIGHT}`}
        style={{ position: "absolute", left: 0, top: 0, color: "var(--color-border-faint)", pointerEvents: "none" }}
      >
        {/* Vertical at x=8 lines up under the parent row's expanded chevron tip
            (chevron sits at row x≈24; thread paddingLeft=16, so 16+8=24). */}
        <line x1="8" y1="8" x2="8" y2={isLast ? ROW_HEIGHT / 2 : ROW_HEIGHT} stroke="currentColor" strokeWidth="1" />
        <line x1="8" y1={ROW_HEIGHT / 2} x2="15" y2={ROW_HEIGHT / 2} stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}
