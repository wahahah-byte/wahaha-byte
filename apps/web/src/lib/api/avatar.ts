import { authedGet, authedPost, authedPatch, authedDelete, authedPostFormData, authedPutFormData } from "./client";

// Mirrors backend ItemSlot enum — keep in sync with Models/Domain/AvatarItems.cs.
// FACE intentionally appears as granular and remains a valid legacy value.
export type ItemSlot =
  // Legacy aliases (deprecated for new uploads)
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

// Slots offered in admin "New item" dropdown; order drives <option> order.
export const GRANULAR_SLOTS: ItemSlot[] = [
  "HAT", "HAIR_FRONT", "HAIR_BACK",
  "FACE", "EYE", "EAR",
  "TOP", "BOTTOM", "OVERALL",
  "GLOVES", "SHOES",
  "CAPE",
  "WEAPON_FRONT", "WEAPON_BACK", "WRIST",
];

// Listed separately so admin UI can group/hide them behind an "advanced" toggle.
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
  // Optional second blob URL for HAIR_BACK render layer (two-layer items).
  secondaryAssetUrl?: string | null;
  isAvailable: boolean;
  // Optional render-only nudge (source-canvas px, 256×384 grid); mock-only.
  offsetX?: number;
  offsetY?: number;
  // Optional native canvas dims; defaults 256×384. Mock-only — backend ignores.
  sourceWidth?: number;
  sourceHeight?: number;
  // Optional uniform scale around item center; defaults 1. Mock-only.
  renderScale?: number;
  // Hide any equipped hair while this item is equipped (helmets/masks). Mock-only.
  // True is treated as both coversHairFront and coversHairBack (back-compat).
  coversHair?: boolean;
  // Granular: hide just HAIR_FRONT or HAIR_BACK. Mock-only.
  coversHairFront?: boolean;
  coversHairBack?: boolean;
  // RE-style inventory footprint; null → fall back to getItemSize() in avatar page.
  gridCols?: number | null;
  gridRows?: number | null;
  // Tight bbox of non-transparent pixels in source PNG (source-pixel coords).
  // Computed server-side at upload time; null for legacy/URL-registered items.
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
  // (x,y) grid position; positionX/Y is desktop (7×5), Mobile fields store mobile (5×7).
  positionX?: number | null;
  positionY?: number | null;
  positionXMobile?: number | null;
  positionYMobile?: number | null;
  // 90° rotation persisted across reloads; toggled by Q/E while dragging.
  isRotated?: boolean;
  avatarItem?: AvatarItemDto | null;
}

// Render-hint subset shared between create and update inputs; null clears server-side.
export interface AvatarItemRenderHintsInput {
  coversHairFront?: boolean | null;
  coversHairBack?: boolean | null;
  offsetX?: number | null;
  offsetY?: number | null;
  renderScale?: number | null;
  sourceWidth?: number | null;
  sourceHeight?: number | null;
}

export interface AvatarItemCreateInput extends AvatarItemRenderHintsInput {
  name: string;
  category: string;
  slot: ItemSlot;
  rarity: Rarity;
  cost: number;
  description?: string | null;
  isAvailable?: boolean;
  image?: File | null;
  // Optional second PNG for two-layer items (HAIR_FRONT today).
  secondaryImage?: File | null;
}

export interface AvatarItemUpdateInput extends AvatarItemRenderHintsInput {
  name: string;
  category: string;
  slot: ItemSlot;
  rarity: Rarity;
  cost: number;
  description?: string | null;
  isAvailable: boolean;
  image?: File | null;
  // Optional replacement second PNG; omitting preserves existing SecondaryAssetUrl.
  secondaryImage?: File | null;
}

// JSON body for register-by-url endpoint — items whose PNG already lives in blob storage.
export interface AvatarItemRegisterByUrlInput extends AvatarItemRenderHintsInput {
  name: string;
  category: string;
  slot: ItemSlot;
  rarity: Rarity;
  cost: number;
  description?: string | null;
  previewAssetUrl: string;
  // Optional second already-uploaded blob URL.
  secondaryAssetUrl?: string | null;
  isAvailable?: boolean;
  // Convenience: also add item to current user's inventory and equip it.
  grantAndEquipForCurrentUser?: boolean;
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

// Real-backend client; declared up-front so eventual swap is one-line.
export const avatarApi = {
  catalog: (filters: { slot?: ItemSlot; rarity?: Rarity; pageNumber?: number; pageSize?: number } = {}) => {
    const qs = Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
      .join("&");
    return authedGet<PagedResult<AvatarItemDto>>(`/api/AvatarItems${qs ? `?${qs}` : ""}`);
  },
  getEquipped: () => authedGet<UserInventoryDto[]>(`/api/UserInventory/equipped`),
  // Full inventory for current user (paged).
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
    // "desktop" writes positionX/Y, "mobile" writes positionXMobile/YMobile.
    layout?: "desktop" | "mobile",
  ) =>
    authedPatch<void>(`/api/UserInventory/${inventoryId}/position`, {
      positionX,
      positionY,
      // Omit when undefined so backend keeps existing value.
      ...(isRotated === undefined ? {} : { isRotated }),
      ...(layout === undefined ? {} : { layout }),
    }),
  release: (inventoryId: number) => authedDelete<void>(`/api/UserInventory/${inventoryId}`),

