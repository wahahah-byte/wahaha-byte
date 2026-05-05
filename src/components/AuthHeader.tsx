"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usersApi } from "@/lib/api/users";
import { usePoints } from "@/context/PointsContext";
import { REGULAR_CAP, RECURRING_CAP } from "@/lib/constants";

export default function AuthHeader() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const {
    balance, username, unsubmittedPoints, recurringSubmittedToday, dailySubmitted,
    setBalance, setUsername, setRecurringSubmittedToday, setDailySubmitted,
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
        setDailySubmitted(data.pointsSubmittedToday ?? 0);
        setRecurringSubmittedToday(data.recurringPointsSubmittedToday ?? 0);
      }
    });
  }, [pathname]);

  if (!isMounted || !hasToken) return null;

  return (
    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
      {username && (
        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {username}
        </span>
      )}

      {unsubmittedPoints > 0 && (
        <div className="flex items-center gap-1.5 shrink-0" title={`${unsubmittedPoints} unsubmitted pts`}>
          <svg width="9" height="11" viewBox="0 0 10 12" fill="none" shapeRendering="crispEdges">
            <path d="M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z" style={{ fill: "var(--color-warning)" }} opacity="0.85" />
            <rect x="4" y="5" width="2" height="2" style={{ fill: "var(--color-bg)" }} opacity="0.5" />
          </svg>
          <span style={{ color: "var(--color-warning)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
            +{unsubmittedPoints.toLocaleString()}
          </span>
        </div>
      )}

      {balance !== null && (
        <div className="flex items-center gap-1.5 shrink-0" data-coin-target="balance">
          <svg width="9" height="11" viewBox="0 0 10 12" fill="none" shapeRendering="crispEdges">
            <path d="M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z" style={{ fill: "var(--color-warning)" }} opacity="0.95" />
            <rect x="4" y="5" width="2" height="2" style={{ fill: "var(--color-bg)" }} opacity="0.4" />
          </svg>
          <span style={{ color: "var(--color-warning)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
            {balance.toLocaleString()}
          </span>
        </div>
      )}

      <div className="relative shrink-0">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
          style={{ background: "#3e3f42", border: "1px solid #555659", color: "#ddd" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" fill="currentColor" opacity="0.8" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill="currentColor" opacity="0.5" />
          </svg>
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div
              className="absolute right-0 mt-2 z-20 min-w-[160px] overflow-hidden"
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
                          style={{ width: `${regPct}%`, background: regCapped ? "var(--color-success)" : regPct >= 75 ? "var(--color-warning)" : "var(--color-accent)" }}
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
                          Recurring
                        </span>
                        <span style={{ color: recCapped ? "var(--color-success)" : "var(--color-fg-muted)", fontSize: "9px", letterSpacing: "0.05em", fontWeight: 600 }}>
                          {recSubmitted} / {RECURRING_CAP}
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "var(--color-track)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${recPct}%`, background: recCapped ? "var(--color-success)" : recPct >= 75 ? "var(--color-warning)" : "var(--color-secondary-accent)" }}
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
    </div>
  );
}
