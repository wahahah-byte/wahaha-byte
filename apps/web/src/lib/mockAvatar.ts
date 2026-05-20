import type { AvatarItemDto, ItemSlot, UserInventoryDto } from "@/lib/api/avatar";
import { applyHints } from "@wahaha/shared";

// Pixel art renders onto a fixed 14×16 grid that PixelAvatar uses as SVG viewBox.
// Regions: hair rows 0-2, face 3-7, neck 8, body 9-11, arms cols 3+10 rows 10-11,
// legs rows 12-14, feet row 15. Items layer in slot z-order — see PixelAvatar.tsx.

export interface PixelRect {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
}

export interface AvatarItemArt {
  itemId: number;
  slot: ItemSlot;
  rects: PixelRect[];
}

// Mock catalog; PNG-backed items use previewAssetUrl, legacy items carry inline `art`.
export const MOCK_AVATAR_ITEMS: (AvatarItemDto & { art?: AvatarItemArt })[] = [
  {
    itemId: 1001,
    name: "Pixel Beanie",
    category: "headwear",
    slot: "HEAD",
    rarity: "COMMON",
    cost: 25,
    description: "A snug knit cap.",
    previewAssetUrl: null,
    isAvailable: true,
    art: {
      itemId: 1001, slot: "HEAD",
      rects: [
        { x: 4, y: 0, w: 6, h: 1, fill: "#a78bfa" },  // top
        { x: 3, y: 1, w: 8, h: 1, fill: "#a78bfa" },  // upper band
        { x: 2, y: 2, w: 10, h: 1, fill: "#7c3aed" }, // brim/band
      ],
    },
  },
  {
    itemId: 1002,
    name: "Crown",
    category: "headwear",
    slot: "HEAD",
    rarity: "LEGENDARY",
    cost: 500,
    description: "A king's headpiece.",
    previewAssetUrl: null,
    isAvailable: true,
    art: {
      itemId: 1002, slot: "HEAD",
      rects: [
        { x: 4, y: 1, w: 1, h: 1, fill: "#fbbf24" },  // left spike
        { x: 6, y: 1, w: 1, h: 1, fill: "#fbbf24" },  // mid spike
        { x: 8, y: 1, w: 1, h: 1, fill: "#fbbf24" },  // right spike
        { x: 5, y: 0, w: 1, h: 1, fill: "#fef3c7" },  // gem
        { x: 7, y: 0, w: 1, h: 1, fill: "#fef3c7" },  // gem
        { x: 9, y: 0, w: 1, h: 1, fill: "#fef3c7" },  // gem
        { x: 3, y: 2, w: 8, h: 1, fill: "#f59e0b" },  // band base
      ],
    },
  },
  {
    itemId: 1003,
    name: "Shades",
    category: "eyewear",
    slot: "FACE",
    rarity: "UNCOMMON",
    cost: 60,
    description: "Cool customer.",
    previewAssetUrl: null,
    isAvailable: true,
    art: {
      itemId: 1003, slot: "FACE",
      rects: [
        { x: 4, y: 4, w: 2, h: 2, fill: "#0f172a" }, // left lens
        { x: 8, y: 4, w: 2, h: 2, fill: "#0f172a" }, // right lens
        { x: 6, y: 4, w: 2, h: 1, fill: "#0f172a" }, // bridge
      ],
    },
  },
  {
    itemId: 1004,
    name: "Vest",
    category: "outerwear",
    slot: "BODY",
    rarity: "COMMON",
    cost: 30,
    description: "Adventurer's vest.",
    previewAssetUrl: null,
    isAvailable: true,
    art: {
      itemId: 1004, slot: "BODY",
      rects: [
        { x: 4, y: 9, w: 2, h: 3, fill: "#10b981" }, // left panel
        { x: 8, y: 9, w: 2, h: 3, fill: "#10b981" }, // right panel
        { x: 5, y: 9, w: 4, h: 1, fill: "#10b981" }, // collar
      ],
    },
  },
  {
    itemId: 1005,
    name: "Lab Coat",
    category: "outerwear",
    slot: "BODY",
    rarity: "RARE",
    cost: 120,
    description: "Science!",
    previewAssetUrl: null,
    isAvailable: true,
    art: {
      itemId: 1005, slot: "BODY",
      rects: [
        { x: 4, y: 9, w: 6, h: 3, fill: "#e5e7eb" },
        { x: 6, y: 9, w: 1, h: 3, fill: "#9ca3af" }, // shadow stripe
        { x: 7, y: 9, w: 1, h: 3, fill: "#9ca3af" },
      ],
    },
  },
  {
    itemId: 1006,
    name: "Boots",
    category: "footwear",
    slot: "FEET",
    rarity: "COMMON",
    cost: 20,
    description: "Sturdy boots.",
    previewAssetUrl: null,
    isAvailable: true,
    art: {
      itemId: 1006, slot: "FEET",
      rects: [
        { x: 4, y: 14, w: 2, h: 1, fill: "#78350f" }, // left leg bottom
        { x: 8, y: 14, w: 2, h: 1, fill: "#78350f" }, // right leg bottom
        { x: 3, y: 15, w: 3, h: 1, fill: "#92400e" }, // left foot
        { x: 8, y: 15, w: 3, h: 1, fill: "#92400e" }, // right foot
      ],
    },
  },
  {
    itemId: 1007,
    name: "Backpack",
    category: "back",
    slot: "BACK",
    rarity: "UNCOMMON",
    cost: 75,
    description: "Carry your gear.",
    previewAssetUrl: null,
    isAvailable: true,
    art: {
      itemId: 1007, slot: "BACK",
      rects: [
        { x: 3, y: 9, w: 1, h: 3, fill: "#92400e" },  // left strap edge
        { x: 10, y: 9, w: 1, h: 3, fill: "#92400e" }, // right strap edge
        { x: 4, y: 8, w: 6, h: 1, fill: "#92400e" },  // top peeking
      ],
    },
  },
  {
    itemId: 1008,
    name: "Pencil",
    category: "tool",
    slot: "HAND",
    rarity: "COMMON",
    cost: 15,
    description: "For the studious.",
    previewAssetUrl: null,
    isAvailable: true,
    art: {
      itemId: 1008, slot: "HAND",
      rects: [
        { x: 11, y: 10, w: 1, h: 2, fill: "#fbbf24" }, // shaft
        { x: 11, y: 9, w: 1, h: 1, fill: "#1f2937" },  // tip
      ],
    },
  },
  {
    itemId: 2002,
    name: "Sweater",
    category: "outerwear",
    slot: "BODY",
    rarity: "COMMON",
    cost: 40,
    description: "A cozy knit sweater.",
    previewAssetUrl: "https://wahaha.blob.core.windows.net/avatar-items/sweater_knit_white.png",
    isAvailable: true,
  },
  // Uses planned granular HAIR_FRONT (z=80, below HEAD/HAT) so hair renders behind hats.
  {
    itemId: 2003,
    name: "Seraph Wave Brown",
    category: "hair",
    slot: "HAIR_FRONT" as ItemSlot,
    rarity: "UNCOMMON",
    cost: 60,
    description: "Long wavy brown hair.",
    previewAssetUrl: "https://wahaha.blob.core.windows.net/avatar-items/hair_seraph_wave_brown.png",
    isAvailable: true,
    offsetX: 11,
  },
  // WEAPON_FRONT (z=130) — planned granular slot; backend currently maps to HAND.
  // sourceWidth=384 so polearm extends past character bounds; ChibiAvatar centers it.
  {
    itemId: 2004,
    name: "Cyber Polearm",
    category: "weapon",
    slot: "WEAPON_FRONT" as ItemSlot,
    rarity: "EPIC",
    cost: 500,
    description: "An alien cyber polearm crackling with energy.",
    // Slug-based naming; the old GUID-style filename is now 404.
    previewAssetUrl: "https://wahaha.blob.core.windows.net/avatar-items/weapon_front_cyber_polearm.png",
    // Back-layer shaft (portion behind chibi body); ChibiAvatar composes both layers.
    secondaryAssetUrl: "https://wahaha.blob.core.windows.net/avatar-items/weapon_front_cyber_polearm_back.png",
    isAvailable: true,
    sourceWidth: 384,
    sourceHeight: 384,
    offsetX: 6,
    offsetY: -8,
    renderScale: 1.25,
    // Backend persists gridCols/Rows; mock must mirror or static-demo defaults to 1×1.
    gridCols: 2,
    gridRows: 1,
  },
  {
    itemId: 2006,
    name: "Flower Crown",
    category: "headwear",
    slot: "HEAD",
    rarity: "RARE",
    cost: 120,
    description: "A delicate crown of pixel flowers.",
    previewAssetUrl: "https://wahaha.blob.core.windows.net/avatar-items/hat_crown_flower.png",
    isAvailable: true,
  },
];

