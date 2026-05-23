import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { type AvatarItemDto, type Rarity } from "@wahaha/shared";

import { ShopItemPreview } from "@/components/shop-item-preview";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";
import { CARD_PREVIEW_BG, rarityColor } from "@/lib/shop-theme";

interface Props {
  item: AvatarItemDto;
  owned: boolean;
  affordable: boolean;
  busy: boolean;
  onPress: () => void;
  width: number;
  height: number;
  previewBox: number;
  colors: ReturnType<typeof useColors>;
}

// Shop grid card: dark icon panel with rarity coin badge on top, name + cost row beneath.
// Always full opacity — state (owned / can't afford / busy) is signalled via badge + border.
export function ShopItemCard({
  item,
  owned,
  affordable,
  busy,
  onPress,
  width,
  height,
  previewBox,
  colors,
}: Props) {
  const accent = rarityColor(item.rarity, colors);
  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      style={({ pressed }) => [
        styles.card,
        {
          width,
          height,
          backgroundColor: colors.surface,
          borderColor: accent,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View
        style={[
          styles.cardPreviewWrap,
          {
            height: previewBox,
            backgroundColor: CARD_PREVIEW_BG,
            overflow: "hidden",
          },
        ]}
      >
        {/* Icon sized smaller than its panel to add breathing room and avoid upscale-pixelation. */}
        <ShopItemPreview item={item} size={Math.floor(previewBox * 0.72)} />
        <RarityBadge rarity={item.rarity} colors={colors} />
      </View>
      <View style={styles.cardBody}>
        <ThemedText
          numberOfLines={2}
          style={[styles.cardName, { color: colors.fg }]}
        >
          {item.name}
        </ThemedText>
        <View style={styles.cardFooter}>
          <ThemedText style={[styles.cardCost, { color: colors.warning }]}>
            {item.cost.toLocaleString()}P
          </ThemedText>
          {owned ? (
            <ThemedText style={[styles.cardBadge, { color: colors.success }]}>OWNED</ThemedText>
          ) : busy ? (
            <ActivityIndicator size="small" color={colors.activeHighlight} />
          ) : !affordable ? (
            <ThemedText style={[styles.cardBadge, { color: colors.danger }]}>—</ThemedText>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

// Rarity coin in upper-right of preview; white ring = minted-token look.
const RARITY_BADGE_SIZE = 22;
function RarityBadge({ rarity, colors }: { rarity: Rarity; colors: ReturnType<typeof useColors> }) {
  const accent = rarityColor(rarity, colors);
  return (
    <View
      style={[
        styles.rarityBadge,
        {
          width: RARITY_BADGE_SIZE,
          height: RARITY_BADGE_SIZE,
          borderRadius: RARITY_BADGE_SIZE / 2,
          backgroundColor: accent,
          borderColor: "rgba(255, 255, 255, 0.9)",
        },
      ]}
    >
      <ThemedText style={styles.rarityBadgeLabel}>
        {rarity[0]}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  cardPreviewWrap: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  rarityBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    // Shadow lifts badge off preview as struck token.
    boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.35)",
    elevation: 3,
  },
  rarityBadgeLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.98)",
    // lineHeight=fontSize so single glyph stays centered.
    lineHeight: 11,
    includeFontPadding: false,
    textAlign: "center",
    textAlignVertical: "center",
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "space-between",
  },
  cardName: { fontSize: 13, fontWeight: "700", lineHeight: 16 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardCost: { fontSize: 13, fontWeight: "800", fontVariant: ["tabular-nums"] },
  cardBadge: { fontSize: 9, fontWeight: "700", letterSpacing: 1.2 },
});
