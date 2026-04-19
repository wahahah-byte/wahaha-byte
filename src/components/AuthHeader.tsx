"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usersApi } from "@/lib/api/users";

export default function AuthHeader() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [stagedPoints, setStagedPoints] = useState(0);
  const [pointsSubmittedToday, setPointsSubmittedToday] = useState(0);
  const [recurringSubmittedToday, setRecurringSubmittedToday] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    const token = !!localStorage.getItem("auth_token");
    setHasToken(token);
    if (!token) return;
    usersApi.getMe().then(({ data }) => {
      if (data) {
        setBalance(data.currentBalance);
        setUsername(data.username);
        setPointsSubmittedToday(data.pointsSubmittedToday ?? 0);
        setRecurringSubmittedToday(data.recurringPointsSubmittedToday ?? 0);
      }
    });
  }, [pathname]);

  useEffect(() => {
    if (!hasToken) return;

    function onPointsAwarded() {
      usersApi.getMe().then(({ data }) => {
        if (data) {
          setBalance(data.currentBalance);
          setPointsSubmittedToday(data.pointsSubmittedToday ?? 0);
          setRecurringSubmittedToday(data.recurringPointsSubmittedToday ?? 0);
        }
      });
    }
    function onStagedUpdated(e: Event) {
      const { delta, reset } = (e as CustomEvent<{ delta: number; reset?: boolean }>).detail;
      if (reset) setStagedPoints(0);
      else setStagedPoints((p) => p + delta);
    }

    window.addEventListener("points-awarded", onPointsAwarded);
    window.addEventListener("staged-points-updated", onStagedUpdated);
    return () => {
      window.removeEventListener("points-awarded", onPointsAwarded);
      window.removeEventListener("staged-points-updated", onStagedUpdated);
    };
  }, [hasToken]);

  if (!isMounted || !hasToken) return null;

  return (
    <div className="flex items-center gap-3">
      {username && (
        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
          {username}
        </span>
      )}

      {stagedPoints > 0 && (
        <div className="flex items-center gap-1.5">
          <svg width="9" height="11" viewBox="0 0 10 12" fill="none">
            <polygon points="5,0 10,4 5,12 0,4" fill="#f59e0b" opacity="0.85" />
          </svg>
          <span style={{ color: "#f59e0b", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
            +{stagedPoints.toLocaleString()}
          </span>
        </div>
      )}

      {(() => {
        const REC_CAP = 50;
        const rec = Math.min(recurringSubmittedToday, REC_CAP);
        const capped = rec >= REC_CAP;
        return (
          <div className="flex items-center gap-1" title={`Recurring: ${rec} / ${REC_CAP} pts today`}>
            <svg width="9" height="11" viewBox="0 0 10 12" fill="none">
              <polygon points="5,0 10,4 5,12 0,4" fill={capped ? "#4ade80" : "#a78bfa"} opacity="0.85" />
            </svg>
            <span style={{ color: capped ? "#4ade80" : "#a78bfa", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
              {rec}/{REC_CAP}
            </span>
          </div>
        );
      })()}

      {balance !== null && (
        <div className="flex items-center gap-1.5">
          <svg width="9" height="11" viewBox="0 0 10 12" fill="none">
            <polygon points="5,0 10,4 5,12 0,4" fill="#5bb8e0" opacity="0.85" />
          </svg>
          <span style={{ color: "#5bb8e0", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
            {balance.toLocaleString()}
          </span>
        </div>
      )}

      <div className="relative">
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
                background: "#1e1f22",
                border: "1px solid #3e3f42",
                borderRadius: "4px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
              }}
            >
              {(() => {
                const REG_CAP = 150;
                const REC_CAP = 50;
                const regSubmitted = Math.min(pointsSubmittedToday - recurringSubmittedToday, REG_CAP);
                const recSubmitted = Math.min(recurringSubmittedToday, REC_CAP);
                const regPct = Math.round((regSubmitted / REG_CAP) * 100);
                const recPct = Math.round((recSubmitted / REC_CAP) * 100);
                const regCapped = regSubmitted >= REG_CAP;
                const recCapped = recSubmitted >= REC_CAP;
                return (
                  <div className="px-4 py-3 border-b flex flex-col gap-2.5" style={{ borderColor: "#2e2f34" }}>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                          Regular
                        </span>
                        <span style={{ color: regCapped ? "#4ade80" : "rgba(255,255,255,0.5)", fontSize: "9px", letterSpacing: "0.05em", fontWeight: 600 }}>
                          {regSubmitted} / {REG_CAP}
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "#2e2f34" }}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${regPct}%`, background: regCapped ? "#4ade80" : regPct >= 75 ? "#f59e0b" : "#5bb8e0" }}
                        />
                      </div>
                      {regCapped && (
                        <p style={{ color: "#4ade80", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "4px" }}>
                          Cap reached
                        </p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                          Recurring
                        </span>
                        <span style={{ color: recCapped ? "#4ade80" : "rgba(255,255,255,0.5)", fontSize: "9px", letterSpacing: "0.05em", fontWeight: 600 }}>
                          {recSubmitted} / {REC_CAP}
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: "#2e2f34" }}>
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{ width: `${recPct}%`, background: recCapped ? "#4ade80" : recPct >= 75 ? "#f59e0b" : "#a78bfa" }}
                        />
                      </div>
                      {recCapped && (
                        <p style={{ color: "#4ade80", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", marginTop: "4px" }}>
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
                  style={{ color: "#aaa", background: "transparent" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#2a2b2f"; e.currentTarget.style.color = "#ef4444"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#aaa"; }}
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
