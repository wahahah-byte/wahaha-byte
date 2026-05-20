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
import { assetPath } from "@/lib/assetPath";

const RARITIES: Rarity[] = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];

// Slot-aware category suggestions for the <datalist>; free-text on the backend.
const CATEGORIES_BY_SLOT: Partial<Record<ItemSlot, readonly string[]>> = {
  HAT:        ["hat", "headband", "headgear", "helmet", "crown"],
  HAIR_FRONT: ["hair"],
  HAIR_BACK:  ["hair"],
  FACE:       ["mask", "scar", "facial-hair", "mouth"],
  EYE:        ["glasses", "eyepatch", "eye-makeup"],
  EAR:        ["earring", "ear-cuff", "ear-stud"],
  TOP:        ["t-shirt", "sweater", "hoodie", "jacket", "vest"],
  BOTTOM:     ["pants", "shorts", "skirt"],
  OVERALL:    ["dress", "robe", "jumpsuit", "kimono"],
  CAPE:       ["cape", "wings", "scarf"],
  GLOVES:     ["gloves", "mittens"],
  SHOES:      ["boots", "sneakers", "sandals"],
  WEAPON_FRONT: ["sword", "staff", "bow", "polearm"],
  WEAPON_BACK:  ["quiver", "holster", "sheath"],
  WRIST:      ["bracelet", "watch"],
  // Legacy slots; generic set for editing old rows.
  HEAD: ["headwear"],
  HAIR: ["hair"],
  BODY: ["outerwear"],
  HAND: ["tool", "weapon"],
  BACK: ["back"],
  FEET: ["footwear"],
};

function categorySuggestionsFor(slot: ItemSlot): readonly string[] {
  return CATEGORIES_BY_SLOT[slot] ?? [];
}

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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const secondaryFileInputRef = useRef<HTMLInputElement | null>(null);

  // Slots that support a secondary asset (mirrors ChibiAvatar z-resolution).
  const supportsSecondaryAsset =
    slot === "HAIR_FRONT" || slot === "CAPE" || slot === "WEAPON_FRONT";
  // Semantic label for the secondary layer.
  const secondaryLayerLabel = slot === "CAPE" ? "Front" : "Back";

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

  async function handleSave() {
    if (submitting) return;
    if (!name.trim()) { setError("Name is required."); return; }
    if (!category.trim()) { setError("Category is required."); return; }
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
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                maxLength={50}
                list="avatar-item-categories"
                className="themed-form-input"
              />
              {/* Slot-aware category suggestions */}
              <datalist id="avatar-item-categories">
                {categorySuggestionsFor(slot).map((c) => <option key={c} value={c} />)}
              </datalist>
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

          {/* Asset section */}
          {isEdit || createMode === "upload" ? (
            <Field label={isEdit ? "Replace image (optional)" : "Image (PNG) *"}>
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
              <Field label="Preview URL *">
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

          {/* Secondary asset (slot-conditional, optional) */}
          {supportsSecondaryAsset && (
            isEdit || createMode === "upload" ? (
              <Field label={isEdit
                ? `Replace ${secondaryLayerLabel.toLowerCase()} layer (optional)`
                : `${secondaryLayerLabel} layer (PNG, optional)`}>
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
              <Field label={`${secondaryLayerLabel} layer URL (optional)`}>
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
                        : "https://…/avatar-items/hair_seraph_back.png"
                  }
                  className="themed-form-input"
                />
              </Field>
            )
          )}

          {(previewSrc || secondaryPreviewSrc) && (
            <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: "4px 0" }}>
              {previewSrc && (
                <PreviewThumb src={previewSrc} label={slot === "CAPE" ? "Back" : "Front"} />
              )}
              {secondaryPreviewSrc && (
                <PreviewThumb src={secondaryPreviewSrc} label={secondaryLayerLabel} />
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ color: "var(--color-fg-subtle)", fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600 }}>
        {label}
      </span>
      {children}
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
