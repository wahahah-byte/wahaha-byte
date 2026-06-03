// Computes the scale + translate that lands an item's content bbox centred
// inside an inventory-card box. The web version (lib/cardTransform.ts) emits
// a CSS string ("scale(s) translate(tx%, ty%)"); this shared variant returns
// the raw numbers so RN can plug them into a `transform: [...]` array.
//
// Math accounts for objectFit:contain (CSS) / resizeMode:contain (RN)
// letterboxing — when source aspect ≠ container aspect, the displayed
// source occupies less than the full container box, so translate-as-fraction
// values need a per-axis correction.

import type { AvatarItemDto } from "../api/avatar";

export interface BoundsInput {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  sourceWidth?: number;
  sourceHeight?: number;
}

export interface BoundsTransformOptions {
  cols?: number;
  rows?: number;
  /** Fraction of the limiting axis the bbox should occupy after transform.
   *  0.75 leaves ~12% margin per side. */
  fillFactor?: number;
}

/** Raw numbers form of the bounds-centred transform. translateX/Y are
 *  percentages of the container box (apply as `(pct/100) * containerSize`
 *  to get px). Returns null when no bounds are present on the item. */
export interface BoundsTransform {
  scale: number;
  translateXPercent: number;
  translateYPercent: number;
}

export function boundsTransformFor(
  item: AvatarItemDto,
  override?: BoundsInput | null,
  options?: BoundsTransformOptions,
): BoundsTransform | null {
  const contentMinX = override?.minX ?? item.contentMinX;
  const contentMinY = override?.minY ?? item.contentMinY;
  const contentMaxX = override?.maxX ?? item.contentMaxX;
  const contentMaxY = override?.maxY ?? item.contentMaxY;
  if (
    contentMinX == null
    || contentMinY == null
    || contentMaxX == null
    || contentMaxY == null
  ) return null;
  const sourceW = override?.sourceWidth ?? item.sourceWidth ?? 256;
  const sourceH = override?.sourceHeight ?? item.sourceHeight ?? 384;
  const cols = options?.cols ?? item.gridCols ?? 1;
  const rows = options?.rows ?? item.gridRows ?? 1;
  const fillFactor = options?.fillFactor ?? 0.75;
  const bboxW = Math.max(1, contentMaxX - contentMinX);
  const bboxH = Math.max(1, contentMaxY - contentMinY);
  const bboxCx = (contentMinX + contentMaxX) / 2;
  const bboxCy = (contentMinY + contentMaxY) / 2;

  const dispFracX = Math.min(1, (sourceW * rows) / (sourceH * cols));
  const dispFracY = Math.min(1, (sourceH * cols) / (sourceW * rows));

  const fx = (bboxCx - sourceW / 2) / sourceW;
  const fy = (bboxCy - sourceH / 2) / sourceH;
  const translateXPercent = -fx * 100 * dispFracX;
  const translateYPercent = -fy * 100 * dispFracY;

  const effSrcW = Math.max(sourceW, (sourceH * cols) / rows);
  const effSrcH = Math.max((sourceW * rows) / cols, sourceH);
  const scale = fillFactor * Math.min(effSrcW / bboxW, effSrcH / bboxH);

  return { scale, translateXPercent, translateYPercent };
}

// Inventory-card footprint heuristic. Lifted from apps/web/src/app/avatar/page.tsx
// so the mobile grid layout uses the same multi-cell sizing rules.
export function getItemSize(item: AvatarItemDto): { cols: number; rows: number } {
  const cat = (item.category ?? "").toLowerCase();
  if (cat.includes("staff")) return { cols: 2, rows: 1 };
  if (cat.includes("sword")) return { cols: 1, rows: 1 };
  // Full-body outfits — overrides legacy BODY slot's 1×1 default.
  if (cat === "outfit") return { cols: 1, rows: 2 };
  if (item.slot === "HAT" || item.slot === "HEAD") return { cols: 1, rows: 1 };
  if (item.gridCols && item.gridRows) {
    return { cols: item.gridCols, rows: item.gridRows };
  }
  switch (item.slot) {
    case "HAIR":
    case "FACE":
    case "FEET":
    case "BODY":
      return { cols: 1, rows: 1 };
    case "HAND":
      return cat === "weapon" ? { cols: 2, rows: 1 } : { cols: 1, rows: 1 };
    case "BACK":
      return { cols: 2, rows: 1 };
    case "HAIR_FRONT":
    case "HAIR_BACK":
    case "EYE":
    case "EAR":
    case "SHOES":
    case "GLOVES":
    case "WRIST":
      return { cols: 1, rows: 1 };
    case "TOP":
    case "BOTTOM":
      return { cols: 1, rows: 1 };
    case "OVERALL":
      return { cols: 1, rows: 2 };
    case "CAPE":
      return cat === "cloak" ? { cols: 1, rows: 1 } : { cols: 2, rows: 1 };
    case "WEAPON_BACK":
    case "WEAPON_FRONT":
      return { cols: 2, rows: 1 };
    case "OFFHAND":
      // Shields/daggers/orbs sit in a single cell — small footprint by default.
      return { cols: 1, rows: 1 };
    default:
      return { cols: 1, rows: 1 };
  }
}

