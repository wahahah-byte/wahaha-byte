// Prepends the configured base path so absolute paths to files in /public/
// resolve correctly when the app is mounted under a sub-path on GitHub Pages
// (e.g. https://wahahah-byte.github.io/wahaha-byte/).
//
// Next.js' basePath/assetPrefix only auto-rewrites bundle URLs and next/image
// — anything that hits the DOM as a plain string (e.g. <img src=...>, css
// background-image, fetch URLs to /public files) needs this manual prefix.
//
// In dev NEXT_PUBLIC_BASE_PATH is empty, so this is a no-op locally.
const PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(p: string): string {
  // Don't double-prefix if a fully-qualified URL was passed in.
  if (/^https?:\/\//i.test(p)) return p;
  if (!p.startsWith("/")) return `${PREFIX}/${p}`;
  return `${PREFIX}${p}`;
}
