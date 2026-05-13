// Shared per-item render-hint resolution for the chibi avatar. Used by
// every surface that renders an AvatarItemDto into a chibi composition —
// the /avatar page, the TaskDetailModal preview, etc. — so weapon offsets,
// covers-hair flags, and source dimensions stay consistent everywhere.

import type { AvatarItemDto } from "@/lib/api/avatar";

// Per-asset render hints (offsetX/Y, renderScale, coversHairFront/Back,
// sourceWidth/Height) keyed by blob filename. Mixed precedence: the
// positional offsetX/offsetY override server values (they're the most
// fiddly to hand-tune iteratively and the server only stores whatever the
// admin last typed in); the other keys still fall back to server values
// when set (they're more structural — source dimensions, cover flags,
// render scale — and an admin's explicit DB value should win over a stale
// code hint).
export const RENDER_HINTS: Record<string, Partial<AvatarItemDto>> = {
  "hat_alien_neo.png": { coversHairFront: true, coversHairBack: true, renderScale: 1.2, offsetY: 10 },
  "hair_seraph_wave_brown.png": { offsetX: 11 },
  // Legacy filename — kept for any rows that still point at the old URL
  // before the backend's slug-naming change.
  "weapon_polearm_alien_cyber.png": {
    sourceWidth: 384, sourceHeight: 384, offsetX: 6, offsetY: -8, renderScale: 1.25,
  },
  // Per-asset polearm override slot — left empty so the broader
  // polearm defaults in CLASS_HINTS apply. Re-add an entry here if a
  // specific polearm needs to deviate from the class default.
  // Staff sprite — the front layer's grip end sits at source (65, 320)
  // but the new chibi base puts its right hand around (90, 228). offsetX
  // here wins over whatever the server has on the row.
  "weapon_front_magic_staff.png": { offsetX: -67, offsetY: 1 },
};

// Class-level render hints applied when an item's name or category
// contains one of these tokens (case-insensitive). Used to set defaults
// shared by every item of the same weapon family — so re-uploading a new
// polearm doesn't require hand-tuning offsets again. Filename-specific
// entries in RENDER_HINTS still win when present (per-asset overrides).
export const CLASS_HINTS: Record<string, Partial<AvatarItemDto>> = {
  // Polearms: 384×384 canvas with the grip drawn in the lower-left of
  // the source. Calibrated against the current chibi base's hand at
  // (90, 228). renderScale 1.25 keeps the haft visually substantial.
  polearm: {
    sourceWidth: 384, sourceHeight: 384, offsetX: -73, offsetY: -8, renderScale: 1.25,
  },
};

// True when any CLASS_HINTS key token appears in the item's name OR
// category. Used by applyHints to pick the matching class default.
export function classHintMatch(item: AvatarItemDto): Partial<AvatarItemDto> | null {
  const haystack = `${item.name ?? ""} ${item.category ?? ""}`.toLowerCase();
  for (const token of Object.keys(CLASS_HINTS)) {
    if (haystack.includes(token)) return CLASS_HINTS[token];
  }
  return null;
}

// Layer order (lowest precedence first → highest precedence last):
//   STRUCTURAL fields (renderScale, sourceWidth/Height, coversHair*):
//     1. Hardcoded fallback in RENDER_HINTS
//     2. CLASS_HINTS family default
//     3. Server-persisted values on the DTO (wins)
//   POSITIONAL fields (offsetX, offsetY):
//     1. Server-persisted values on the DTO
//     2. CLASS_HINTS family default
//     3. RENDER_HINTS entry (wins)
// The positional inversion exists so weapon/hair-hand tuning can be
// iterated in code without needing to PUT each tweak back to the API.
// `coversHair` (the legacy single flag) is treated as both granular flags
// true and applied last when truthy, since some pre-migration data still
// uses it.
export function applyHints(item: AvatarItemDto): AvatarItemDto {
  const filename = item.previewAssetUrl?.split("/").pop() ?? "";
  const fileHints = RENDER_HINTS[filename] ?? {};
  const classHints = classHintMatch(item) ?? {};
  const merged: AvatarItemDto = { ...item };
  // Structural fields: server > class hints > file hints. Server values
  // win when set; otherwise prefer the class-family default over the
  // per-filename one (class defaults encode artist convention, filename
  // entries are usually one-off pre-DB stopgaps).
  for (const key of [
    "coversHairFront", "coversHairBack",
    "renderScale", "sourceWidth", "sourceHeight",
  ] as const) {
    if (merged[key] == null && classHints[key] != null) {
      // @ts-expect-error narrow assignment — key is a known optional field
      merged[key] = classHints[key];
    }
    if (merged[key] == null && fileHints[key] != null) {
      // @ts-expect-error narrow assignment — key is a known optional field
      merged[key] = fileHints[key];
    }
  }
  // Positional fields: file > class > server. Per-asset filename entries
  // override the family default (so a misaligned individual polearm can
  // be hand-corrected), and both override whatever the server has.
  for (const key of ["offsetX", "offsetY"] as const) {
    if (classHints[key] != null) merged[key] = classHints[key];
    if (fileHints[key] != null) merged[key] = fileHints[key];
  }
  // Legacy single-flag coversHair → expand to both granular flags when
  // either side is unset. Server-side rows shouldn't be using this anymore
  // but mock-data fallback might.
  if (merged.coversHair === true) {
    if (merged.coversHairFront == null) merged.coversHairFront = true;
    if (merged.coversHairBack == null) merged.coversHairBack = true;
  }
  return merged;
}
