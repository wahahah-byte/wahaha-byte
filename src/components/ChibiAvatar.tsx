"use client";

import type { UserInventoryDto } from "@/lib/api/avatar";
import { assetPath } from "@/lib/assetPath";

// Z-order for stacking equipment layers above the base. Lower numbers render
// behind, higher numbers in front. Covers both the current 6-slot backend enum
// and the planned granular slots so the same map works through the migration.
const SLOT_Z: Record<string, number> = {
  // Planned granular slots (not yet on the backend — items can use these too).
  WEAPON_BACK: 0,
  CAPE: 10,
  HAIR_BACK: 20,
  BOTTOM: 40,
  TOP: 50,
  GLOVES: 60,
  SHOES: 70,
  HAIR_FRONT: 80,
  EYE: 100,
  EAR: 110,
  HAT: 120,
  WEAPON_FRONT: 130,
  WRIST: 140,

  // Current backend enum — mapped to roughly equivalent z-bands.
  BACK: 10,
  BODY: 50,
  FEET: 70,
  FACE: 90,
  HAND: 130,
  HEAD: 120,
};

// Source canvas is 256×384. Render at exactly 2× downsample (128×192) or
// other clean integer divisors for the crispest pixel-art result.
const SOURCE_W = 256;
const SOURCE_H = 384;
const ASPECT = SOURCE_W / SOURCE_H;

interface Props {
  equipped: UserInventoryDto[];
  height?: number;        // rendered pixel height (default 192 = clean 2× downsample)
  basePath?: string;      // override for testing / theming
  pose?: "idle" | "still";
  className?: string;
}

export default function ChibiAvatar({
  equipped,
  height = 192,
  basePath = assetPath("/avatars/base.png"),
  pose = "idle",
  className,
}: Props) {
  const width = Math.round(height * ASPECT);

  // Filter to items that actually have a PNG asset, then sort by slot z-order.
  // Items without a previewAssetUrl (e.g. legacy mock pixel-rect items) are
  // simply skipped — the base character still shows. Hair (category "hair")
  // is suppressed when any equipped item declares coversHair — e.g. a
  // full-coverage helmet — so hair doesn't poke through.
  const hideHair = equipped.some((inv) => inv.avatarItem?.coversHair === true);
  const layered = equipped
    .filter((inv) => {
      const item = inv.avatarItem;
      if (!item?.previewAssetUrl) return false;
      if (hideHair && item.category === "hair") return false;
      return true;
    })
    .sort((a, b) => {
      const za = SLOT_Z[a.avatarItem!.slot] ?? 100;
      const zb = SLOT_Z[b.avatarItem!.slot] ?? 100;
      return za - zb;
    });

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width,
        height,
        animation: pose === "idle" ? "avatar-idle 2.6s ease-in-out infinite" : undefined,
      }}
    >
      <img
        src={basePath}
        alt=""
        width={width}
        height={height}
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          imageRendering: "pixelated",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
      {layered.map((inv) => {
        const item = inv.avatarItem!;
        // Per-item canvas can be larger than the base (e.g. an oversized
        // weapon at 384×384 vs base 256×384). Render at the item's native
        // dimensions scaled by the same source-pixel→DOM-pixel ratio as
        // the base, then anchor at top-left — i.e. the item canvas's (0,0)
        // matches the base canvas's (0,0). Extra pixels overhang to the
        // right and/or below. Use offsetX/Y to nudge if the asset was
        // drawn with a different anchor convention.
        const itemSrcW = item.sourceWidth ?? SOURCE_W;
        const itemSrcH = item.sourceHeight ?? SOURCE_H;
        const scale = height / SOURCE_H;
        const itemW = Math.round(itemSrcW * scale);
        const itemH = Math.round(itemSrcH * scale);
        const left = 0;
        const top = 0;
        // Source-canvas offsets scaled to render size so a "1px right"
        // hint stays visually consistent across height settings.
        const dx = (item.offsetX ?? 0) * scale;
        const dy = (item.offsetY ?? 0) * scale;
        // Per-item uniform scale, applied via CSS transform around the
        // item img's center — so changing scale doesn't drift the visual
        // anchor and offsetX/Y stays calibrated.
        const renderScale = item.renderScale ?? 1;
        return (
          <img
            key={inv.inventoryId}
            // assetPath is a no-op for full https:// URLs (e.g. blob storage)
            // and prepends the GitHub Pages base path for /-rooted public assets.
            src={assetPath(item.previewAssetUrl!)}
            alt=""
            width={itemW}
            height={itemH}
            draggable={false}
            style={{
              position: "absolute",
              left,
              top,
              width: itemW,
              height: itemH,
              imageRendering: "pixelated",
              userSelect: "none",
              pointerEvents: "none",
              transform: dx || dy || renderScale !== 1
                ? `translate(${dx}px, ${dy}px) scale(${renderScale})`
                : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
