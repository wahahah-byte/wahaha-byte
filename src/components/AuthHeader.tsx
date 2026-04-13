"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { usersApi } from "@/lib/api/users";

export default function AuthHeader() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [stagedPoints, setStagedPoints] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    setHasToken(!!localStorage.getItem("auth_token"));
  }, [pathname]);

  useEffect(() => {
    if (!hasToken) return;

    usersApi.getMe().then(({ data }) => {
      if (data) setBalance(data.currentBalance);
    });

    function onPointsAwarded(e: Event) {
      const delta = (e as CustomEvent<{ delta: number }>).detail.delta;
      setBalance((b) => (b ?? 0) + delta);
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
      {/* Staged (unsubmitted) points */}
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

      {/* Points balance */}
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

      {/* Avatar + dropdown */}
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
              className="absolute right-0 mt-1 z-20 py-1 min-w-[120px]"
              style={{ background: "#1e1f22", border: "1px solid #3e3f42" }}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  localStorage.removeItem("auth_token");
                  window.location.replace("/");
                }}
                className="w-full text-left px-4 py-2 text-xs tracking-wider uppercase cursor-pointer transition-colors"
                style={{ color: "#aaa", background: "transparent" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#2e2f32"; e.currentTarget.style.color = "#ef4444"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#aaa"; }}
              >
                Sign Out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
