// Shared CSS-transform helper for any "preview the item's PNG in a square
// box" surface — the inventory cards on /avatar, and the row thumbnails
// in AvatarAdminPanel both consume this. Keeps the auto-centring math in
// one place so the two views stay visually consistent.

import { useEffect, useState } from "react";
import type { AvatarItemDto } from "@/lib/api/avatar";
import { computeImageBounds, type ImageBounds } from "@/lib/imageBounds";

// Bounds the renderer accepts — either from the DTO (server-computed) or
// from the in-browser client scan. Kept loose (only the four bbox coords
// plus optional source dims) so either source slots in identically.
export interface BoundsInput {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  sourceWidth?: number;
  sourceHeight?: number;
}

export interface BoundsTransformOptions {
  // Override the item's grid footprint. The inventory card uses the item's
  // own gridCols/gridRows (the card matches the item's footprint), but
  // surfaces like the admin row thumbnail are always square — they pass
  // cols=1, rows=1 so the math treats it as a 1×1 box regardless of the
  // item's storage size.
  cols?: number;
  rows?: number;
  // Fraction of the limiting axis the bbox should occupy after transform.
  // 0.75 leaves a ~12% margin per side. Drop lower for more breathing room.
  fillFactor?: number;
}

// Compute the CSS transform that lands the item's content bbox centred in
// the container box. Returns null when no bounds are available (caller
// falls back to its own default — slot heuristic, raw objectFit:contain,
// etc.).
//
// Math accounts for objectFit:contain letterboxing: when the source aspect
// doesn't match the container aspect, the displayed source occupies less
// than the full container box, so translate-percentages (which are
// measured against the container) need a per-axis correction factor.
export function boundsTransformFor(
  item: AvatarItemDto,
  override?: BoundsInput | null,
  options?: BoundsTransformOptions,
): string | null {
  const contentMinX = override?.minX ?? item.contentMinX;
  const contentMinY = override?.minY ?? item.contentMinY;
  const contentMaxX = override?.maxX ?? item.contentMaxX;
  const contentMaxY = override?.maxY ?? item.contentMaxY;
  if (contentMinX == null || contentMinY == null || contentMaxX == null || contentMaxY == null) return null;
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
  const tx = -fx * 100 * dispFracX;
  const ty = -fy * 100 * dispFracY;

  const effSrcW = Math.max(sourceW, (sourceH * cols) / rows);
  const effSrcH = Math.max((sourceW * rows) / cols, sourceH);
  const scale = fillFactor * Math.min(effSrcW / bboxW, effSrcH / bboxH);

  return `scale(${scale.toFixed(3)}) translate(${tx.toFixed(2)}%, ${ty.toFixed(2)}%)`;
}

// Subscribes to the in-browser bbox cache for the given URL. Returns null
// while the scan is in flight, or if the scan can't run (CORS-tainted,
// unreachable URL, fully transparent image). Caller treats null as "fall
// through to next precedence step".
export function useClientBounds(url: string | null | undefined): ImageBounds | null {
  const [bounds, setBounds] = useState<ImageBounds | null>(null);
  useEffect(() => {
    if (!url) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setBounds(null);
      return;
    }
    let cancelled = false;
    computeImageBounds(url).then((b) => {
      if (!cancelled) setBounds(b);
    });
    return () => { cancelled = true; };
  }, [url]);
  return bounds;
}
