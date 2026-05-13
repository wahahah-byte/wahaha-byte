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
  // Front drape of a two-layer cape — sits over TOP/OVERALL so the cape
  // edges visibly fall in front of the body, but stays below GLOVES so the
  // hand sprites can still grab/hold things over it. Not a real backend
  // slot; only used as the z-anchor for a CAPE item's secondaryAssetUrl.
  CAPE_FRONT: 55,
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
// The chibi base only occupies SOURCE_W × SOURCE_H, but item canvases can
// be wider (e.g. weapons at 384×384). Without horizontal room the extra
// pixels overflow into the next layout section (or get visually clipped on
// surfaces with overflow:hidden). Add OVERHANG_RIGHT_SRC source pixels of
// right-side room so items up to (SOURCE_W + OVERHANG_RIGHT_SRC) wide fit
// inside their own preview box. Asymmetric so the container stays compact
// — the layout-level centring is recovered via a translateX below.
// 128 covers today's 384-wide weapons; update if items get even wider.
const OVERHANG_RIGHT_SRC = 128;
const CONTAINER_SOURCE_W = SOURCE_W + OVERHANG_RIGHT_SRC;
const ASPECT = CONTAINER_SOURCE_W / SOURCE_H;

// Slot-wide horizontal nudge applied to items that don't carry their own
// offsetX hint. In source-canvas pixels (256-wide); positive shifts the
// sprite right. Hair PNGs are consistently drawn a few pixels left of
// canvas centre, so a +3 default re-aligns them with the chibi head. The
// per-item OffsetX render hint still wins when set — this only kicks in
// for items that pass through without one.
const SLOT_OFFSET_X: Record<string, number> = {
  HAIR: 5,
  HAIR_FRONT: 5,
  HAIR_BACK: 5,
};

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
  // The base sprite renders at its native aspect inside the wider
  // container so the chibi doesn't get stretched. Items anchor at the
  // same (0, 0) as the base, so existing offsetX/Y tuning stays valid.
  // visualShift translates the whole container left by half the right
  // overhang so the chibi (which sits at the left edge of the asymmetric
  // container) ends up visually centred in its parent flex slot — without
  // bloating the chibi section's layout width or pushing the inventory
  // grid further away.
  const baseScale = height / SOURCE_H;
  const baseW = Math.round(SOURCE_W * baseScale);
  const baseLeft = 0;
  // The container sits at its own left edge in the parent flex slot, but
  // half of it is dead right-side overhang. Apply a positive `left:` on
  // the position:relative container to nudge the whole thing right by
  // half the overhang (plus a small calibration nudge that makes weapon
  // sprites with negative offsetX visually clear of the section edge) —
  // that re-centres the chibi in the parent without expanding the
  // section's layout box. Both terms are expressed in SOURCE pixels and
  // multiplied by baseScale so the visual shift tracks the chibi size:
  // when the avatar preview shrinks, the alignment scales with it.
  // Using `left:` instead of `transform:translateX` so it doesn't clobber
  // the avatar-idle bobbing animation that already lives on `transform`.
  const CHIBI_NUDGE_X_SRC = 40;
  const visualShiftX = Math.round((OVERHANG_RIGHT_SRC / 2 + CHIBI_NUDGE_X_SRC) * baseScale);

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
  //   - optionally, secondaryAssetUrl, drawn at a slot-dependent z-order:
  //       HAIR_FRONT   primary → HAIR_BACK   (back-of-head strands)
  //       CAPE         primary → CAPE_FRONT  (drape in front of body)
  //       WEAPON_FRONT primary → WEAPON_BACK (shaft passing behind chibi)
  //
  // Two-layer rows let a single inventory square own both sides of an
  // asset that wraps the chibi (hair around the head, cape around the
  // body, polearm shaft crossing the torso). For hair, the secondary is
  // suppressed by hideHairBack so a full-coverage hat hides the back
  // strands as well as the front. Cape and weapon secondaries always
  // render — hats don't interact with them.
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

    if (item.secondaryAssetUrl) {
      // Slot-dependent z + suppression rules.
      //   CAPE         → secondary drapes in front of body (CAPE_FRONT z)
      //   WEAPON_FRONT → secondary passes behind body (WEAPON_BACK z)
      //   anything else (HAIR_FRONT today) → secondary is back-of-head
      // Only hair secondaries respect hideHairBack — a helmet covers the
      // back strands. Cape/weapon secondaries never interact with hats.
      let secondaryZ: number;
      let respectHairCover: boolean;
      if (item.slot === "CAPE") {
        secondaryZ = SLOT_Z.CAPE_FRONT;
        respectHairCover = false;
      } else if (item.slot === "WEAPON_FRONT") {
        secondaryZ = SLOT_Z.WEAPON_BACK;
        respectHairCover = false;
      } else {
        secondaryZ = SLOT_Z.HAIR_BACK;
        respectHairCover = true;
      }
      if (!(respectHairCover && hideHairBack)) {
        layered.push({
          key: `${inv.inventoryId}:secondary`,
          inv,
          src: item.secondaryAssetUrl,
          z: secondaryZ,
        });
      }
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
        left: visualShiftX,
        animation: pose === "idle" ? "avatar-idle 2.6s ease-in-out infinite" : undefined,
      }}
    >
      <img
        src={basePath}
        alt=""
        width={baseW}
        height={height}
        draggable={false}
        style={{
          position: "absolute",
          // Anchor at baseLeft so the chibi sits centred inside the
          // overhang-padded container. `inset:0` would stretch the 256-wide
          // base to fill the wider container.
          left: baseLeft,
          top: 0,
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
        // Items shift right by the same baseLeft as the base so their
        // canvas (0, 0) keeps aligning with the base canvas (0, 0).
        // OffsetX/Y are still added on top.
        const left = baseLeft;
        const top = 0;
        // Per-item offsetX wins over slot defaults. Slot defaults exist
        // for systematic alignment quirks (e.g. all hair drawn 3 px left
        // of centre) so admins don't have to set the same offsetX on
        // every hair upload.
        const offsetX = item.offsetX ?? SLOT_OFFSET_X[item.slot] ?? 0;
        const offsetY = item.offsetY ?? 0;
        const dx = offsetX * scale;
        const dy = offsetY * scale;
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
