// Client-side content-bounds detector; alpha-scan fallback when server bounds are missing.
// CORS-tainted canvas → resolve(null); caller falls back to slot defaults.
// Cache keyed by URL so re-renders don't re-scan.

export interface ImageBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  // Native image dimensions for centering math in source-pixel space.
  sourceWidth: number;
  sourceHeight: number;
}

const ALPHA_THRESHOLD = 16; // 16/255 ≈ 6%. Mirrors server constant.
const cache = new Map<string, Promise<ImageBounds | null>>();

export function computeImageBounds(url: string): Promise<ImageBounds | null> {
  if (!url) return Promise.resolve(null);
  const cached = cache.get(url);
  if (cached) return cached;
  // SSR / static export has no canvas API; resolve null and re-scan on hydration.
  if (typeof window === "undefined" || typeof document === "undefined") {
    return Promise.resolve(null);
  }

  const p = new Promise<ImageBounds | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => {
      try {
        const w = img.naturalWidth, h = img.naturalHeight;
        if (w === 0 || h === 0) { resolve(null); return; }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(img, 0, 0);
        let data: Uint8ClampedArray;
        try {
          data = ctx.getImageData(0, 0, w, h).data;
        } catch {
          // Tainted canvas — image origin didn't return CORS headers.
          resolve(null);
          return;
        }
        let minX = w, minY = h, maxX = -1, maxY = -1;
        for (let y = 0; y < h; y++) {
          const rowOffset = y * w * 4;
          for (let x = 0; x < w; x++) {
            const a = data[rowOffset + x * 4 + 3];
            if (a > ALPHA_THRESHOLD) {
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            }
          }
        }
        if (maxX < 0 || maxY < 0) { resolve(null); return; }
        resolve({ minX, minY, maxX, maxY, sourceWidth: w, sourceHeight: h });
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });

  cache.set(url, p);
  return p;
}
