"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ChibiAvatar from "@/components/ChibiAvatar";
import DemoModeBanner from "@/components/DemoModeBanner";
import { buildMockInventory } from "@/lib/mockAvatar";
import { assetPath } from "@/lib/assetPath";
import { avatarApi, type AvatarItemDto, type UserInventoryDto, type ItemSlot } from "@/lib/api/avatar";
import { useToast } from "@/context/ToastContext";
import { useDesktopLayout } from "@/hooks/useDesktopLayout";
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

// Grid dimensions for the inventory. Desktop is landscape (7×5) for the
// RE5/RE6 attaché-case feel; mobile flips to portrait (5×7) so the grid
// fits the narrower viewport without horizontal scroll. Total cells stay
// at 35 so identical inventories fit on both shapes — items that don't
// fit the new shape are re-placed by autoPlace.
const GRID_DESKTOP = { cols: 7, rows: 5 } as const;
const GRID_MOBILE = { cols: 5, rows: 7 } as const;
// Desktop cells stay at the comfortable 64px the layout was designed around.
// Mobile cells are shrunk to 56px so the 5-wide grid (5×56 + gaps ≈ 286px)
// fits inside a 320px viewport's content area without triggering a horizontal
// scrollbar — 64px overflows on the narrowest common phone widths.
const CELL_PX_DESKTOP = 64;
const CELL_PX_MOBILE = 56;

// CSS transform applied to the inventory-card image so the sprite is zoomed
// in and roughly centered on the actual item content. Each item PNG covers
// the full 256×384 chibi canvas, so the item sits in a slot-specific region
// of that canvas — we scale up and translate to bring that region into the
// card's center. translateY is a percentage of the image height.
const SLOT_TRANSFORM: Record<ItemSlot, string> = {
  HEAD:  "scale(1.7) translateY(22%)",
  HAIR:  "scale(1.7) translateY(20%)",
  FACE:  "scale(1.7) translateY(12%)",
  BODY:  "scale(1.4) translateY(-4%)",
  HAND:  "scale(1.4) translateY(-6%)",
  BACK:  "scale(1.4) translateY(2%)",
  FEET:  "scale(1.7) translateY(-22%)",
};

// Per-asset overrides for the inventory-card transform, keyed by filename.
// Use this when a sprite needs more zoom or a different vertical offset than
// its slot default — e.g. an oversized weapon on a 384×384 canvas would
// otherwise render small inside its 2×1 card.
const CARD_TRANSFORM_OVERRIDE: Record<string, string> = {
  "weapon_polearm_alien_cyber.png": "scale(2.2) translate(3%, -10%)",
};

// Per-asset overrides for the *rotated* card transform. Translate happens
// before rotate in CSS transforms, so when the polearm card is flipped 90°
// the unrotated translate(3%, -10%) maps to a different screen direction —
// the off-center bias of the source sprite reappears in a new corner.
// Calibrate these values by direct feedback rather than computing from the
// unrotated transform.
const CARD_TRANSFORM_ROTATED_OVERRIDE: Record<string, string> = {
  "weapon_polearm_alien_cyber.png": "scale(2.2) translate(10%, 3%) rotate(90deg)",
};

// Resident-Evil-style inventory: items take up a different number of grid
// cells depending on what they are. The backend now stores gridCols/gridRows
// per item — when set we honour those directly. Older rows without a stored
// size fall back to a slot-based heuristic so the page still renders.
function getItemSize(item: AvatarItemDto): { cols: number; rows: number } {
  if (item.gridCols && item.gridRows) {
    return { cols: item.gridCols, rows: item.gridRows };
  }
  const cat = (item.category ?? "").toLowerCase();
  switch (item.slot) {
    case "HEAD":
    case "HAIR":
    case "FACE":
    case "FEET":
    case "BODY":
      return { cols: 1, rows: 1 };
    case "HAND":
      return cat === "weapon" ? { cols: 2, rows: 1 } : { cols: 1, rows: 1 };
    case "BACK":
      return { cols: 2, rows: 1 };
    default:
      return { cols: 1, rows: 1 };
  }
}

