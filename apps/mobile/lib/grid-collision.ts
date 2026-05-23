// Inventory-grid placement + collision math, extracted from the avatar screen.
// Pure functions — easy to unit-test, reusable across any future grid surfaces.

import { getItemSize, type UserInventoryDto } from "@wahaha/shared";

export interface Placed {
  positionX: number;
  positionY: number;
  cols: number;
  rows: number;
}

export interface GridDims {
  cols: number;
  rows: number;
}

// True when (x, y, cols, rows) fits inside the grid AND doesn't overlap any item in `placed`.
export function rectFits(
  placed: Placed[],
  x: number,
  y: number,
  cols: number,
  rows: number,
  grid: GridDims,
): boolean {
  if (x < 0 || y < 0 || x + cols > grid.cols || y + rows > grid.rows) return false;
  for (const p of placed) {
    const overlap =
      x < p.positionX + p.cols
      && x + cols > p.positionX
      && y < p.positionY + p.rows
      && y + rows > p.positionY;
    if (overlap) return false;
  }
  return true;
}

// Two-phase placement:
//   1. Honour rows that already have a valid (non-colliding) stored position.
//   2. First-fit scan (top-left → bottom-right) for the rest. Rows that don't fit
//      anywhere are returned with position cleared so the caller can surface that.
export function autoPlace(rows: UserInventoryDto[], grid: GridDims): UserInventoryDto[] {
  const placed: Placed[] = [];
  const out: UserInventoryDto[] = new Array(rows.length);

  // Phase 1: honour stored positions.
  rows.forEach((row, idx) => {
    if (!row.avatarItem) { out[idx] = row; return; }
    const size = getItemSize(row.avatarItem);
    if (
      row.positionX != null
      && row.positionY != null
      && rectFits(placed, row.positionX, row.positionY, size.cols, size.rows, grid)
    ) {
      placed.push({ positionX: row.positionX, positionY: row.positionY, cols: size.cols, rows: size.rows });
      out[idx] = row;
    }
  });

  // Phase 2: first-fit scan for whatever's left.
  rows.forEach((row, idx) => {
    if (out[idx] || !row.avatarItem) return;
    const size = getItemSize(row.avatarItem);
    let assigned: { x: number; y: number } | null = null;
    outer: for (let y = 0; y < grid.rows; y++) {
      for (let x = 0; x < grid.cols; x++) {
        if (rectFits(placed, x, y, size.cols, size.rows, grid)) {
          assigned = { x, y };
          break outer;
        }
      }
    }
    if (assigned) {
      placed.push({ positionX: assigned.x, positionY: assigned.y, cols: size.cols, rows: size.rows });
      out[idx] = { ...row, positionX: assigned.x, positionY: assigned.y };
    } else {
      out[idx] = { ...row, positionX: null, positionY: null };
    }
  });
  return out;
}
