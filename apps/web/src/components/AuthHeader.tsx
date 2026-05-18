"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usersApi } from "@/lib/api/users";
import { usePoints } from "@/context/PointsContext";
import { useTheme } from "@/context/ThemeContext";
import { REGULAR_CAP, RECURRING_CAP } from "@/lib/constants";
import ThemeToggle from "@/components/ThemeToggle";

interface Props {
  variant?: "header" | "sidebar";
}

export default function AuthHeader({ variant = "header" }: Props = {}) {
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const {
    balance, username, profilePictureUrl, unsubmittedPoints, recurringSubmittedToday, dailySubmitted,
    setBalance, setUsername, setProfilePictureUrl, setRecurringSubmittedToday, setDailySubmitted,
  } = usePoints();

  useEffect(() => {
    setIsMounted(true);
    const token = !!localStorage.getItem("auth_token");
    setHasToken(token);
    if (!token) return;
    usersApi.getMe().then(({ data }) => {
      if (data) {
        setBalance(data.currentBalance);
        setUsername(data.username);
        setProfilePictureUrl(data.profilePictureUrl ?? null);
        setDailySubmitted(data.pointsSubmittedToday ?? 0);
        setRecurringSubmittedToday(data.recurringPointsSubmittedToday ?? 0);
      }
    });
  }, [pathname]);

  // Always render the theme toggle, even before mount or when unauthenticated.
  // Authenticated users get the toggle inside the avatar dropdown instead.
  if (!isMounted || !hasToken) return <ThemeToggle />;

  const balanceChip = balance !== null && (
    <div className="flex items-center gap-1.5 shrink-0" data-coin-target="balance">
      <svg width="15" height="12" viewBox="0 0 12 10" fill="none" aria-hidden>
        <ellipse cx="6" cy="0.55" rx="2" ry="0.55" fill="var(--color-warning)" opacity="0.95" />
        <path d="M 4,0.55 A 2,0.55 0 0 0 8,0.55" stroke="var(--color-warning)" strokeWidth="0.25" fill="none" opacity="1" />
        {/* Tall stack — side rims (dark) and coin edges (bright) below the top */}
        <rect x="4" y="1.1" width="4" height="0.9" fill="var(--color-warning)" opacity="0.5" />
        <rect x="4" y="2" width="4" height="1" fill="var(--color-warning)" opacity="0.95" />
        <rect x="4" y="3" width="4" height="1" fill="var(--color-warning)" opacity="0.5" />
        <rect x="4" y="4" width="4" height="1" fill="var(--color-warning)" opacity="0.95" />
        <rect x="4" y="5" width="4" height="1" fill="var(--color-warning)" opacity="0.5" />
        <rect x="4" y="6" width="4" height="1" fill="var(--color-warning)" opacity="0.95" />
        <rect x="4" y="7" width="4" height="1" fill="var(--color-warning)" opacity="0.5" />

        {/* Short stack — top face (3D oval) */}
        <ellipse cx="10.5" cy="4.55" rx="1.5" ry="0.5" fill="var(--color-warning)" opacity="0.95" />
        <path d="M 9,4.55 A 1.5,0.5 0 0 0 12,4.55" stroke="var(--color-warning)" strokeWidth="0.22" fill="none" opacity="1" />
        <rect x="9" y="5.1" width="3" height="0.9" fill="var(--color-warning)" opacity="0.5" />
        <rect x="9" y="6" width="3" height="1" fill="var(--color-warning)" opacity="0.95" />
        <rect x="9" y="7" width="3" height="1" fill="var(--color-warning)" opacity="0.5" />

        {/* Loose coin A — front-left */}
        <ellipse cx="2.5" cy="8.4" rx="1.5" ry="0.4" fill="var(--color-warning)" opacity="0.95" />
        <rect x="1" y="8.5" width="3" height="0.5" fill="var(--color-warning)" opacity="0.5" />
        <rect x="0.5" y="9" width="4" height="1" fill="var(--color-warning)" opacity="0.5" />

        {/* Loose coin B — front-right */}
        <ellipse cx="9.5" cy="8.4" rx="2" ry="0.45" fill="var(--color-warning)" opacity="0.95" />
        <rect x="7.5" y="8.5" width="4" height="0.5" fill="var(--color-warning)" opacity="0.5" />
        <rect x="7" y="9" width="5" height="1" fill="var(--color-warning)" opacity="0.5" />
      </svg>
      <span style={{ color: "var(--color-warning)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
        {balance.toLocaleString()}
      </span>
    </div>
  );

  const unsubmittedChip = unsubmittedPoints > 0 && (
    <div className="flex items-center gap-1.5 shrink-0" title={`${unsubmittedPoints} unsubmitted pts`}>
      <svg width="9" height="11" viewBox="0 0 10 12" fill="none" shapeRendering="crispEdges">
        <path d="M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z" style={{ fill: "var(--color-warning)" }} opacity="0.85" />
        <rect x="4" y="5" width="2" height="2" style={{ fill: "var(--color-bg)" }} opacity="0.5" />
      </svg>
      <span style={{ color: "var(--color-warning)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
        +{unsubmittedPoints.toLocaleString()}
      </span>
    </div>
  );

  const avatarBtn = (
    <div className="relative shrink-0">
      <button
        onClick={() => setMenuOpen((o) => !o)}
        className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
        style={{ background: "#3e3f42", border: "1px solid #555659", color: "#ddd", padding: 0 }}
        aria-label="Account menu"
      >
        {profilePictureUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profilePictureUrl}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.8" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="currentColor" opacity="0.5" />
          </svg>
        )}
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
          <div
            className={`absolute z-20 min-w-[160px] overflow-hidden ${
              variant === "sidebar" ? "left-0 bottom-full mb-2" : "right-0 mt-2"
            }`}
            style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                borderRadius: "4px",
                boxShadow: "var(--shadow-popover)",
              }}
            >
              {(() => {
                const regSubmitted = Math.min(dailySubmitted - recurringSubmittedToday, REGULAR_CAP);
                const recSubmitted = Math.min(recurringSubmittedToday, RECURRING_CAP);
                const regPct = Math.round((regSubmitted / REGULAR_CAP) * 100);
                const recPct = Math.round((recSubmitted / RECURRING_CAP) * 100);
                const regCapped = regSubmitted >= REGULAR_CAP;
                const recCapped = recSubmitted >= RECURRING_CAP;
                return (
                  <div className="px-4 py-3 border-b flex flex-col gap-2.5" style={{ borderColor: "var(--color-border-soft)" }}>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                          Regular
                        </span>
                        <span style={{ color: regCapped ? "var(--color-success)" : "var(--color-fg-muted)", fontSize: "9px", letterSpacing: "0.05em", fontWeight: 600 }}>
                          {regSubmitted} / {REGULAR_CAP}
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "var(--color-track)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${regPct}%`, background: regCapped ? "var(--color-success)" : regPct >= 75 ? "var(--color-warning)" : "var(--color-active-highlight)" }}
                        />
                      </div>
                      {regCapped && (
                        <p style={{ color: "var(--color-success)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "4px" }}>
                          Cap reached
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                          Routines
                        </span>
                        <span style={{ color: recCapped ? "var(--color-success)" : "var(--color-fg-muted)", fontSize: "9px", letterSpacing: "0.05em", fontWeight: 600 }}>
                          {recSubmitted} / {RECURRING_CAP}
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "var(--color-track)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${recPct}%`, background: recCapped ? "var(--color-success)" : recPct >= 75 ? "var(--color-warning)" : "var(--color-active-highlight-alt)" }}
                        />
                      </div>
                      {recCapped && (
                        <p style={{ color: "var(--color-success)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "4px" }}>
                          Cap reached
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}
              <div className="py-1">
                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs tracking-wider uppercase cursor-pointer transition-colors"
                  style={{ color: "var(--color-fg-muted)", background: "transparent", border: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <span>Theme</span>
                  <span style={{ color: "var(--color-active-highlight)", fontWeight: 600, letterSpacing: "0.15em" }}>
                    {theme === "dark" ? "Dark" : "Light"}
                  </span>
                </button>
                <a
                  href="/avatar"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase cursor-pointer transition-colors block"
                  style={{ color: "var(--color-fg-muted)", background: "transparent", textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  Avatar
                </a>
                <a
                  href="/settings"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase cursor-pointer transition-colors block"
                  style={{ color: "var(--color-fg-muted)", background: "transparent", textDecoration: "none" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-2)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  Settings
                </a>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    localStorage.removeItem("auth_token");
                    window.location.replace("/");
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs tracking-wider uppercase cursor-pointer transition-colors"
                  style={{ color: "var(--color-fg-muted)", background: "transparent" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-2)"; e.currentTarget.style.color = "var(--color-danger)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--color-fg-muted)"; }}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </>
        )}
    </div>
  );

  if (variant === "sidebar") {
    return (
      <div className="desktop-sidebar-user">
        {avatarBtn}
        {username && (
          <span className="desktop-sidebar-user-name">{username}</span>
        )}
        {(balanceChip || unsubmittedChip) && (
          <div className="desktop-sidebar-user-points">
            {balanceChip}
            {unsubmittedChip}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      {username && (
        <span style={{ color: "var(--color-fg-muted)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {username}
        </span>
      )}
      {unsubmittedChip}
      {balanceChip}
      {avatarBtn}
    </div>
  );
}
