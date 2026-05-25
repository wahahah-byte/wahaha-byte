"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// 7-day strip centered on today: 3 days before, today, 3 days after.
// Decorative for now — tap targets can be wired later.
const DAYS_BEFORE = 3;
const DAYS_AFTER = 3;

function buildDays(): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: Date[] = [];
  for (let i = -DAYS_BEFORE; i <= DAYS_AFTER; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push(d);
  }
  return out;
}

const WEEKDAY_FMT = new Intl.DateTimeFormat("en-US", { weekday: "short" });

export default function CalendarStrip() {
  const pathname = usePathname();
  // Compute on the client to avoid SSR mismatches (timezone, midnight rollover).
  const [days, setDays] = useState<Date[] | null>(null);
  useEffect(() => { setDays(buildDays()); }, []);

  if (pathname === "/login" || pathname === "/register") return null;
  if (!days) return null;

  const todayKey = days[DAYS_BEFORE].toDateString();

  return (
    <div
      aria-label="Calendar strip"
      style={{
        display: "flex",
        gap: 4,
        // Keep height in sync with --calendar-strip-h so .task-page-shell /
        // .desktop-shell can subtract it without overflowing the viewport.
        height: "var(--calendar-strip-h, 50px)",
        padding: "4px 12px",
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border-soft)",
      }}
    >
      <div style={{ display: "flex", gap: 4, maxWidth: 480, margin: "0 auto", flex: 1 }}>
        {days.map((d) => {
          const isToday = d.toDateString() === todayKey;
          return (
            <div
              key={d.toISOString()}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                padding: "6px 4px",
                borderRadius: 8,
                background: isToday ? "var(--color-active-highlight-bg)" : "transparent",
                color: isToday ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                border: isToday
                  ? "1px solid var(--color-active-highlight-border)"
                  : "1px solid transparent",
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  opacity: isToday ? 1 : 0.85,
                }}
              >
                {WEEKDAY_FMT.format(d)}
              </span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                }}
              >
                {d.getDate()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
