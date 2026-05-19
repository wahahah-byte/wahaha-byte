import type { ApiClient } from "./client";

// Mirrors backend ItemSlot enum — keep in sync with C#
// Models/Domain/AvatarItems.cs. The granular MapleStory-style slots are what
// new uploads should target; the legacy values are kept so existing seeded
// rows still validate but aren't surfaced in the admin "New item" dropdown.
export type ItemSlot =
  // Legacy aliases
  | "HEAD"
  | "HAIR"
  | "BODY"
  | "HAND"
  | "BACK"
  | "FEET"
  // Granular slots — includes FACE which is both legacy and granular
  | "HAT"
  | "HAIR_FRONT"
  | "HAIR_BACK"
  | "FACE"
  | "EYE"
  | "EAR"
  | "TOP"
  | "BOTTOM"
  | "OVERALL"
  | "CAPE"
  | "GLOVES"
  | "SHOES"
  | "WEAPON_FRONT"
  | "WEAPON_BACK"
  | "WRIST";

export const GRANULAR_SLOTS: ItemSlot[] = [
  "HAT", "HAIR_FRONT", "HAIR_BACK",
  "FACE", "EYE", "EAR",
  "TOP", "BOTTOM", "OVERALL",
  "GLOVES", "SHOES",
  "CAPE",
  "WEAPON_FRONT", "WEAPON_BACK", "WRIST",
];

export const LEGACY_SLOTS: ItemSlot[] = [
  "HEAD", "HAIR", "BODY", "HAND", "BACK", "FEET",
];

export type Rarity = "COMMON" | "UNCOMMON" | "RARE" | "EPIC" | "LEGENDARY";

export interface AvatarItemDto {
  itemId: number;
  name: string;
  category: string;
  slot: ItemSlot;
  rarity: Rarity;
  cost: number;
  description?: string | null;
  previewAssetUrl?: string | null;
  secondaryAssetUrl?: string | null;
  isAvailable: boolean;
  offsetX?: number;
  offsetY?: number;
  sourceWidth?: number;
  sourceHeight?: number;
  renderScale?: number;
  coversHair?: boolean;
  coversHairFront?: boolean;
  coversHairBack?: boolean;
  gridCols?: number | null;
  gridRows?: number | null;
  contentMinX?: number | null;
  contentMinY?: number | null;
  contentMaxX?: number | null;
  contentMaxY?: number | null;
}

export interface UserInventoryDto {
  inventoryId: number;
  userId: string;
  itemId: number;
  acquiredAt: string;
  isEquipped: boolean;
  positionX?: number | null;
  positionY?: number | null;
  // Per-shape mobile placement — kept separate from desktop because the
  // grids have different aspect ratios (5×7 portrait vs 7×5 landscape).
  positionXMobile?: number | null;
  positionYMobile?: number | null;
  isRotated?: boolean;
  avatarItem?: AvatarItemDto | null;
}

export interface AvatarItemRenderHintsInput {
  coversHairFront?: boolean | null;
  coversHairBack?: boolean | null;
  offsetX?: number | null;
  offsetY?: number | null;
  renderScale?: number | null;
  sourceWidth?: number | null;
  sourceHeight?: number | null;
}

// `image`/`secondaryImage` are typed `unknown` so this interface is portable
// across web (File) and mobile (RN doesn't have File; uploads use a different
// shape). Web's avatar admin layer keeps the File-typed wrappers.
export interface AvatarItemCreateInput extends AvatarItemRenderHintsInput {
  name: string;
  category: string;
  slot: ItemSlot;
  rarity: Rarity;
  cost: number;
  description?: string | null;
  isAvailable?: boolean;
  image?: unknown;
  secondaryImage?: unknown;
}

export interface AvatarItemUpdateInput extends AvatarItemRenderHintsInput {
  name: string;
  category: string;
  slot: ItemSlot;
  rarity: Rarity;
  cost: number;
  description?: string | null;
  isAvailable: boolean;
  image?: unknown;
  secondaryImage?: unknown;
}

export interface AvatarItemRegisterByUrlInput extends AvatarItemRenderHintsInput {
  name: string;
  category: string;
  slot: ItemSlot;
  rarity: Rarity;
  cost: number;
  description?: string | null;
  previewAssetUrl: string;
  secondaryAssetUrl?: string | null;
  isAvailable?: boolean;
  grantAndEquipForCurrentUser?: boolean;
}

