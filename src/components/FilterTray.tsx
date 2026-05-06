"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Filter = { label: string; shortLabel: string; value: string };

type Props = {
  open: boolean;
  filters: readonly Filter[];
  activeFilter: string;
  onChange: (value: string) => void;
  onClose: () => void;
  getCount?: (value: string) => number;
  badgeColor?: (value: string) => string | null;
  /** Distance from screen bottom to the tray. Defaults match MobileActionBar (44px) + MobileNav (44px). */
  bottomOffsetPx?: number;
  /** Optional ref to the page-content pager. Horizontal swipes on the tray drive
   *  this element's transform 1:1 with the thumb (carousel-style page slide). */
  pagerRef?: React.RefObject<HTMLElement | null>;
  /** Optional ref to the tray's own root element. Lets the action-bar handle
   *  drive the tray's vertical translate directly during a drag-to-open or
   *  drag-to-close gesture. */
  trayElementRef?: React.RefObject<HTMLDivElement | null>;
};

const TRAY_HEIGHT = 28;
const DISMISS_DRAG_PX = 50;
const AXIS_DEADZONE_PX = 8;

export default function FilterTray({
  open, filters, activeFilter, onChange, onClose, getCount, badgeColor,
  bottomOffsetPx = 88, pagerRef, trayElementRef,
}: Props) {
  const [dragY, setDragY] = useState(0);
  const swipeRef = useRef<{ startX: number; startY: number; startIdx: number; locked: "v" | "h" | null } | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const activeIdx = Math.max(0, filters.findIndex((f) => f.value === activeFilter));

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    const startIdx = filters.findIndex((f) => f.value === activeFilter);
    swipeRef.current = {
      startX: t.clientX,
      startY: t.clientY,
      startIdx: startIdx < 0 ? 0 : startIdx,
      locked: null,
    };
  }
  function onTouchMove(e: React.TouchEvent) {
    const s = swipeRef.current;
    if (!s) return;
    const t = e.touches[0];
    const dx = t.clientX - s.startX;
    const dy = t.clientY - s.startY;
    // Axis lock at the deadzone so a tap doesn't trigger a drag and a horizontal
    // page swipe doesn't accidentally pull the tray down.
    if (s.locked === null) {
      if (Math.abs(dx) < AXIS_DEADZONE_PX && Math.abs(dy) < AXIS_DEADZONE_PX) return;
      s.locked = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }
    if (s.locked === "v" && dy > 0) {
      setDragY(dy);
      return;
    }
    if (s.locked === "h" && filters.length > 1) {
      // Drag-the-thumb model: the highlight tracks the finger 1:1 across pill
      // widths. dx of one pill width = +1 filter index. The pager slides in
      // the same direction the highlight does (toward the destination filter).
      const viewportW = window.innerWidth || 1;
      const pillWidth = (viewportW - 16) / filters.length; // strip is full-width minus px-2 padding
      const deltaIdx = dx / pillWidth;
      const continuous = Math.max(0, Math.min(filters.length - 1, s.startIdx + deltaIdx));
      const slotPct = 100 / filters.length;

      const pager = pagerRef?.current;
      if (pager) {
        // eslint-disable-next-line react-hooks/immutability
        pager.style.transition = "none";
        pager.style.transform = `translateX(${-continuous * slotPct}%)`;
      }

      // Slide the active-pill highlight in lockstep with the page so the user
      // sees the selection moving toward the next filter as they swipe.
      const highlight = highlightRef.current;
      if (highlight) {
        highlight.style.transition = "none";
        highlight.style.transform = `translateX(${continuous * 100}%)`;
      }
    }
  }
  function onTouchEnd() {
    const s = swipeRef.current;
    swipeRef.current = null;
    if (!s) return;
    if (s.locked === "v") {
      const final = dragY;
      setDragY(0);
      if (final > DISMISS_DRAG_PX) onClose();
      return;
    }
    if (s.locked === "h") {
      const pager = pagerRef?.current;
      const highlight = highlightRef.current;
      const slotPct = 100 / filters.length;

      // Read the current pager position (or fall back to highlight) to figure
      // out which pill we landed nearest to.
      let continuousIdx = s.startIdx;
      if (pager) {
        const match = pager.style.transform.match(/translateX\((-?[\d.]+)%\)/);
        const currentPct = match ? parseFloat(match[1]) : 0;
        continuousIdx = -currentPct / slotPct;
      } else if (highlight) {
        const match = highlight.style.transform.match(/translateX\((-?[\d.]+)%\)/);
        const currentPct = match ? parseFloat(match[1]) : 0;
        continuousIdx = currentPct / 100;
      }
      const snappedIdx = Math.max(0, Math.min(filters.length - 1, Math.round(continuousIdx)));

      // Restore transitions so the snap glides on both pager and highlight.
      // For the pager, React will overwrite the transform in its next render
      // via the JSX inline style — same target value, no jump.
      if (pager) {
        // eslint-disable-next-line react-hooks/immutability
        pager.style.transition = "";
      }
      if (highlight) {
        highlight.style.transition = "transform 0.22s cubic-bezier(0.2, 0, 0, 1)";
        highlight.style.transform = `translateX(${snappedIdx * 100}%)`;
      }

      const target = filters[snappedIdx];
      if (target && target.value !== activeFilter) {
        onChange(target.value);
      } else if (pager) {
        // Same filter — no React update will fire, so write the snap transform
        // directly so the page settles back to its rest position.
        pager.style.transform = `translateX(${-snappedIdx * slotPct}%)`;
      }
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <div
        ref={trayElementRef}
        className="fixed left-0 right-0 sm:hidden overflow-hidden"
        style={{
          bottom: `calc(${bottomOffsetPx}px + env(safe-area-inset-bottom, 0px))`,
          height: TRAY_HEIGHT,
          background: "var(--color-header)",
          borderTop: "1px solid var(--color-border-soft)",
          borderBottom: "1px solid var(--color-border-hairline)",
          zIndex: 34,
          transform: open
            ? (dragY > 0 ? `translateY(${dragY}px)` : "translateY(0)")
            : `translateY(calc(100% + 8px))`,
          transition: dragY > 0 ? "none" : "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
          willChange: "transform",
          pointerEvents: open ? "auto" : "none",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        aria-hidden={!open}
      >
        <div className="h-full flex items-stretch px-2 relative">
          {/* Moving highlight that slides between pill positions. Direct DOM
              writes during a swipe drive its transform 1:1 with the pager;
              React-driven activeFilter changes (taps, cycle gesture) animate
              via CSS transition. Sized to one pill slot (1/N of the strip
              content area), so translateX(N * 100%) lands on the Nth pill. */}
          <div
            ref={highlightRef}
            aria-hidden
            style={{
              position: "absolute",
              top: 3,
              bottom: 3,
              left: 8,
              width: `calc((100% - 16px) / ${filters.length})`,
              background: "var(--color-active-highlight-bg)",
              border: "1px solid var(--color-active-highlight-border)",
              borderRadius: 3,
              transform: `translateX(${activeIdx * 100}%)`,
              transition: "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
              pointerEvents: "none",
              willChange: "transform",
            }}
          />
          {filters.map((f) => {
            const isActive = f.value === activeFilter;
            const count = getCount?.(f.value);
            const dot = badgeColor?.(f.value) ?? null;
            return (
              <button
                key={f.value}
                onClick={() => { onChange(f.value); }}
                role="menuitemradio"
                aria-checked={isActive}
                className="flex items-center justify-center cursor-pointer"
                style={{
                  flex: "1 1 0",
                  minWidth: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                  background: "transparent",
                  border: "none",
                  color: isActive ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                  fontSize: "10px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: isActive ? 700 : 500,
                  padding: "0 6px",
                  position: "relative",
                  zIndex: 1,
                  WebkitTapHighlightColor: "transparent",
                  transition: "color 0.18s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {dot && (
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: dot, flexShrink: 0 }} />
                )}
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{f.shortLabel}</span>
                {count !== undefined && (
                  <span style={{ opacity: 0.6, fontWeight: 500, flexShrink: 0 }}>{count}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>,
    document.body
  );
}
