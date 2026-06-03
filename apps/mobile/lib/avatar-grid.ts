// Shared grid geometry for the avatar inventory screen + its draggable cards.

export const GRID_COLS = 5;
export const GRID_ROWS = 7;
export const CELL_PX = 56;
export const CELL_GAP = 1;
export const CELL_STEP = CELL_PX + CELL_GAP;
// Inner padding between frame border and first/last cell.
export const FRAME_PAD = 1;
// Outer border thickness; frame width sums FRAME_PAD + FRAME_BORDER.
export const FRAME_BORDER = 1;
// 150ms long-press starts drag (tap=equip, hold=drag).
export const LONG_PRESS_MS = 150;
// Keep holding still (no drag movement) this long after the press is recognised
// and the sell screen opens — a deliberate "tap and hold for a few seconds" hold.
export const LONG_PRESS_SELL_MS = 650;
export const DRAG_TAP_TOLERANCE = 8;

// Grid dimensions threaded into the collision helpers.
export const GRID = { cols: GRID_COLS, rows: GRID_ROWS } as const;
