import type { AvatarItemDto } from "@wahaha/shared";

// Asset URL with content-bounds cache-buster so re-uploads bust RN image cache.
export function bustedAssetUrl(item: AvatarItemDto, url: string | null | undefined): string | null {
  if (!url) return null;
  const v = item.contentMinX != null
    && item.contentMinY != null
    && item.contentMaxX != null
    && item.contentMaxY != null
    ? `${item.contentMinX}_${item.contentMinY}_${item.contentMaxX}_${item.contentMaxY}`
    : String(item.itemId);
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}v=${v}`;
}
