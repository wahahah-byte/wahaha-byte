// Shared per-item render-hint resolution for the chibi avatar. Used by
// every surface that renders an AvatarItemDto into a chibi composition —
// the /avatar page, the TaskDetailModal preview, etc. — so weapon offsets,
// covers-hair flags, and source dimensions stay consistent everywhere.

import type { AvatarItemDto } from "../api/avatar";

export const RENDER_HINTS: Record<string, Partial<AvatarItemDto>> = {
  "hat_alien_neo.png": { coversHairFront: true, coversHairBack: true, renderScale: 1.2, offsetY: 10 },
  "hair_seraph_wave_brown.png": { offsetX: 11 },
  "weapon_polearm_alien_cyber.png": {
    sourceWidth: 384, sourceHeight: 384, offsetX: 6, offsetY: -8, renderScale: 1.25,
  },
  "weapon_front_magic_staff.png": { offsetX: -67, offsetY: 1 },
};

export const CLASS_HINTS: Record<string, Partial<AvatarItemDto>> = {
  polearm: {
    sourceWidth: 384, sourceHeight: 384, offsetX: -73, offsetY: -8, renderScale: 1.25,
  },
};

export function classHintMatch(item: AvatarItemDto): Partial<AvatarItemDto> | null {
  const haystack = `${item.name ?? ""} ${item.category ?? ""}`.toLowerCase();
  for (const token of Object.keys(CLASS_HINTS)) {
    if (haystack.includes(token)) return CLASS_HINTS[token];
  }
  return null;
}

// Layer order (lowest → highest precedence):
//   STRUCTURAL (renderScale, sourceWidth/Height, coversHair*):
//     fileHints < classHints < server
//   POSITIONAL (offsetX, offsetY):
//     server < classHints < fileHints
// The positional inversion lets weapon/hair-hand tuning iterate in code
// without re-POSTing each tweak. Legacy `coversHair` expands to both
// granular flags when truthy.
export function applyHints(item: AvatarItemDto): AvatarItemDto {
  const filename = item.previewAssetUrl?.split("/").pop() ?? "";
  const fileHints = RENDER_HINTS[filename] ?? {};
  const classHints = classHintMatch(item) ?? {};
  const merged: AvatarItemDto = { ...item };
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
  for (const key of ["offsetX", "offsetY"] as const) {
    if (classHints[key] != null) merged[key] = classHints[key];
    if (fileHints[key] != null) merged[key] = fileHints[key];
  }
  if (merged.coversHair === true) {
    if (merged.coversHairFront == null) merged.coversHairFront = true;
    if (merged.coversHairBack == null) merged.coversHairBack = true;
  }
  return merged;
}
