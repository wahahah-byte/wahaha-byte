"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Tasks", activeColor: "var(--color-active-highlight)" },
  { href: "/recurring", label: "Recurring", activeColor: "var(--color-active-highlight-alt)" },
];

export default function HeaderNav() {
  const pathname = usePathname();
  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav className="hidden sm:flex items-center gap-1">
      {LINKS.map((l) => {
        const active = pathname === l.href;
        return (
          <Link
            key={l.href}
            href={l.href}
            className="px-3 py-1.5 transition-colors"
            style={{
              color: active ? l.activeColor : "var(--color-fg-muted)",
              fontSize: "10px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: active ? 600 : 500,
              borderBottom: active ? `1px solid ${l.activeColor}` : "1px solid transparent",
            }}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
