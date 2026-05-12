import { authedGet, authedPost, authedPatch, authedDelete } from "./client";

// Mirrors backend ItemSlot enum — keep in sync with C# Models/Domain/AvatarItems.cs.
export type ItemSlot = "HEAD" | "HAIR" | "BODY" | "HAND" | "FACE" | "BACK" | "FEET";
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
  isAvailable: boolean;
  // Optional render-only nudge (source-canvas pixels, 256×384 grid).
  // Mock-data only — backend ignores; ChibiAvatar applies as a transform.
  offsetX?: number;
  offsetY?: number;
  // Optional native canvas dimensions of the asset. Defaults to 256×384
  // (matches base.png). Use when a sprite extends past the character
  // bounds — e.g. an oversized weapon on a wider canvas. The item's
  // canvas is centered over the base canvas; offsetX/Y still nudges
  // from that anchor. Mock-data only — backend ignores.
  sourceWidth?: number;
  sourceHeight?: number;
  // Optional uniform scale applied around the item's center. Defaults to 1.
  // Use to up- or down-scale a sprite without redrawing it; because the
  // origin is the item's center, offsetX/Y stays calibrated across scale
  // changes. Mock-data only — backend ignores.
  renderScale?: number;
  // When true, hides any equipped hair (category "hair") while this item
  // is equipped. Use for full-coverage helmets / masks where hair would
  // otherwise poke through. Mock-data only — backend ignores.
  coversHair?: boolean;
  // RE-style inventory footprint. Null falls back to 1x1 in the avatar
  // page's getItemSize() — kept nullable so older rows without a stored
  // size still render.
  gridCols?: number | null;
  gridRows?: number | null;
}

export interface UserInventoryDto {
  inventoryId: number;
  userId: string;
  itemId: number;
  acquiredAt: string;
  isEquipped: boolean;
  // (x, y) grid position assigned by the avatar page's drag-and-drop layout.
  // Null when the row was never positioned — the client auto-places it on
  // first load.
  positionX?: number | null;
  positionY?: number | null;
  // 90° rotation persisted across reloads. Toggled by Q/E while dragging.
  isRotated?: boolean;
  avatarItem?: AvatarItemDto | null;
}

export interface PagedResult<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Real-backend client. Currently unused by the UI (PixelAvatar takes mock data),
// declared up-front so the eventual swap is a one-line source change.
export const avatarApi = {
  catalog: (filters: { slot?: ItemSlot; rarity?: Rarity; pageNumber?: number; pageSize?: number } = {}) => {
    const qs = Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join("&");
    return authedGet<PagedResult<AvatarItemDto>>(`/api/AvatarItems${qs ? `?${qs}` : ""}`);
  },
  getEquipped: () => authedGet<UserInventoryDto[]>(`/api/UserInventory/equipped`),
  // Full inventory for the current user (paged). Used by the avatar page to
  // tell which catalogue items the user already owns vs needs to acquire.
  getInventory: (pageNumber = 1, pageSize = 200) =>
    authedGet<PagedResult<UserInventoryDto>>(`/api/UserInventory?pageNumber=${pageNumber}&pageSize=${pageSize}`),
  acquire: (itemId: number, isEquipped = false) =>
    authedPost<UserInventoryDto>(`/api/UserInventory`, { itemId, isEquipped }),
  equip: (inventoryId: number) => authedPatch<void>(`/api/UserInventory/${inventoryId}/equip`),
  unequip: (inventoryId: number) => authedPatch<void>(`/api/UserInventory/${inventoryId}/unequip`),
  setPosition: (
    inventoryId: number,
    positionX: number | null,
    positionY: number | null,
    isRotated?: boolean,
  ) =>
    authedPatch<void>(`/api/UserInventory/${inventoryId}/position`, {
      positionX,
      positionY,
      // Omit when undefined so the backend keeps the existing value
      // (lets older callers update just the position).
      ...(isRotated === undefined ? {} : { isRotated }),
    }),
  release: (inventoryId: number) => authedDelete<void>(`/api/UserInventory/${inventoryId}`),
};
