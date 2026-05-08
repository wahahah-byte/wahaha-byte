import { authedGet, authedPost, authedPatch, authedDelete } from "./client";

// Mirrors backend ItemSlot enum — keep in sync with C# Models/Domain/AvatarItems.cs.
export type ItemSlot = "HEAD" | "BODY" | "HAND" | "FACE" | "BACK" | "FEET";
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
}

export interface UserInventoryDto {
  inventoryId: number;
  userId: string;
  itemId: number;
  acquiredAt: string;
  isEquipped: boolean;
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
  acquire: (itemId: number, isEquipped = false) =>
    authedPost<UserInventoryDto>(`/api/UserInventory`, { itemId, isEquipped }),
  equip: (inventoryId: number) => authedPatch<void>(`/api/UserInventory/${inventoryId}/equip`),
  unequip: (inventoryId: number) => authedPatch<void>(`/api/UserInventory/${inventoryId}/unequip`),
  release: (inventoryId: number) => authedDelete<void>(`/api/UserInventory/${inventoryId}`),
};
