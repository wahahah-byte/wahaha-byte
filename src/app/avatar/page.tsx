"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ChibiAvatar from "@/components/ChibiAvatar";
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

// Fixed grid dimensions for the inventory. RE-style positional placement
// uses explicit (x, y) cells; auto-fill responsiveness goes away. Landscape
// shape (more columns than rows) matches the RE5/RE6 attaché-case feel.
const GRID_COLS = 7;
const GRID_ROWS = 5;
const CELL_PX = 64;

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
      return { cols: 1, rows: 1 };
    case "BODY":
      return { cols: 1, rows: 2 };
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
// drag modifier so the dragged item jumps exactly cell-to-cell.
const SNAP_STEP = CELL_PX + 1;

// dnd-kit modifier that rounds the drag delta to the nearest cell step,
// causing the dragged card to follow the same snapping rhythm as the
// preview overlay rather than free-tracking the cursor.
const snapToGrid: Modifier = ({ transform }) => ({
  ...transform,
  x: Math.round(transform.x / SNAP_STEP) * SNAP_STEP,
  y: Math.round(transform.y / SNAP_STEP) * SNAP_STEP,
});

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
): boolean {
  if (x < 0 || y < 0 || x + cols > GRID_COLS || y + height > GRID_ROWS) return false;
  for (const row of rows) {
    if (row.inventoryId === skipId) continue;
    if (row.positionX == null || row.positionY == null) continue;
    const base = getItemSize(row.avatarItem!);
    const rot = rotations.has(row.inventoryId);
    const oCols = rot ? base.rows : base.cols;
    const oRows = rot ? base.cols : base.rows;
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
function autoPlace(rows: UserInventoryDto[]): UserInventoryDto[] {
  // Auto-placement runs on freshly-loaded inventory before any rotation
  // could be applied, so pass an empty rotations set to rectFits.
  const noRotations = new Set<number>();
  const placed: UserInventoryDto[] = rows
    .filter((r) => r.positionX != null && r.positionY != null)
    .slice();
  const result: UserInventoryDto[] = [...placed];
  for (const row of rows) {
    if (row.positionX != null && row.positionY != null) continue;
    const size = getItemSize(row.avatarItem!);
    let assigned: { x: number; y: number } | null = null;
    outer: for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        if (rectFits(result, null, x, y, size.cols, size.rows, noRotations)) {
          assigned = { x, y };
          break outer;
        }
      }
    }
    const next = assigned
      ? { ...row, positionX: assigned.x, positionY: assigned.y }
      : row;
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

  useEffect(() => {
    setIsMounted(true);
    const token = !!localStorage.getItem("auth_token");
    setHasToken(token);
    if (!token) {
      setLoading(false);
      return;
    }
    // Only fetch the user's inventory — the grid shows what they own, not the
    // full catalogue. Items missing a renderable asset or an `avatarItem`
    // join are filtered out so the grid only contains things that actually
    // render on the chibi.
    avatarApi.getInventory(1, 200).then(({ data, error }) => {
      if (error) setError(error);
      const rows = (data?.data ?? [])
        .filter((row) => row.avatarItem?.previewAssetUrl)
        .map((row) => ({ ...row, avatarItem: applyHints(row.avatarItem!) }));
      // Hair lives in its own grid, so auto-place each tab's rows
      // independently. Otherwise a hair item at (0,0) would block an
      // equipment item at (0,0) even though they're never on screen together.
      const equipRows = rows.filter((r) => r.avatarItem?.slot !== "HAIR");
      const hairRows = rows.filter((r) => r.avatarItem?.slot === "HAIR");
      const placed = [...autoPlace(equipRows), ...autoPlace(hairRows)];
      setInventory(placed);
      // Persist any positions that were newly assigned by autoPlace so
      // subsequent reloads return the same layout. Fire-and-forget.
      for (const row of placed) {
        const original = rows.find((r) => r.inventoryId === row.inventoryId);
        if (!original) continue;
        const xChanged = original.positionX !== row.positionX;
        const yChanged = original.positionY !== row.positionY;
        if ((xChanged || yChanged) && row.positionX != null && row.positionY != null) {
          avatarApi.setPosition(row.inventoryId, row.positionX, row.positionY);
        }
      }
      setLoading(false);
    });
  }, [setError]);

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

  const onDragStart = useCallback((event: DragStartEvent) => {
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
    const base = getItemSize(moving.avatarItem);
    const rot = rotations.has(invId);
    const cols = rot ? base.rows : base.cols;
    const rows = rot ? base.cols : base.rows;
    // Only collide against items in the same tab — hair items share grid
    // coordinates with equipment but live in a separate view.
    const movingIsHair = moving.avatarItem.slot === "HAIR";
    const sameTab = inventory.filter((r) => (r.avatarItem?.slot === "HAIR") === movingIsHair);
    if (!rectFits(sameTab, invId, x, y, cols, rows, rotations)) return;
    if (moving.positionX === x && moving.positionY === y) return;
    setInventory((prev) => prev.map((row) =>
      row.inventoryId === invId ? { ...row, positionX: x, positionY: y } : row));
    avatarApi.setPosition(invId, x, y).then(({ error }) => {
      if (error) setError(error);
    });
  }, [inventory, rotations, setError]);

  // Q/E toggles rotation on the item currently being dragged. The handler is
  // installed only while a drag is active so the keys behave normally when
  // the user isn't interacting with the grid. Rotation is ephemeral state.
  useEffect(() => {
    if (activeDragId == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "q" && e.key !== "Q" && e.key !== "e" && e.key !== "E") return;
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
  }, [activeDragId]);

  async function onCardClick(inv: UserInventoryDto) {
    if (busyIds.has(inv.inventoryId)) return;
    setBusyIds((prev) => new Set(prev).add(inv.inventoryId));
    try {
      if (inv.isEquipped) {
        const { error } = await avatarApi.unequip(inv.inventoryId);
        if (error) { setError(error); return; }
        setInventory((prev) => prev.map((row) =>
          row.inventoryId === inv.inventoryId ? { ...row, isEquipped: false } : row));
      } else {
        const { error } = await avatarApi.equip(inv.inventoryId);
        if (error) { setError(error); return; }
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

  if (!hasToken) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <p style={{ color: "var(--color-fg-muted)", fontSize: 12 }}>Sign in to customize your avatar.</p>
          <Link
            href="/login"
            className="text-[10px] tracking-widest uppercase font-semibold"
            style={{
              color: "var(--color-fg)",
              border: "1px solid var(--color-border-hairline)",
              borderRadius: 999,
              padding: "6px 14px",
              textDecoration: "none",
            }}
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

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

        {/* Inventory grid — only items the user owns. Click to equip/unequip. */}
        <section className="flex flex-col gap-3" style={{ flex: isDesktop ? "1 1 auto" : undefined, minWidth: 0 }}>
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
                      padding: "5px 10px",
                      fontSize: 10,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      fontWeight: 600,
                      borderRadius: 2,
                      border: "1px solid rgba(120, 150, 160, 0.55)",
                      background: active ? "rgba(80, 110, 120, 0.65)" : "transparent",
                      color: active ? "#fff" : "var(--color-fg-subtle)",
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
              modifiers={[snapToGrid]}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragCancel={onDragCancel}
            >
              {/* Wrap in a horizontally scrollable container so the
                  landscape grid (wider than the mobile content area) can
                  scroll instead of overflowing the page. */}
              <div style={{ overflowX: "auto", paddingBottom: 4, margin: "0 -8px", padding: "0 8px 6px" }}>
              <div
                style={{
                  padding: 1,
                  background: "rgba(80, 110, 120, 0.45)",
                  border: "1px solid rgba(120, 150, 160, 0.55)",
                  borderRadius: 2,
                  display: "grid",
                  gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_PX}px)`,
                  gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_PX}px)`,
                  gap: 1,
                  width: "fit-content",
                  margin: "0 auto",
                }}
              >
                {/* Drop-target underlay — every cell is a droppable so the
                    user can release an item anywhere on the grid. Items
                    render on top via gridColumnStart/gridRowStart. */}
                {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => {
                  const x = i % GRID_COLS;
                  const y = Math.floor(i / GRID_COLS);
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
        background: "rgba(18, 28, 34, 0.85)",
        boxShadow: "inset 0 0 12px rgba(0, 0, 0, 0.45)",
      }}
    />
  );
}

interface DraggableItemProps {
  inv: UserInventoryDto;
  busy: boolean;
  failed: boolean;
  rotated: boolean;
  onCardClick: (inv: UserInventoryDto) => void;
  onImageError: (itemId: number) => void;
}

// Single inventory card. Drag handles come from dnd-kit's useDraggable. The
// card is rendered ON TOP of the drop-cell underlay using explicit
// gridColumnStart / gridRowStart from inv.positionX / inv.positionY.
function DraggableItem({ inv, busy, failed, rotated, onCardClick, onImageError }: DraggableItemProps) {
  const item = inv.avatarItem!;
  const baseSize = getItemSize(item);
  // 90° rotation swaps the grid footprint.
  const size = rotated
    ? { cols: baseSize.rows, rows: baseSize.cols }
    : baseSize;
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
      className="re-cell"
      style={{
        gridColumnStart: (inv.positionX ?? 0) + 1,
        gridColumnEnd: `span ${size.cols}`,
        gridRowStart: (inv.positionY ?? 0) + 1,
        gridRowEnd: `span ${size.rows}`,
        background: isDragging
          ? "#a8a862"
          : isEquipped
            ? "rgba(70, 130, 145, 0.55)"
            : "rgba(18, 28, 34, 0.85)",
        boxShadow: isDragging
          ? "inset 0 0 0 1px rgba(220, 220, 140, 0.9)"
          : isEquipped
            ? "inset 0 0 0 1px rgba(160, 220, 235, 0.85)"
            : "inset 0 0 12px rgba(0, 0, 0, 0.45)",
        border: "none",
        padding: 0,
        cursor: busy ? "wait" : (isDragging ? "grabbing" : "grab"),
        opacity: busy ? 0.5 : 1,
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
              if (!rotated) return base;
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
            background: "rgba(160, 220, 235, 0.95)",
            boxShadow: "0 0 6px rgba(160, 220, 235, 0.9)",
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
