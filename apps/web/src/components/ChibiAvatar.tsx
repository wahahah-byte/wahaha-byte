"use client";

import type { UserInventoryDto } from "@/lib/api/avatar";
import { assetPath } from "@/lib/assetPath";

// Z-order for stacking equipment layers above the base.
const SLOT_Z: Record<string, number> = {
  // Planned granular slots.
  WEAPON_BACK: 0,
  CAPE: 10,
  HAIR_BACK: 20,
  // Off-hand sits on the back arm — behind the body (base z=30) but in front of back-hair/cape.
  OFFHAND: 25,
  BOTTOM: 40,
  TOP: 50,
  // OVERALL shares TOP's z-band; hides TOP/BOTTOM when equipped.
  OVERALL: 50,
  // Front drape of a two-layer cape; sits over body but below GLOVES.
  CAPE_FRONT: 55,
  // Off-hand strap wrap — drawn over body so the grip appears to loop around the arm.
  // Sits just above CAPE_FRONT but still below GLOVES so a gauntlet covers it.
  OFFHAND_FRONT: 56,
  GLOVES: 60,
  SHOES: 70,
  HAIR_FRONT: 80,
  EYE: 100,
  EAR: 110,
  HAT: 120,
  WEAPON_FRONT: 130,
  WRIST: 140,

  // Current backend enum mapped to z-bands.
  BACK: 10,
  BODY: 50,
  FEET: 70,
  HAIR: 80,     // Behind HEAD/HAT so a helmet sits on top.
  FACE: 90,
  HAND: 130,
  HEAD: 120,
};

// Source canvas 256x384; render at integer divisors for crispest pixel art.
const SOURCE_W = 256;
const SOURCE_H = 384;
// Symmetric overhang so wider item canvases (e.g. weapons) fit without overflow.
const OVERHANG_SRC = 128;
const CONTAINER_SOURCE_W = SOURCE_W + OVERHANG_SRC * 2;
const ASPECT = CONTAINER_SOURCE_W / SOURCE_H;

// Slot-wide horizontal nudge for items without their own offsetX hint.
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
  // Base sprite renders at native aspect inside the wider container.
  const baseScale = height / SOURCE_H;
  const baseW = Math.round(SOURCE_W * baseScale);
  // Symmetric overhang anchors items to base canvas (0,0).
  const baseLeft = Math.round(OVERHANG_SRC * baseScale);

  // Suppression rules: hair-cover flags, legacy HAIR slot, OVERALL hiding TOP/BOTTOM.
  const hideHairFront = equipped.some((inv) => {
    const i = inv.avatarItem;
    return i?.coversHairFront === true || i?.coversHair === true;
  });
  const hideHairBack = equipped.some((inv) => {
    const i = inv.avatarItem;
    return i?.coversHairBack === true || i?.coversHair === true;
  });
  const hasOverall = equipped.some((inv) => inv.avatarItem?.slot === "OVERALL");

  // Each equipped row expands to primary + optional secondary layer.
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
    // Legacy single-bucket hair; hidden if either granular flag is set.
    const isLegacyHair =
      item.slot === "HAIR" || (item.slot !== "HAIR_FRONT" && item.slot !== "HAIR_BACK" && item.category === "hair");

    const primarySuppressed =
      (hideHairFront && isPrimaryHairFront) ||
      (hideHairBack && isPrimaryHairBack) ||
      ((hideHairFront || hideHairBack) && isLegacyHair);

    if (!primarySuppressed) {
      // Worn view (equippedAssetUrl) overrides catalog preview when set — used for items
      // whose chibi-side appearance differs from the shop icon (e.g. shields show their
      // back/strap when worn, but a front face in the catalog).
      const wornSrc = item.equippedAssetUrl ?? item.previewAssetUrl;
      layered.push({
        key: `${inv.inventoryId}:primary`,
        inv,
        src: wornSrc,
        z: SLOT_Z[item.slot] ?? 100,
      });
    }

    if (item.secondaryAssetUrl) {
      // Slot-dependent secondary z; only hair secondaries respect hideHairBack.
      let secondaryZ: number;
      let respectHairCover: boolean;
      if (item.slot === "CAPE") {
        secondaryZ = SLOT_Z.CAPE_FRONT;
        respectHairCover = false;
      } else if (item.slot === "WEAPON_FRONT") {
        secondaryZ = SLOT_Z.WEAPON_BACK;
        respectHairCover = false;
      } else if (item.slot === "OFFHAND") {
        // Strap/grip overlay drawn over body so it appears to wrap the arm.
        secondaryZ = SLOT_Z.OFFHAND_FRONT;
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
          // Anchor at baseLeft so chibi sits centred in overhang-padded container.
          left: baseLeft,
          top: 0,
          // Base body z between back-of-character and clothing layers.
          zIndex: 30,
          imageRendering: "pixelated",
          userSelect: "none",
          pointerEvents: "none",
        }}
      />
      {layered.map((layer) => {
        const item = layer.inv.avatarItem!;
        // Item canvas can be larger than base; anchor top-left at base (0,0).
        const itemSrcW = item.sourceWidth ?? SOURCE_W;
        const itemSrcH = item.sourceHeight ?? SOURCE_H;
        const scale = height / SOURCE_H;
        const itemW = Math.round(itemSrcW * scale);
        const itemH = Math.round(itemSrcH * scale);
        // Items shift right by baseLeft so canvas (0,0) aligns with base.
        const left = baseLeft;
        const top = 0;
        // Per-item offsetX wins over slot defaults.
        const offsetX = item.offsetX ?? SLOT_OFFSET_X[item.slot] ?? 0;
        const offsetY = item.offsetY ?? 0;
        const dx = offsetX * scale;
        const dy = offsetY * scale;
        const renderScale = item.renderScale ?? 1;
        return (
          <img
            key={layer.key}
            // assetPath no-ops full URLs and prepends base path for /-rooted assets.
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