// Per-asset render hints (offsetX/Y, renderScale, coversHair, sourceWidth/Height).
// The backend AvatarItemDto doesn't persist these — they're applied here keyed
// by the asset filename so the same PNG renders correctly whether the item
// came from the mock catalogue or from /api/AvatarItems.
const RENDER_HINTS: Record<string, Partial<AvatarItemDto>> = {
  "hat_alien_neo.png": { coversHair: true, renderScale: 1.2, offsetY: 10 },
  "hair_seraph_wave_brown.png": { offsetX: 11 },
  "weapon_polearm_alien_cyber.png": {
    sourceWidth: 384, sourceHeight: 384, offsetX: 6, offsetY: -8, renderScale: 1.25,
  },
};

function applyHints(item: AvatarItemDto): AvatarItemDto {
  if (!item.previewAssetUrl) return item;
  const filename = item.previewAssetUrl.split("/").pop() ?? "";
  const hints = RENDER_HINTS[filename];
  return hints ? { ...item, ...hints } : item;
}

// Whitelist of URL patterns that point to real (or potentially real) assets.
// Anything else — notably the legacy seed paths like `/assets/hats/…` — is
// treated as a placeholder so we never issue a 404 GET for it. Add new
// patterns here whenever a real asset source comes online.
function hasRealAsset(url: string | null | undefined): boolean {
  if (!url) return false;
  return url.startsWith("https://wahaha.blob.core.windows.net/")
      || url.startsWith("/avatar-items/")
      || url.startsWith("data:");
}

// Step between adjacent grid cells in screen pixels — equals the cell size
// plus the 1px gap rendered by the grid container. Used by the snap-to-grid
// drag modifier so the dragged item jumps exactly cell-to-cell. Cell size
// differs between desktop and mobile, so the snap step is computed inside
// the component (see snapToGrid below) rather than living here as a module
// constant.
// Hysteresis fraction for the snap modifier: the dragged card only flips
// to the next cell once the cursor has moved past 70% of the cell step
// from the last snapped position — eliminates the back-and-forth flicker
// when the cursor hovers near a cell boundary.
const SNAP_HYSTERESIS_FRACTION = 0.7;

// Custom dnd-kit collision detector that snaps to the cell closest to the
// active item's TOP-LEFT corner (rather than the cell under the cursor).
// This makes the drop indicator follow the dragged box itself, so the user
// doesn't have to mentally offset the cursor when placing a multi-cell item.
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

// Returns true when the rectangle (x, y, cols, rows) fits entirely inside
// the grid AND doesn't overlap any other item in `rows`. `skipId` excludes
// the item being moved from the collision check (so it doesn't collide
// with itself). `rotations` is the set of inventoryIds that are currently
// rotated 90°, swapping their cols/rows for the overlap check.
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

// Assigns a position to every inventory row that doesn't already have one,
// scanning the grid row-by-row for the first cell where the item's footprint
// fits without colliding with already-placed items. Items that can't fit
// stay positionless and are skipped from the grid render.
// Whether the user can rotate (Q/E) this item while dragging it. Square
// (1×1) footprints have nothing to flip, so rotation is a no-op for them.
function canRotate(item: AvatarItemDto): boolean {
  const { cols, rows } = getItemSize(item);
  return cols !== rows;
}

// Effective grid footprint of an item given its current rotation state.
// All rotatable items swap cols/rows when flipped 90°.
function sizeFor(item: AvatarItemDto, rotated: boolean): { cols: number; rows: number } {
  const base = getItemSize(item);
  if (!rotated) return base;
  return { cols: base.rows, rows: base.cols };
}

// True if the row's persisted position keeps its (rotation-aware) footprint
// inside the grid. Catches the case where an item's gridCols/gridRows was
// changed in the backend after the position was saved — the old position
// may now extend past the grid edge. Honours the persisted `isRotated`
// flag so a rotated 2×1 at the right edge stays valid.
function hasValidPlacement(row: UserInventoryDto, gridCols: number, gridRows: number): boolean {
  if (row.positionX == null || row.positionY == null) return false;
  if (!row.avatarItem) return false;
  const { cols, rows } = sizeFor(row.avatarItem, !!row.isRotated);
  return row.positionX >= 0
    && row.positionY >= 0
    && row.positionX + cols <= gridCols
    && row.positionY + rows <= gridRows;
}

