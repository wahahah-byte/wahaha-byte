"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ChibiAvatar from "@/components/ChibiAvatar";
import DemoModeBanner from "@/components/DemoModeBanner";
import { buildMockInventory } from "@/lib/mockAvatar";
import { assetPath } from "@/lib/assetPath";
import { boundsTransformFor, useClientBounds } from "@/lib/cardTransform";
import { applyHints } from "@wahaha/shared";
import { clearEquippedAvatarCache, primeEquippedAvatarCache } from "@/hooks/useEquippedAvatar";
import {
  avatarApi,
  type AvatarItemDto,
  type ItemSlot,
  type PagedResult,
  type UserInventoryDto,
} from "@/lib/api/avatar";
import { useToast } from "@/context/ToastContext";
import { useDesktopLayout } from "@/hooks/useDesktopLayout";
import { useUserRoles } from "@/hooks/useUserRoles";
import AvatarAdminPanel from "@/components/AvatarAdminPanel";
import SellConfirmModal from "@/components/SellConfirmModal";
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
  type Modifier,
} from "@dnd-kit/core";

// Desktop landscape 7×5 / mobile portrait 5×7; total 35 cells either way.
const GRID_DESKTOP = { cols: 7, rows: 5 } as const;
const GRID_MOBILE = { cols: 5, rows: 7 } as const;
// Mobile cells shrunk to 56px so 5-wide grid fits inside 320px viewport.
const CELL_PX_DESKTOP = 64;
const CELL_PX_MOBILE = 56;

// CSS transform for inventory-card image; sprite zoomed and centered on item content.
// Typed as Record<string,string> because mock items use planned granular slots
// not in the current ItemSlot enum (HAIR_FRONT, WEAPON_BACK, CAPE).
const SLOT_TRANSFORM: Record<string, string> = {
  // ---- Legacy aliases ----
  HEAD:  "scale(1.85) translateY(32%)",
  HAIR:  "scale(1.7) translateY(20%)",
  BODY:  "scale(1.4) translateY(-4%)",
  HAND:  "scale(1.4) translateY(-6%)",
  FACE:  "scale(1.7) translateY(12%)",
  BACK:  "scale(1.4) translateY(2%)",
  FEET:  "scale(1.7) translateY(-22%)",

  // ---- Granular slots (MapleStory-style) ----
  // Hair slots map to same upper canvas region as HAIR.
  HAIR_FRONT: "scale(1.7) translateY(20%)",
  HAIR_BACK:  "scale(1.7) translateY(20%)",
  // Headwear sits on upper third — same as HEAD.
  HAT:  "scale(1.85) translateY(32%)",
  // Eye/ear accessories higher than mouth.
  EYE:  "scale(1.7) translateY(14%)",
  EAR:  "scale(1.7) translateY(12%)",
  // Body sections overlap chibi torso — same band as BODY.
  TOP:     "scale(1.4) translateY(-4%)",
  BOTTOM:  "scale(1.4) translateY(8%)",
  OVERALL: "scale(1.3) translateY(2%)",
  // Capes are two-layer; auto-centre skipped — -10% lifts combined sprite to centre.
  CAPE:   "scale(1.3) translateY(-10%)",
  GLOVES: "scale(1.4) translateY(-6%)",
  SHOES:  "scale(1.7) translateY(-22%)",
  // Weapons render small by default; per-asset CARD_TRANSFORM_OVERRIDE bigger scales.
  WEAPON_FRONT: "scale(1.4)",
  WEAPON_BACK:  "scale(1.4)",
  // Off-hand (shields, daggers, orbs) — sized large and shifted right to recentre items
  // whose canvas places them on the chibi's back-arm side, plus a small upward lift.
  // autoBounds is skipped for this slot so every off-hand item renders at this uniform transform.
  OFFHAND: "scale(2.15) translate(8%, -4%)",
  WRIST:  "scale(1.4) translateY(-6%)",
};

// Per-asset card-transform overrides; fallback when item has no server bounds.
const CARD_TRANSFORM_OVERRIDE: Record<string, string> = {
  // Legacy filename, kept in case any row still points at it.
  "weapon_polearm_alien_cyber.png": "scale(2.2) translate(3%, -10%)",
  // Seraph hair drawn ~11 source px left of canvas center; offset matches chibi alignment.
  "hair_seraph_wave_brown.png": "scale(1.7) translate(2.8%, 20%)",
  // Two-layer magic staff: -16% Y lifts combined sprite to card centre.
  "weapon_front_magic_staff.png": "scale(1.4) translate(0%, -16%)",
};

// Class-level card transforms; applied when name/category contains token.
const CARD_CLASS_TRANSFORM: Record<string, string> = {
  // Polearm: 2× zoom, lifted 12% to centre diagonal sprite's bbox.
  polearm: "scale(2.0) translate(0%, -12%)",
  // Sword: forced 1×1 footprint; nudge right (sprite biased left of canvas centre) + lift to centre vertically.
  sword: "scale(1.7) translate(8%, -12%)",
  // Headwear: HAT-slot items in this category sit slightly higher on the canvas than hat-category items
  // (helmets that wrap the head) — bump scale, ease the downward shift to keep them away from the top.
  headwear: "scale(2.0) translateY(24%)",
};

function cardClassTransform(item: AvatarItemDto): string | null {
  const haystack = `${item.name ?? ""} ${item.category ?? ""}`.toLowerCase();
  for (const token of Object.keys(CARD_CLASS_TRANSFORM)) {
    if (haystack.includes(token)) return CARD_CLASS_TRANSFORM[token];
  }
  return null;
}

// Auto-centring math (boundsTransformFor + useClientBounds) lives in @/lib/cardTransform.

// Per-asset rotated-card-transform overrides; translate-before-rotate means
// unrotated values can't be reused — calibrate by direct feedback.
const CARD_TRANSFORM_ROTATED_OVERRIDE: Record<string, string> = {
  "weapon_polearm_alien_cyber.png": "scale(2.2) translate(10%, 3%) rotate(90deg)",
};