  // ---- Admin / Moderator endpoints ----------------------------------------
  // Mirror [Authorize(Roles="Admin,Moderator")] gates; backend enforces.

  // POST /api/AvatarItems — create new item, optionally with PNG.
  createItem: (input: AvatarItemCreateInput) => {
    const form = buildAvatarItemForm(input);
    return authedPostFormData<AvatarItemDto>(`/api/AvatarItems`, form);
  },

  // POST /api/AvatarItems/register-by-url — register row pointing at existing blob URL.
  registerItemByUrl: (input: AvatarItemRegisterByUrlInput) =>
    authedPost<AvatarItemDto>(`/api/AvatarItems/register-by-url`, input),

  // PUT /api/AvatarItems/{id} — update metadata + optionally replace PNG.
  // Handler requires body ItemId matches route id (UpdateAvatarItemHandler.cs:32).
  updateItem: (itemId: number, input: AvatarItemUpdateInput) => {
    const form = buildAvatarItemForm(input);
    form.append("ItemId", String(itemId));
    return authedPutFormData<AvatarItemDto>(`/api/AvatarItems/${itemId}`, form);
  },

  // PATCH /api/AvatarItems/{id}/toggleavailability — flips isAvailable.
  toggleItemAvailability: (itemId: number) =>
    authedPatch<void>(`/api/AvatarItems/${itemId}/toggleavailability`),

  // POST /api/AvatarItems/{id}/recompute-bounds — re-fetch + alpha-scan + store fresh bbox.
  recomputeBounds: (itemId: number) =>
    authedPost<AvatarItemDto>(`/api/AvatarItems/${itemId}/recompute-bounds`, {}),

  // POST /api/AvatarItems/{id}/grant — Admin/Mod grants item to target user.
  // Skips point cost; autoEquip flips new row to equipped.
  grantItem: (itemId: number, payload: { targetEmail?: string | null; autoEquip?: boolean }) =>
    authedPost<UserInventoryDto>(`/api/AvatarItems/${itemId}/grant`, {
      targetEmail: payload.targetEmail ?? null,
      autoEquip: !!payload.autoEquip,
    }),

  // DELETE /api/AvatarItems/{id} — Admin-only; hidden for Moderator sessions.
  deleteItem: (itemId: number) =>
    authedDelete<void>(`/api/AvatarItems/${itemId}`),
};

// Serialise create/update input into FormData; field names match C# DTO properties.
function buildAvatarItemForm(input: AvatarItemCreateInput | AvatarItemUpdateInput): FormData {
  const form = new FormData();
  form.append("Name", input.name);
  form.append("Category", input.category);
  form.append("Slot", input.slot);
  form.append("Rarity", input.rarity);
  form.append("Cost", String(input.cost));
  if (input.description != null) form.append("Description", input.description);
  if (input.isAvailable !== undefined) form.append("IsAvailable", String(input.isAvailable));
  if (input.image) form.append("Image", input.image, input.image.name);
  if (input.secondaryImage) form.append("SecondaryImage", input.secondaryImage, input.secondaryImage.name);
  // Render hints — only append when set so unset fields keep existing DB values.
  if (input.coversHairFront != null) form.append("CoversHairFront", String(input.coversHairFront));
  if (input.coversHairBack != null) form.append("CoversHairBack", String(input.coversHairBack));
  if (input.offsetX != null) form.append("OffsetX", String(input.offsetX));
  if (input.offsetY != null) form.append("OffsetY", String(input.offsetY));
  if (input.renderScale != null) form.append("RenderScale", String(input.renderScale));
  if (input.sourceWidth != null) form.append("SourceWidth", String(input.sourceWidth));
  if (input.sourceHeight != null) form.append("SourceHeight", String(input.sourceHeight));
  return form;
}
