"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Top-right slot in the global header. Shows a "Sign In" button when the visitor has no
// auth token; when signed in we render nothing here (the avatar / balance / menu already
// surface in DesktopSidebar's AuthHeader and MobileEdgeDrawer's user row).
//
// Hidden on /login and /register so the auth flow itself doesn't carry a redundant CTA.
export default function HeaderAuthSlot() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setHasToken(!!localStorage.getItem("auth_token"));
  }, [pathname]);

  if (pathname === "/login" || pathname === "/register") return null;
  // Pre-mount: render nothing — server has no localStorage so a flash-of-button would mismatch.
  if (!isMounted || hasToken) return null;

  return (
    <Link
      href="/login"
      className="shrink-0"
      style={{
        color: "var(--color-active-highlight)",
        background: "var(--color-active-highlight-bg)",
        border: "1px solid var(--color-active-highlight-border)",
        borderRadius: 3,
        padding: "6px 14px",
        fontSize: 10,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        fontWeight: 600,
        textDecoration: "none",
      }}
    >
      Sign In
    </Link>
  );
}