// Class-level rotated-card transforms; consulted when per-filename rotated override is missing.
const CARD_CLASS_ROTATED_TRANSFORM: Record<string, string> = {
  // Polearm rotated 1×2: translate(+25%, +5%) pulls bbox to card centre post-rotate.
  polearm: "translate(25%, 5%) scale(2.0) rotate(90deg)",
  // Staff rotated 1×2: combined-bbox closer to source vertical centre; +28% X, +5% Y.
  staff: "translate(28%, 5%) scale(1.4) rotate(90deg)",
  // Outfits (1×2 → 2×1 on rotation): scale 2.5 fills the wider-shorter cell at a visual
  // size comparable to the non-rotated rendering. translate(+15%, 0%) compensates for the
  // body content sitting in the lower-half of the source canvas — after 90° clockwise rotate
  // the body ends up left-of-centre, so a positive X translate pulls it back. Covers OVERALL
  // category options (dress/robe/jumpsuit/kimono) and the BODY-legacy "outfit" category.
  outfit:   "translate(15%, 0%) scale(2.5) rotate(90deg)",
  dress:    "translate(15%, 0%) scale(2.5) rotate(90deg)",
  robe:     "translate(15%, 0%) scale(2.5) rotate(90deg)",
  jumpsuit: "translate(15%, 0%) scale(2.5) rotate(90deg)",
  kimono:   "translate(15%, 0%) scale(2.5) rotate(90deg)",
};

function cardClassRotatedTransform(item: AvatarItemDto): string | null {
  const haystack = `${item.name ?? ""} ${item.category ?? ""}`.toLowerCase();
  for (const token of Object.keys(CARD_CLASS_ROTATED_TRANSFORM)) {
    if (haystack.includes(token)) return CARD_CLASS_ROTATED_TRANSFORM[token];
  }
  return null;
}

// True for any slot in the hair tab; backend currently only exposes bare "HAIR".
function isHairSlot(slot: string | undefined | null): boolean {
  return slot === "HAIR" || slot === "HAIR_FRONT" || slot === "HAIR_BACK";
}

// True for weapon group (HAND/WEAPON_FRONT/WEAPON_BACK); chibi only holds one weapon at a time.
function isWeaponSlot(slot: string | undefined | null): boolean {
  return slot === "HAND"
    || slot === "WEAPON_FRONT"
    || slot === "WEAPON_BACK"
    || slot === "OFFHAND";
}

// Two-handed primary weapons block the off-hand slot (MapleStory rule).
// Category-based so admin-defined "greatsword" etc. is detected even if not yet in the WEAPON_FRONT default list.
function isTwoHanded(item: AvatarItemDto | undefined | null): boolean {
  if (!item || item.slot !== "WEAPON_FRONT") return false;
  const cat = (item.category ?? "").toLowerCase();
  return cat.includes("staff")
    || cat.includes("polearm")
    || cat.includes("bow")
    || cat.includes("greatsword")
    || cat.includes("two-hand")
    || cat.includes("twohand");
}

// Cross-slot equip conflicts (outfit/hair/hat). Returns true when equipping `newSlot`
// should auto-unequip an item currently in `existingSlot`. Same-slot dups are handled
// elsewhere (the existing "same-slot drop" line in onCardClick), so this only matches
// DIFFERENT slots that visually conflict.
//
// Groups:
//   - Outfit: OVERALL/BODY (full-body) conflict with TOP/BOTTOM (partial). Partial items
//     coexist with each other but not with a full-body item.
//   - Hair:   HAIR / HAIR_FRONT / HAIR_BACK — only one hair style at a time.
//   - Hat:    HAT / HEAD (legacy) — only one head covering at a time.
function shouldDropOnEquip(newSlot: string | undefined | null, existingSlot: string | undefined | null): boolean {
  if (!newSlot || !existingSlot || newSlot === existingSlot) return false;
  const isFull = (s: string) => s === "OVERALL" || s === "BODY";
  const isPartial = (s: string) => s === "TOP" || s === "BOTTOM";
  if (isFull(newSlot) && (isFull(existingSlot) || isPartial(existingSlot))) return true;
  if (isPartial(newSlot) && isFull(existingSlot)) return true;
  const HAIR = new Set(["HAIR", "HAIR_FRONT", "HAIR_BACK"]);
  if (HAIR.has(newSlot) && HAIR.has(existingSlot)) return true;
  const HAT = new Set(["HAT", "HEAD"]);
  if (HAT.has(newSlot) && HAT.has(existingSlot)) return true;
  return false;
}

// RE-style inventory footprint; backend stores gridCols/gridRows; legacy rows fall back to slot heuristic.
function getItemSize(item: AvatarItemDto): { cols: number; rows: number } {
  const cat = (item.category ?? "").toLowerCase();
  // Staffs always 2×1; precedence over persisted gridCols/Rows for legacy rows.
  if (cat.includes("staff")) return { cols: 2, rows: 1 };
  // Swords always 1×1; centered inventory icon even when slot would default to 2×1.
  if (cat.includes("sword")) return { cols: 1, rows: 1 };
  // Full-body outfits (Ninja Outfit, Space Suit, dresses/robes) always 1×2 — even when stored
  // in the legacy BODY slot which would otherwise default them to 1×1.
  if (cat === "outfit") return { cols: 1, rows: 2 };
  // Hats (HAT and legacy HEAD) always 1×1; overrides persisted size.
  if (item.slot === "HAT" || item.slot === "HEAD") return { cols: 1, rows: 1 };
  if (item.gridCols && item.gridRows) {
    return { cols: item.gridCols, rows: item.gridRows };
  }
  switch (item.slot) {
    // Legacy slots ------------------------------------------------------
    // (HEAD handled above — always 1×1.)
    case "HAIR":
    case "FACE":
    case "FEET":
    case "BODY":
      return { cols: 1, rows: 1 };
    case "HAND":
      return cat === "weapon" ? { cols: 2, rows: 1 } : { cols: 1, rows: 1 };
    case "BACK":
      return { cols: 2, rows: 1 };
    // Granular slots ----------------------------------------------------
    // (HAT handled above — always 1×1.)
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
      // Dress / robe — tall in inventory like RE4 body armor.
      return { cols: 1, rows: 2 };
    case "CAPE":
      // Cloak-category capes hang straight down (1×1); other capes keep 2-wide.
      return cat === "cloak" ? { cols: 1, rows: 1 } : { cols: 2, rows: 1 };
    case "WEAPON_BACK":
    case "WEAPON_FRONT":
      return { cols: 2, rows: 1 };
    case "OFFHAND":
      // Shields/daggers/orbs fit in a single cell — small footprint by default.
      return { cols: 1, rows: 1 };
    default:
      return { cols: 1, rows: 1 };
  }
}

// Render hints (RENDER_HINTS, CLASS_HINTS) and applyHints() live in @/lib/avatarHints.

// Whitelist of URL patterns pointing at real assets; everything else returns 404.
function hasRealAsset(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith("https://wahaha.blob.core.windows.net/")
      || url.startsWith("/avatar-items/")
      || url.startsWith("data:");
}

// Hysteresis fraction for snap modifier; only flips cells past 70% of cell step.
const SNAP_HYSTERESIS_FRACTION = 0.7;

