"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/", label: "Tasks", match: (p: string) => p === "/" },
  { href: "/recurring", label: "Recurring", match: (p: string) => p === "/recurring" },
  { href: "/archive", label: "Archive", match: (p: string) => p === "/archive" },
] as const;

export default function MobileNav() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 sm:hidden flex"
      style={{
        background: "var(--color-header)",
        borderTop: "1px solid var(--color-border-soft)",
        boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.08)",
        zIndex: 40,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {ITEMS.map((item) => {
        const isActive = item.match(pathname);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors"
            style={{ color: isActive ? "var(--color-active-highlight)" : "var(--color-fg-muted)" }}
          >
            {item.label === "Tasks" ? <TasksIcon /> : item.label === "Recurring" ? <RecurringIcon /> : <ArchiveIcon />}
            <span style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: isActive ? 600 : 500 }}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

function TasksIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-3-6.7" />
      <polyline points="21 4 21 10 15 10" />
    </svg>
  );
}

function ArchiveIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="4" rx="1" />
      <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
      <line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}
