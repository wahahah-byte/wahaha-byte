"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  // Setting `key` of this prop to a unique value each time triggers a re-mount.
  // Pass null to render nothing.
  message: TierUpMessage | null;
  onDone?: () => void;
}

export interface TierUpMessage {
  // Stable id per emission so callers can re-fire by changing the id.
  id: string;
  tierLabel: string;          // e.g. "WEEK ONE"
  multiplier: string;         // e.g. "1.5×"
  streakCount: number;
}

const VISIBLE_MS = 2200;

export default function TierUpBanner({ message, onDone }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onDone?.(), VISIBLE_MS);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!mounted || !message) return null;

  return createPortal(
    <div
      key={message.id}
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: "calc(env(safe-area-inset-top, 0px) + 18px)",
        left: "50%",
        zIndex: 9000,
        pointerEvents: "none",
        animation: "tier-banner-in 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        background: "var(--color-active-highlight-alt-bg, rgba(91,184,224,0.12))",
        border: "1px solid var(--color-active-highlight-alt)",
        borderRadius: 999,
        padding: "8px 16px",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
        backdropFilter: "blur(6px)",
      }}
    >
      <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>🔥</span>
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "var(--color-active-highlight-alt)",
          whiteSpace: "nowrap",
        }}
      >
        {message.tierLabel} · {message.multiplier} unlocked
      </span>
    </div>,
    document.body,
  );
}

// Compute the milestone tier the user just crossed, if any.
// Returns null when the new streak count isn't a tier boundary.
// Returns the current tier number and label for a given streak count, or
// null when the streak hasn't crossed the first threshold (3 days). Mirrors
// the boundaries used by tierForStreak so the in-row badge and the tier-up
// banner agree on what tier a streak belongs to.
export function currentStreakTier(count: number): { tier: number; label: string } | null {
  if (count < 3) return null;
  if (count >= 30) return { tier: 4, label: "TIER 4" };
  if (count >= 14) return { tier: 3, label: "TIER 3" };
  if (count >= 7) return { tier: 2, label: "TIER 2" };
  return { tier: 1, label: "TIER 1" };
}

export function tierForStreak(prev: number, next: number): TierUpMessage | null {
  const tiers: { at: number; label: string; mult: string }[] = [
    { at: 3, label: "Day 3", mult: "1.2×" },
    { at: 7, label: "Week One", mult: "1.5×" },
    { at: 14, label: "Two Weeks", mult: "1.8×" },
    { at: 30, label: "Month Streak", mult: "2.0×" },
  ];
  // Pick the highest tier crossed in this transition (handles edge cases like
  // restoring a saved streak that jumps multiple tiers in one step).
  let crossed: { at: number; label: string; mult: string } | null = null;
  for (const t of tiers) if (prev < t.at && next >= t.at) crossed = t;
  if (!crossed) return null;
  return {
    id: `tier-${next}-${Date.now()}`,
    tierLabel: crossed.label,
    multiplier: crossed.mult,
    streakCount: next,
  };
}