// Custom dnd-kit collision detector: snaps to cell closest to TOP-LEFT corner.
const topLeftCellCollision: CollisionDetection = ({ collisionRect, droppableContainers, droppableRects }) => {
  if (!collisionRect) return [];
  const tx = collisionRect.left;
  const ty = collisionRect.top;
  let bestId: ReturnType<typeof String> | null = null;
  let bestDist = Infinity;
  for (const droppable of droppableContainers) {
    const r = droppableRects.get(droppable.id);
    if (!r) continue;
    const dx = r.left - tx;
    const dy = r.top - ty;
    const d = dx * dx + dy * dy;
    if (d < bestDist) {
      bestDist = d;
      bestId = String(droppable.id);
    }
  }
  return bestId != null ? [{ id: bestId }] : [];
};

// True when (x,y,cols,rows) fits inside grid AND doesn't overlap other items.
function rectFits(
  rows: UserInventoryDto[],
  skipId: number | null,
  x: number,
  y: number,
  cols: number,
  height: number,
  rotations: Set<number>,
  gridCols: number,
  gridRows: number,
): boolean {
  if (x < 0 || y < 0 || x + cols > gridCols || y + height > gridRows) return false;
  for (const row of rows) {
    if (row.inventoryId === skipId) continue;
    if (row.positionX == null || row.positionY == null) continue;
    const { cols: oCols, rows: oRows } = sizeFor(
      row.avatarItem!,
      rotations.has(row.inventoryId),
    );
    const ox = row.positionX;
    const oy = row.positionY;
    const overlap = x < ox + oCols && x + cols > ox && y < oy + oRows && y + height > oy;
    if (overlap) return false;
  }
  return true;
}

// True when user can rotate (Q/E) this item; square footprints are no-op.
function canRotate(item: AvatarItemDto): boolean {
  const { cols, rows } = getItemSize(item);
  return cols !== rows;
}

// Effective grid footprint given rotation state; rotatable items swap cols/rows.
function sizeFor(item: AvatarItemDto, rotated: boolean): { cols: number; rows: number } {
  const base = getItemSize(item);
  if (!rotated) return base;
  return { cols: base.rows, rows: base.cols };
}

// True if row's persisted (rotation-aware) footprint stays inside the grid.
function hasValidPlacement(row: UserInventoryDto, gridCols: number, gridRows: number): boolean {
  if (row.positionX == null || row.positionY == null) return false;
  if (!row.avatarItem) return false;
  const { cols, rows } = sizeFor(row.avatarItem, !!row.isRotated);
  return row.positionX >= 0
    && row.positionY >= 0
    && row.positionX + cols <= gridCols
    && row.positionY + rows <= gridRows;
}

// Convert live catalog into demo-page inventory shape; pre-equips one item per showcase slot.
function buildInventoryFromCatalog(items: AvatarItemDto[]): UserInventoryDto[] {
  const now = new Date().toISOString();
  const showcaseSlots: ItemSlot[][] = [
    ["HAT", "HEAD"],
    ["TOP", "BODY"],
    ["HAIR_FRONT", "HAIR"],
    ["WEAPON_FRONT", "HAND", "WEAPON_BACK"],
  ];
  const equippedIds = new Set<number>();
  for (const group of showcaseSlots) {
    const match = items.find((it) => group.includes(it.slot) && !equippedIds.has(it.itemId));
    if (match) equippedIds.add(match.itemId);
  }
  return items.map((item, i) => ({
    inventoryId: 9100 + i,
    userId: "00000000-0000-0000-0000-000000000000",
    itemId: item.itemId,
    acquiredAt: now,
    isEquipped: equippedIds.has(item.itemId),
    avatarItem: applyHints(item),
    positionX: null,
    positionY: null,
  }));
}

// Demo-mode inventory loader; tries live catalogue first, falls back to mock on failure.
async function loadDemoInventory(): Promise<UserInventoryDto[]> {
  const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  if (apiUrl) {
    try {
      const res = await fetch(`${apiUrl}/api/AvatarItems?pageSize=200`);
      if (res.ok) {
        const page: PagedResult<AvatarItemDto> = await res.json();
        // Drop legacy seed rows with relative previewAssetUrl (files don't exist).
        const items = (page.data ?? []).filter((it) => hasRealAsset(it.previewAssetUrl));
        if (items.length > 0) return buildInventoryFromCatalog(items);
      }
    } catch {
      // Swallow — fall through to hardcoded mock.
    }
  }
  return buildMockInventory().map((row) => ({
    ...row,
    avatarItem: applyHints(row.avatarItem!),
  }));
}

function autoPlace(rows: UserInventoryDto[], gridCols: number, gridRows: number): UserInventoryDto[] {
  // Build rotations set from persisted isRotated so rectFits uses actual footprint.
  const persistedRotations = new Set<number>(
    rows.filter((r) => r.isRotated).map((r) => r.inventoryId),
  );
  // Strip persisted positions that no longer fit (e.g. backend size grew).
  const placed: UserInventoryDto[] = rows
    .filter((r) => hasValidPlacement(r, gridCols, gridRows))
    .slice();
  const result: UserInventoryDto[] = [...placed];
  for (const row of rows) {
    if (hasValidPlacement(row, gridCols, gridRows)) continue;
    // Re-placement honours persisted rotation so a rotated polearm gets a fitting slot.
    const size = sizeFor(row.avatarItem!, !!row.isRotated);
    let assigned: { x: number; y: number } | null = null;
    outer: for (let y = 0; y < gridRows; y++) {
      for (let x = 0; x < gridCols; x++) {
        if (rectFits(result, null, x, y, size.cols, size.rows, persistedRotations, gridCols, gridRows)) {
          assigned = { x, y };
          break outer;
        }
      }
    }
    const next = assigned
      ? { ...row, positionX: assigned.x, positionY: assigned.y }
      : { ...row, positionX: null, positionY: null };
    result.push(next);
  }
  return result;
}

