// Client-side image resize for profile-picture uploads; keeps request under 1 MB backend cap.

interface ResizeOptions {
  // Largest allowed dimension on either side; aspect ratio preserved.
  maxDimension?: number;
  // JPEG quality (0..1); ignored for PNG. 0.85 is a good photo default.
  quality?: number;
  // Output MIME type; default "image/jpeg" for better photo compression.
  type?: "image/jpeg" | "image/png";
}

const DEFAULTS: Required<ResizeOptions> = {
  maxDimension: 256,
  quality: 0.85,
  type: "image/jpeg",
};

// Load file into <img> so the browser handles every native format (JPEG/PNG/WebP/HEIC…).
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Could not read image")); };
    img.src = url;
  });
}

// Returns Blob with resized image (type matches requested output type).
export async function resizeImage(file: File, options: ResizeOptions = {}): Promise<Blob> {
  const { maxDimension, quality, type } = { ...DEFAULTS, ...options };

  const img = await loadImage(file);
  const { naturalWidth: w, naturalHeight: h } = img;

  // Never upscale; if source is smaller, just re-encode at target type/quality.
  const scale = Math.min(1, maxDimension / Math.max(w, h));
  const targetW = Math.round(w * scale);
  const targetH = Math.round(h * scale);

  const canvas = document.createElement("canvas");
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is unavailable");

  // imageSmoothingQuality "high" gives a markedly better downscale than default.
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
