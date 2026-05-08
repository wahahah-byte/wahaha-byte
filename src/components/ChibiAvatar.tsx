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
  // simply skipped — the base character still shows.
  const layered = equipped
    .filter((inv) => inv.avatarItem?.previewAssetUrl)
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
      {layered.map((inv) => (
        <img
          key={inv.inventoryId}
          // assetPath is a no-op for full https:// URLs (e.g. blob storage)
          // and prepends the GitHub Pages base path for /-rooted public assets.
          src={assetPath(inv.avatarItem!.previewAssetUrl!)}
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
      ))}
    </div>
  );
}