export default function AvatarPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<UserInventoryDto[]>([]);
  // Role flags drive admin manage-items panel; false until JWT read on client.
  const userRoles = useUserRoles();
  // Hair has its own grid; position scoped per inventory row, collision per tab.
  const [activeTab, setActiveTab] = useState<"equipment" | "hair">("equipment");
  // Inventory IDs currently rotated 90° (cols/rows swapped); ephemeral, not persisted.
  const [rotations, setRotations] = useState<Set<number>>(new Set());
  // inventoryId of dragged item, or null; scopes the Q/E keydown handler.
  const [activeDragId, setActiveDragId] = useState<number | null>(null);
  // Snapshot of the dragged item's rotation at drag start. Q/E during drag toggles
  // rotations freely (no overlap check); on a rejected/cancelled drop we revert to this
  // so the chibi doesn't keep a rotation the user couldn't actually commit.
  const dragStartRotatedRef = useRef<boolean>(false);
  // Inventory IDs currently being mutated — disables card mid-request.
  const [busyIds, setBusyIds] = useState<Set<number>>(new Set());
  // Item IDs whose preview PNG 404'd — render PaperIcon placeholder instead.
  const [failedIds, setFailedIds] = useState<Set<number>>(new Set());
  // Inventory row queued for the sell confirmation modal; null while closed.
  const [sellTarget, setSellTarget] = useState<UserInventoryDto | null>(null);
  const { setError, setSuccess } = useToast();
  const isDesktop = useDesktopLayout();
  const { cols: gridCols, rows: gridRows } = isDesktop ? GRID_DESKTOP : GRID_MOBILE;
  // Active cell size and derived snap step; mobile uses smaller cell.
  const cellPx = isDesktop ? CELL_PX_DESKTOP : CELL_PX_MOBILE;
  const snapStep = cellPx + 1;
  const snapHysteresis = snapStep * SNAP_HYSTERESIS_FRACTION;

  // Per-viewport position caches; flipping shapes never destroys either layout.
  const desktopPositionsRef = useRef<Map<number, { x: number; y: number; rotated: boolean }>>(new Map());
  const mobilePositionsRef = useRef<Map<number, { x: number; y: number; rotated: boolean }>>(new Map());
  const lastModeRef = useRef<"desktop" | "mobile" | null>(null);
  // Flips true once initial inventory load resolves; gates the per-mode swap effect.
  const [inventoryLoaded, setInventoryLoaded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = !!localStorage.getItem("auth_token");
    setHasToken(token);
    if (!token) {
      // Demo mode — try live catalogue, fall back to hardcoded mock.
      // Equip/unequip and setPosition guarded so nothing hits backend.
      loadDemoInventory().then((rows) => {
        setInventory(rows);
        setInventoryLoaded(true);
        setLoading(false);
      });
      return;
    }
    avatarApi.getInventory(1, 200).then(({ data, error }) => {
      if (error) setError(error);
      const rows = (data?.data ?? [])
        .filter((row) => row.avatarItem?.previewAssetUrl)
        .map((row) => ({ ...row, avatarItem: applyHints(row.avatarItem!) }));
      // Seed BOTH caches from persisted backend positions; desktop/mobile stored separately.
      for (const row of rows) {
        if (row.positionX != null && row.positionY != null) {
          desktopPositionsRef.current.set(row.inventoryId, {
            x: row.positionX, y: row.positionY, rotated: !!row.isRotated,
          });
        }
        if (row.positionXMobile != null && row.positionYMobile != null) {
          mobilePositionsRef.current.set(row.inventoryId, {
            x: row.positionXMobile, y: row.positionYMobile, rotated: !!row.isRotated,
          });
        }
      }
      setInventory(rows);
      setRotations(new Set(rows.filter((r) => r.isRotated).map((r) => r.inventoryId)));
      setInventoryLoaded(true);
      setLoading(false);
    });
  }, [setError]);

  // Per-mode swap on viewport flip; snapshots outgoing, restores incoming, autoPlace fills gaps.
  // Newly-assigned desktop positions persist to backend; mobile is session-only.
  useEffect(() => {
    if (!inventoryLoaded) return;
    const mode: "desktop" | "mobile" = isDesktop ? "desktop" : "mobile";
    const previousMode = lastModeRef.current;
    if (previousMode === mode) return;
    // Update ref now so concurrent reads target the new mode's cache.
    lastModeRef.current = mode;

    setInventory((prev) => {
      if (prev.length === 0) return prev;

      // 1. Snapshot rendered positions into OUTGOING cache.
      const outgoing = previousMode === "desktop"
        ? desktopPositionsRef.current
        : previousMode === "mobile"
          ? mobilePositionsRef.current
          : null;
      if (outgoing) {
        for (const r of prev) {
          if (r.positionX != null && r.positionY != null) {
            outgoing.set(r.inventoryId, { x: r.positionX, y: r.positionY, rotated: !!r.isRotated });
          } else {
            outgoing.delete(r.inventoryId);
          }
        }
      }

      // 2. Restore each row's position from INCOMING cache; missing rows fall through to autoPlace.
      const incoming = mode === "desktop" ? desktopPositionsRef.current : mobilePositionsRef.current;
      const seeded = prev.map((r) => {
        const c = incoming.get(r.inventoryId);
        if (c) return { ...r, positionX: c.x, positionY: c.y, isRotated: c.rotated };
        return { ...r, positionX: null, positionY: null };
      });

      // 3. autoPlace anything still missing on the incoming grid shape.
      const targetCols = mode === "desktop" ? GRID_DESKTOP.cols : GRID_MOBILE.cols;
      const targetRows = mode === "desktop" ? GRID_DESKTOP.rows : GRID_MOBILE.rows;
      const equipRows = seeded.filter((r) => !isHairSlot(r.avatarItem?.slot));
      const hairRows = seeded.filter((r) => isHairSlot(r.avatarItem?.slot));
      const placed = [
        ...autoPlace(equipRows, targetCols, targetRows),
        ...autoPlace(hairRows, targetCols, targetRows),
      ];

      // 4. Write back to incoming cache; persist newly-assigned positions to backend column for current mode.
      const newlyAssigned: Array<{ id: number; x: number; y: number; rotated: boolean }> = [];
      for (const r of placed) {
        if (r.positionX == null || r.positionY == null) continue;
        const hadCache = incoming.has(r.inventoryId);
        incoming.set(r.inventoryId, { x: r.positionX, y: r.positionY, rotated: !!r.isRotated });
        if (!hadCache) {
          newlyAssigned.push({ id: r.inventoryId, x: r.positionX, y: r.positionY, rotated: !!r.isRotated });
        }
      }

      if (hasToken && newlyAssigned.length > 0) {
        for (const a of newlyAssigned) {
          avatarApi.setPosition(a.id, a.x, a.y, a.rotated, mode);
        }
      }

      // 5. Sync rotations Set so keyboard handler stays in lockstep with rendered orientation.
      setRotations(new Set(placed.filter((r) => r.isRotated).map((r) => r.inventoryId)));

      return placed;
    });
  }, [isDesktop, inventoryLoaded, hasToken]);

  // Keep active mode's cache in sync on every inventory change (drag/rotate; equip won't touch position).
  useEffect(() => {
    if (!inventoryLoaded || lastModeRef.current === null) return;
    const cache = lastModeRef.current === "desktop" ? desktopPositionsRef.current : mobilePositionsRef.current;
    for (const r of inventory) {
      if (r.positionX != null && r.positionY != null) {
        cache.set(r.inventoryId, { x: r.positionX, y: r.positionY, rotated: !!r.isRotated });
      } else {
        cache.delete(r.inventoryId);
      }
    }
  }, [inventory, inventoryLoaded]);

  // The chibi only renders items flagged equipped.
  const equipped = useMemo(
    () => inventory.filter((inv) => inv.isEquipped),
    [inventory],
  );

  // Share equipped with TaskDetailModal cache via primeEquippedAvatarCache.
  useEffect(() => {
    if (!hasToken) return;
    primeEquippedAvatarCache(equipped);
  }, [equipped, hasToken]);

  // Items in currently-visible tab; hair hidden until user switches tabs.
  const visibleInventory = useMemo(
    () => inventory.filter((inv) =>
      activeTab === "hair"
        ? isHairSlot(inv.avatarItem?.slot)
        : !isHairSlot(inv.avatarItem?.slot),
    ),
    [inventory, activeTab],
  );

  // dnd-kit sensors — small activation distance so click isn't read as drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
  );

  // Last snapped (x,y) in drag-delta px; carries across moves for hysteresis.
  const lastSnapRef = useRef({ x: 0, y: 0 });
  const snapToGrid = useCallback<Modifier>(({ transform }) => {
    const last = lastSnapRef.current;
    let x = last.x;
    let y = last.y;
    if (Math.abs(transform.x - last.x) >= snapHysteresis) {
      x = Math.round(transform.x / snapStep) * snapStep;
    }
    if (Math.abs(transform.y - last.y) >= snapHysteresis) {
      y = Math.round(transform.y / snapStep) * snapStep;
    }
    // Clamp snap inside grid so dragged box can't translate outside bounds.
    if (activeDragId != null) {
      const moving = inventory.find((r) => r.inventoryId === activeDragId);
      if (
        moving?.avatarItem
        && moving.positionX != null
        && moving.positionY != null
      ) {
        const { cols, rows } = sizeFor(moving.avatarItem, rotations.has(activeDragId));
        const minX = -moving.positionX * snapStep;
        const maxX = (gridCols - moving.positionX - cols) * snapStep;
        const minY = -moving.positionY * snapStep;
        const maxY = (gridRows - moving.positionY - rows) * snapStep;
        x = Math.max(minX, Math.min(maxX, x));
        y = Math.max(minY, Math.min(maxY, y));
      }
    }
    lastSnapRef.current = { x, y };
    return { ...transform, x, y };
  }, [activeDragId, inventory, rotations, gridCols, gridRows, snapStep, snapHysteresis]);
  const modifiers = useMemo(() => [snapToGrid], [snapToGrid]);

  const onDragStart = useCallback((event: DragStartEvent) => {
    lastSnapRef.current = { x: 0, y: 0 };
    const id = event.active.id;
    if (typeof id === "number") {
      setActiveDragId(id);
      // Capture rotation now so we can revert if the drop is rejected.
      dragStartRotatedRef.current = rotations.has(id);
    }
  }, [rotations]);

  // Revert any rotation toggled during the drag — Q/E during drag updates state freely,
  // but a cancel means the user didn't commit any change, so the chibi's rotation reverts.
  const revertDragRotation = useCallback(() => {
    if (activeDragId == null) return;
    const original = dragStartRotatedRef.current;
    setRotations((prev) => {
      const has = prev.has(activeDragId);
      if (has === original) return prev;
      const n = new Set(prev);
      if (original) n.add(activeDragId);
      else n.delete(activeDragId);
      return n;
    });
  }, [activeDragId]);

  const onDragCancel = useCallback(() => {
    revertDragRotation();
    setActiveDragId(null);
  }, [revertDragRotation]);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    const invId = event.active.id;
    const overId = event.over?.id;
    // Helper: commit the post-drag rotation if it differs from the persisted value,
    // OR revert it to the drag-start snapshot when the drop is rejected. Server keeps
    // rotation pinned to the inventory row so we always end up consistent.
    const releaseAndRevert = () => {
      revertDragRotation();
      setActiveDragId(null);
    };
    // Dropped outside the grid entirely.
    if (typeof invId !== "number" || typeof overId !== "string") { releaseAndRevert(); return; }
    // Drop targets keyed as "cell-{x}-{y}".
    const match = /^cell-(\d+)-(\d+)$/.exec(overId);
    if (!match) { releaseAndRevert(); return; }
    const x = Number(match[1]);
    const y = Number(match[2]);
    const moving = inventory.find((r) => r.inventoryId === invId);
    if (!moving?.avatarItem) { releaseAndRevert(); return; }
    const rotated = rotations.has(invId);
    const { cols, rows } = sizeFor(moving.avatarItem, rotated);
    // Only collide against same-tab items; hair shares coords with equipment.
    const movingIsHair = isHairSlot(moving.avatarItem.slot);
    const sameTab = inventory.filter((r) => isHairSlot(r.avatarItem?.slot) === movingIsHair);
    if (!rectFits(sameTab, invId, x, y, cols, rows, rotations, gridCols, gridRows)) {
      // Overlap / off-grid — drop rejected, revert any in-drag rotation toggle.
      releaseAndRevert();
      return;
    }
    setActiveDragId(null);
    if (moving.positionX === x && moving.positionY === y && moving.isRotated === rotated) return;
    setInventory((prev) => prev.map((row) =>
      row.inventoryId === invId ? { ...row, positionX: x, positionY: y, isRotated: rotated } : row));
    if (!hasToken) return;
    // Persist to column matching active grid shape; backend keeps desktop/mobile separate.
    avatarApi.setPosition(invId, x, y, rotated, isDesktop ? "desktop" : "mobile").then(({ error }) => {
      if (error) setError(error);
    });
  }, [inventory, rotations, setError, gridCols, gridRows, hasToken, isDesktop, revertDragRotation]);

  // Q/E toggles rotation on the dragged item; handler installed only during active drag.
  // The toggle is unconditional — no overlap or in-grid check here, so users can spin
  // a 2-cell item even when its current position would conflict. The drop handler is
  // responsible for validating the final placement and reverting rotation on rejection.
  useEffect(() => {
    if (activeDragId == null) return;
    const dragging = inventory.find((r) => r.inventoryId === activeDragId);
    // Skip listener for items that can't rotate (1×1 and BODY).
    if (!dragging?.avatarItem || !canRotate(dragging.avatarItem)) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "q" && e.key !== "Q" && e.key !== "e" && e.key !== "E") return;
      // Browser fires keydown repeatedly while held (~30Hz); respond only once per physical press.
      if (e.repeat) return;
      e.preventDefault();
      setRotations((prev) => {
        const n = new Set(prev);
        if (n.has(activeDragId)) n.delete(activeDragId);
        else n.add(activeDragId);
        return n;
      });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeDragId, inventory]);

  async function onCardClick(inv: UserInventoryDto) {
    if (busyIds.has(inv.inventoryId)) return;
    setBusyIds((prev) => new Set(prev).add(inv.inventoryId));
    try {
      if (inv.isEquipped) {
        if (hasToken) {
          const { error } = await avatarApi.unequip(inv.inventoryId);
          if (error) { setError(error); return; }
        }
        setInventory((prev) => prev.map((row) =>
          row.inventoryId === inv.inventoryId ? { ...row, isEquipped: false } : row));
      } else {
        const slot = inv.avatarItem?.slot;
        const newIsOffhand = slot === "OFFHAND";
        const newIs2H = isTwoHanded(inv.avatarItem);
        // Cross-slot weapon group: equipping a weapon-slot item unequips other weapon-slot items,
        // EXCEPT OFFHAND coexists with 1H primary weapons (MapleStory sword + shield rule).
        // 2H primaries (staff/polearm/bow) still mutex with OFFHAND.
        const crossWeaponRows = isWeaponSlot(slot)
          ? inventory.filter((row) => {
              if (!row.isEquipped) return false;
              if (row.inventoryId === inv.inventoryId) return false;
              const rowSlot = row.avatarItem?.slot;
              if (!isWeaponSlot(rowSlot)) return false;
              // Same-slot duplicates handled by the same-slot drop below — skip here.
              if (rowSlot === slot) return false;
              // Coexistence rules between OFFHAND and the primary weapon.
              if (newIsOffhand && rowSlot === "WEAPON_FRONT") {
                // Only drop the existing primary if it's two-handed.
                return isTwoHanded(row.avatarItem);
              }
              if (rowSlot === "OFFHAND" && slot === "WEAPON_FRONT") {
                // Only drop the existing off-hand if the new primary is two-handed.
                return newIs2H;
              }
              // Default: all other weapon-slot combos remain mutually exclusive.
              return true;
            })
          : [];
        // Cross-slot mutex outside the weapon family: outfit (OVERALL/BODY ↔ TOP/BOTTOM),
        // hair (HAIR/HAIR_FRONT/HAIR_BACK), and hat (HAT/HEAD) groups.
        const crossSlotRows = inventory.filter((row) => {
          if (!row.isEquipped) return false;
          if (row.inventoryId === inv.inventoryId) return false;
          return shouldDropOnEquip(slot, row.avatarItem?.slot);
        });
        // Dedupe in case any row qualifies under both weapon + cross-slot rules.
        const allDrops = new Map<number, UserInventoryDto>();
        for (const row of crossWeaponRows) allDrops.set(row.inventoryId, row);
        for (const row of crossSlotRows) allDrops.set(row.inventoryId, row);
        if (hasToken) {
          // Sequential unequip so 5xx on one doesn't leave the rest half-applied.
          for (const row of allDrops.values()) {
            const { error } = await avatarApi.unequip(row.inventoryId);
            if (error) { setError(error); return; }
          }
          const { error } = await avatarApi.equip(inv.inventoryId);
          if (error) { setError(error); return; }
        }
        // Mirror locally: flip this on; turn off same-slot dup and all cross-mutex rows.
        const droppedIds = new Set(allDrops.keys());
        setInventory((prev) => prev.map((row) => {
          if (row.inventoryId === inv.inventoryId) return { ...row, isEquipped: true };
          if (droppedIds.has(row.inventoryId)) return { ...row, isEquipped: false };
          if (row.isEquipped && row.avatarItem?.slot === slot) return { ...row, isEquipped: false };
          return row;
        }));
      }
      // Equip changed — drop modal cache so next open re-fetches.
      clearEquippedAvatarCache();
    } finally {
      setBusyIds((prev) => {
        const n = new Set(prev);
        n.delete(inv.inventoryId);
        return n;
      });
    }
  }

  // Sell-back: right-click an inventory card → SellConfirmModal opens; modal's Sell button
  // runs confirmSell() which hits the server and removes the row. 50% rate mirrors
  // SellInventoryHandler.SellRefundRatio on the backend.
  function onCardSell(inv: UserInventoryDto) {
    if (busyIds.has(inv.inventoryId)) return;
    if (!inv.avatarItem) return;
    setSellTarget(inv);
  }

  async function confirmSell() {
    const inv = sellTarget;
    if (!inv) return;
    const item = inv.avatarItem;
    if (!item) return;
    if (busyIds.has(inv.inventoryId)) return;
    setBusyIds((prev) => new Set(prev).add(inv.inventoryId));
    try {
      const { data, error } = await avatarApi.sellInventory(inv.inventoryId);
      if (error) { setError(error); return; }
      setInventory((prev) => prev.filter((row) => row.inventoryId !== inv.inventoryId));
      clearEquippedAvatarCache();
      setSellTarget(null);
      if (data) {
        setSuccess(`Sold "${item.name}" for ${data.refundedPoints} pts (new balance: ${data.newBalance}).`);
      }
    } finally {
      setBusyIds((prev) => {
        const n = new Set(prev);
        n.delete(inv.inventoryId);
        return n;
      });
    }
  }

  if (!isMounted) return null;

  return (
    <main className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div
        className="mx-auto px-4 py-6 flex flex-col gap-5"
        style={{ maxWidth: isDesktop ? 1024 : 448 }}
      >
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="text-[10px] tracking-widest uppercase font-semibold"
            style={{ color: "var(--color-fg-subtle)", textDecoration: "none" }}
          >
            ← Back
          </Link>
          <h1
            className="text-xs font-semibold"
            style={{ color: "var(--color-fg)", letterSpacing: "0.18em", textTransform: "uppercase" }}
          >
            Avatar
          </h1>
          <span style={{ width: 40 }} aria-hidden />
        </header>

        {!hasToken && <DemoModeBanner className="" />}

        {/* Two-column split on desktop, stacked on mobile */}
        <div
          style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            // 60px gap on desktop gives chibi's right-side overhang clear space.
            gap: isDesktop ? 60 : 20,
            alignItems: isDesktop ? "flex-start" : "stretch",
          }}
        >
        {/* Preview — chibi floats directly on page background, no frame */}
        <section
          className="flex flex-col items-center justify-center"
          style={{
            padding: "12px 16px 4px",
            flex: isDesktop ? "0 0 auto" : undefined,
            position: isDesktop ? "sticky" : undefined,
            top: isDesktop ? 24 : undefined,
            alignSelf: isDesktop ? "flex-start" : undefined,
          }}
        >
          <ChibiAvatar equipped={equipped} height={isDesktop ? 240 : 160} />
          <p style={{ color: "var(--color-fg-subtle)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 14 }}>
            {loading ? "Loading…" : equipped.length === 0 ? "Nothing equipped" : `${equipped.length} equipped`}
          </p>
        </section>

        {/* Inventory grid — only items the user owns; click to equip/unequip */}
        <section
          className="flex flex-col gap-3"
          style={{
            flex: isDesktop ? "1 1 auto" : undefined,
            minWidth: 0,
            alignItems: isDesktop ? undefined : "center",
          }}
        >
          <h2
            style={{
              color: "var(--color-fg-subtle)",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Inventory {!loading && `(${visibleInventory.length})`}
          </h2>
          {!loading && (
            <div style={{ display: "flex", gap: 6 }}>
              {(["equipment", "hair"] as const).map((tab) => {
                const active = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "5px 12px",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      borderRadius: 0,
                      // RE4-style flat tab.
                      border: "1px solid rgba(220, 230, 235, 0.55)",
                      background: active ? "rgba(40, 44, 48, 0.85)" : "rgba(20, 22, 24, 0.55)",
                      color: active ? "rgba(235, 240, 245, 0.95)" : "rgba(170, 180, 185, 0.6)",
                      cursor: "pointer",
                    }}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          )}
          {loading ? (
            <p style={{ color: "var(--color-fg-subtle)", fontSize: 11 }}>Loading items…</p>
          ) : visibleInventory.length === 0 ? (
            <p style={{ color: "var(--color-fg-subtle)", fontSize: 11 }}>
              {activeTab === "hair"
                ? "No hair items yet."
                : "You don’t own any items yet."}
            </p>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={topLeftCellCollision}
              modifiers={modifiers}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragCancel={onDragCancel}
              // Opt out of auto-scroll; grid fits viewport, prevents mobile page-scroll on drag.
              autoScroll={false}
            >
              {/* data-edge-drawer-block opts grid out of MobileEdgeDrawer's right-swipe open */}
              <div
                data-edge-drawer-block
                style={{
                  overflowX: "auto",
                  paddingBottom: 4,
                  margin: isDesktop ? "0 -8px" : 0,
                  padding: isDesktop ? "0 8px 6px" : "0 0 6px",
                }}
              >
              <div
                style={{
                  padding: 1,
                  // RE4-style: dark transparent grid with bright hairline border.
                  background: "rgba(200, 210, 215, 0.18)",
                  border: "1px solid rgba(220, 230, 235, 0.6)",
                  borderRadius: 0,
                  display: "grid",
                  gridTemplateColumns: `repeat(${gridCols}, ${cellPx}px)`,
                  gridTemplateRows: `repeat(${gridRows}, ${cellPx}px)`,
                  gap: 1,
                  width: "fit-content",
                  // Desktop left-aligned; mobile centred via margin auto.
                  margin: isDesktop ? 0 : "0 auto",
                }}
              >
                {/* Drop-target underlay — every cell droppable; items render on top via gridColumnStart */}
                {Array.from({ length: gridCols * gridRows }).map((_, i) => {
                  const x = i % gridCols;
                  const y = Math.floor(i / gridCols);
                  return <DropCell key={`cell-${x}-${y}`} x={x} y={y} />;
                })}

                {visibleInventory
                  .filter((row) => row.positionX != null && row.positionY != null)
                  .map((inv) => (
                    <DraggableItem
                      key={inv.inventoryId}
                      inv={inv}
                      busy={busyIds.has(inv.inventoryId)}
                      failed={failedIds.has(inv.avatarItem!.itemId)}
                      rotated={rotations.has(inv.inventoryId)}
                      dimmed={activeDragId != null && activeDragId !== inv.inventoryId}
                      onCardClick={onCardClick}
                      onCardSell={onCardSell}
                      onImageError={(itemId) => setFailedIds((prev) => {
                        if (prev.has(itemId)) return prev;
                        const n = new Set(prev);
                        n.add(itemId);
                        return n;
                      })}
                    />
                  ))}
              </div>
              </div>
            </DndContext>
          )}
        </section>
        </div>

        {/* Admin manage-items panel; hidden until JWT read so SSR matches first paint */}
        {userRoles.ready && userRoles.canManageAvatarItems && (
          <AvatarAdminPanel
            isAdmin={userRoles.isAdmin}
            isModerator={userRoles.isModerator}
          />
        )}
      </div>
      <SellConfirmModal
        inv={sellTarget}
        refundPoints={sellTarget?.avatarItem ? Math.floor(sellTarget.avatarItem.cost * 0.5) : 0}
        busy={sellTarget ? busyIds.has(sellTarget.inventoryId) : false}
        onSell={confirmSell}
        onCancel={() => { if (!sellTarget || !busyIds.has(sellTarget.inventoryId)) setSellTarget(null); }}
      />
    </main>
  );
}

// Single empty grid cell; dnd-kit drop target keyed `cell-{x}-{y}`.
function DropCell({ x, y }: { x: number; y: number }) {
  const { setNodeRef } = useDroppable({ id: `cell-${x}-${y}` });
  return (
    <div
      ref={setNodeRef}
      style={{
        gridColumnStart: x + 1,
        gridRowStart: y + 1,
        // Desaturated dark fill with inner vignette — RE4 attaché-case pocket look.
        background: "rgba(28, 30, 32, 0.65)",
        boxShadow: "inset 0 0 18px rgba(0, 0, 0, 0.55)",
      }}
    />
  );
}

interface DraggableItemProps {
  inv: UserInventoryDto;
  busy: boolean;
  failed: boolean;
  rotated: boolean;
  dimmed: boolean;
  onCardClick: (inv: UserInventoryDto) => void;
  // Right-click on a card triggers sell-back (parent shows confirm + handles refund).
  onCardSell: (inv: UserInventoryDto) => void;
  onImageError: (itemId: number) => void;
}

// Single inventory card; renders ON TOP of drop-cell underlay via explicit grid placement.
function DraggableItem({ inv, busy, failed, rotated, dimmed, onCardClick, onCardSell, onImageError }: DraggableItemProps) {
  const item = inv.avatarItem!;
  // Effective footprint — rotation-aware, except BODY items keep native shape.
  const size = sizeFor(item, rotated);
  const isEquipped = inv.isEquipped;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: inv.inventoryId,
  });
  // Run alpha-scan client-side so card centres even when row has no server bounds.
  const clientBounds = useClientBounds(
    item.previewAssetUrl ? assetPath(item.previewAssetUrl) : null,
  );

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={() => { if (!isDragging) onCardClick(inv); }}
      onContextMenu={(e) => {
        // Override the browser context menu so right-click on an inventory card opens the
        // sell-back confirm dialog instead. Cards have nothing useful in the native menu.
        e.preventDefault();
        if (!isDragging) onCardSell(inv);
      }}
      disabled={busy}
      title={`${item.description ?? item.name} (right-click to sell)`}
      // Drop `re-cell` while dragging so :hover can't override; `is-dragging` pins yellow look.
      className={isDragging ? "is-dragging" : "re-cell"}
      style={{
        gridColumnStart: (inv.positionX ?? 0) + 1,
        gridColumnEnd: `span ${size.cols}`,
        gridRowStart: (inv.positionY ?? 0) + 1,
        gridRowEnd: `span ${size.rows}`,
        background: isDragging
          ? "var(--color-active-highlight-bg)"
          : isEquipped
            ? "rgba(48, 52, 56, 0.85)"
            : "rgba(28, 30, 32, 0.85)",
        boxShadow: isDragging
          ? "inset 0 0 0 2px var(--color-active-highlight)"
          : isEquipped
            ? "inset 0 0 0 1px rgba(230, 235, 240, 0.9)"
            : "inset 0 0 18px rgba(0, 0, 0, 0.55)",
        border: "none",
        padding: 0,
        cursor: busy ? "wait" : (isDragging ? "grabbing" : "grab"),
        // Dim non-dragged cards while drag in progress so yellow dragged card is unambiguous.
        opacity: busy ? 0.5 : dimmed ? 0.35 : 1,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        zIndex: isDragging ? 50 : 1,
        touchAction: "none",
      }}
      {...listeners}
      {...attributes}
    >
      {hasRealAsset(item.previewAssetUrl) && !failed ? (() => {
        // Resolve shared transform once; both layers share bbox-derived translate/scale.
        // Pass un-rotated card footprint (getItemSize, not rotation-aware `size`) so
        // math centres against actual rendered box.
        const filename = item.previewAssetUrl?.split("/").pop() ?? "";
        const cardSize = getItemSize(item);
        // Two-layer items: primary bbox doesn't represent combined visual; skip auto-centre.
        const isTwoLayer = !!item.secondaryAssetUrl && hasRealAsset(item.secondaryAssetUrl);
        // HAT/HEAD: per-image autoBounds renders each hat at a different scale/position based on its
        // own bbox; helmets, hats, and headwear end up visually inconsistent. Force every hat to use
        // the uniform SLOT_TRANSFORM instead. Same treatment for OFFHAND so shields/daggers/orbs
        // all render at the same scale and position regardless of their own bbox.
        const isHatSlot = item.slot === "HAT" || item.slot === "HEAD";
        const isOffhandSlot = item.slot === "OFFHAND";
        const autoBounds = (isTwoLayer || isHatSlot || isOffhandSlot)
          ? null
          : boundsTransformFor(item, clientBounds, { cols: cardSize.cols, rows: cardSize.rows });
        const baseTransform =
          autoBounds
          ?? CARD_TRANSFORM_OVERRIDE[filename]
          ?? cardClassTransform(item)
          ?? SLOT_TRANSFORM[item.slot]
          ?? "scale(1.4)";
        const layerTransform = (() => {
          if (!rotated) return baseTransform;
          const rotatedOverride = CARD_TRANSFORM_ROTATED_OVERRIDE[filename];
          if (rotatedOverride) return rotatedOverride;
          const rotatedClass = cardClassRotatedTransform(item);
          if (rotatedClass) return rotatedClass;
          const scale = baseTransform.match(/scale\([^)]+\)/)?.[0] ?? "scale(1.4)";
          return `${scale} rotate(90deg)`;
        })();
        const hasSecondary = item.secondaryAssetUrl && hasRealAsset(item.secondaryAssetUrl);
        // Secondary z-order mirrors ChibiAvatar: CAPE primary=back→secondary front; HAIR/WEAPON_FRONT primary=front→secondary behind.
        const secondaryInFront = item.slot === "CAPE";
        const layerStyle = (z: number): React.CSSProperties => ({
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          imageRendering: "pixelated",
          transform: layerTransform,
          transformOrigin: "center",
          pointerEvents: "none",
          zIndex: z,
        });
        return (
          <>
            {hasSecondary && !secondaryInFront && (
              <Image
                src={assetPath(item.secondaryAssetUrl!)}
                alt=""
                width={120}
                height={120}
                unoptimized
                loading="eager"
                draggable={false}
                style={layerStyle(0)}
              />
            )}
            <Image
              src={assetPath(item.previewAssetUrl!)}
              alt=""
              width={120}
              height={120}
              unoptimized
              loading="eager"
              draggable={false}
              onError={() => onImageError(item.itemId)}
              style={layerStyle(1)}
            />
            {hasSecondary && secondaryInFront && (
              <Image
                src={assetPath(item.secondaryAssetUrl!)}
                alt=""
                width={120}
                height={120}
                unoptimized
                loading="eager"
                draggable={false}
                style={layerStyle(2)}
              />
            )}
          </>
        );
      })() : (
        <PaperIcon />
      )}
      {isEquipped && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 6,
            height: 6,
            borderRadius: "50%",
            // Small bright accent on equipped cards; RE4-style off-white marker.
            background: "rgba(235, 240, 245, 0.95)",
            boxShadow: "0 0 5px rgba(235, 240, 245, 0.7)",
          }}
        />
      )}
    </button>
  );
}

