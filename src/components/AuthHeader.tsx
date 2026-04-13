"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AuthHeader() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    setHasToken(!!localStorage.getItem("auth_token"));
  }, [pathname]);

  if (!isMounted || !hasToken) return null;

  return (
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
  );
}
