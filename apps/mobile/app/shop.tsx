import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FeaturedHero } from "@/components/featured-hero";
import { ShopFilterTray } from "@/components/shop-filter-tray";
import { ShopItemCard } from "@/components/shop-item-card";
import { ShopItemDetailsModal } from "@/components/shop-item-details-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";
import { useShopLogic } from "@/hooks/use-shop-logic";
import { rarityColor } from "@/lib/shop-theme";

const CARD_GAP = 10;
const HORIZONTAL_PAD = 16;
// Target card width — drives column count from screen width.
const TARGET_CARD_W = 156;
// Cap grid + banner width on tablets/desktop so icons don't balloon.
const CONTENT_MAX_W = 1100;
// Min/max column count guardrails — keeps layout sane across phone↔desktop.
const MIN_COLS = 2;
const MAX_COLS = 6;

export default function ShopScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();

  const {
    items, ownedIds, balance, loading, error,
    filteredItems, featuredItem, filtersAreClear,
    slotFilter, setSlotFilter,
    rarityFilter, setRarityFilter,
    sortKey, setSortKey,
    ownedFilter, setOwnedFilter,
    resetFilters,
    detailItem, setDetailItem,
    purchasingId, purchase,
  } = useShopLogic();

  // Responsive grid: derive cols so each card lands near TARGET_CARD_W.
  // Cap content width so icons don't balloon on tablets/desktop.
  const contentW = Math.min(screenW - HORIZONTAL_PAD * 2, CONTENT_MAX_W - HORIZONTAL_PAD * 2);
  const cols = Math.min(
    MAX_COLS,
    Math.max(MIN_COLS, Math.floor((contentW + CARD_GAP) / (TARGET_CARD_W + CARD_GAP))),
  );
  const cardW = Math.floor((contentW - CARD_GAP * (cols - 1)) / cols);
  const previewBox = Math.floor(cardW * 0.88);
  const cardH = previewBox + 72; // preview + 2-line name + footer
  // Hero height tracks content width — wide-aspect banner on phones, taller on small screens.
  const heroH = Math.min(220, Math.max(150, Math.floor(contentW * 0.42)));

  return (
    <ThemedView style={{ flex: 1 }}>
      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: c.borderSoft }]}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backBtn}>
          <ThemedText style={{ fontSize: 26, lineHeight: 26, color: c.fg }}>‹</ThemedText>
        </Pressable>
        <ThemedText style={[styles.title, { color: c.fg }]}>SHOP</ThemedText>
        <View style={[styles.balancePill, { borderColor: c.borderSoft, backgroundColor: c.surface }]}>
          <ThemedText style={[styles.balanceLabel, { color: c.fgSubtle }]}>BAL</ThemedText>
          <ThemedText style={[styles.balanceValue, { color: c.fg }]}>
            {balance == null ? "—" : balance.toLocaleString()}
          </ThemedText>
        </View>
      </View>

      {loading && items.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={c.activeHighlight} />
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <ThemedText style={{ color: c.danger, textAlign: "center" }}>{error}</ThemedText>
        </View>
      ) : filteredItems.length === 0 ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}>
          <ThemedText style={{ color: c.fgSubtle, fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase" }}>
            No items match
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingTop: 12,
            paddingBottom: 32,
            paddingHorizontal: HORIZONTAL_PAD,
            // Center the content column on tablets/desktop where contentW < screenW.
            alignItems: "center",
          }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: contentW }}>
            {/* FEATURED banner — only when no filters active so we don't surprise users mid-search. */}
            {featuredItem && filtersAreClear ? (
              <>
                <SectionLabel label="Featured" colors={c} />
                <FeaturedHero
                  item={featuredItem}
                  owned={ownedIds.has(featuredItem.itemId)}
                  height={heroH}
                  width={contentW}
                  onPress={() => setDetailItem(featuredItem)}
                  colors={c}
                />
                <View style={{ height: 18 }} />
                <SectionLabel label={`All items · ${filteredItems.length}`} colors={c} />
              </>
            ) : (
              <SectionLabel label={`${filteredItems.length} items`} colors={c} />
            )}

            <View style={[styles.grid, { gap: CARD_GAP }]}>
              {filteredItems.map((item) => (
                <ShopItemCard
                  key={item.itemId}
                  item={item}
                  owned={ownedIds.has(item.itemId)}
                  affordable={balance == null ? true : balance >= item.cost}
                  busy={purchasingId === item.itemId}
                  onPress={() => setDetailItem(item)}
                  width={cardW}
                  height={cardH}
                  previewBox={previewBox}
                  colors={c}
                />
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      <ShopFilterTray
        slotFilter={slotFilter}
        rarityFilter={rarityFilter}
        sortKey={sortKey}
        ownedFilter={ownedFilter}
        setSlotFilter={setSlotFilter}
        setRarityFilter={setRarityFilter}
        setSortKey={setSortKey}
        setOwnedFilter={setOwnedFilter}
        onClear={resetFilters}
        rarityColorFor={(r) => rarityColor(r, c)}
      />

      <ShopItemDetailsModal
        item={detailItem}
        owned={detailItem ? ownedIds.has(detailItem.itemId) : false}
        affordable={!detailItem || balance == null ? true : balance >= detailItem.cost}
        busy={detailItem ? purchasingId === detailItem.itemId : false}
        balance={balance}
        onClose={() => setDetailItem(null)}
        onBuy={(autoEquip) => detailItem && purchase(detailItem, autoEquip)}
        colors={c}
      />
    </ThemedView>
  );
}

// Uppercase section header — Discord shop style ("FEATURED", "ALL ITEMS · N").
// Kept inline since it's screen-specific and only used here.
function SectionLabel({
  label,
  colors,
}: {
  label: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.sectionLabelRow}>
      <ThemedText style={[styles.sectionLabel, { color: colors.fgMuted }]}>
        {label.toUpperCase()}
      </ThemedText>
      <View style={[styles.sectionLabelDivider, { backgroundColor: colors.borderHairline }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
  },
  backBtn: { width: 32, height: 32, alignItems: "center", justifyContent: "center" },
  title: { flex: 1, fontSize: 14, fontWeight: "700", letterSpacing: 2 },
  balancePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderRadius: 999,
  },
  balanceLabel: { fontSize: 9, letterSpacing: 1.5, fontWeight: "700" },
  balanceValue: { fontSize: 13, fontWeight: "700", fontVariant: ["tabular-nums"] },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  // Section label — Discord shop's uppercase headers above each row.
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.8,
  },
  sectionLabelDivider: {
    flex: 1,
    height: 1,
  },
});
