"use client";

import type { ItemSlot, UserInventoryDto } from "@/lib/api/avatar";
import { MOCK_AVATAR_ITEMS, type AvatarItemArt } from "@/lib/mockAvatar";

// itemId → pixel art lookup; PNG-backed items go to ChibiAvatar instead.
const ART_BY_ID = new Map<number, AvatarItemArt>(
  MOCK_AVATAR_ITEMS.flatMap((i) => (i.art ? [[i.itemId, i.art] as const] : [])),
);

interface Props {
  equipped: UserInventoryDto[];
  size?: number;        // pixel height of the rendered avatar
  pose?: "idle" | "doing"; // animation hint — only "idle" implemented
  className?: string;
}

// 14x16 chibi grid; uses fixed colors so the character doesn't shift with theme.
const C = {
  skin:    "#f6d4a3",
  hair:    "#7c4a18",
  eye:     "#1a1a2e",
  sparkle: "#ffffff",
  mouth:   "#dc2626",
  shirt:   "#4f46e5", // default body clothing
  pants:   "#1f2937",
};

function BaseCharacter() {
  return (
    <g shapeRendering="crispEdges">
      {/* HAIR */}
      <rect x={4} y={0} width={6} height={1} fill={C.hair} />
      <rect x={3} y={1} width={8} height={1} fill={C.hair} />
      <rect x={2} y={2} width={10} height={1} fill={C.hair} />
      <rect x={2} y={3} width={2} height={4} fill={C.hair} />
      <rect x={10} y={3} width={2} height={4} fill={C.hair} />

      {/* FACE */}
      <rect x={4} y={3} width={6} height={4} fill={C.skin} />
      <rect x={5} y={7} width={4} height={1} fill={C.skin} />

      {/* EYES with sparkles */}
      <rect x={4} y={4} width={2} height={2} fill={C.eye} />
      <rect x={8} y={4} width={2} height={2} fill={C.eye} />
      <rect x={5} y={4} width={1} height={1} fill={C.sparkle} />
      <rect x={9} y={4} width={1} height={1} fill={C.sparkle} />

      {/* MOUTH */}
      <rect x={6} y={6} width={2} height={1} fill={C.mouth} />

      {/* NECK */}
      <rect x={6} y={8} width={2} height={1} fill={C.skin} />

      {/* BODY + arms */}
      <rect x={4} y={9} width={6} height={3} fill={C.shirt} />
      <rect x={3} y={10} width={1} height={2} fill={C.skin} />
      <rect x={10} y={10} width={1} height={2} fill={C.skin} />
      {/* Hands */}
      <rect x={3} y={12} width={1} height={1} fill={C.skin} />
      <rect x={10} y={12} width={1} height={1} fill={C.skin} />

      {/* LEGS */}
      <rect x={4} y={12} width={2} height={3} fill={C.pants} />
      <rect x={8} y={12} width={2} height={3} fill={C.pants} />

      {/* FEET */}
      <rect x={3} y={15} width={3} height={1} fill={C.eye} />
      <rect x={8} y={15} width={3} height={1} fill={C.eye} />
    </g>
  );
}

export default function PixelAvatar({ equipped, size = 130, pose = "idle", className }: Props) {
  // Group items by slot; last-wins for duplicates.
  const bySlot = new Map<ItemSlot, AvatarItemArt>();
  for (const inv of equipped) {
    const item = inv.avatarItem;
    if (!item) continue;
    const art = ART_BY_ID.get(item.itemId);
    if (!art) continue;
    bySlot.set(item.slot, art);
  }

  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: pose === "idle" ? "avatar-idle 2.6s ease-in-out infinite" : undefined,
      }}
    >
      <svg
        viewBox="0 0 14 16"
        width={Math.round((size * 14) / 16)}
        height={size}
        shapeRendering="crispEdges"
        style={{ imageRendering: "pixelated" }}
      >
        {/* BACK first so it sits behind the base */}
        {bySlot.get("BACK")?.rects.map((r, i) => (
          <rect key={`BACK-${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
        ))}

        <BaseCharacter />

        {/* Slot overlays in z-order */}
        {(["BODY", "FEET", "HAND", "FACE", "HEAD"] as const).flatMap((slot) =>
          bySlot.get(slot)?.rects.map((r, i) => (
            <rect key={`${slot}-${i}`} x={r.x} y={r.y} width={r.w} height={r.h} fill={r.fill} />
          )) ?? [],
        )}
      </svg>
    </div>
  );
}
