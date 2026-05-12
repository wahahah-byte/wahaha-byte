"use client";

import { currentStreakTier } from "@/components/TierUpBanner";

interface Props {
  currentStreakCount?: number;
  longestStreakCount?: number;
}

// Segmented pixel bar showing progress to the next streak tier. Renders
// nothing until the user is at least 3 days deep (the first tier threshold).
export default function StreakDisplay({ currentStreakCount, longestStreakCount }: Props) {
  const c = currentStreakCount ?? 0;
  if (c < 3) return null;

  const multiplier = c >= 30 ? 2.0 : c >= 14 ? 1.8 : c >= 7 ? 1.5 : 1.2;
  const nextTier = c >= 30 ? null : c >= 14 ? { at: 30, mult: 2.0 } : c >= 7 ? { at: 14, mult: 1.8 } : { at: 7, mult: 1.5 };
  const tierStart = c >= 14 ? 14 : c >= 7 ? 7 : 3;
  const SEGMENTS = 12;
  const filled = nextTier
    ? Math.max(1, Math.min(SEGMENTS, Math.round(((c - tierStart) / (nextTier.at - tierStart)) * SEGMENTS)))
    : SEGMENTS;
  const fmt = (m: number) => Number.isInteger(m) ? m.toFixed(0) : m.toFixed(1);

  return (
    <div className="flex flex-col gap-1.5" style={{ color: "var(--color-active-highlight-alt)" }}>
      <div className="flex items-center justify-between text-[11px]">
        <span className="inline-flex items-baseline gap-1.5">
          <span style={{ fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
            {currentStreakTier(c)?.label ?? "TIER 1"}
          </span>
          <span style={{ opacity: 0.5 }}>·</span>
          <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{c}</span>
          {longestStreakCount != null && longestStreakCount > c && (
            <span style={{ opacity: 0.55, fontVariantNumeric: "tabular-nums" }}>/ {longestStreakCount}</span>
          )}
          <span style={{ marginLeft: 6, fontWeight: 600 }}>{fmt(multiplier)}×</span>
        </span>
        {nextTier ? (
          <span style={{ color: "var(--color-fg-subtle)", fontSize: "10px", letterSpacing: "0.05em", fontVariantNumeric: "tabular-nums" }}>
            {nextTier.at - c} → {fmt(nextTier.mult)}×
          </span>
        ) : (
          <span style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
            Max
          </span>
        )}
      </div>
      <div className="flex" style={{ gap: 2 }} aria-hidden>
        {Array.from({ length: SEGMENTS }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 6,
              background: i < filled ? "var(--color-active-highlight-alt)" : "var(--color-border-soft)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
