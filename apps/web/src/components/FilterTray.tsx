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
  // Tap on handle to toggle.
  onToggle?: () => void;
  getCount?: (value: string) => number;
  badgeColor?: (value: string) => string | null;
  // Distance from screen bottom to the tray.
  bottomOffsetPx?: number;
  // Page-content pager driven 1:1 by horizontal tray swipes.
  pagerRef?: React.RefObject<HTMLElement | null>;
  // Tray root element ref.
  trayElementRef?: React.RefObject<HTMLDivElement | null>;
};

const TRAY_HEIGHT = 28;
const TRAY_HEIGHT_TOTAL = TRAY_HEIGHT + 8; // matches closed translateY gap
const DISMISS_DRAG_PX = 50;
const AXIS_DEADZONE_PX = 8;
const SWIPE_CYCLE_THRESHOLD = 36;

export default function FilterTray({
  open, filters, activeFilter, onChange, onClose, onToggle, getCount, badgeColor,
  bottomOffsetPx = 50, pagerRef, trayElementRef,
}: Props) {
  const [dragY, setDragY] = useState(0);
  const [cycleHint, setCycleHint] = useState<string | null>(null);
  const swipeRef = useRef<{ startX: number; startY: number; startIdx: number; locked: "v" | "h" | null } | null>(null);
  const handleDragRef = useRef<{ startX: number; startY: number; startedOpen: boolean; locked: "v" | "h" | null; moved: boolean } | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const highlightRef = useRef<HTMLDivElement | null>(null);
  const activeIdx = Math.max(0, filters.findIndex((f) => f.value === activeFilter));

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!cycleHint) return;
    const t = window.setTimeout(() => setCycleHint(null), 900);
    return () => window.clearTimeout(t);
  }, [cycleHint]);

  function cycleFilter(direction: -1 | 1) {
    const idx = filters.findIndex((f) => f.value === activeFilter);
    if (idx < 0) return;
    const next = Math.max(0, Math.min(filters.length - 1, idx + direction));
    if (next === idx) return;
    onChange(filters[next].value);
    setCycleHint(filters[next].label);
  }

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
    if (s.locked === null) {
      if (Math.abs(dx) < AXIS_DEADZONE_PX && Math.abs(dy) < AXIS_DEADZONE_PX) return;
      s.locked = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
    }
    if (s.locked === "v" && dy > 0) {
      setDragY(dy);
      return;
    }
    if (s.locked === "h" && filters.length > 1) {
      const viewportW = window.innerWidth || 1;
      const pillWidth = (viewportW - 16) / filters.length;
      const deltaIdx = dx / pillWidth;
      const continuous = Math.max(0, Math.min(filters.length - 1, s.startIdx + deltaIdx));
      const slotPct = 100 / filters.length;

      const pager = pagerRef?.current;
      if (pager) {
        // eslint-disable-next-line react-hooks/immutability
        pager.style.transition = "none";
        pager.style.transform = `translateX(${-continuous * slotPct}%)`;
      }

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
        pager.style.transform = `translateX(${-snappedIdx * slotPct}%)`;
      }
    }
  }

  // Handle gestures: tap toggles, V-drag opens/closes, H-swipe cycles filter.
  function onHandleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    handleDragRef.current = {
      startX: t.clientX, startY: t.clientY,
      startedOpen: open, locked: null, moved: false,
    };
  }
  function onHandleTouchMove(e: React.TouchEvent) {
    const d = handleDragRef.current;
    if (!d) return;
    const t = e.touches[0];
    const dx = t.clientX - d.startX;
    const dy = t.clientY - d.startY;

    if (d.locked === null) {
      if (Math.abs(dx) < AXIS_DEADZONE_PX && Math.abs(dy) < AXIS_DEADZONE_PX) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) >= SWIPE_CYCLE_THRESHOLD) {
          d.locked = "h";
          d.moved = true;
          cycleFilter(dx < 0 ? 1 : -1);
        }
        return;
      }
      d.locked = "v";
      d.moved = true;
    }

    if (d.locked === "v") {
      const tray = trayElementRef?.current;
      const handle = handleRef.current;
      if (!tray || !handle) return;
      const baseY = d.startedOpen ? 0 : TRAY_HEIGHT_TOTAL;
      const targetY = Math.max(0, Math.min(TRAY_HEIGHT_TOTAL, baseY + dy));
      // eslint-disable-next-line react-hooks/immutability
      tray.style.transition = "none";
      tray.style.transform = `translateY(${targetY}px)`;
      const progress = 1 - targetY / TRAY_HEIGHT_TOTAL;
      const handleBottom = bottomOffsetPx + TRAY_HEIGHT * progress;
      handle.style.transition = "none";
      handle.style.bottom = `calc(${handleBottom}px + env(safe-area-inset-bottom, 0px))`;
    }
  }
  function onHandleTouchEnd() {
    const d = handleDragRef.current;
    handleDragRef.current = null;
    if (!d) return;

    if (d.locked === "v") {
      const tray = trayElementRef?.current;
      const handle = handleRef.current;
      if (!tray || !handle) return;
      const match = tray.style.transform.match(/translateY\((-?[\d.]+)px\)/);
      const currentY = match ? parseFloat(match[1]) : 0;
      const willOpen = currentY < TRAY_HEIGHT_TOTAL / 2;
      // eslint-disable-next-line react-hooks/immutability
      tray.style.transition = "transform 0.22s cubic-bezier(0.2, 0, 0, 1)";
      tray.style.transform = willOpen ? "translateY(0)" : `translateY(calc(100% + 8px))`;
      handle.style.transition = "bottom 0.22s cubic-bezier(0.2, 0, 0, 1)";
      handle.style.bottom = `calc(${bottomOffsetPx + (willOpen ? TRAY_HEIGHT : 0)}px + env(safe-area-inset-bottom, 0px))`;
      if (willOpen !== open) onToggle?.();
    }
  }

  function onHandleClick() {
    // Suppress synthesized click after a drag.
    if (handleDragRef.current?.moved) return;
    onToggle?.();
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      <button
        ref={handleRef}
        type="button"
        data-edge-drawer-block
        data-edge-drawer-block-row
        onClick={onHandleClick}
        onTouchStart={onHandleTouchStart}
        onTouchMove={onHandleTouchMove}
        onTouchEnd={onHandleTouchEnd}
        onTouchCancel={onHandleTouchEnd}
        aria-label={open ? "Close filter" : "Open filter"}
        className="sm:hidden"
        style={{
          position: "fixed",
          left: "50%",
          bottom: open
            ? `calc(${bottomOffsetPx + TRAY_HEIGHT}px + env(safe-area-inset-bottom, 0px))`
            : `calc(${bottomOffsetPx}px + env(safe-area-inset-bottom, 0px))`,
          transform: "translateX(-50%)",
          padding: "14px 30px",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          touchAction: "none",
          WebkitTapHighlightColor: "transparent",
          zIndex: 35,
          transition: "bottom 0.22s cubic-bezier(0.2, 0, 0, 1)",
        }}
      >
        {cycleHint && (
          <div
            aria-live="polite"
            style={{
              position: "absolute",
              bottom: "calc(100% + 4px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--color-surface)",
              color: "var(--color-active-highlight)",
              border: "1px solid var(--color-active-highlight-border)",
              borderRadius: 3,
              padding: "4px 10px",
              fontSize: "10px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontWeight: 600,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
              pointerEvents: "none",
              animation: "filter-cycle-hint 0.9s ease-out forwards",
            }}
          >
            {cycleHint}
          </div>
        )}
        <span
          aria-hidden
          style={{
            display: "block",
            width: 60, height: 3,
            borderRadius: 1.5,
            background: open ? "var(--color-active-highlight)" : "var(--color-border)",
            transition: "background 0.18s",
          }}
        />
      </button>

      <div
        ref={trayElementRef}
        data-edge-drawer-block
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
            : "translateY(calc(100% + 8px))",
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
