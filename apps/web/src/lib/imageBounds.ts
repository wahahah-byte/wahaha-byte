// Client-side content-bounds detector. Same alpha-scan idea as the server's
// ContentBoundsService, run in the browser as a fallback for items that
// don't yet have server-computed bounds — items uploaded before the bbox
// feature shipped, registered via URL on an older build, or just not yet
// Recenter-ed by an admin.
//
// CORS caveat: drawing a cross-origin image into a canvas taints it and
// makes getImageData() throw a SecurityError. To avoid that, we load the
// image with `crossOrigin: "anonymous"` — which means the origin serving
// the asset (Azure blob storage, a third-party CDN, etc.) must respond
// with `Access-Control-Allow-Origin`. Same-origin sources (e.g.
// assetPath("/avatars/...")) work without any server config.
//
// When CORS fails or the image won't load, computeImageBounds() resolves
// to null — the caller falls back to whatever default it had (server
// bounds, slot defaults, etc.). Failures are never thrown.
//
// Cache: results live in a module-level Map keyed by URL. The same Promise
// is reused while a scan is in flight, so a grid with 30 items only
// triggers 30 fetches (not 30 × however many renders).

export interface ImageBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  // Native image dimensions — needed by the caller to compute centering
  // transforms in source-pixel space.
  sourceWidth: number;
  sourceHeight: number;
}

const ALPHA_THRESHOLD = 16; // 16/255 ≈ 6%. Mirrors server constant.
const cache = new Map<string, Promise<ImageBounds | null>>();

export function computeImageBounds(url: string): Promise<ImageBounds | null> {
  if (!url) return Promise.resolve(null);
  const cached = cache.get(url);
  if (cached) return cached;
  // Defer to runtime — during SSR / static export the canvas API isn't
  // available; we'd otherwise throw on the first call. Resolving null
  // means the server-bounds / slot-default path takes over for that
  // render, and the client-side scan fires on hydration.
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
          // Tainted canvas — image origin didn't return CORS headers
          // even though we asked for anonymous. Bail cleanly.
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
