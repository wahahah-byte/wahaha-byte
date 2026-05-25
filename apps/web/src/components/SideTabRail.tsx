"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { NavIconSettings } from "@/components/NavIcons";

// Floating right-edge tab with quick-access icons. Mount where you want it to
// appear — currently only the /profile page renders it.
//
// Portals to document.body so the rail escapes any ancestor `transform` (the
// MobileEdgeDrawer's slider has translateX, which would otherwise make
// `position: fixed` anchor to the slider instead of the viewport).
export default function SideTabRail() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const rail = (
    <nav
      aria-label="Quick access"
      data-edge-drawer-block
      style={{
        position: "fixed",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 36,
        display: "flex",
        flexDirection: "column",
        background: "var(--color-header)",
        border: "1px solid var(--color-border)",
        borderRight: "none",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        boxShadow: "-3px 0 14px rgba(0, 0, 0, 0.35)",
        overflow: "hidden",
      }}
    >
      <SideTabLink
        href="/settings"
        label="Settings"
        icon={<NavIconSettings />}
      />
    </nav>
  );

  return createPortal(rail, document.body);
}

function SideTabLink({
  href, label, icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      style={{
        width: 36,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--color-fg-muted)",
        background: "transparent",
        textDecoration: "none",
        transition: "color 0.12s, background 0.12s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--color-fg)";
        e.currentTarget.style.background = "var(--color-overlay-hover, rgba(255, 255, 255, 0.05))";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--color-fg-muted)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {icon}
    </Link>
  );
}
