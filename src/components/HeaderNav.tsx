"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Tasks" },
  { href: "/recurring", label: "Recurring" },
];

export default function HeaderNav() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="flex items-center gap-1">
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className="px-3 py-1.5 transition-colors"
            style={{
              color: active ? "var(--color-accent)" : "var(--color-fg-muted)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: active ? 600 : 500,
              borderBottom: active ? "1px solid var(--color-accent)" : "1px solid transparent",
            }}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