// Shop purchase wire types. Body is just { autoEquip } — the user being
// purchased-for is always the caller (resolved from JWT server-side).
// Response carries the new inventory row plus the user's updated balance
// so a successful buy can update the grid + balance display in one shot.
export interface PurchaseAvatarItemInput {
  autoEquip?: boolean;
}

export interface PurchaseAvatarItemResponse {
  inventory: UserInventoryDto;
  newBalance: number;
}

// PagedResult is shared across feature APIs — defined in api/tasks.ts so
// only one canonical export exists at the package root. Import from there
// if you need it explicitly.
import type { PagedResult } from "./tasks";

export function createAvatarApi(client: ApiClient) {
  return {
    catalog: (filters: { slot?: ItemSlot; rarity?: Rarity; pageNumber?: number; pageSize?: number } = {}) => {
      const qs = Object.entries(filters)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
        .join("&");
      return client.authedGet<PagedResult<AvatarItemDto>>(`/api/AvatarItems${qs ? `?${qs}` : ""}`);
    },
    getEquipped: () => client.authedGet<UserInventoryDto[]>(`/api/UserInventory/equipped`),
    getInventory: (pageNumber = 1, pageSize = 200) =>
      client.authedGet<PagedResult<UserInventoryDto>>(`/api/UserInventory?pageNumber=${pageNumber}&pageSize=${pageSize}`),
    acquire: (itemId: number, isEquipped = false) =>
      client.authedPost<UserInventoryDto>(`/api/UserInventory`, { itemId, isEquipped }),
    // Shop purchase — debits CurrentBalance by item.cost, creates a SPEND
    // PointTransaction with SourceType=shop_item, and adds the inventory
    // row (optionally auto-equipping). Server enforces no-duplicates so a
    // stale client can't double-buy.
    purchase: (itemId: number, input: PurchaseAvatarItemInput = {}) =>
      client.authedPost<PurchaseAvatarItemResponse>(
        `/api/AvatarItems/${itemId}/purchase`,
        { autoEquip: input.autoEquip ?? false },
      ),
    equip: (inventoryId: number) => client.authedPatch<void>(`/api/UserInventory/${inventoryId}/equip`),
    unequip: (inventoryId: number) => client.authedPatch<void>(`/api/UserInventory/${inventoryId}/unequip`),
    setPosition: (
      inventoryId: number,
      positionX: number | null,
      positionY: number | null,
      isRotated?: boolean,
      // "desktop" writes positionX/Y, "mobile" writes positionXMobile/YMobile.
      // Omit to keep the historical desktop-only behaviour.
      layout?: "desktop" | "mobile",
    ) =>
      client.authedPatch<void>(`/api/UserInventory/${inventoryId}/position`, {
        positionX,
        positionY,
        ...(isRotated === undefined ? {} : { isRotated }),
        ...(layout === undefined ? {} : { layout }),
      }),
    release: (inventoryId: number) => client.authedDelete<void>(`/api/UserInventory/${inventoryId}`),

    // ---- Admin / Moderator endpoints --------------------------------------
    registerItemByUrl: (input: AvatarItemRegisterByUrlInput) =>
      client.authedPost<AvatarItemDto>(`/api/AvatarItems/register-by-url`, input),

    toggleItemAvailability: (itemId: number) =>
      client.authedPatch<void>(`/api/AvatarItems/${itemId}/toggleavailability`),

    recomputeBounds: (itemId: number) =>
      client.authedPost<AvatarItemDto>(`/api/AvatarItems/${itemId}/recompute-bounds`, {}),

    grantItem: (itemId: number, payload: { targetEmail?: string | null; autoEquip?: boolean }) =>
      client.authedPost<UserInventoryDto>(`/api/AvatarItems/${itemId}/grant`, {
        targetEmail: payload.targetEmail ?? null,
        autoEquip: !!payload.autoEquip,
      }),

    deleteItem: (itemId: number) =>
      client.authedDelete<void>(`/api/AvatarItems/${itemId}`),
  };
}

export type AvatarApi = ReturnType<typeof createAvatarApi>;
