"use client";

import { useCallback, useRef, useState } from "react";

interface Card {
  key: string;
  content: React.ReactNode;
}

interface Props {
  cards: Card[];
  height?: number;
  // Optional card labels for a11y.
  labels?: string[];
}

const SWIPE_COMMIT_PX = 56;
const AXIS_DEADZONE = 8;

// Horizontal swipe pager for the detail modal.
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
      // Rubber-band past the boundary cards.
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

      {/* Labeled tab strip */}
      <div
        className="flex justify-center"
        role="tablist"
        style={{ gap: 4, borderBottom: "1px solid var(--color-border-faint)" }}
      >
        {cards.map((_, i) => {
          const isActive = i === active;
          const label = labels?.[i] ?? `Card ${i + 1}`;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={label}
              onClick={() => setActive(i)}
              className="cursor-pointer transition-colors"
              style={{
                background: "transparent",
                border: "none",
                padding: "6px 14px",
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "var(--color-active-highlight-alt)" : "var(--color-fg-subtle)",
                borderBottom: `2px solid ${isActive ? "var(--color-active-highlight-alt)" : "transparent"}`,
                marginBottom: -1,
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.color = "var(--color-fg-muted)"; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.color = "var(--color-fg-subtle)"; }}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
