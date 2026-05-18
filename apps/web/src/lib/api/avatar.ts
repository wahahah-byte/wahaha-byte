import { authedGet, authedPost, authedPatch, authedDelete, authedPostFormData, authedPutFormData } from "./client";

// Mirrors backend ItemSlot enum — keep in sync with C#
// Models/Domain/AvatarItems.cs. The granular MapleStory-style slots are what
// new uploads should target; the legacy values are kept so existing seeded
// rows still validate but aren't surfaced in the admin "New item" dropdown.
// FACE intentionally appears as granular (for masks / mouth accessories) and
// also remains a valid legacy value — the same name does double duty.
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

// Slots offered in the admin "New item" dropdown. Order here drives the
// order of <option> elements (head → body → accessories → weapons).
export const GRANULAR_SLOTS: ItemSlot[] = [
  "HAT", "HAIR_FRONT", "HAIR_BACK",
  "FACE", "EYE", "EAR",
  "TOP", "BOTTOM", "OVERALL",
  "GLOVES", "SHOES",
  "CAPE",
  "WEAPON_FRONT", "WEAPON_BACK", "WRIST",
];

// Listed separately so the admin UI can group / hide them behind an
// "advanced" toggle. Existing seeded rows surface in the catalogue list
// using these values; we render them but don't push admins toward them.
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
  // Optional second blob URL — drives the HAIR_BACK render layer for items
  // (currently only HAIR_FRONT-slotted hair) that need both a front-of-head
  // and back-of-head sprite from a single inventory row. The inventory card
  // ignores this; only ChibiAvatar reads it.
  secondaryAssetUrl?: string | null;
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
  //
  // Setting `coversHair: true` is treated as both coversHairFront and
  // coversHairBack being true (kept for back-compat with existing RENDER_HINTS
  // entries that pre-date the granular slot split).
  coversHair?: boolean;
  // Granular versions: hide just HAIR_FRONT (e.g. a band that pushes bangs
  // aside but leaves back hair visible) or just HAIR_BACK (rare). Mock-data
  // only — backend ignores.
  coversHairFront?: boolean;
  coversHairBack?: boolean;
  // RE-style inventory footprint. Null falls back to 1x1 in the avatar
  // page's getItemSize() — kept nullable so older rows without a stored
  // size still render.
  gridCols?: number | null;
  gridRows?: number | null;
  // Tight bounding box of non-transparent pixels in the source PNG (in
  // source-pixel coords, origin top-left). Computed server-side by
  // ContentBoundsService at upload time. Used by the inventory-card
  // renderer to auto-centre the visible content of the image. All four
  // are null for items uploaded before the auto-centre feature shipped
  // and for items registered by external URL (no blob to scan); the card
  // renderer falls back to SLOT_TRANSFORM / CARD_TRANSFORM_OVERRIDE in
  // that case.
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
  // (x, y) grid position assigned by the avatar page's drag-and-drop layout.
  // Null when the row was never positioned — the client auto-places it on
  // first load. positionX/Y is the desktop (7×5) placement; the Mobile
  // variants store the mobile (5×7) placement so the two grids don't
  // overwrite each other on the backend.
  positionX?: number | null;
  positionY?: number | null;
  positionXMobile?: number | null;
  positionYMobile?: number | null;
  // 90° rotation persisted across reloads. Toggled by Q/E while dragging.
  isRotated?: boolean;
  avatarItem?: AvatarItemDto | null;
}

// Shape of the input the API's POST /api/AvatarItems endpoint accepts as a
// multipart/form-data body. `image` is optional — items can be created with
// metadata only and have a PNG attached later via the update endpoint. Keep
// field names lowerCamelCase to match the C# CreateAvatarItemDto property
// names (ASP.NET model binding is case-insensitive but matching keeps the
// network payload predictable).
// Render-hint subset shared between create and update inputs. Every field is
// optional; sending null clears the existing value server-side and the
// frontend then falls back to per-slot defaults.
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
  // Optional second PNG for two-layer items (HAIR_FRONT today). Uploaded to
  // the same blob container and stored in SecondaryAssetUrl server-side.
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
  // Optional replacement second PNG. Omitting it preserves the existing
  // SecondaryAssetUrl on the row.
  secondaryImage?: File | null;
}

