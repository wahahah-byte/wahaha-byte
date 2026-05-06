"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  /** Distance from screen bottom to the tray. Defaults match MobileActionBar (56px) + MobileNav (56px). */
  bottomOffsetPx?: number;
  /**
   * Optional ref to a horizontally-translatable pager element. The tray will mirror
   * its scroll position to this element's `transform`, so the page-content pager
   * follows the user's thumb 1:1 with the pill strip.
   *
   * Convention: the pager's inner element should have width = `${filters.length * 100}%`
   * and each child page width = `${100 / filters.length}%`. The tray writes
   * `transform: translateX(-{progress * (100/filters.length)}%)`.
   */
  pagerRef?: React.RefObject<HTMLElement | null>;
};

const TRAY_HEIGHT = 56;
const PILL_FLEX_BASIS = "60%";
const SCROLL_SETTLE_MS = 120;
const DISMISS_DRAG_PX = 50;

export default function FilterTray({
  open, filters, activeFilter, onChange, onClose, getCount, badgeColor,
  bottomOffsetPx = 112, pagerRef,
}: Props) {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const settleTimerRef = useRef<number | null>(null);
  const suppressNextSettleRef = useRef(false);
  const [dragY, setDragY] = useState(0);
  const swipeRef = useRef<{ startX: number; startY: number; locked: "v" | "h" | null } | null>(null);

  // Center the active pill when the tray opens, or when activeFilter changes externally.
  useEffect(() => {
    if (!open) return;
    const idx = filters.findIndex((f) => f.value === activeFilter);
    if (idx < 0) return;
    const strip = stripRef.current;
    const pill = pillRefs.current[idx];
    if (!strip || !pill) return;
    requestAnimationFrame(() => {
      const target = pill.offsetLeft - (strip.clientWidth - pill.clientWidth) / 2;
      // Suppress the next scroll-settle so the auto-center doesn't loop into onChange.
      suppressNextSettleRef.current = true;
      strip.scrollLeft = target;
    });
  }, [open, activeFilter, filters]);

  const handleScroll = useCallback(() => {
    const strip = stripRef.current;
    if (strip) {
      // Mirror scroll position into the page-content pager via direct DOM write
      // (no React state, fires at scroll-event rate ~60fps).
      const pager = pagerRef?.current;
      if (pager && filters.length > 1) {
        const firstPill = pillRefs.current[0];
        const lastPill = pillRefs.current[filters.length - 1];
        if (firstPill && lastPill) {
          const firstCenter = firstPill.offsetLeft + firstPill.clientWidth / 2;
          const lastCenter = lastPill.offsetLeft + lastPill.clientWidth / 2;
          const stripCenter = strip.scrollLeft + strip.clientWidth / 2;
          const span = lastCenter - firstCenter;
          const rawProgress = span > 0 ? (stripCenter - firstCenter) / span : 0;
          const progress = Math.max(0, Math.min(1, rawProgress)) * (filters.length - 1);
          const pct = -(progress * (100 / filters.length));
          // Direct DOM writes are intentional — state updates at 60fps would
          // tank scroll perf. The ref transports a DOM element we drive imperatively.
          // eslint-disable-next-line react-hooks/immutability
          pager.style.transition = "none";
          pager.style.transform = `translateX(${pct}%)`;
        }
      }
    }

    if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    settleTimerRef.current = window.setTimeout(() => {
      if (suppressNextSettleRef.current) { suppressNextSettleRef.current = false; return; }
      const s = stripRef.current;
      if (!s) return;
      const centerX = s.scrollLeft + s.clientWidth / 2;
      let bestIdx = -1;
      let bestDist = Infinity;
      pillRefs.current.forEach((pill, i) => {
        if (!pill) return;
        const pillCenter = pill.offsetLeft + pill.clientWidth / 2;
        const dist = Math.abs(pillCenter - centerX);
        if (dist < bestDist) { bestDist = dist; bestIdx = i; }
      });
      if (bestIdx >= 0) {
        const target = filters[bestIdx];
        if (target && target.value !== activeFilter) onChange(target.value);
      }
      // Restore CSS transition so subsequent activeFilter changes (e.g. cycle gesture
      // or chip tap) animate smoothly.
      const pager = pagerRef?.current;
      if (pager) pager.style.transition = "";
    }, SCROLL_SETTLE_MS);
  }, [filters, activeFilter, onChange, pagerRef]);

  function selectPill(idx: number) {
    const strip = stripRef.current;
    const pill = pillRefs.current[idx];
    if (!strip || !pill) return;
    const target = pill.offsetLeft - (strip.clientWidth - pill.clientWidth) / 2;
    strip.scrollTo({ left: target, behavior: "smooth" });
    // The scroll-settle detector will commit onChange.
  }

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
    // Axis lock: whichever axis crosses the deadzone first wins. Horizontal
    // wins → leave the dismiss handler dormant so the native pill scroll runs
    // unobstructed even if the finger drifts vertically.
    if (s.locked === null) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      s.locked = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }
    if (s.locked === "v" && dy > 0) setDragY(dy);
  }
  function onTouchEnd() {
    const s = swipeRef.current;
    swipeRef.current = null;
    if (!s) return;
    const final = dragY;
    setDragY(0);
    if (s.locked === "v" && final > DISMISS_DRAG_PX) onClose();
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Backdrop — taps outside the tray dismiss it. Sits below the action bar (which is z-35). */}
      <div
        className="fixed inset-0 sm:hidden"
        style={{
          zIndex: 33,
          background: "transparent",
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
      />
      <div
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
        <div
          ref={stripRef}
          onScroll={handleScroll}
          className="h-full flex items-center filter-tray-strip"
          style={{
            overflowX: "auto",
            overflowY: "hidden",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            paddingLeft: "20%",
            paddingRight: "20%",
            gap: 8,
          }}
        >
          {filters.map((f, i) => {
            const isActive = f.value === activeFilter;
            const count = getCount?.(f.value);
            const dot = badgeColor?.(f.value) ?? null;
            return (
              <div
                key={f.value}
                ref={(el) => { pillRefs.current[i] = el; }}
                onClick={() => selectPill(i)}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                style={{
                  flex: `0 0 ${PILL_FLEX_BASIS}`,
                  scrollSnapAlign: "center",
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  background: isActive ? "var(--color-active-highlight-bg)" : "transparent",
                  border: `1px solid ${isActive ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                  borderRadius: 4,
                  color: isActive ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                  fontSize: "11px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  transition: "background 0.18s, color 0.18s, border-color 0.18s, transform 0.18s",
                  transform: isActive ? "scale(1)" : "scale(0.96)",
                  WebkitTapHighlightColor: "transparent",
                  userSelect: "none",
                }}
              >
                {dot && (
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: dot }} />
                )}
                <span>{f.label}</span>
                {count !== undefined && (
                  <span style={{ opacity: 0.6, fontWeight: 500 }}>{count}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>,
    document.body
  );
}
