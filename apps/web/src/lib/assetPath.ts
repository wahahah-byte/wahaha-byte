// Prepends configured basePath so /public absolute paths resolve under sub-path deploys.
const PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function assetPath(p: string): string {
  // Don't double-prefix fully-qualified URLs.
  if (/^https?:\/\//i.test(p)) return p;
  if (!p.startsWith("/")) return `${PREFIX}/${p}`;
  return `${PREFIX}${p}`;
}