function autoPlace(rows: UserInventoryDto[], gridCols: number, gridRows: number): UserInventoryDto[] {
  // Build a rotations set from the persisted `isRotated` flags so the
  // collision check inside rectFits uses each row's actual footprint
  // (rotated rows have swapped cols/rows).
  const persistedRotations = new Set<number>(
    rows.filter((r) => r.isRotated).map((r) => r.inventoryId),
  );
  // Strip persisted positions that no longer fit inside the grid (e.g.
  // an item's size grew after a backend migration). Those rows fall back
  // into the "needs placement" queue and get a fresh slot.
  const placed: UserInventoryDto[] = rows
    .filter((r) => hasValidPlacement(r, gridCols, gridRows))
    .slice();
  const result: UserInventoryDto[] = [...placed];
  for (const row of rows) {
    if (hasValidPlacement(row, gridCols, gridRows)) continue;
    // Re-placement honours the item's persisted rotation so a rotated
    // polearm gets a slot that fits its rotated footprint.
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
  // Hair has its own grid so the main inventory isn't cluttered with wigs.
  // Position is stored per inventory row; collision checks are scoped to
  // the active tab so hair and equipment can share the same coordinates.
  const [activeTab, setActiveTab] = useState<"equipment" | "hair">("equipment");
  // Inventory IDs currently rotated 90° (cols/rows swapped). Ephemeral —
  // not persisted, so refresh resets every item to its native orientation.
  // Toggled by Q/E while an item is being dragged.
  const [rotations, setRotations] = useState<Set<number>>(new Set());
  // The inventoryId of the item currently being dragged, or null if no drag
  // is active. Used to scope the Q/E keydown handler.
  const [activeDragId, setActiveDragId] = useState<number | null>(null);
  // Inventory IDs currently being mutated — used to disable the card mid-request.
  const [busyIds, setBusyIds] = useState<Set<number>>(new Set());
  // Item IDs whose preview PNG returned a non-OK response — those cards
  // render a pixelated paper placeholder instead of the broken image.
  const [failedIds, setFailedIds] = useState<Set<number>>(new Set());
  const { setError } = useToast();
  const isDesktop = useDesktopLayout();
  const { cols: gridCols, rows: gridRows } = isDesktop ? GRID_DESKTOP : GRID_MOBILE;
  // Active cell size and derived snap step. Mobile uses a smaller cell so
  // the grid fits inside narrow phone viewports without horizontal scroll;
  // the snap step must follow it so drag positioning lines up cell-to-cell
  // at the rendered size.
  const cellPx = isDesktop ? CELL_PX_DESKTOP : CELL_PX_MOBILE;
  const snapStep = cellPx + 1;
  const snapHysteresis = snapStep * SNAP_HYSTERESIS_FRACTION;

  // Per-viewport position caches. Each shape (desktop 7×5, mobile 5×7) keeps
  // its own canonical layout so flipping between them never destroys the
  // arrangement the user built on either one. The desktop cache is seeded
  // from backend positions on first load; the mobile cache is populated on
  // its first activation by autoPlace on top of the desktop layout — items
  // that fit keep their (x, y), items that don't get the top-most free slot.
  const desktopPositionsRef = useRef<Map<number, { x: number; y: number; rotated: boolean }>>(new Map());
  const mobilePositionsRef = useRef<Map<number, { x: number; y: number; rotated: boolean }>>(new Map());
  const lastModeRef = useRef<"desktop" | "mobile" | null>(null);
  // Flipped once the initial inventory load resolves so the per-mode swap
  // effect knows it's safe to run.
  const [inventoryLoaded, setInventoryLoaded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const token = !!localStorage.getItem("auth_token");
    setHasToken(token);
    if (!token) {
      // Demo mode — populate inventory from the mock catalogue. Positions
      // are left null; the per-mode swap effect runs autoPlace for the
      // active viewport and caches the result. Equip/unequip and
      // setPosition calls below are guarded so nothing hits the backend.
      const rows = buildMockInventory().map((row) => ({
        ...row,
        avatarItem: applyHints(row.avatarItem!),
      }));
      setInventory(rows);
      setInventoryLoaded(true);
      setLoading(false);
      return;
    }
    avatarApi.getInventory(1, 200).then(({ data, error }) => {
      if (error) setError(error);
      const rows = (data?.data ?? [])
        .filter((row) => row.avatarItem?.previewAssetUrl)
        .map((row) => ({ ...row, avatarItem: applyHints(row.avatarItem!) }));
      // Seed the desktop cache from the persisted backend positions so the
      // swap effect can treat the cache as the source of truth uniformly.
      for (const row of rows) {
        if (row.positionX != null && row.positionY != null) {
          desktopPositionsRef.current.set(row.inventoryId, {
            x: row.positionX, y: row.positionY, rotated: !!row.isRotated,
          });
        }
      }
      setInventory(rows);
      setRotations(new Set(rows.filter((r) => r.isRotated).map((r) => r.inventoryId)));
      setInventoryLoaded(true);
      setLoading(false);
    });
  }, [setError]);

  // Per-mode swap. Fires when the viewport flips (or on first inventory
  // load). Snapshots the outgoing layout into its cache, then restores the
  // incoming layout from its cache and runs autoPlace for anything missing.
  // Newly-assigned desktop positions are persisted to the backend so the
  // user's first-ever layout sticks across reloads; mobile is session-only.
  useEffect(() => {
    if (!inventoryLoaded) return;
    const mode: "desktop" | "mobile" = isDesktop ? "desktop" : "mobile";
    const previousMode = lastModeRef.current;
    if (previousMode === mode) return;
    // Update the ref now so any concurrent reads (e.g. the sync-cache effect
    // firing on the resulting setInventory) target the new mode's cache.
    lastModeRef.current = mode;

    setInventory((prev) => {
      if (prev.length === 0) return prev;

      // 1. Snapshot the rendered positions into the OUTGOING cache so the
      //    user's edits on the previous viewport are preserved when they
      //    flip back.
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

      // 2. Restore each row's position from the INCOMING cache; items with
      //    no cached entry fall through to autoPlace below.
      const incoming = mode === "desktop" ? desktopPositionsRef.current : mobilePositionsRef.current;
      const seeded = prev.map((r) => {
        const c = incoming.get(r.inventoryId);
        if (c) return { ...r, positionX: c.x, positionY: c.y, isRotated: c.rotated };
        return { ...r, positionX: null, positionY: null };
      });

      // 3. autoPlace anything still missing on the incoming grid shape.
      const targetCols = mode === "desktop" ? GRID_DESKTOP.cols : GRID_MOBILE.cols;
      const targetRows = mode === "desktop" ? GRID_DESKTOP.rows : GRID_MOBILE.rows;
      const equipRows = seeded.filter((r) => r.avatarItem?.slot !== "HAIR");
      const hairRows = seeded.filter((r) => r.avatarItem?.slot === "HAIR");
      const placed = [
        ...autoPlace(equipRows, targetCols, targetRows),
        ...autoPlace(hairRows, targetCols, targetRows),
      ];

      // 4. Write back to the incoming cache so future flips restore exactly
      //    this layout, and record which items got brand-new positions —
      //    those are the only ones we persist to the backend (and only on
      //    desktop, since the backend column stores the desktop layout).
      const newlyAssigned: Array<{ id: number; x: number; y: number; rotated: boolean }> = [];
      for (const r of placed) {
        if (r.positionX == null || r.positionY == null) continue;
        const hadCache = incoming.has(r.inventoryId);
        incoming.set(r.inventoryId, { x: r.positionX, y: r.positionY, rotated: !!r.isRotated });
        if (!hadCache && mode === "desktop") {
          newlyAssigned.push({ id: r.inventoryId, x: r.positionX, y: r.positionY, rotated: !!r.isRotated });
        }
      }

      if (hasToken && newlyAssigned.length > 0) {
        for (const a of newlyAssigned) {
          avatarApi.setPosition(a.id, a.x, a.y, a.rotated);
        }
      }

      // 5. Sync the rotation Set so the keyboard handler stays in lockstep
      //    with the rendered orientation.
      setRotations(new Set(placed.filter((r) => r.isRotated).map((r) => r.inventoryId)));

      return placed;
    });
  }, [isDesktop, inventoryLoaded, hasToken]);

  // Keep the active mode's cache in sync on every inventory change (drag,
  // rotate, equip won't touch position). Without this, edits made between
  // viewport flips would be lost when the swap effect reads the cache.
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

  // The chibi only renders items that are flagged equipped.
  const equipped = useMemo(
    () => inventory.filter((inv) => inv.isEquipped),
    [inventory],
  );

  // Items in the currently-visible tab. The grid render and the inventory
  // count both key off this so hair is hidden until the user switches tabs.
  const visibleInventory = useMemo(
    () => inventory.filter((inv) =>
      activeTab === "hair"
        ? inv.avatarItem?.slot === "HAIR"
        : inv.avatarItem?.slot !== "HAIR",
    ),
    [inventory, activeTab],
  );

  // dnd-kit sensors — small activation distance so a click doesn't get
  // misread as a drag. Touch starts on a 150ms long-press so iOS doesn't
  // hijack a tap into a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
  );

  // Last snapped (x, y) the dragged card was rendered at, in drag-delta
  // pixels. Carried across pointer moves to add hysteresis to the snap
  // modifier so the card doesn't flicker between two cells when the
  // cursor hovers near a boundary. Reset on every drag start.
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
    // Clamp the snap within the grid so the dragged box can't translate
    // outside the inventory bounds. Uses the moving item's current position
    // and (rotation-aware) size to compute the allowed delta range.
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
    if (typeof id === "number") setActiveDragId(id);
  }, []);

  const onDragCancel = useCallback(() => {
    setActiveDragId(null);
  }, []);

  const onDragEnd = useCallback((event: DragEndEvent) => {
    setActiveDragId(null);
    const invId = event.active.id;
    const overId = event.over?.id;
    if (typeof invId !== "number" || typeof overId !== "string") return;
    // Drop targets are keyed as "cell-{x}-{y}".
    const match = /^cell-(\d+)-(\d+)$/.exec(overId);
    if (!match) return;
    const x = Number(match[1]);
    const y = Number(match[2]);
    const moving = inventory.find((r) => r.inventoryId === invId);
    if (!moving?.avatarItem) return;
    const { cols, rows } = sizeFor(moving.avatarItem, rotations.has(invId));
    // Only collide against items in the same tab — hair items share grid
    // coordinates with equipment but live in a separate view.
    const movingIsHair = moving.avatarItem.slot === "HAIR";
    const sameTab = inventory.filter((r) => (r.avatarItem?.slot === "HAIR") === movingIsHair);
    if (!rectFits(sameTab, invId, x, y, cols, rows, rotations, gridCols, gridRows)) return;
    const rotated = rotations.has(invId);
    if (moving.positionX === x && moving.positionY === y && moving.isRotated === rotated) return;
    setInventory((prev) => prev.map((row) =>
      row.inventoryId === invId ? { ...row, positionX: x, positionY: y, isRotated: rotated } : row));
    // Mobile keeps its layout in the in-memory cache only; persisting mobile
    // coords would clobber the desktop position on the backend.
    if (!hasToken || !isDesktop) return;
    avatarApi.setPosition(invId, x, y, rotated).then(({ error }) => {
      if (error) setError(error);
    });
  }, [inventory, rotations, setError, gridCols, gridRows, hasToken, isDesktop]);

  // Q/E toggles rotation on the item currently being dragged. The handler is
  // installed only while a drag is active so the keys behave normally when
  // the user isn't interacting with the grid. Each toggle persists immediately
  // so a cancelled drag still keeps the new orientation.
  useEffect(() => {
    if (activeDragId == null) return;
    const dragging = inventory.find((r) => r.inventoryId === activeDragId);
    // Skip the listener entirely for items that can't rotate — 1×1
    // footprints and BODY-slot (sweater/torso) items keep their shape.
    if (!dragging?.avatarItem || !canRotate(dragging.avatarItem)) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "q" && e.key !== "Q" && e.key !== "e" && e.key !== "E") return;
      // Browser fires keydown repeatedly while a key is held (~30Hz). Each
      // repeat would toggle rotation again, so the box flickers between
      // shapes and lands wherever the last fire happens to be. Only respond
      // to the first event per physical press.
      if (e.repeat) return;
      e.preventDefault();
      const newRotated = !rotations.has(activeDragId);
      setRotations((prev) => {
        const n = new Set(prev);
        if (newRotated) n.add(activeDragId);
        else n.delete(activeDragId);
        return n;
      });
      setInventory((prev) => prev.map((r) =>
        r.inventoryId === activeDragId ? { ...r, isRotated: newRotated } : r));
      // Mobile rotation is session-only; the backend column tracks the
      // desktop layout exclusively.
      if (!hasToken || !isDesktop) return;
      // Fire-and-forget — keeps the rotation pinned even if the user
      // releases the mouse outside the grid (drag-cancel).
      avatarApi.setPosition(
        activeDragId,
        dragging.positionX ?? null,
        dragging.positionY ?? null,
        newRotated,
      );
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeDragId, inventory, rotations, hasToken, isDesktop]);

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
        if (hasToken) {
          const { error } = await avatarApi.equip(inv.inventoryId);
          if (error) { setError(error); return; }
        }
        const slot = inv.avatarItem?.slot;
        // Mirror the backend's slot uniqueness locally so the UI updates
        // without a refetch — equipping flips this row on and any other
        // equipped row in the same slot off.
        setInventory((prev) => prev.map((row) => {
          if (row.inventoryId === inv.inventoryId) return { ...row, isEquipped: true };
          if (row.isEquipped && row.avatarItem?.slot === slot) return { ...row, isEquipped: false };
          return row;
        }));
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

        {/* Two-column split on desktop, stacked column on mobile. The flex
            wrapper switches direction at the 880px breakpoint. */}
        <div
          style={{
            display: "flex",
            flexDirection: isDesktop ? "row" : "column",
            gap: isDesktop ? 36 : 20,
            alignItems: isDesktop ? "flex-start" : "stretch",
          }}
        >
        {/* Preview — chibi floats directly on the page background, no frame. */}
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
          <ChibiAvatar equipped={equipped} height={isDesktop ? 360 : 224} />
          <p style={{ color: "var(--color-fg-subtle)", fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: 14 }}>
            {loading ? "Loading…" : equipped.length === 0 ? "Nothing equipped" : `${equipped.length} equipped`}
          </p>
        </section>

        {/* Inventory grid — only items the user owns. Click to equip/unequip.
            On mobile the section's children (header, tab strip, grid wrapper)
            are centred on the cross-axis so the tab buttons sit directly
            above the centred grid instead of hugging the left edge. */}
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
                      // RE4-style flat tab: bright hairline border, very
                      // dark transparent fill when active; muted text when
                      // inactive.
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
              // dnd-kit's default auto-scroll engages whenever the dragged
              // item's rect approaches the edge of any scrollable ancestor
              // — on mobile the page itself is taller than the viewport,
              // so dragging a card downward toward the thumb-rest area
              // makes the whole page scroll uncontrollably. The grid fits
              // entirely in view and never needs scrolling during a drag,
              // so we opt out completely.
              autoScroll={false}
            >
              {/* Horizontally scrollable as a defense if a future shape
                  exceeds the content area. With the current 7×5 / 5×7
                  layouts no scroll is needed. data-edge-drawer-block opts
                  the inventory grid out of MobileEdgeDrawer's right-swipe
                  open gesture — without it, dragging an item rightward
                  on mobile both moves the card AND pulls open the nav
                  drawer. Desktop keeps the -8px negative margin so the
                  grid's left edge can sit flush with the tab strip; mobile
                  drops it and the horizontal padding so the wrapper's
                  intrinsic width equals the grid's, which lets the parent
                  section's align-items:center centre everything cleanly
                  without producing an overflow scrollbar. */}
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
                  // RE4-style: very dark transparent grid background with a
                  // bright hairline outer border — almost monochrome, no
                  // blue tint.
                  background: "rgba(200, 210, 215, 0.18)",
                  border: "1px solid rgba(220, 230, 235, 0.6)",
                  borderRadius: 0,
                  display: "grid",
                  gridTemplateColumns: `repeat(${gridCols}, ${cellPx}px)`,
                  gridTemplateRows: `repeat(${gridRows}, ${cellPx}px)`,
                  gap: 1,
                  width: "fit-content",
                  // Desktop: left-aligned so the grid's left edge lines up
                  // with the tab strip's leftmost tab. Mobile: horizontally
                  // centred in the page so the narrower 5×7 grid sits in
                  // the middle of the screen rather than hugging the left.
                  margin: isDesktop ? 0 : "0 auto",
                }}
              >
                {/* Drop-target underlay — every cell is a droppable so the
                    user can release an item anywhere on the grid. Items
                    render on top via gridColumnStart/gridRowStart. */}
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
      </div>
    </main>
  );
}

