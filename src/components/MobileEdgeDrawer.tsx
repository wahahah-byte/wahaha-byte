"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";

const ITEMS = [
  { href: "/", label: "Tasks" },
  { href: "/recurring", label: "Routines" },
  { href: "/archive", label: "Archive" },
] as const;

const DRAWER_WIDTH = 70;       // wide enough to fit "Recurring" comfortably
const COMMIT_FRACTION = 0.5;   // drag must cross this fraction of DRAWER_WIDTH to commit
const AXIS_DEADZONE = 8;

export default function MobileEdgeDrawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dragX, setDragX] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  // Track viewport so we can disable the drawer + its document-level swipe
  // listeners on desktop (>=1024px), where DesktopSidebar replaces it.
  const [isDesktop, setIsDesktop] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startedOpen: boolean; locked: "h" | "v" | null } | null>(null);

  // Defer the portal until after hydration so server (no DOM) and first client
  // render both return null — otherwise React sees a mismatch.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 880px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Escape closes (mostly defensive — mobile-only component).
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while the drawer is open so the page underneath doesn't scroll.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Document-level open gesture: when the drawer is closed, a horizontal swipe
  // that starts in the LEFT HALF of the viewport (and not over the task list
  // panel) opens the drawer. The exclusion lets task rows keep their own
  // swipe-to-reveal-actions gesture without interference.
  useEffect(() => {
    if (open || isDesktop) return;
    const dragXRef: { current: number | null } = { current: null };

    function onStart(e: TouchEvent) {
      if (e.touches.length > 1) return;
      const t = e.touches[0];
      if (t.clientX > window.innerWidth / 2) return;
      const target = e.target as Element | null;
      if (target?.closest(".task-list-panel")) return;
      // Bottom action bar, filter tray + handle, and any open modal mark
      // themselves with this attribute so their gestures aren't hijacked.
      if (target?.closest("[data-edge-drawer-block]")) return;
      // Some elements (the FilterTray handle pill) are visually narrow but
      // sit in a row a user is likely reaching for — block the entire
      // horizontal band at that Y.
      const rowBlockers = document.querySelectorAll("[data-edge-drawer-block-row]");
      for (let i = 0; i < rowBlockers.length; i++) {
        const r = rowBlockers[i].getBoundingClientRect();
        if (t.clientY >= r.top && t.clientY <= r.bottom) return;
      }
      dragRef.current = {
        startX: t.clientX, startY: t.clientY,
        startedOpen: false, locked: null,
      };
      dragXRef.current = null;
    }

    function onMove(e: TouchEvent) {
      const d = dragRef.current;
      if (!d) return;
      const t = e.touches[0];
      const dx = t.clientX - d.startX;
      const dy = t.clientY - d.startY;
      if (d.locked === null) {
        if (Math.abs(dx) < AXIS_DEADZONE && Math.abs(dy) < AXIS_DEADZONE) return;
        if (Math.abs(dx) > Math.abs(dy)) {
          d.locked = "h";
        } else {
          d.locked = "v";
          dragRef.current = null;
          return;
        }
      }
      if (d.locked === "h") {
        const targetX = Math.max(-DRAWER_WIDTH, Math.min(0, -DRAWER_WIDTH + dx));
        dragXRef.current = targetX;
        setDragX(targetX);
      }
    }

    function onEnd() {
      const d = dragRef.current;
      if (!d) return;
      dragRef.current = null;
      const final = dragXRef.current;
      dragXRef.current = null;
      setDragX(null);
      if (d.locked !== "h" || final === null) return;
      const openIfPast = -DRAWER_WIDTH + DRAWER_WIDTH * COMMIT_FRACTION;
      if (final > openIfPast) setOpen(true);
    }

    document.addEventListener("touchstart", onStart, { passive: true });
    document.addEventListener("touchmove", onMove, { passive: true });
    document.addEventListener("touchend", onEnd);
    document.addEventListener("touchcancel", onEnd);
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend", onEnd);
      document.removeEventListener("touchcancel", onEnd);
    };
  }, [open, isDesktop]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    dragRef.current = {
      startX: t.clientX, startY: t.clientY,
      startedOpen: open, locked: null,
    };
  }, [open]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const t = e.touches[0];
    const dx = t.clientX - d.startX;
    const dy = t.clientY - d.startY;

    if (d.locked === null) {
      if (Math.abs(dx) < AXIS_DEADZONE && Math.abs(dy) < AXIS_DEADZONE) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        d.locked = "h";
      } else {
        d.locked = "v";
        dragRef.current = null;
        return;
      }
    }

    if (d.locked === "h") {
      const baseX = d.startedOpen ? 0 : -DRAWER_WIDTH;
      const targetX = Math.max(-DRAWER_WIDTH, Math.min(0, baseX + dx));
      setDragX(targetX);
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    const d = dragRef.current;
    dragRef.current = null;
    if (!d) return;
    const final = dragX;
    setDragX(null);
    if (d.locked !== "h" || final === null) return;

    // Snap based on how far past the threshold we've dragged.
    const openIfPast = -DRAWER_WIDTH + DRAWER_WIDTH * COMMIT_FRACTION;
    const closeIfBefore = -DRAWER_WIDTH * COMMIT_FRACTION;
    if (d.startedOpen) {
      // open → close requires dragging left past the close threshold
      if (final < closeIfBefore) setOpen(false);
    } else {
      // closed → open requires dragging right past the open threshold
      if (final > openIfPast) setOpen(true);
    }
  }, [dragX]);

  if (!mounted) return null;
  // On desktop the static DesktopSidebar replaces this drawer entirely.
  if (isDesktop) return null;
  if (pathname === "/login" || pathname === "/register") return null;

  // Where the drawer's left edge sits — interpolated during a drag, snapped otherwise.
  const drawerX = dragX !== null ? dragX : (open ? 0 : -DRAWER_WIDTH);
  const visibleFraction = (drawerX + DRAWER_WIDTH) / DRAWER_WIDTH;
  const isActive = open || dragX !== null;

  return createPortal(
    <>
      {/* Backdrop — rendered while open OR mid-drag, fades with progress.
          Tap closes; swiping left from here also closes (same drag handlers as the panel). */}
      {isActive && (
        <div
          aria-hidden
          className="sm:hidden"
          onClick={() => setOpen(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
          style={{
            position: "fixed",
            inset: 0,
            background: `rgba(0, 0, 0, ${0.4 * visibleFraction})`,
            transition: dragX !== null ? "none" : "background 0.22s",
            zIndex: 39,
          }}
        />
      )}

      {/* Drawer panel — narrow vertical rail anchored to the left edge,
          buttons clustered at the bottom. */}
      <nav
        aria-label="Page navigation"
        className="sm:hidden"
        style={{
          position: "fixed",
          top: 0,
          bottom: 0,
          left: 0,
          width: DRAWER_WIDTH,
          background: "var(--color-header)",
          borderRight: "1px solid var(--color-border-soft)",
          boxShadow: isActive ? "2px 0 14px rgba(0, 0, 0, 0.25)" : "none",
          transform: `translateX(${drawerX}px)`,
          transition: dragX !== null ? "none" : "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",                              // buttons cluster at the bottom
          paddingBottom: `calc(8px + env(safe-area-inset-bottom, 0px))`,
          overflow: "hidden",                                      // clip any text bleed when closed
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex flex-col items-center justify-center gap-0.5"
              style={{
                height: 50,
                color: active ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                background: active ? "var(--color-active-highlight-bg)" : "transparent",
                borderLeft: `2px solid ${active ? "var(--color-active-highlight)" : "transparent"}`,
                textDecoration: "none",
                lineHeight: 1,
                transition: "background 0.18s, color 0.18s",
              }}
            >
              {item.label === "Tasks" ? <TasksIcon /> : item.label === "Routines" ? <RecurringIcon /> : <ArchiveIcon />}
              <span style={{ fontSize: "8px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: active ? 600 : 500 }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>,
    document.body
  );
}

function TasksIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="6" x2="20" y2="6" />
      <line x1="9" y1="12" x2="20" y2="12" />
      <line x1="9" y1="18" x2="20" y2="18" />
      <polyline points="3,6 4,7 6,5" />
      <polyline points="3,12 4,13 6,11" />
      <polyline points="3,18 4,19 6,17" />
    </svg>
  );
}
function RecurringIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <polyline points="21 4 21 10 15 10" />
    </svg>
  );
}
function ArchiveIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}
