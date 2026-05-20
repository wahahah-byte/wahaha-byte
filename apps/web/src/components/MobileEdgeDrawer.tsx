"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { usePoints } from "@/context/PointsContext";
import { useTheme } from "@/context/ThemeContext";
import { usersApi } from "@/lib/api/users";
import { REGULAR_CAP, RECURRING_CAP } from "@/lib/constants";

const ITEMS = [
  { href: "/", label: "To Do" },
  { href: "/recurring", label: "Routines" },
  { href: "/archive", label: "Archive" },
] as const;

const DRAWER_WIDTH = 220;      // wide enough for icon + uppercase label side-by-side
const COMMIT_FRACTION = 0.5;   // drag must cross this fraction of DRAWER_WIDTH to commit
const AXIS_DEADZONE = 8;

export default function MobileEdgeDrawer() {
  const pathname = usePathname();
  const {
    username, profilePictureUrl, balance, unsubmittedPoints, dailySubmitted, recurringSubmittedToday,
    setBalance, setUsername, setProfilePictureUrl, setDailySubmitted, setRecurringSubmittedToday,
  } = usePoints();
  const { theme, toggleTheme } = useTheme();
  const [hasToken, setHasToken] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  useEffect(() => {
    const token = !!localStorage.getItem("auth_token");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasToken(token);
    if (!token) return;
    // Drawer hydrates points context on route changes (no AuthHeader on mobile).
    usersApi.getMe().then(({ data }) => {
      if (!data) return;
      setBalance(data.currentBalance);
      setUsername(data.username);
      setProfilePictureUrl(data.profilePictureUrl ?? null);
      setDailySubmitted(data.pointsSubmittedToday ?? 0);
      setRecurringSubmittedToday(data.recurringPointsSubmittedToday ?? 0);
    });
  }, [pathname, setBalance, setUsername, setProfilePictureUrl, setDailySubmitted, setRecurringSubmittedToday]);

  // Close account popup whenever drawer closes.
  useEffect(() => {
    if (!open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAccountMenuOpen(false);
    }
  }, [open]);
  const [dragX, setDragX] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  // Desktop replaces drawer with DesktopSidebar.
  const [isDesktop, setIsDesktop] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startedOpen: boolean; locked: "h" | "v" | null } | null>(null);

  // Defer portal until after hydration to avoid SSR mismatch.
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

  // Escape closes.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // Document-level right-swipe to open; opted out via data-edge-drawer-block.
  useEffect(() => {
    if (open || isDesktop) return;
    const dragXRef: { current: number | null } = { current: null };

    function onStart(e: TouchEvent) {
      if (e.touches.length > 1) return;
      const t = e.touches[0];
      const target = e.target as Element | null;
      // Revealed row owns its right-swipe.
      if (target?.closest('.task-row-wrapper[data-revealed="true"]')) return;
      // Action bar, tray, modals opt-out.
      if (target?.closest("[data-edge-drawer-block]")) return;
      // Block entire horizontal band for narrow row-blockers (e.g. tray handle).
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
        // Open gesture is right-swipe only.
        if (Math.abs(dx) > Math.abs(dy) && dx > 0) {
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
        // Hide popup at drag start so it doesn't translate with the panel.
        setAccountMenuOpen(false);
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

    // Snap based on threshold crossing.
    const openIfPast = -DRAWER_WIDTH + DRAWER_WIDTH * COMMIT_FRACTION;
    const closeIfBefore = -DRAWER_WIDTH * COMMIT_FRACTION;
    if (d.startedOpen) {
      if (final < closeIfBefore) setOpen(false);
    } else {
      if (final > openIfPast) setOpen(true);
    }
  }, [dragX]);

  if (!mounted) return null;
  // Desktop replaces this with DesktopSidebar.
  if (isDesktop) return null;
  if (pathname === "/login" || pathname === "/register") return null;

  // Drawer left-edge position; interpolated during drag.
  const drawerX = dragX !== null ? dragX : (open ? 0 : -DRAWER_WIDTH);
  const visibleFraction = (drawerX + DRAWER_WIDTH) / DRAWER_WIDTH;
  const isActive = open || dragX !== null;

  return createPortal(
    <>
      {/* Backdrop; tap or swipe-left closes */}
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

      {/* Drawer panel; footer pinned to bottom via marginTop:auto */}
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
          paddingTop: `calc(12px + env(safe-area-inset-top, 0px))`,
          paddingBottom: `calc(8px + env(safe-area-inset-bottom, 0px))`,
          overflow: "hidden",
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        {/* Footer: nav + points + caps + user identity */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column" }}>
          {!hasToken && (() => {
            const active = pathname === "/avatar";
            return (
              <Link
                href="/avatar"
                onClick={() => setOpen(false)}
                className="flex items-center"
                style={{
                  height: 44,
                  gap: 12,
                  padding: "0 16px",
                  color: active ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                  background: active ? "var(--color-active-highlight-bg)" : "transparent",
                  borderLeft: `2px solid ${active ? "var(--color-active-highlight)" : "transparent"}`,
                  textDecoration: "none",
                  lineHeight: 1,
                  transition: "background 0.18s, color 0.18s",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, flexShrink: 0 }}>
                  <AvatarIcon />
                </span>
                <span style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: active ? 600 : 500 }}>
                  Avatar
                </span>
              </Link>
            );
          })()}
          {ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center"
                style={{
                  height: 44,
                  gap: 12,
                  padding: "0 16px",
                  color: active ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                  background: active ? "var(--color-active-highlight-bg)" : "transparent",
                  borderLeft: `2px solid ${active ? "var(--color-active-highlight)" : "transparent"}`,
                  textDecoration: "none",
                  lineHeight: 1,
                  transition: "background 0.18s, color 0.18s",
                }}
              >
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 18, flexShrink: 0 }}>
                  {item.label === "To Do" ? <TasksIcon />
                    : item.label === "Routines" ? <RecurringIcon />
                    : <ArchiveIcon />}
                </span>
                <span style={{ fontSize: "11px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: active ? 600 : 500 }}>
                  {item.label}
                </span>
              </Link>
            );
          })}

          {hasToken && balance !== null && (() => {
            const regSubmitted = Math.min(dailySubmitted - recurringSubmittedToday, REGULAR_CAP);
            const recSubmitted = Math.min(recurringSubmittedToday, RECURRING_CAP);
            const regPct = Math.round((regSubmitted / REGULAR_CAP) * 100);
            const recPct = Math.round((recSubmitted / RECURRING_CAP) * 100);
            const regCapped = regSubmitted >= REGULAR_CAP;
            const recCapped = recSubmitted >= RECURRING_CAP;
            return (
              <div style={{ padding: "12px 14px 10px", borderTop: "1px solid var(--color-border-soft)", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 9, color: "var(--color-fg-subtle)", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600 }}>Points</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--color-fg)" }}>
                    {balance.toLocaleString()}
                    {unsubmittedPoints > 0 && (
                      <span style={{ color: "var(--color-warning)", marginLeft: 6 }}>
                        +{unsubmittedPoints.toLocaleString()}
                      </span>
                    )}
                  </span>
                </div>
                <CapBar label="Regular" cur={regSubmitted} cap={REGULAR_CAP} pct={regPct} capped={regCapped} colorVar="--color-active-highlight" />
                <CapBar label="Routines" cur={recSubmitted} cap={RECURRING_CAP} pct={recPct} capped={recCapped} colorVar="--color-active-highlight-alt" />
              </div>
            );
          })()}

          {/* User identity row with account menu popup */}
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 14px",
              borderTop: "1px solid var(--color-border-soft)",
            }}
          >
            <button
              type="button"
              onClick={() => setAccountMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={accountMenuOpen}
              aria-label="Account menu"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                overflow: "hidden",
                background: "#3e3f42",
                border: "1px solid #555659",
                color: "#ddd",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {profilePictureUrl ? (
                <Image src={profilePictureUrl} alt="" width={28} height={28} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} unoptimized />
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.8" />
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="currentColor" opacity="0.5" />
                </svg>
              )}
            </button>
            <span
              style={{
                flex: 1,
                minWidth: 0,
                color: "var(--color-fg)",
                fontSize: 12,
                fontWeight: 500,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {username ?? "Guest"}
            </span>
            <Link
              href="/settings"
              aria-label="Settings"
              onClick={() => setOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                color: "var(--color-fg-muted)",
                flexShrink: 0,
              }}
            >
              <SettingsIcon />
            </Link>

            {accountMenuOpen && (
              <>
                {/* Click-outside catcher */}
                <div
                  onClick={() => setAccountMenuOpen(false)}
                  style={{ position: "fixed", inset: 0, zIndex: 41 }}
                />
                <div
                  role="menu"
                  style={{
                    position: "absolute",
                    left: 10,
                    right: 10,
                    bottom: "calc(100% + 4px)",
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 4,
                    boxShadow: "var(--shadow-popover)",
                    overflow: "hidden",
                    zIndex: 42,
                  }}
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { toggleTheme(); }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "transparent",
                      border: "none",
                      color: "var(--color-fg-muted)",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span>Theme</span>
                    <span style={{ color: "var(--color-active-highlight)", fontWeight: 600 }}>
                      {theme === "dark" ? "Dark" : "Light"}
                    </span>
                  </button>
                  <Link
                    href="/avatar"
                    role="menuitem"
                    onClick={() => { setAccountMenuOpen(false); setOpen(false); }}
                    style={{
                      width: "100%",
                      display: "block",
                      padding: "10px 14px",
                      borderTop: "1px solid var(--color-border-soft)",
                      color: "var(--color-fg-muted)",
                      fontSize: 11,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    Avatar
                  </Link>
                  {hasToken && (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setAccountMenuOpen(false);
                        setOpen(false);
                        localStorage.removeItem("auth_token");
                        window.location.replace("/");
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        padding: "10px 14px",
                        background: "transparent",
                        border: "none",
                        borderTop: "1px solid var(--color-border-soft)",
                        color: "var(--color-fg-muted)",
                        fontSize: 11,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                        cursor: "pointer",
                        textAlign: "left",
                      }}
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
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
function AvatarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}
function CapBar({ label, cur, cap, pct, capped, colorVar }: { label: string; cur: number; cap: number; pct: number; capped: boolean; colorVar: string }) {
  const fill = capped ? "var(--color-success)" : pct >= 75 ? "var(--color-warning)" : `var(${colorVar})`;
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 9, color: "var(--color-fg-subtle)", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          {label}
        </span>
        <span style={{ fontSize: 9, color: capped ? "var(--color-success)" : "var(--color-fg-muted)", letterSpacing: "0.05em", fontWeight: 600 }}>
          {cur} / {cap}
        </span>
      </div>
      <div style={{ width: "100%", height: 3, borderRadius: 999, overflow: "hidden", background: "var(--color-track)" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: fill, transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

function SettingsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 8.6a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03Z" />
    </svg>
  );
}
