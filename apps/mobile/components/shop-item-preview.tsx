import { Image, StyleSheet, View } from "react-native";

import {
  applyHints,
  boundsTransformFor,
  type AvatarItemDto,
} from "@wahaha/shared";

import { ItemLayers } from "@/components/item-layers";

// Per-filename perceptual nudge applied to outer wrap. Add an entry here when an
// asset's alpha bbox doesn't match its visual centre (e.g. pointy hats whose tips
// extend past the bbox).
const SHOP_PREVIEW_NUDGE: Record<string, { translateXPercent?: number; translateYPercent?: number }> = {
  // Wizard hat tip extends past alpha bbox — small leftward balance.
  "hat_wizard_hat.png": { translateXPercent: -10 },
};

// Shop preview centring — three render paths:
//   1. Bounded: scale/translate from server-stored content bbox (skipped for helmets so
//      shrinking-on-tight-bounds doesn't make some helmets smaller than others).
//   2. Helmet: forced uniform scale + Y-shift so every helmet renders consistently
//      regardless of stored bounds.
//   3. Contain fallback: RN's contain mode centres the image in the box.
export function ShopItemPreview({ item: raw, size }: { item: AvatarItemDto; size: number }) {
  const item = applyHints(raw);
  // Keyed on bare filename so CDN cache-buster doesn't break match.
  const filename = item.previewAssetUrl?.split("/").pop()?.split("?")[0] ?? "";
  const nudge = SHOP_PREVIEW_NUDGE[filename];
  const nudgeX = nudge?.translateXPercent ? (nudge.translateXPercent / 100) * size : 0;
  const nudgeY = nudge?.translateYPercent ? (nudge.translateYPercent / 100) * size : 0;

  // Force 1×1 — square shop box, smaller scale fits wide items.
  // Helmets get uniform shop-cell treatment regardless of stored bounds — see below.
  const isHelmet = `${item.name ?? ""} ${item.category ?? ""}`.toLowerCase().includes("helmet");
  // Skip the bounded path for helmets so every helmet renders at the same forced scale +
  // translate (mirrors the inventory grid's HAT slot treatment). Otherwise tight bounds
  // make some helmets shrink to 75–82% of the cell while others without bounds render full-size.
  const auto = isHelmet ? null : boundsTransformFor(item, null, {
    cols: 1,
    rows: 1,
    fillFactor: 0.82,
  });

  // Outer wrap carries the nudge so inner layers stay aligned.
  const wrapStyle = {
    width: size,
    height: size,
    transform: [{ translateX: nudgeX }, { translateY: nudgeY }],
  };

  if (auto) {
    // Bounds path — scale+translate so content bbox lands at box centre.
    const tx = (auto.translateXPercent / 100) * size;
    const ty = (auto.translateYPercent / 100) * size;
    const scaled = size * auto.scale;
    const layerStyle = {
      position: "absolute" as const,
      left: (size - scaled) / 2 + tx * auto.scale,
      top: (size - scaled) / 2 + ty * auto.scale,
      width: scaled,
      height: scaled,
    };
    return (
      <View style={wrapStyle}>
        <ItemLayers item={item} renderImage={(uri, key) => (
          <Image key={key} source={{ uri }} style={layerStyle} resizeMode="contain" />
        )} />
      </View>
    );
  }

  // Helmet path: scale up + drop the image so the upper-canvas helmet content lands at
  // the cell centre. Uses absolute positioning (same math as the bounded path) so it
  // behaves identically across PNGs regardless of stored bounds.
  if (isHelmet) {
    const helmetScale = 1.85;
    const helmetTyPct = 22; // pre-scale translateY (× scale = effective shift)
    const scaled = size * helmetScale;
    const layerStyle = {
      position: "absolute" as const,
      left: (size - scaled) / 2,
      top: (size - scaled) / 2 + (helmetTyPct / 100) * size * helmetScale,
      width: scaled,
      height: scaled,
    };
    return (
      <View style={[wrapStyle, { overflow: "hidden" }]}>
        <ItemLayers item={item} renderImage={(uri, key) => (
          <Image key={key} source={{ uri }} style={layerStyle} resizeMode="contain" />
        )} />
      </View>
    );
  }

  // Contain fallback — RN centres each layer in the box.
  const imageStyle = { width: size, height: size };
  return (
    <View style={[wrapStyle, { alignItems: "center", justifyContent: "center" }]}>
      <ItemLayers item={item} renderImage={(uri, key) => (
        <Image key={key} source={{ uri }} style={[imageStyle, styles.absoluteFill]} resizeMode="contain" />
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteFill: {
    position: "absolute",
    left: 0,
    top: 0,
  },
});
