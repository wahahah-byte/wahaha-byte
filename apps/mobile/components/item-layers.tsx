import type { ReactNode } from "react";

import { type AvatarItemDto } from "@wahaha/shared";

import { bustedAssetUrl } from "@/lib/avatar-asset";

interface Props {
  item: AvatarItemDto;
  // Renders one layer's <Image>. Caller controls the actual Image style (positioning, sizing,
  // resizeMode, etc.); this component only handles z-order and the secondary-asset toggle.
  renderImage: (uri: string, key: "back" | "primary" | "front") => ReactNode;
}

// Z-ordered layer composition: optional back-layer (secondary), primary, optional front-layer
// (CAPE-style overlay). Eliminates the repeated triple-conditional that previously appeared
// three times in shop.tsx (one per render path) and once in avatar.tsx.
//
// Z-rule:
//   * For most slots, secondaryAssetUrl renders BEHIND primary (z = back).
//   * CAPE inverts this — its secondary asset is the front drape that overlays the body (z = front).
export function ItemLayers({ item, renderImage }: Props) {
  const secondaryInFront = item.slot === "CAPE";
  const primaryUri = bustedAssetUrl(item, item.previewAssetUrl);
  const secondaryUri = bustedAssetUrl(item, item.secondaryAssetUrl);
  return (
    <>
      {secondaryUri && !secondaryInFront ? renderImage(secondaryUri, "back") : null}
      {primaryUri ? renderImage(primaryUri, "primary") : null}
      {secondaryUri && secondaryInFront ? renderImage(secondaryUri, "front") : null}
    </>
  );
}
