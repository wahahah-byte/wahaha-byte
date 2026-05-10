// Client-side image resize for profile picture uploads. Phone cameras shoot
// 5–10 MB JPEGs we never need at full resolution — a profile picture renders
// at a few hundred pixels at most. Resizing in the browser before the upload
// avoids storing and serving the raw image, and keeps the request well under
// the backend's 1 MB cap.

interface ResizeOptions {
  // Largest allowed dimension on either side. The image is scaled so neither
  // width nor height exceeds this; aspect ratio is preserved.
  maxDimension?: number;
  // JPEG quality (0..1). Ignored when output is PNG. 0.85 is a good default
  // for photographs — visually indistinguishable from 1.0 at typical sizes.
  quality?: number;
  // Output MIME type. Default is "image/jpeg" because it compresses photos
  // far better than PNG. Pass "image/png" for screenshots / line art.
  type?: "image/jpeg" | "image/png";
}

const DEFAULTS: Required<ResizeOptions> = {
  maxDimension: 256,
  quality: 0.85,
  type: "image/jpeg",
};

// Loads the file into a real <img> first so the browser handles every format
// it natively understands (JPEG, PNG, WebP, GIF, AVIF, HEIC on Safari…).
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read image")); };
    img.src = url;
  });
}

// Returns a Blob with the resized image, ready to attach to a FormData. The
// returned blob's `type` matches the requested output type so the server's
// content-type sniffing works.
export async function resizeImage(file: File, options: ResizeOptions = {}): Promise<Blob> {
  const { maxDimension, quality, type } = { ...DEFAULTS, ...options };

  const img = await loadImage(file);
  const { naturalWidth: w, naturalHeight: h } = img;

  // Don't upscale — if the source is already smaller than the target, just
  // re-encode at the target type/quality so we still get a size win.
  const scale = Math.min(1, maxDimension / Math.max(w, h));
  const targetW = Math.round(w * scale);
  const targetH = Math.round(h * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is unavailable");

  // imageSmoothingQuality is implementation-specific but "high" gives a
  // markedly better downscale than the default. JPEG-only flag — harmless
  // for PNG.
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, targetW, targetH);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob ? resolve(blob) : reject(new Error("Canvas encoding failed")),
      type,
      quality,
    );
  });
}