// Pixel-art "document" silhouette fallback when item's preview PNG fails to load.
function PaperIcon() {
  return (
    <svg
      width="60%"
      height="60%"
      viewBox="0 0 10 12"
      shapeRendering="crispEdges"
      fill="var(--color-fg-muted)"
      style={{ imageRendering: "pixelated" }}
    >
      {/* Top edge — stops short so folded corner fits */}
      <rect x="1" y="1" width="6" height="1" />
      {/* Folded corner */}
      <rect x="7" y="1" width="1" height="2" />
      <rect x="8" y="2" width="1" height="2" />
      <rect x="9" y="3" width="1" height="8" />
      {/* Bottom edge */}
      <rect x="1" y="11" width="9" height="1" />
      {/* Left edge */}
      <rect x="1" y="1" width="1" height="11" />
      {/* Body fill */}
      <rect x="2" y="2" width="5" height="9" fill="var(--color-fg-muted)" opacity="0.18" />
      <rect x="7" y="3" width="2" height="8" fill="var(--color-fg-muted)" opacity="0.18" />
      {/* Three text lines */}
      <rect x="3" y="4" width="4" height="1" opacity="0.55" />
      <rect x="3" y="6" width="4" height="1" opacity="0.55" />
      <rect x="3" y="8" width="3" height="1" opacity="0.55" />
    </svg>
  );
}