// True for any slot that belongs in the hair tab.
export function isHairSlot(slot: string | undefined | null): boolean {
  return slot === "HAIR" || slot === "HAIR_FRONT" || slot === "HAIR_BACK";
}

// Cross-slot equip conflicts: returns true when equipping `newSlot` should
// auto-unequip an item currently in `existingSlot`. Same-slot duplicates are
// handled separately (the server + each client drop those directly), so this
// only matches DIFFERENT slots that visually conflict. Mirrors ShouldDropOnEquip
// in wahaha.API/Repositories/UserInventoryRepository.cs and the web copy in
// apps/web/src/app/avatar/page.tsx — keep all three in sync.
//
// Groups:
//   - Outfit: OVERALL/BODY (full-body) conflict with TOP/BOTTOM (partial); partials
//     coexist with each other but not with a full-body item.
//   - Hair:   HAIR / HAIR_FRONT / HAIR_BACK — only one hair style at a time.
//   - Hat:    HAT / HEAD (legacy) — only one head covering at a time.
export function shouldDropOnEquip(
  newSlot: string | undefined | null,
  existingSlot: string | undefined | null,
): boolean {
  if (!newSlot || !existingSlot || newSlot === existingSlot) return false;
  const isFull = (s: string) => s === "OVERALL" || s === "BODY";
  const isPartial = (s: string) => s === "TOP" || s === "BOTTOM";
  if (isFull(newSlot) && (isFull(existingSlot) || isPartial(existingSlot))) return true;
  if (isPartial(newSlot) && isFull(existingSlot)) return true;
  if (isHairSlot(newSlot) && isHairSlot(existingSlot)) return true;
  const isHat = (s: string) => s === "HAT" || s === "HEAD";
  if (isHat(newSlot) && isHat(existingSlot)) return true;
  return false;
}

// Weapons share one "held by chibi" group across HAND / WEAPON_FRONT / WEAPON_BACK / OFFHAND.
export function isWeaponSlot(slot: string | undefined | null): boolean {
  return slot === "HAND"
    || slot === "WEAPON_FRONT"
    || slot === "WEAPON_BACK"
    || slot === "OFFHAND";
}

// Two-handed primary weapons block the off-hand slot (MapleStory rule). Category-based so
// admin-defined "greatsword" etc. is detected even if not yet in the WEAPON_FRONT default list.
// Mirrors apps/web/src/app/avatar/page.tsx isTwoHanded and the C# IsTwoHanded in
// wahaha.API/Repositories/UserInventoryRepository.cs — keep the token list in sync.
export function isTwoHanded(item: AvatarItemDto | undefined | null): boolean {
  if (!item || item.slot !== "WEAPON_FRONT") return false;
  const cat = (item.category ?? "").toLowerCase();
  return cat.includes("staff")
    || cat.includes("polearm")
    || cat.includes("bow")
    || cat.includes("greatsword")
    || cat.includes("two-hand")
    || cat.includes("twohand");
}

// ---- Inventory-card transform fallbacks -----------------------------------
//
// Mirrors apps/web/src/app/avatar/page.tsx — SLOT_TRANSFORM, CARD_TRANSFORM_OVERRIDE
// and CARD_CLASS_TRANSFORM. The web version stores them as CSS strings; the
// numeric form here lets RN consume them via `transform: [...]`.
//
// Precedence (when server-computed bounds aren't available OR the item is
// two-layer): per-filename override → class match → slot default → 1.4×.