// Single empty grid cell. dnd-kit treats it as a drop target keyed by
// `cell-{x}-{y}`. The cell visually fills the grid slot at (x, y) with the
// recessed-pocket look from the original RE-style design.
function DropCell({ x, y }: { x: number; y: number }) {
  const { setNodeRef } = useDroppable({ id: `cell-${x}-${y}` });
  return (
    <div
      ref={setNodeRef}
      style={{
        gridColumnStart: x + 1,
        gridRowStart: y + 1,
        // Desaturated dark fill with a soft inner vignette — matches the
        // RE4-style attaché-case pocket look.
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
  onImageError: (itemId: number) => void;
}

// Single inventory card. Drag handles come from dnd-kit's useDraggable. The
// card is rendered ON TOP of the drop-cell underlay using explicit
// gridColumnStart / gridRowStart from inv.positionX / inv.positionY.
function DraggableItem({ inv, busy, failed, rotated, dimmed, onCardClick, onImageError }: DraggableItemProps) {
  const item = inv.avatarItem!;
  // Effective footprint — accounts for rotation, except BODY items which
  // keep their native shape so the box doesn't morph on Q/E.
  const size = sizeFor(item, rotated);
  const isEquipped = inv.isEquipped;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: inv.inventoryId,
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={() => { if (!isDragging) onCardClick(inv); }}
      disabled={busy}
      title={item.description ?? item.name}
      // Drop the `re-cell` class while dragging so its `:hover` rule (which
      // forces a blue background via !important) can never match. The
      // `is-dragging` class pins the yellow look on its own.
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
        // Dim non-dragged cards while a drag is in progress so the yellow
        // dragged item is unambiguous even when the cursor hovers over a
        // different equipped (blue) card after the snap.
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
      {hasRealAsset(item.previewAssetUrl) && !failed ? (
        <Image
          src={assetPath(item.previewAssetUrl!)}
          alt=""
          width={120}
          height={120}
          unoptimized
          loading="eager"
          draggable={false}
          onError={() => onImageError(item.itemId)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            transform: (() => {
              const filename = item.previewAssetUrl?.split("/").pop() ?? "";
              const base =
                CARD_TRANSFORM_OVERRIDE[filename]
                ?? SLOT_TRANSFORM[item.slot]
                ?? "scale(1.4)";
              // BODY items: rotate only the box footprint, not the sprite —
              // the sweater pixel stays vertically oriented even when the
              // grid box flips horizontal.
              if (!rotated || item.slot === "BODY") return base;
              // Per-asset rotated override wins so off-center sprites can be
              // re-calibrated for the flipped orientation. Otherwise keep
              // just the scale (drops translate, which is in pre-rotation
              // coords and would push the image off-center).
              const rotatedOverride = CARD_TRANSFORM_ROTATED_OVERRIDE[filename];
              if (rotatedOverride) return rotatedOverride;
              const scale = base.match(/scale\([^)]+\)/)?.[0] ?? "scale(1.4)";
              return `${scale} rotate(90deg)`;
            })(),
            transformOrigin: "center",
            pointerEvents: "none",
          }}
        />
      ) : (
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
            // Small bright accent on equipped cards — RE4 uses subdued
            // off-white markers on owned items.
            background: "rgba(235, 240, 245, 0.95)",
            boxShadow: "0 0 5px rgba(235, 240, 245, 0.7)",
          }}
        />
      )}
    </button>
  );
}

// Pixel-art "document" silhouette used as a fallback when an item's preview
// PNG fails to load. Sized to fit its parent — both width and height are
// 60% so the icon sits centered with a little padding inside the card's
// image area. Tinted via currentColor so it picks up the muted foreground.
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
      {/* Top edge — stops short so the folded corner can fit */}
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
