export interface TierUpMessage {
  id: string;
  tierLabel: string;
  multiplier: string;
  streakCount: number;
}

// Boundaries match tierForStreak so the in-row badge and the tier-up banner
// agree on what tier a streak belongs to.
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