const ZERO = 0;

/** Numeric form of a CSS scale + translate transform. translateX/Y are in
 *  percentages of the rendered box (multiply by box dims to get px). */
export interface CardTransform {
  scale: number;
  translateXPercent: number;
  translateYPercent: number;
}

// Slot defaults are calibrated to centre the typical content region of each
// slot in the card. The source canvas is 256×384 with the chibi laid out:
//
//   Head / hat region: source y ≈ 50–170   (centre ≈ 110)
//   Hair (front/back): source y ≈ 80–200   (centre ≈ 140)
//   Face / eyes:       source y ≈ 120–180  (centre ≈ 150)
//   Body / top:        source y ≈ 200–280  (centre ≈ 240)
//   Bottom:            source y ≈ 260–340  (centre ≈ 300)
//   Cape:              source y ≈ 170–280  (centre ≈ 225)
//   Shoes / feet:      source y ≈ 330–380  (centre ≈ 355)
//
// translateY% is derived to land each region's centre at card-y = h/2, given
// the chosen scale: `ty% = (scale × (0.5 − sourceCentre/384)) × 100`.
//
// Web's slot values (HAT 22%, SHOES −22%, etc.) are deliberately small —
// they're a transient fallback before web's client-side alpha-bbox scan
// resolves, after which `boundsTransformFor` provides proper centring. Mobile
// has no client-side scan, so these are permanent and must do the centring
// themselves.
// Web's SLOT_TRANSFORM values, used here as the fallback for items without
// server-computed bounds. These look correct now that the mobile renderer
// applies the proper CSS `scale × translate` composition (translate is
// multiplied by scale in screen px). For items WITH bounds the bounds-based
// path in resolveCardTransform takes over and provides exact bbox centring.
const SLOT_CARD_TRANSFORM: Record<string, CardTransform> = {
  // HAT / HEAD: hat sprite sits in upper third of canvas — bumped scale + Y shift to
  // centre the visible content. 28% lifts helmets ~2px higher than the original 32%.
  HEAD:  { scale: 1.85, translateXPercent: ZERO, translateYPercent: 24 },
  HAIR:  { scale: 1.7, translateXPercent: ZERO, translateYPercent: 20 },
  BODY:  { scale: 1.4, translateXPercent: ZERO, translateYPercent: -4 },
  HAND:  { scale: 1.4, translateXPercent: ZERO, translateYPercent: -14 },
  FACE:  { scale: 1.7, translateXPercent: ZERO, translateYPercent: 12 },
  BACK:  { scale: 1.4, translateXPercent: ZERO, translateYPercent: 2 },
  FEET:  { scale: 1.7, translateXPercent: ZERO, translateYPercent: -22 },
  HAIR_FRONT: { scale: 1.7, translateXPercent: ZERO, translateYPercent: 20 },
  HAIR_BACK:  { scale: 1.7, translateXPercent: ZERO, translateYPercent: 20 },
  HAT:  { scale: 1.85, translateXPercent: ZERO, translateYPercent: 24 },
  EYE:  { scale: 1.7, translateXPercent: ZERO, translateYPercent: 14 },
  EAR:  { scale: 1.7, translateXPercent: ZERO, translateYPercent: 12 },
  TOP:     { scale: 1.4, translateXPercent: ZERO, translateYPercent: -4 },
  BOTTOM:  { scale: 1.4, translateXPercent: ZERO, translateYPercent: 8 },
  OVERALL: { scale: 1.3, translateXPercent: ZERO, translateYPercent: 2 },
  // Two-layer capes (primary back panel + secondary front drape) skip the
  // bounds-based path, so this slot value runs permanently. -8% nudges the
  // centring point to match the typical visual centre of the cape drape.
  CAPE:   { scale: 1.3, translateXPercent: ZERO, translateYPercent: -8 },
  GLOVES: { scale: 1.4, translateXPercent: ZERO, translateYPercent: -6 },
  SHOES:  { scale: 1.7, translateXPercent: ZERO, translateYPercent: -22 },
  WEAPON_FRONT: { scale: 1.4, translateXPercent: ZERO, translateYPercent: ZERO },
  WEAPON_BACK:  { scale: 1.4, translateXPercent: ZERO, translateYPercent: ZERO },
  // Off-hand items (shields, daggers, orbs): sized large, shifted right (back-arm canvas
  // content sits left of centre), and lifted to balance the cell's vertical centre.
  OFFHAND:      { scale: 2.15, translateXPercent: 8, translateYPercent: -4 },
  WRIST:  { scale: 1.4, translateXPercent: ZERO, translateYPercent: -6 },
};

