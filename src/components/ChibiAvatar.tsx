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
  // OVERALL shares TOP's z-band — when equipped, the filter above hides
  // any TOP/BOTTOM behind it, so they can't conflict in the stack.
  OVERALL: 50,
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
  HAIR: 80,     // Renders behind HEAD/HAT (z=120) so a helmet sits on top.
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
  // Items without a previewAssetUrl are skipped — the base character still shows.
  //
  // Three suppression rules layered together:
  //   1. coversHairFront / coversHairBack — hat-style items hide the matching
  //      hair slot. The legacy `coversHair` flag is treated as "both true" so
  //      pre-existing RENDER_HINTS entries (e.g. hat_alien_neo.png) keep
  //      working without a code change.
  //   2. Category "hair" rows on the legacy `HAIR` slot are also suppressed
  //      when either hair flag is set (back-compat for the old single-slot
  //      hair model).
  //   3. OVERALL equipped — when an OVERALL-slot item is present, the chibi
  //      composite hides any equipped TOP and BOTTOM items behind it. The
  //      user can still own / equip the underlying pieces; they just don't
  //      render while the OVERALL is on.
  const hideHairFront = equipped.some((inv) => {
    const i = inv.avatarItem;
    return i?.coversHairFront === true || i?.coversHair === true;
  });
  const hideHairBack = equipped.some((inv) => {
    const i = inv.avatarItem;
    return i?.coversHairBack === true || i?.coversHair === true;
  });
  const hasOverall = equipped.some((inv) => inv.avatarItem?.slot === "OVERALL");

  // Each equipped row expands to one or two render layers:
  //   - the primary previewAssetUrl, drawn at its slot's own z-order
  //   - optionally, secondaryAssetUrl, drawn at HAIR_BACK z-order
  //
  // Two-layer rows (Option B for hair front/back) let a single inventory
  // square own both the bangs and the strands behind the head. The
  // secondary layer is suppressed by hideHairBack just like a standalone
  // HAIR_BACK item would be.
  type Layer = {
    key: string;
    inv: UserInventoryDto;
    src: string;
    z: number;
  };
  const layered: Layer[] = [];
  for (const inv of equipped) {
    const item = inv.avatarItem;
    if (!item?.previewAssetUrl) continue;
    if (hasOverall && (item.slot === "TOP" || item.slot === "BOTTOM")) continue;
    const isPrimaryHairFront = item.slot === "HAIR_FRONT";
    const isPrimaryHairBack = item.slot === "HAIR_BACK";
    // Legacy single-bucket hair — hidden if either granular flag is set.
    const isLegacyHair =
      item.slot === "HAIR" || (item.slot !== "HAIR_FRONT" && item.slot !== "HAIR_BACK" && item.category === "hair");

    const primarySuppressed =
      (hideHairFront && isPrimaryHairFront) ||
      (hideHairBack && isPrimaryHairBack) ||
      ((hideHairFront || hideHairBack) && isLegacyHair);

    if (!primarySuppressed) {
      layered.push({
        key: `${inv.inventoryId}:primary`,
        inv,
        src: item.previewAssetUrl,
        z: SLOT_Z[item.slot] ?? 100,
      });
    }

    if (item.secondaryAssetUrl && !hideHairBack) {
      layered.push({
        key: `${inv.inventoryId}:secondary`,
        inv,
        src: item.secondaryAssetUrl,
        z: SLOT_Z.HAIR_BACK,
      });
    }
  }
  layered.sort((a, b) => a.z - b.z);

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
          // Base body sits between the back-of-character layers (HAIR_BACK=20,
          // CAPE=10, WEAPON_BACK=0) and the clothing layers (BOTTOM=40, TOP=50).
          // Without this, the base is at z=auto and back-hair / capes render
          // *over* the face. Has to stay below 40 so clothing still draws on
          // top of the naked body silhouette.
          zIndex: 30,
          imageRendering: "pixelated",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
      {layered.map((layer) => {
        const item = layer.inv.avatarItem!;
        // Per-item canvas can be larger than the base (e.g. an oversized
        // weapon at 384×384 vs base 256×384). Render at the item's native
        // dimensions scaled by the same source-pixel→DOM-pixel ratio as
        // the base, then anchor at top-left — i.e. the item canvas's (0,0)
        // matches the base canvas's (0,0). Extra pixels overhang to the
        // right and/or below. Use offsetX/Y to nudge if the asset was
        // drawn with a different anchor convention.
        //
        // Render-hint values (sourceWidth/Height, offsetX/Y, renderScale)
        // apply to both layers of a two-layer item — the primary and
        // secondary are assumed to be painted on the same canvas at the
        // same anchor, so the hair-back artist works in the same coord
        // system as the hair-front artist.
        const itemSrcW = item.sourceWidth ?? SOURCE_W;
        const itemSrcH = item.sourceHeight ?? SOURCE_H;
        const scale = height / SOURCE_H;
        const itemW = Math.round(itemSrcW * scale);
        const itemH = Math.round(itemSrcH * scale);
        const left = 0;
        const top = 0;
        const dx = (item.offsetX ?? 0) * scale;
        const dy = (item.offsetY ?? 0) * scale;
        const renderScale = item.renderScale ?? 1;
        return (
          <img
            key={layer.key}
            // assetPath is a no-op for full https:// URLs (e.g. blob storage)
            // and prepends the GitHub Pages base path for /-rooted public assets.
            src={assetPath(layer.src)}
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
              zIndex: layer.z,
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
