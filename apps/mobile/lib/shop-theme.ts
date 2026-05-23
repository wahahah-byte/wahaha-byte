import { type Rarity } from "@wahaha/shared";

import { useColors } from "@/hooks/use-colors";

// Uniform dark icon-showcase panel — applied behind every preview regardless of theme.
// Lives outside theme palette so the visual stays consistent in both light + dark mode.
export const CARD_PREVIEW_BG = "#2b2d31";

// Maps a rarity tier to its accent color. Shared across shop components (hero, card,
// detail modal, filter tray) so the rarity palette has one source of truth.
export function rarityColor(rarity: Rarity, c: ReturnType<typeof useColors>): string {
  switch (rarity) {
    case "COMMON":    return c.fgMuted;
    case "UNCOMMON":  return c.success;
    case "RARE":      return c.activeHighlight;
    case "EPIC":      return c.secondaryAccent;
    case "LEGENDARY": return c.warning;
  }
}
