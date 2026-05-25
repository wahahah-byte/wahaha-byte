"use client";

import Image from "next/image";
import { useState } from "react";
import type { AvatarItemDto } from "@/lib/api/avatar";
import { assetPath } from "@/lib/assetPath";
import { boundsTransformFor, useClientBounds } from "@/lib/cardTransform";

// CSS-transform fallbacks copied from apps/web/src/app/avatar/page.tsx so the
// shop card preview centres items the same way the inventory grid does
// (alpha-bbox bounds first; slot / class / per-file overrides as fallback).

const SLOT_TRANSFORM: Record<string, string> = {
  HEAD:  "scale(1.85) translateY(32%)",
  HAIR:  "scale(1.7) translateY(20%)",
  BODY:  "scale(1.4) translateY(-4%)",
  HAND:  "scale(1.4) translateY(-6%)",
  FACE:  "scale(1.7) translateY(12%)",
  BACK:  "scale(1.4) translateY(2%)",
  FEET:  "scale(1.7) translateY(-22%)",
  HAIR_FRONT: "scale(1.7) translateY(20%)",
  HAIR_BACK:  "scale(1.7) translateY(20%)",
  HAT:  "scale(1.85) translateY(32%)",
  EYE:  "scale(1.7) translateY(14%)",
  EAR:  "scale(1.7) translateY(12%)",
  TOP:     "scale(1.4) translateY(-4%)",
  BOTTOM:  "scale(1.4) translateY(8%)",
  OVERALL: "scale(1.3) translateY(2%)",
  CAPE:   "scale(1.3) translateY(-10%)",
  GLOVES: "scale(1.4) translateY(-6%)",
  SHOES:  "scale(1.7) translateY(-22%)",
  WEAPON_FRONT: "scale(1.4)",
  WEAPON_BACK:  "scale(1.4)",
  OFFHAND: "scale(2.15) translate(8%, -4%)",
  WRIST:  "scale(1.4) translateY(-6%)",
};

const CARD_TRANSFORM_OVERRIDE: Record<string, string> = {
  "weapon_polearm_alien_cyber.png": "scale(2.2) translate(3%, -10%)",
  "hair_seraph_wave_brown.png": "scale(1.7) translate(2.8%, 20%)",
  "weapon_front_magic_staff.png": "scale(1.4) translate(0%, -16%)",
};

const CARD_CLASS_TRANSFORM: Record<string, string> = {
  polearm: "scale(2.0) translate(0%, -12%)",
  sword: "scale(1.7) translate(8%, -12%)",
  headwear: "scale(2.0) translateY(24%)",
};

function cardClassTransform(item: AvatarItemDto): string | null {
  const haystack = `${item.name ?? ""} ${item.category ?? ""}`.toLowerCase();
  for (const token of Object.keys(CARD_CLASS_TRANSFORM)) {
    if (haystack.includes(token)) return CARD_CLASS_TRANSFORM[token];
  }
  return null;
}

interface Props {
  item: AvatarItemDto;
}

// Square preview for a shop card. Renders primary + optional secondary layer,
// both transformed by the same final transform so they stay aligned. Icon
// sized to fill ~75% of the box (fillFactor in bounds-based path; slot
// scale ≥1.3 for fallback).
export default function ShopItemPreview({ item }: Props) {
  const [failed, setFailed] = useState(false);
  // Trigger a client-side alpha scan when the DTO has no server bbox.
  const clientBounds = useClientBounds(
    item.previewAssetUrl ? assetPath(item.previewAssetUrl) : null,
  );

  if (!item.previewAssetUrl || failed) {
    return <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10 }}>—</div>;
  }

  const isTwoLayer = !!item.secondaryAssetUrl;
  // HAT/HEAD/OFFHAND: skip bounds-based auto so every helmet/shield renders at
  // the same uniform SLOT_TRANSFORM size, regardless of individual bbox.
  const isHatSlot = item.slot === "HAT" || item.slot === "HEAD";
  const isOffhandSlot = item.slot === "OFFHAND";
  // Force cols/rows = 1 for the shop card (square showcase, no grid footprint).
  // Lower fillFactor = more padding around the visible bbox.
  const autoBounds = (isTwoLayer || isHatSlot || isOffhandSlot)
    ? null
    : boundsTransformFor(item, clientBounds, { cols: 1, rows: 1, fillFactor: 0.6 });

  const filename = item.previewAssetUrl.split("/").pop() ?? "";
  const transform =
    autoBounds
    ?? CARD_TRANSFORM_OVERRIDE[filename]
    ?? cardClassTransform(item)
    ?? SLOT_TRANSFORM[item.slot]
    ?? "scale(1.4)";

  const layerStyle: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    transform,
    transformOrigin: "center",
    pointerEvents: "none",
  };

  const hasSecondary = !!item.secondaryAssetUrl;
  // HAIR_FRONT items: render primary on top of secondary so the front strands
  // overlap the back layer. All other two-layer items render secondary in front.
  const secondaryInFront = item.slot !== "HAIR_FRONT";

  // Outer wrapper shrinks everything uniformly. Lower SHRINK = smaller icons.
  // Applies on top of the bounds/slot transforms so they keep their relative
  // proportions but render smaller overall in the card.
  const SHRINK = 0.78;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${SHRINK})`,
        transformOrigin: "center",
      }}
    >
      {hasSecondary && !secondaryInFront && (
        <Image
          src={assetPath(item.secondaryAssetUrl!)}
          alt=""
          fill
          unoptimized
          draggable={false}
          style={{ ...layerStyle, zIndex: 0 }}
        />
      )}
      <Image
        src={assetPath(item.previewAssetUrl)}
        alt=""
        fill
        unoptimized
        draggable={false}
        onError={() => setFailed(true)}
        style={{ ...layerStyle, zIndex: 1 }}
      />
      {hasSecondary && secondaryInFront && (
        <Image
          src={assetPath(item.secondaryAssetUrl!)}
          alt=""
          fill
          unoptimized
          draggable={false}
          style={{ ...layerStyle, zIndex: 2 }}
        />
      )}
    </div>
  );
}