// JSON body for the register-by-url endpoint — for items whose PNG already
// lives in blob storage (uploaded by hand / via data factory) so the admin
// just needs to register a catalogue row pointing at the existing URL.
export interface AvatarItemRegisterByUrlInput extends AvatarItemRenderHintsInput {
  name: string;
  category: string;
  slot: ItemSlot;
  rarity: Rarity;
  cost: number;
  description?: string | null;
  previewAssetUrl: string;
  // Optional second already-uploaded blob URL. Server-side mirror of
  // secondaryImage on the upload-by-multipart path.
  secondaryAssetUrl?: string | null;
  isAvailable?: boolean;
  // Convenience flag — backend will also add the new item to the current
  // user's inventory and equip it (auto-unequipping anything in the same
  // slot). Useful for "register-and-test in one step" flows.
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
    // "desktop" writes positionX/Y, "mobile" writes positionXMobile/YMobile.
    // Omit to keep the historical desktop-only behaviour.
    layout?: "desktop" | "mobile",
  ) =>
    authedPatch<void>(`/api/UserInventory/${inventoryId}/position`, {
      positionX,
      positionY,
      // Omit when undefined so the backend keeps the existing value
      // (lets older callers update just the position).
      ...(isRotated === undefined ? {} : { isRotated }),
      ...(layout === undefined ? {} : { layout }),
    }),
  release: (inventoryId: number) => authedDelete<void>(`/api/UserInventory/${inventoryId}`),

  // ---- Admin / Moderator endpoints ----------------------------------------
  // These mirror the [Authorize(Roles = "Admin,Moderator")] gates in the API
  // AvatarItemsController. The client doesn't enforce roles — backend 403s
  // any caller without the right role — so the admin UI is free to hide the
  // entry points based on canManageAvatarItems() in lib/auth/roles.

  // POST /api/AvatarItems — create a new catalogue item, optionally with a
  // PNG that the backend uploads to blob storage and links via PreviewAssetUrl.
  // Use this when you have a fresh asset on disk to upload.
  createItem: (input: AvatarItemCreateInput) => {
    const form = buildAvatarItemForm(input);
    return authedPostFormData<AvatarItemDto>(`/api/AvatarItems`, form);
  },

  // POST /api/AvatarItems/register-by-url — register a catalogue row that
  // points at an already-uploaded blob URL. Skips the multipart upload step.
  registerItemByUrl: (input: AvatarItemRegisterByUrlInput) =>
    authedPost<AvatarItemDto>(`/api/AvatarItems/register-by-url`, input),

  // PUT /api/AvatarItems/{id} — update metadata + optionally replace the
  // PNG. Multipart even when no file is included; the backend reads
  // everything from form fields. The handler also requires the body's
  // ItemId to match the route id (see UpdateAvatarItemHandler.cs:32) —
  // append it explicitly so the deserialised DTO doesn't default to 0.
  updateItem: (itemId: number, input: AvatarItemUpdateInput) => {
    const form = buildAvatarItemForm(input);
    form.append("ItemId", String(itemId));
    return authedPutFormData<AvatarItemDto>(`/api/AvatarItems/${itemId}`, form);
  },

  // PATCH /api/AvatarItems/{id}/toggleavailability — flips isAvailable on or
  // off. No body; the backend reads the current value and inverts it.
  toggleItemAvailability: (itemId: number) =>
    authedPatch<void>(`/api/AvatarItems/${itemId}/toggleavailability`),

  // POST /api/AvatarItems/{id}/recompute-bounds — re-fetches the item's
  // PreviewAssetUrl, runs the alpha-channel bbox scan, and stores fresh
  // content_min/max_x/y on the row. Use to fix legacy items (uploaded
  // before the bbox feature) or URL-registered items (the register-by-url
  // path doesn't compute bounds at create time). Returns the updated DTO
  // so the caller can splice it back into the list.
  recomputeBounds: (itemId: number) =>
    authedPost<AvatarItemDto>(`/api/AvatarItems/${itemId}/recompute-bounds`, {}),

  // POST /api/AvatarItems/{id}/grant — Admin/Moderator grants the item to
  // a target user (or to themselves when targetEmail is omitted/empty).
  // Skips the regular point cost. autoEquip flips the new inventory row
  // to equipped (unequipping anything in the same slot first). Returns
  // the freshly created inventory row so the admin UI can confirm + the
  // host page can splice it into the user's current inventory if granting
  // to self.
  grantItem: (itemId: number, payload: { targetEmail?: string | null; autoEquip?: boolean }) =>
    authedPost<UserInventoryDto>(`/api/AvatarItems/${itemId}/grant`, {
      targetEmail: payload.targetEmail ?? null,
      autoEquip: !!payload.autoEquip,
    }),

  // DELETE /api/AvatarItems/{id} — Admin-only. Hidden in the UI for
  // Moderator-only sessions; the server enforces the same restriction.
  deleteItem: (itemId: number) =>
    authedDelete<void>(`/api/AvatarItems/${itemId}`),
};

// Serialise the create/update input into a FormData payload. Centralised so
// the field-name contract with C# CreateAvatarItemDto / UpdateAvatarItemDto
// only has to be maintained once. Booleans are stringified the way ASP.NET
// model binding expects ("true" / "false"), and undefined fields are omitted
// entirely (the server keeps the existing value on update). Explicit nulls
// would require a separate "reset to default" affordance — currently the UI
// just omits unset render-hint fields rather than sending null.
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
  // Render hints — only append when set, so unset fields fall through to
  // existing DB values on update.
  if (input.coversHairFront != null) form.append("CoversHairFront", String(input.coversHairFront));
  if (input.coversHairBack != null) form.append("CoversHairBack", String(input.coversHairBack));
  if (input.offsetX != null) form.append("OffsetX", String(input.offsetX));
  if (input.offsetY != null) form.append("OffsetY", String(input.offsetY));
  if (input.renderScale != null) form.append("RenderScale", String(input.renderScale));
  if (input.sourceWidth != null) form.append("SourceWidth", String(input.sourceWidth));
  if (input.sourceHeight != null) form.append("SourceHeight", String(input.sourceHeight));
  return form;
}
