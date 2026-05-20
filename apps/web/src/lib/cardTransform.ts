// Shared CSS-transform helper for "preview item PNG in a square box" surfaces.

import { useEffect, useState } from "react";
import type { AvatarItemDto } from "@/lib/api/avatar";
import { computeImageBounds, type ImageBounds } from "@/lib/imageBounds";

// Bounds either from DTO (server-computed) or client scan; loose shape so both fit.
export interface BoundsInput {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  sourceWidth?: number;
  sourceHeight?: number;
}

export interface BoundsTransformOptions {
  // Override item's grid footprint; admin row thumbnail uses cols=1, rows=1.
  cols?: number;
  rows?: number;
  // Fraction of limiting axis bbox occupies after transform; lower = more padding.
  fillFactor?: number;
}

// CSS transform landing bbox centred in container; returns null when no bounds.
// Accounts for objectFit:contain letterboxing with per-axis correction factors.
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

// Subscribes to in-browser bbox cache for URL; null while scan in flight / not runnable.
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
