import { Pressable, StyleSheet, View } from "react-native";

import { type AvatarItemDto } from "@wahaha/shared";

import { ShopItemPreview } from "@/components/shop-item-preview";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";
import { CARD_PREVIEW_BG, rarityColor } from "@/lib/shop-theme";

interface Props {
  item: AvatarItemDto;
  owned: boolean;
  height: number;
  width: number;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
}

// Discord-style hero banner shown at the top of the shop when no filters are active.
// Left side: eyebrow / name / rarity pill / cost / CTA. Right side: large item preview.
export function FeaturedHero({ item, owned, height, width, onPress, colors }: Props) {
  const accent = rarityColor(item.rarity, colors);
  // Preview sized smaller than banner height — extra padding avoids upscale-pixelation.
  const previewSize = Math.floor(height * 0.68);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.hero,
        {
          height,
          width,
          borderColor: accent,
          backgroundColor: CARD_PREVIEW_BG,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={styles.heroBody}>
        <ThemedText style={[styles.heroEyebrow, { color: accent }]}>
          {owned ? "OWNED · FEATURED" : "FEATURED"}
        </ThemedText>
        <ThemedText
          style={[styles.heroName, { color: "rgba(255, 255, 255, 0.95)" }]}
          numberOfLines={2}
        >
          {item.name}
        </ThemedText>
        <View style={styles.heroMetaRow}>
          <View style={[styles.heroRarityPill, { backgroundColor: accent }]}>
            <ThemedText style={styles.heroRarityLabel}>{item.rarity}</ThemedText>
          </View>
          <ThemedText style={[styles.heroCost, { color: "rgba(255, 255, 255, 0.92)" }]}>
            {item.cost.toLocaleString()} <ThemedText style={{ color: colors.warning, fontWeight: "800" }}>P</ThemedText>
          </ThemedText>
        </View>
        <View style={[styles.heroCta, { borderColor: accent, backgroundColor: `${accent}1A` }]}>
          <ThemedText style={[styles.heroCtaLabel, { color: accent }]}>
            {owned ? "View details" : "View · Buy"} ›
          </ThemedText>
        </View>
      </View>

      <View
        style={[
          styles.heroPreviewWrap,
          { width: previewSize, height: previewSize },
        ]}
      >
        <ShopItemPreview item={item} size={previewSize} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hero: {
    position: "relative",
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.25)",
    elevation: 6,
    marginBottom: 4,
  },
  heroBody: {
    flex: 1,
    paddingVertical: 16,
    gap: 6,
    zIndex: 2,
  },
  heroEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 2,
  },
  heroName: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.2,
    lineHeight: 24,
  },
  heroMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },
  heroRarityPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  heroRarityLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.4,
    color: "rgba(255, 255, 255, 0.98)",
  },
  heroCost: {
    fontSize: 14,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  heroCta: {
    alignSelf: "flex-start",
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  heroCtaLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  heroPreviewWrap: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    marginLeft: 8,
  },
});
