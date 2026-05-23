// Per-slot category whitelist. The admin form's category dropdown renders the canonical
// list below; the backend uses isValidCategory() to reject anything else. Legacy aliases
// are accepted by validation (so existing rows still round-trip) but hidden from the
// dropdown so new items can only use canonical names.
//
// Keep this in sync with C# wahaha.API/Models/Domain/AvatarCategoryWhitelist.cs.

import type { ItemSlot } from "../api/avatar";

// Canonical category names per slot, in display order for the dropdown.
export const CATEGORIES_BY_SLOT: Record<ItemSlot, readonly string[]> = {
  // Granular slots
  HAT:          ["hat", "helmet", "crown", "cap", "mask", "headband"],
  HAIR_FRONT:   ["hair", "bangs"],
  HAIR_BACK:    ["hair"],
  FACE:         ["mask", "scar", "facial-hair", "mouth"],
  EYE:          ["glasses", "eyepatch", "eye-makeup"],
  EAR:          ["earring", "ear-cuff", "ear-stud"],
  TOP:          ["t-shirt", "sweater", "hoodie", "jacket", "vest", "shirt"],
  BOTTOM:       ["pants", "shorts", "skirt", "jeans"],
  OVERALL:      ["dress", "robe", "jumpsuit", "kimono", "outfit"],
  CAPE:         ["cape", "cloak", "wings", "scarf"],
  GLOVES:       ["gloves", "mittens", "gauntlets"],
  SHOES:        ["boots", "sneakers", "sandals", "heels", "flats"],
  // WEAPON_FRONT and WEAPON_BACK accept the same categories — the slots differ only by
  // chibi render z-order (front vs back of the body). A sheathed sword and a held sword
  // are both "sword", just rendered in different layers.
  WEAPON_FRONT: ["sword", "greatsword", "dagger", "staff", "polearm", "bow", "wand", "axe", "quiver", "holster", "sheath", "backpack"],
  WEAPON_BACK:  ["sword", "greatsword", "dagger", "staff", "polearm", "bow", "wand", "axe", "quiver", "holster", "sheath", "backpack"],
  OFFHAND:      ["shield", "dagger", "orb", "tome", "lantern", "buckler"],
  WRIST:        ["bracelet", "watch", "bangle"],
  // Legacy slots (deprecated for new uploads, kept so existing rows can be edited).
  HEAD:         ["hat", "helmet", "crown", "cap", "mask", "headband", "headwear"],
  HAIR:         ["hair"],
  BODY:         ["outerwear", "outfit", "top", "bottom"],
  HAND:         ["sword", "dagger", "axe", "wand", "tool", "weapon", "accessory"],
  BACK:         ["cape", "cloak", "wings"],
  FEET:         ["footwear", "boots", "sneakers"],
};

// Extra categories accepted by validation (for backward compat with rows seeded before
// the whitelist landed) but not surfaced in the admin dropdown. Empty by default — add
// entries here if a legacy category needs to round-trip without migrating the row.
export const LEGACY_CATEGORIES_BY_SLOT: Partial<Record<ItemSlot, readonly string[]>> = {
  // Seeded items used "accessory" / "weapon" / "weapon_staff" / "headwear" / "outerwear" / "outfit" / "cape" before
  // the whitelist existed — accept them so editing those rows doesn't 400.
  HAT:          ["headwear"],
  HEAD:         ["headwear"],
  FACE:         ["accessory"],
  HAND:         ["accessory", "weapon", "weapon_staff"],
  WEAPON_FRONT: ["weapon", "weapon_staff"],
  CAPE:         ["cape"],
  BODY:         ["outerwear", "outfit"],
};

export function isValidCategory(slot: ItemSlot, category: string): boolean {
  const normalised = (category ?? "").trim().toLowerCase();
  if (!normalised) return false;
  const canonical = CATEGORIES_BY_SLOT[slot] ?? [];
  if (canonical.some((c) => c.toLowerCase() === normalised)) return true;
  const legacy = LEGACY_CATEGORIES_BY_SLOT[slot] ?? [];
  return legacy.some((c) => c.toLowerCase() === normalised);
}
