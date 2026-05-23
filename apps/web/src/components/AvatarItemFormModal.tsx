"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  avatarApi,
  GRANULAR_SLOTS,
  LEGACY_SLOTS,
  type AvatarItemDto,
  type AvatarItemCreateInput,
  type AvatarItemUpdateInput,
  type AvatarItemRegisterByUrlInput,
  type ItemSlot,
  type Rarity,
} from "@/lib/api/avatar";
import {
  CATEGORIES_BY_SLOT as CANONICAL_CATEGORIES_BY_SLOT,
  isValidCategory,
} from "@wahaha/shared";
import { assetPath } from "@/lib/assetPath";

const RARITIES: Rarity[] = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];

export type FormMode =
  | { kind: "create" }
  | { kind: "edit"; item: AvatarItemDto };

interface Props {
  mode: FormMode;
  onClose: () => void;
  // Fired with the saved DTO for parent splice without re-fetch.
  onSaved: (item: AvatarItemDto) => void;
}

type CreateSubMode = "upload" | "url";

// Modal for creating and editing avatar items (upload PNG or register URL).
export default function AvatarItemFormModal({ mode, onClose, onSaved }: Props) {
  const isEdit = mode.kind === "edit";
  const seed = mode.kind === "edit" ? mode.item : null;

  const [createMode, setCreateMode] = useState<CreateSubMode>("upload");
  const [name, setName] = useState(seed?.name ?? "");
  const [category, setCategory] = useState(seed?.category ?? "");
  const [slot, setSlot] = useState<ItemSlot>(seed?.slot ?? "HEAD");
  const [rarity, setRarity] = useState<Rarity>(seed?.rarity ?? "COMMON");
  const [cost, setCost] = useState<string>(seed ? String(seed.cost) : "0");
  const [description, setDescription] = useState(seed?.description ?? "");
  const [isAvailable, setIsAvailable] = useState(seed?.isAvailable ?? true);
  const [previewAssetUrl, setPreviewAssetUrl] = useState(seed?.previewAssetUrl ?? "");
  // URL-register only: server grants + equips on save.
  const [grantAndEquip, setGrantAndEquip] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  // Two-layer support for HAIR_FRONT/CAPE/WEAPON_FRONT slots.
  const [secondaryImage, setSecondaryImage] = useState<File | null>(null);
  const [secondaryAssetUrl, setSecondaryAssetUrl] = useState(seed?.secondaryAssetUrl ?? "");
  // Distinct "worn" view (e.g. shield back/strap) — optional, falls back to catalog preview.
  const [equippedImage, setEquippedImage] = useState<File | null>(null);
  const [equippedAssetUrl, setEquippedAssetUrl] = useState(seed?.equippedAssetUrl ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement | null>(null);
  const equippedFileInputRef = useRef<HTMLInputElement | null>(null);

  // Canonical category options for the current slot (drives the dropdown).
  const canonicalCategoriesForSlot = useMemo<readonly string[]>(
    () => CANONICAL_CATEGORIES_BY_SLOT[slot] ?? [],
    [slot],
  );

  // When slot changes, reset the category if it's no longer valid for the new slot.
  // Skip on initial mount so editing an existing item doesn't blank its category.
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) { isFirstRender.current = false; return; }
    if (category && !isValidCategory(slot, category)) setCategory("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slot]);

  // Slots that support a secondary asset (mirrors ChibiAvatar z-resolution).
  const supportsSecondaryAsset =
    slot === "HAIR_FRONT" || slot === "CAPE" || slot === "WEAPON_FRONT" || slot === "OFFHAND";
  // Per-slot copy for the secondary upload — describes the role of the second image so
  // admins know whether they're uploading a back layer, front drape, etc.
  const secondaryCopy = (() => {
    switch (slot) {
      case "HAIR_FRONT":
        return {
          short: "Back hair",
          field: "Back hair layer",
          help: "Drawn behind the body when equipped. Pairs with the catalog image (front hair).",
        };
      case "CAPE":
        return {
          short: "Front drape",
          field: "Front drape",
          help: "Drawn over the body when equipped. Pairs with the catalog image (back panel).",
        };
      case "WEAPON_FRONT":
        return {
          short: "Back portion",
          field: "Back portion of weapon",
          help: "Part of the weapon visible behind the chibi (e.g. the back end of a polearm).",
        };
      case "OFFHAND":
        return {
          short: "Strap",
          field: "Strap / front overlay",
          help: "Drawn over the arm so the shield grip appears to wrap around it. Sits in front of the body.",
        };
      default:
        return { short: "Secondary", field: "Secondary layer", help: "" };
    }
  })();
  const secondaryLayerLabel = secondaryCopy.short;
  // OFFHAND is the main use case (shield back face), but any slot may want a worn variant.
  // Surface the field only on slots where it's likely relevant to keep the form short.
  const supportsEquippedAsset =
    slot === "OFFHAND" || slot === "WEAPON_FRONT" || slot === "WEAPON_BACK" || slot === "HAND";
  // Per-slot copy for the worn/equipped upload — explains where this image is used on the chibi.
  const equippedCopy = (() => {
    if (slot === "OFFHAND") return {
      field: "Worn-from-behind image",
      help: "Shown on the chibi instead of the catalog image (shields face away when held in the back hand).",
      thumbLabel: "Worn (back)",
    };
    return {
      field: "Worn view",
      help: "Shown on the chibi instead of the catalog image when the worn appearance differs from the catalog view.",
      thumbLabel: "Worn",
    };
  })();

  // Render hints; empty string means "use slot default".
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [coversHairFront, setCoversHairFront] = useState<boolean>(seed?.coversHairFront ?? false);
  const [coversHairBack, setCoversHairBack] = useState<boolean>(seed?.coversHairBack ?? false);
  const [offsetX, setOffsetX] = useState<string>(seed?.offsetX != null ? String(seed.offsetX) : "");
  const [offsetY, setOffsetY] = useState<string>(seed?.offsetY != null ? String(seed.offsetY) : "");
  const [renderScale, setRenderScale] = useState<string>(seed?.renderScale != null ? String(seed.renderScale) : "");
  const [sourceWidth, setSourceWidth] = useState<string>(seed?.sourceWidth != null ? String(seed.sourceWidth) : "");
  const [sourceHeight, setSourceHeight] = useState<string>(seed?.sourceHeight != null ? String(seed.sourceHeight) : "");

  // Parse number-string input; returns "INVALID" sentinel for non-numeric.
  function parseOptionalNumber(s: string): number | null | "INVALID" {
    const trimmed = s.trim();
    if (trimmed === "") return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : "INVALID";
  }

  // Auto-focus first field on open.
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    nameInputRef.current?.focus();
  }, []);

  // Escape closes the modal.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const previewSrc = useMemo(() => {
    if (image) return URL.createObjectURL(image);
    if (isEdit && seed?.previewAssetUrl) return assetPath(seed.previewAssetUrl);
    if (!isEdit && createMode === "url" && previewAssetUrl) return previewAssetUrl;
    return null;
  }, [image, isEdit, seed, createMode, previewAssetUrl]);

  // Mirror of previewSrc for the secondary asset when slot uses it.
  const secondaryPreviewSrc = useMemo(() => {
    if (!supportsSecondaryAsset) return null;
    if (secondaryImage) return URL.createObjectURL(secondaryImage);
    if (isEdit && seed?.secondaryAssetUrl) return assetPath(seed.secondaryAssetUrl);
    if (!isEdit && createMode === "url" && secondaryAssetUrl) return secondaryAssetUrl;
    return null;
  }, [supportsSecondaryAsset, secondaryImage, isEdit, seed, createMode, secondaryAssetUrl]);

  // Mirror of previewSrc for the "worn" asset when slot supports it.
  const equippedPreviewSrc = useMemo(() => {
    if (!supportsEquippedAsset) return null;
    if (equippedImage) return URL.createObjectURL(equippedImage);
    if (isEdit && seed?.equippedAssetUrl) return assetPath(seed.equippedAssetUrl);
    if (!isEdit && createMode === "url" && equippedAssetUrl) return equippedAssetUrl;
    return null;
  }, [supportsEquippedAsset, equippedImage, isEdit, seed, createMode, equippedAssetUrl]);

  // Revoke object URLs to avoid blob leaks.
  useEffect(() => {
    if (!image) return;
    const src = URL.createObjectURL(image);
    return () => URL.revokeObjectURL(src);
  }, [image]);

  useEffect(() => {
    if (!secondaryImage) return;
    const src = URL.createObjectURL(secondaryImage);
    return () => URL.revokeObjectURL(src);
  }, [secondaryImage]);

  useEffect(() => {
    if (!equippedImage) return;
    const src = URL.createObjectURL(equippedImage);
    return () => URL.revokeObjectURL(src);
  }, [equippedImage]);

  async function handleSave() {
    if (submitting) return;
    if (!name.trim()) { setError("Name is required."); return; }
    if (!category.trim()) { setError("Category is required."); return; }
    if (!isValidCategory(slot, category)) {
      setError(`"${category}" is not a valid category for slot ${slot}.`);
      return;
    }
    const costN = Number(cost);
    if (!Number.isFinite(costN) || costN < 0) { setError("Cost must be a non-negative number."); return; }

    // Validate + collect render hint values.
    const ox = parseOptionalNumber(offsetX);
    const oy = parseOptionalNumber(offsetY);
    const rs = parseOptionalNumber(renderScale);
    const sw = parseOptionalNumber(sourceWidth);
    const sh = parseOptionalNumber(sourceHeight);
    if (ox === "INVALID" || oy === "INVALID" || rs === "INVALID" || sw === "INVALID" || sh === "INVALID") {
      setError("Render hint values must be numbers (or blank).");
      return;
    }
    const hints = {
      coversHairFront,
      coversHairBack,
      offsetX: ox,
      offsetY: oy,
      renderScale: rs,
      sourceWidth: sw,
      sourceHeight: sh,
    };

    setSubmitting(true);
    setError(null);

    // Drop secondary state for non-supporting slots.
    const secondaryImagePayload = supportsSecondaryAsset ? (secondaryImage ?? null) : null;
    const secondaryUrlPayload = supportsSecondaryAsset && secondaryAssetUrl.trim()
      ? secondaryAssetUrl.trim()
      : null;
    // Drop equipped state for non-supporting slots so a stale field doesn't leak through.
    const equippedImagePayload = supportsEquippedAsset ? (equippedImage ?? null) : null;
    const equippedUrlPayload = supportsEquippedAsset && equippedAssetUrl.trim()
      ? equippedAssetUrl.trim()
      : null;

    try {
      if (isEdit) {
        const payload: AvatarItemUpdateInput = {
          name: name.trim(),
          category: category.trim(),
          slot,
          rarity,
          cost: costN,
          description: description.trim() || null,
          isAvailable,
          image: image ?? null,
          secondaryImage: secondaryImagePayload,
          equippedImage: equippedImagePayload,
          ...hints,
        };
        const { data, error: apiError } = await avatarApi.updateItem(seed!.itemId, payload);
        if (apiError) { setError(apiError); return; }
        // Splice locally if server omits the DTO (204).
        const next: AvatarItemDto = data ?? {
          ...seed!,
          name: payload.name,
          category: payload.category,
          slot: payload.slot,
          rarity: payload.rarity,
          cost: payload.cost,
          description: payload.description ?? null,
          isAvailable: payload.isAvailable,
        };
        onSaved(next);
        onClose();
        return;
      }

      // create path
      if (createMode === "url") {
        if (!previewAssetUrl.trim()) { setError("Preview URL is required."); return; }
        const payload: AvatarItemRegisterByUrlInput = {
          name: name.trim(),
          category: category.trim(),
          slot,
          rarity,
          cost: costN,
          description: description.trim() || null,
          previewAssetUrl: previewAssetUrl.trim(),
          secondaryAssetUrl: secondaryUrlPayload,
          equippedAssetUrl: equippedUrlPayload,
          isAvailable,
          grantAndEquipForCurrentUser: grantAndEquip,
          ...hints,
        };
        const { data, error: apiError } = await avatarApi.registerItemByUrl(payload);
        if (apiError) { setError(apiError); return; }
        if (data) onSaved(data);
      } else {
        // upload mode — require image client-side.
        if (!image) { setError("Pick a PNG to upload."); return; }
        const payload: AvatarItemCreateInput = {
          name: name.trim(),
          category: category.trim(),
          slot,
          rarity,
          cost: costN,
          description: description.trim() || null,
          isAvailable,
          image,
          secondaryImage: secondaryImagePayload,
          equippedImage: equippedImagePayload,
          ...hints,
        };
        const { data, error: apiError } = await avatarApi.createItem(payload);
        if (apiError) { setError(apiError); return; }
        if (data) onSaved(data);
      }
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      data-edge-drawer-block
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "var(--color-modal-overlay)" }}
      onClick={(e) => { if (e.target === e.currentTarget && !submitting) onClose(); }}
    >
      <div
        className="w-full max-w-md relative"
        style={{
          background: "var(--color-panel)",
          border: "1px solid var(--color-border)",
          borderRadius: 6,
          boxShadow: "var(--shadow-popover)",
          padding: "20px 20px 16px",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <h2
            style={{
              color: "var(--color-fg)",
              fontSize: 11,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 700,
            }}
          >
            {isEdit ? `Edit Item #${seed!.itemId}` : "New Avatar Item"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            disabled={submitting}
            style={{
              fontSize: 16,
              lineHeight: 1,
              color: "var(--color-fg-subtle)",
              background: "transparent",
              border: "none",
              cursor: submitting ? "wait" : "pointer",
              padding: 4,
            }}
          >
            ×
          </button>
        </header>

        {!isEdit && (
          <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
            <ModeTab active={createMode === "upload"} onClick={() => setCreateMode("upload")} label="Upload PNG" />
            <ModeTab active={createMode === "url"} onClick={() => setCreateMode("url")} label="Register URL" />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Field label="Name *">
            <input
              ref={nameInputRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              className="themed-form-input"
            />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Slot *">
              <select value={slot} onChange={(e) => setSlot(e.target.value as ItemSlot)} className="themed-form-input">
                <optgroup label="Granular (preferred)">
                  {GRANULAR_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </optgroup>
                <optgroup label="Legacy (existing rows only)">
                  {LEGACY_SLOTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </optgroup>
              </select>
            </Field>
            <Field label="Rarity *">
              <select value={rarity} onChange={(e) => setRarity(e.target.value as Rarity)} className="themed-form-input">
                {RARITIES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 10 }}>
            <Field label="Category *">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="themed-form-input"
              >
                {/* Existing legacy category not in the canonical list — keep it selectable so
                    editing an old row doesn't silently change its category. */}
                {category && !canonicalCategoriesForSlot.includes(category) && (
                  <option value={category}>{category} (legacy)</option>
                )}
                {/* Placeholder forces an explicit selection on create. */}
                {!category && <option value="" disabled>Choose a category…</option>}
                {canonicalCategoriesForSlot.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Cost (pts)">
              <input
                type="number"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                min={0}
                className="themed-form-input"
              />
            </Field>
          </div>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={255}
              rows={2}
              className="themed-form-input"
              style={{ resize: "vertical", minHeight: 38 }}
            />
          </Field>

          {/* Asset section — primary "catalog" image is shown in the shop, inventory grid, and as
              the default chibi layer when no separate worn image is uploaded. */}
          {isEdit || createMode === "upload" ? (
            <Field
              label={isEdit ? "Replace catalog image (optional)" : "Catalog image (PNG) *"}
              help="Shown in the shop and inventory grid. Also used on the chibi unless a separate worn image is uploaded below."
            >
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png"
                  onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                  style={{ flex: 1, minWidth: 0, color: "var(--color-fg-muted)", fontSize: 11 }}
                />
                {image && (
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    style={smallBtnStyle}
                  >
                    Clear
                  </button>
                )}
              </div>
            </Field>
          ) : (
            <>
              <Field
                label="Catalog image URL *"
                help="Shown in the shop and inventory grid. Also used on the chibi unless a separate worn image URL is provided below."
              >
                <input
                  type="url"
                  value={previewAssetUrl}
                  onChange={(e) => setPreviewAssetUrl(e.target.value)}
                  maxLength={255}
                  placeholder="https://…/avatar-items/hat.png"
                  className="themed-form-input"
                />
              </Field>
              <label
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: "var(--color-fg-muted)", fontSize: 10,
                  letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500,
                }}
              >
                <input type="checkbox" checked={grantAndEquip} onChange={(e) => setGrantAndEquip(e.target.checked)} />
                Grant + equip on my chibi
              </label>
            </>
          )}

          {/* Secondary asset (slot-conditional, optional) — separate render layer paired with the
              catalog image. Role depends on slot: back hair, front cape drape, back of weapon,
              or shield strap wrap. */}
          {supportsSecondaryAsset && (
            isEdit || createMode === "upload" ? (
              <Field
                label={isEdit
                  ? `Replace ${secondaryCopy.field.toLowerCase()} (optional)`
                  : `${secondaryCopy.field} (PNG, optional)`}
                help={secondaryCopy.help}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    ref={secondaryFileInputRef}
                    type="file"
                    accept="image/png"
                    onChange={(e) => setSecondaryImage(e.target.files?.[0] ?? null)}
                    style={{ flex: 1, minWidth: 0, color: "var(--color-fg-muted)", fontSize: 11 }}
                  />
                  {secondaryImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setSecondaryImage(null);
                        if (secondaryFileInputRef.current) secondaryFileInputRef.current.value = "";
                      }}
                      style={smallBtnStyle}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </Field>
            ) : (
              <Field
                label={`${secondaryCopy.field} URL (optional)`}
                help={secondaryCopy.help}
              >
                <input
                  type="url"
                  value={secondaryAssetUrl}
                  onChange={(e) => setSecondaryAssetUrl(e.target.value)}
                  maxLength={255}
                  placeholder={
                    slot === "CAPE"
                      ? "https://…/avatar-items/cape_valor_front.png"
                      : slot === "WEAPON_FRONT"
                        ? "https://…/avatar-items/weapon_polearm_back.png"
                        : slot === "OFFHAND"
                          ? "https://…/avatar-items/shield_kite_strap.png"
                          : "https://…/avatar-items/hair_seraph_back.png"
                  }
                  className="themed-form-input"
                />
              </Field>
            )
          )}

          {/* Equipped/worn asset (slot-conditional, optional) — substitutes the catalog image
              on the chibi when the worn appearance differs from the catalog photo
              (e.g. shield: catalog = front face, chibi = back/strap). */}
          {supportsEquippedAsset && (
            isEdit || createMode === "upload" ? (
              <Field
                label={isEdit
                  ? `Replace ${equippedCopy.field.toLowerCase()} (optional)`
                  : `${equippedCopy.field} (PNG, optional)`}
                help={equippedCopy.help}
              >
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input
                    ref={equippedFileInputRef}
                    type="file"
                    accept="image/png"
                    onChange={(e) => setEquippedImage(e.target.files?.[0] ?? null)}
                    style={{ flex: 1, minWidth: 0, color: "var(--color-fg-muted)", fontSize: 11 }}
                  />
                  {equippedImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setEquippedImage(null);
                        if (equippedFileInputRef.current) equippedFileInputRef.current.value = "";
                      }}
                      style={smallBtnStyle}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </Field>
            ) : (
              <Field
                label={`${equippedCopy.field} URL (optional)`}
                help={equippedCopy.help}
              >
                <input
                  type="url"
                  value={equippedAssetUrl}
                  onChange={(e) => setEquippedAssetUrl(e.target.value)}
                  maxLength={255}
                  placeholder="https://…/avatar-items/shield_kite_worn.png"
                  className="themed-form-input"
                />
              </Field>
            )
          )}

          {(previewSrc || secondaryPreviewSrc || equippedPreviewSrc) && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "4px 0" }}>
              {previewSrc && (
                <PreviewThumb src={previewSrc} label="Catalog" />
              )}
              {secondaryPreviewSrc && (
                <PreviewThumb src={secondaryPreviewSrc} label={secondaryLayerLabel} />
              )}
              {equippedPreviewSrc && (
                <PreviewThumb src={equippedPreviewSrc} label={equippedCopy.thumbLabel} />
              )}
            </div>
          )}

          <label
            style={{
              display: "flex", alignItems: "center", gap: 6,
              color: "var(--color-fg-muted)", fontSize: 10,
              letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500,
            }}
          >
            <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} />
            Available in catalogue
          </label>

          {/* Advanced render-hint controls */}
          <div style={{ borderTop: "1px solid var(--color-border-hairline)", paddingTop: 8 }}>
            <button
              type="button"
              onClick={() => setShowAdvanced((v) => !v)}
              aria-expanded={showAdvanced}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "4px 0",
                background: "transparent", border: "none", cursor: "pointer",
                color: "var(--color-fg-subtle)", fontSize: 9,
                letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600,
              }}
            >
              <span>Advanced (render hints)</span>
              <span aria-hidden style={{ fontSize: 11 }}>{showAdvanced ? "▾" : "▸"}</span>
            </button>

            {showAdvanced && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <label style={hintCheckLabelStyle}>
                    <input
                      type="checkbox"
                      checked={coversHairFront}
                      onChange={(e) => setCoversHairFront(e.target.checked)}
                    />
                    Covers hair (front)
                  </label>
                  <label style={hintCheckLabelStyle}>
                    <input
                      type="checkbox"
                      checked={coversHairBack}
                      onChange={(e) => setCoversHairBack(e.target.checked)}
                    />
                    Covers hair (back)
                  </label>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <Field label="Offset X (src px)">
                    <input
                      type="number"
                      value={offsetX}
                      onChange={(e) => setOffsetX(e.target.value)}
                      placeholder="0"
                      className="themed-form-input"
                    />
                  </Field>
                  <Field label="Offset Y (src px)">
                    <input
                      type="number"
                      value={offsetY}
                      onChange={(e) => setOffsetY(e.target.value)}
                      placeholder="0"
                      className="themed-form-input"
                    />
                  </Field>
                </div>

                <Field label={`Render scale${renderScale ? ` (${renderScale}×)` : ""}`}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="range"
                      min={0.5}
                      max={2.5}
                      step={0.05}
                      value={renderScale === "" ? 1 : Number(renderScale)}
                      onChange={(e) => setRenderScale(e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => setRenderScale("")}
                      title="Reset to slot default"
                      style={smallBtnStyle}
                    >
                      Reset
                    </button>
                  </div>
                </Field>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <Field label="Source width (px)">
                    <input
                      type="number"
                      value={sourceWidth}
                      onChange={(e) => setSourceWidth(e.target.value)}
                      placeholder="256"
                      min={0}
                      className="themed-form-input"
                    />
                  </Field>
                  <Field label="Source height (px)">
                    <input
                      type="number"
                      value={sourceHeight}
                      onChange={(e) => setSourceHeight(e.target.value)}
                      placeholder="384"
                      min={0}
                      className="themed-form-input"
                    />
                  </Field>
                </div>

                <p style={{ color: "var(--color-fg-subtle)", fontSize: 9, lineHeight: 1.4, margin: 0 }}>
                  Leave a field blank to use the per-slot default. Offsets and
                  source dimensions are in the original PNG&apos;s pixel coordinates.
                </p>
              </div>
            )}
          </div>

          {error && (
            <p
              role="alert"
              style={{
                color: "var(--color-danger)",
                fontSize: 11,
                lineHeight: 1.4,
                background: "var(--color-danger-bg)",
                border: "1px solid var(--color-danger-border)",
                padding: "6px 8px",
                borderRadius: 2,
              }}
            >
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", marginTop: 4 }}>
            <button type="button" onClick={onClose} disabled={submitting} style={cancelBtnStyle}>
              Cancel
            </button>
            <button type="button" onClick={handleSave} disabled={submitting} style={saveBtnStyle}>
              {submitting ? "Saving…" : isEdit ? "Save changes" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PreviewThumb({ src, label }: { src: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{
        width: 96, height: 96,
        border: "1px solid var(--color-border-hairline)",
        background: "rgba(0,0,0,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <Image
          src={src}
          alt=""
          width={192}
          height={192}
          unoptimized
          style={{ width: "100%", height: "100%", objectFit: "contain", imageRendering: "pixelated" }}
        />
      </div>
      <span style={{ color: "var(--color-fg-subtle)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
        {label}
      </span>
    </div>
  );
}

function Field({ label, help, children }: { label: string; help?: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ color: "var(--color-fg-subtle)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
        {label}
      </span>
      {children}
      {help && (
        <span style={{ color: "var(--color-fg-muted)", fontSize: 10, lineHeight: 1.35, marginTop: 2 }}>
          {help}
        </span>
      )}
    </label>
  );
}

function ModeTab({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: "6px 8px",
        background: active ? "var(--color-active-highlight-bg)" : "transparent",
        border: `1px solid ${active ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
        color: active ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
        borderRadius: 2,
        fontSize: 10,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontWeight: 600,
        cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}

const smallBtnStyle: React.CSSProperties = {
  padding: "4px 8px",
  background: "transparent",
  border: "1px solid var(--color-border-hairline)",
  color: "var(--color-fg-muted)",
  borderRadius: 2,
  fontSize: 9,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontWeight: 600,
  cursor: "pointer",
};

const hintCheckLabelStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 6,
  color: "var(--color-fg-muted)",
  fontSize: 10,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  fontWeight: 500,
};

const cancelBtnStyle: React.CSSProperties = {
  ...smallBtnStyle,
  padding: "6px 12px",
  fontSize: 10,
};

const saveBtnStyle: React.CSSProperties = {
  padding: "6px 14px",
  background: "var(--color-active-highlight-bg)",
  border: "1px solid var(--color-active-highlight-border)",
  color: "var(--color-active-highlight)",
  borderRadius: 2,
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  fontWeight: 700,
  cursor: "pointer",
};
