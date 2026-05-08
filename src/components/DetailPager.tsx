"use client";

import { useCallback, useRef, useState } from "react";

interface Card {
  key: string;
  content: React.ReactNode;
}

interface Props {
  cards: Card[];
  height?: number;
  // Optional left-right card labels for accessibility (announced to screen readers).
  labels?: string[];
}

const SWIPE_COMMIT_PX = 56;
const AXIS_DEADZONE = 8;

// Two-card horizontal swipe pager used inside the task detail modal.
// Designed to feel native: lock-to-axis early so vertical scroll inside the
// modal still works, soft-cap rubber-banding past the edges, and small dots
// for the activity indicator (no chrome above the cards themselves).
export default function DetailPager({ cards, height = 220, labels }: Props) {
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; locked: "h" | "v" | null; w: number } | null>(null);

  const onStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length > 1) { dragRef.current = null; return; }
    const t = e.touches[0];
    const w = wrapRef.current?.clientWidth ?? 0;
    dragRef.current = { startX: t.clientX, startY: t.clientY, locked: null, w };
    setDragX(0);
  }, []);

  const onMove = useCallback((e: React.TouchEvent) => {
    const d = dragRef.current;
    if (!d || e.touches.length > 1) return;
    const t = e.touches[0];
    const dx = t.clientX - d.startX;
    const dy = t.clientY - d.startY;
    if (d.locked === null) {
      if (Math.abs(dx) < AXIS_DEADZONE && Math.abs(dy) < AXIS_DEADZONE) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        d.locked = "h";
        setDragging(true);
      } else {
        d.locked = "v";
        dragRef.current = null;
        return;
      }
    }
    if (d.locked === "h") {
      const atStart = active === 0;
      const atEnd = active === cards.length - 1;
      // Rubber-band past the boundary cards so the user feels the edge.
      const min = atEnd ? -d.w * 0.15 : -d.w;
      const max = atStart ? d.w * 0.15 : d.w;
      const clamped = Math.max(min, Math.min(max, dx));
      setDragX(clamped);
    }
  }, [active, cards.length]);

  const onEnd = useCallback(() => {
    const d = dragRef.current;
    dragRef.current = null;
    setDragging(false);
    if (!d || d.locked !== "h") { setDragX(0); return; }
    if (dragX < -SWIPE_COMMIT_PX && active < cards.length - 1) setActive(active + 1);
    else if (dragX > SWIPE_COMMIT_PX && active > 0) setActive(active - 1);
    setDragX(0);
  }, [dragX, active, cards.length]);

  return (
    <div className="flex flex-col gap-2">
      <div
        ref={wrapRef}
        style={{ overflow: "hidden", height, position: "relative" }}
        onTouchStart={onStart}
        onTouchMove={onMove}
        onTouchEnd={onEnd}
        onTouchCancel={onEnd}
      >
        <div
          style={{
            display: "flex",
            width: `${cards.length * 100}%`,
            height: "100%",
            transform: `translateX(calc(${-active * (100 / cards.length)}% + ${dragX}px))`,
            transition: dragging ? "none" : "transform 0.26s cubic-bezier(0.22, 1, 0.36, 1)",
            willChange: "transform",
          }}
        >
          {cards.map((card, i) => (
            <div
              key={card.key}
              role="group"
              aria-label={labels?.[i]}
              aria-hidden={i !== active}
              style={{
                flex: `0 0 ${100 / cards.length}%`,
                minWidth: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {card.content}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-1.5" aria-hidden>
        {cards.map((_, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              tabIndex={-1}
              aria-label={labels?.[i] ?? `Card ${i + 1}`}
              style={{
                width: isActive ? 16 : 5,
                height: 5,
                borderRadius: 999,
                background: isActive ? "var(--color-active-highlight-alt)" : "var(--color-border-faint)",
                border: "none",
                padding: 0,
                cursor: "pointer",
                opacity: isActive ? 1 : 0.6,
                transition: "width 0.22s, background 0.18s, opacity 0.18s",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
