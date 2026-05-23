import type { ItemSlot, Rarity } from "@wahaha/shared";

// ---- Filter types ----------------------------------------------------------

export type RarityFilter = "ALL" | Rarity;

// Slot filter labels — collapses HAIR_*/WEAPON_* variants into single chips.
export type SlotGroup =
  | "ALL"
  | "HAT"
  | "HAIR"
  | "FACE"
  | "EYE"
  | "EAR"
  | "TOP"
  | "BOTTOM"
  | "OVERALL"
  | "CAPE"
  | "GLOVES"
  | "SHOES"
  | "WEAPON"
  | "OFFHAND"
  | "WRIST";

export type SortKey = "DEFAULT" | "COST_ASC" | "COST_DESC" | "RARITY" | "NEWEST";

export type OwnedFilter = "ALL" | "UNOWNED" | "OWNED";

// ---- Static data -----------------------------------------------------------

export const RARITIES: Rarity[] = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];

// Low→high ordering so RANK[b] - RANK[a] gives rare-first sort.
export const RARITY_RANK: Record<Rarity, number> = {
  COMMON: 0,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4,
};

export const SLOT_GROUPS: { key: SlotGroup; label: string; matches: (s: ItemSlot) => boolean }[] = [
  { key: "ALL",     label: "All categories", matches: () => true },
  { key: "HAT",     label: "Hat",            matches: (s) => s === "HAT" || s === "HEAD" },
  { key: "HAIR",    label: "Hair",           matches: (s) => s === "HAIR" || s === "HAIR_FRONT" || s === "HAIR_BACK" },
  { key: "FACE",    label: "Face",           matches: (s) => s === "FACE" },
  { key: "EYE",     label: "Eye",            matches: (s) => s === "EYE" },
  { key: "EAR",     label: "Ear",            matches: (s) => s === "EAR" },
  { key: "TOP",     label: "Top",            matches: (s) => s === "TOP" },
  { key: "BOTTOM",  label: "Bottom",         matches: (s) => s === "BOTTOM" },
  { key: "OVERALL", label: "Overall",        matches: (s) => s === "OVERALL" || s === "BODY" },
  { key: "CAPE",    label: "Cape",           matches: (s) => s === "CAPE" || s === "BACK" },
  { key: "GLOVES",  label: "Gloves",         matches: (s) => s === "GLOVES" || s === "HAND" },
  { key: "SHOES",   label: "Shoes",          matches: (s) => s === "SHOES" || s === "FEET" },
  { key: "WEAPON",  label: "Weapon",         matches: (s) => s === "WEAPON_FRONT" || s === "WEAPON_BACK" },
  { key: "OFFHAND", label: "Off-hand",       matches: (s) => s === "OFFHAND" },
  { key: "WRIST",   label: "Wrist",          matches: (s) => s === "WRIST" },
];

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "DEFAULT",   label: "Default" },
  { value: "COST_ASC",  label: "Cost: low → high" },
  { value: "COST_DESC", label: "Cost: high → low" },
  { value: "RARITY",    label: "Rarity: rare first" },
  { value: "NEWEST",    label: "Newest first" },
];

export const OWNED_OPTIONS: { value: OwnedFilter; label: string }[] = [
  { value: "ALL",     label: "All items" },
  { value: "UNOWNED", label: "Not owned" },
  { value: "OWNED",   label: "Owned" },
];

export function rarityLabel(r: Rarity): string {
  return r.charAt(0) + r.slice(1).toLowerCase();
}