const itemById = new Map(MOCK_AVATAR_ITEMS.map((i) => [i.itemId, i]));
export function mockItem(id: number) { return itemById.get(id) ?? null; }

// Default mock equipped set; PNG-backed items show on ChibiAvatar.
export const MOCK_EQUIPPED_IDS: number[] = [2002, 2003, 2004];

export function buildMockEquipped(): UserInventoryDto[] {
  const now = new Date().toISOString();
  return MOCK_EQUIPPED_IDS
    .map((id, i) => {
      const item = itemById.get(id);
      if (!item) return null;
      const { art: _art, ...dto } = item;
      void _art;
      const inv: UserInventoryDto = {
        inventoryId: 9000 + i,
        userId: "00000000-0000-0000-0000-000000000000",
        itemId: dto.itemId,
        acquiredAt: now,
        isEquipped: true,
        // Apply hints so callers rendering the mock directly get class-level offsets.
        avatarItem: applyHints(dto),
      };
      return inv;
    })
    .filter((x): x is UserInventoryDto => x !== null);
}

// Demo-mode inventory: every PNG-backed mock item is owned; same four pre-equipped.
export function buildMockInventory(): UserInventoryDto[] {
  const now = new Date().toISOString();
  const equippedSet = new Set(MOCK_EQUIPPED_IDS);
  return MOCK_AVATAR_ITEMS
    .filter((item) => item.previewAssetUrl)
    .map((item, i) => {
      const { art: _art, ...dto } = item;
      void _art;
      const inv: UserInventoryDto = {
        inventoryId: 9100 + i,
        userId: "00000000-0000-0000-0000-000000000000",
        itemId: dto.itemId,
        acquiredAt: now,
        isEquipped: equippedSet.has(dto.itemId),
        avatarItem: dto,
        // Positions null so autoPlace assigns slots based on active grid shape.
        positionX: null,
        positionY: null,
      };
      return inv;
    });
}