const CARD_TRANSFORM_OVERRIDE: Record<string, CardTransform> = {
  "weapon_polearm_alien_cyber.png": { scale: 2.2, translateXPercent: 3, translateYPercent: -10 },
  "hair_seraph_wave_brown.png": { scale: 1.7, translateXPercent: 2.8, translateYPercent: 20 },
  "weapon_front_magic_staff.png": { scale: 1.4, translateXPercent: 0, translateYPercent: -16 },
};

// Order matters — first matching token wins. Specific tokens (helmet) must precede
// broader ones (hat) so e.g. "Robot Helmet" matches helmet and not hat.
const CARD_CLASS_TRANSFORM: Array<{ token: string; tf: CardTransform }> = [
  { token: "polearm", tf: { scale: 2.0, translateXPercent: 0, translateYPercent: -12 } },
  // Swords: lift higher than the HAND slot default — sword sprite is bottom-anchored
  // in the canvas, so a stronger negative Y is needed to centre it.
  { token: "sword",  tf: { scale: 1.7, translateXPercent: 8, translateYPercent: -14 } },
  // Helmets: scale 2.0 reads as a beefier round silhouette; 24% Y keeps content centred.
  { token: "helmet", tf: { scale: 2.0, translateXPercent: 0, translateYPercent: 24 } },
  // Hats (wizard, pirate, etc.): sprite anchored higher on the canvas than helmets;
  // 32% Y pulls the visible content down to sit at the cell's vertical centre.
  // NB: "cap" is intentionally omitted — substring of "cape" so the token would mis-match
  //     CAPE-slot items. Cap-category items fall back to the HAT slot transform (close enough).
  { token: "hat",      tf: { scale: 2.0, translateXPercent: 0, translateYPercent: 32 } },
  { token: "crown",    tf: { scale: 2.0, translateXPercent: 0, translateYPercent: 32 } },
  { token: "headband", tf: { scale: 2.0, translateXPercent: 0, translateYPercent: 32 } },
];

function cardClassTransformFor(item: AvatarItemDto): CardTransform | null {
  const haystack = `${item.name ?? ""} ${item.category ?? ""}`.toLowerCase();
  for (const entry of CARD_CLASS_TRANSFORM) {
    if (haystack.includes(entry.token)) return entry.tf;
  }
  return null;
}

/** Resolves the final card transform for a given item, applying the same
 *  precedence as web's DraggableItem render: optional bounds-derived
 *  auto-centre (skipped for two-layer items and HAT/HEAD/OFFHAND slots so
 *  helmets/shields render at a uniform forced size) → per-filename override
 *  → class match → slot default → 1.4× fallback. */
export function resolveCardTransform(
  item: AvatarItemDto,
  opts: {
    cols: number;
    rows: number;
    isTwoLayer?: boolean;
    boundsOverride?: BoundsInput | null;
    fillFactor?: number;
  },
): CardTransform {
  // Slots where per-item bounds-based centring produces inconsistent visuals across items
  // (helmets render at varying sizes; shields end up off-centre because their bbox is small).
  // Force these slots through SLOT_CARD_TRANSFORM so every item in the slot reads the same.
  const skipAutoBounds = item.slot === "HAT"
    || item.slot === "HEAD"
    || item.slot === "OFFHAND";
  if (!opts.isTwoLayer && !skipAutoBounds) {
    const auto = boundsTransformFor(item, opts.boundsOverride ?? null, {
      cols: opts.cols,
      rows: opts.rows,
      fillFactor: opts.fillFactor ?? 0.75,
    });
    if (auto) {
      return {
        scale: auto.scale,
        translateXPercent: auto.translateXPercent,
        translateYPercent: auto.translateYPercent,
      };
    }
  }
  const filename = item.previewAssetUrl?.split("/").pop() ?? "";
  return (
    CARD_TRANSFORM_OVERRIDE[filename]
    ?? cardClassTransformFor(item)
    ?? SLOT_CARD_TRANSFORM[item.slot]
    ?? { scale: 1.4, translateXPercent: 0, translateYPercent: 0 }
  );
}
