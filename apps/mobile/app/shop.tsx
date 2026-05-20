import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  applyHints,
  boundsTransformFor,
  type AvatarItemDto,
  type ItemSlot,
  type Rarity,
  type UserInventoryDto,
} from "@wahaha/shared";

import { avatarApi, usersApi } from "@/lib/api";
import { bustedAssetUrl } from "@/lib/avatar-asset";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";

const CARD_GAP = 10;
const HORIZONTAL_PAD = 16;
// Target card width — drives column count from screen width.
const TARGET_CARD_W = 156;

const RARITIES: Rarity[] = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];

// Low→high ordering so RANK[b] - RANK[a] gives rare-first sort.
const RARITY_RANK: Record<Rarity, number> = {
  COMMON: 0,
  UNCOMMON: 1,
  RARE: 2,
  EPIC: 3,
  LEGENDARY: 4,
};

type RarityFilter = "ALL" | Rarity;

// Slot filter labels — collapses HAIR_*/WEAPON_* variants.
type SlotGroup = "ALL" | "HAT" | "HAIR" | "FACE" | "EYE" | "EAR" | "TOP" | "BOTTOM" | "OVERALL" | "CAPE" | "GLOVES" | "SHOES" | "WEAPON" | "WRIST";

const SLOT_GROUPS: { key: SlotGroup; label: string; matches: (s: ItemSlot) => boolean }[] = [
  { key: "ALL",     label: "All categories", matches: () => true },
  { key: "HAT",     label: "Hat",            matches: (s) => s === "HAT" || s === "HEAD" },
  { key: "HAIR",    label: "Hair",           matches: (s) => s === "HAIR" || s === "HAIR_FRONT" || s === "HAIR_BACK" },
  { key: "FACE",    label: "Face",           matches: (s) => s === "FACE" },
  { key: "EYE",     label: "Eye",            matches: (s) => s === "EYE" },
  { key: "EAR",     label: "Ear",            matches: (s) => s === "EAR" },
  { key: "TOP",     label: "Top",            matches: (s) => s === "TOP" },
  { key: "BOTTOM",  label: "Bottom",         matches: (s) => s === "BOTTOM" },
  { key: "OVERALL", label: "Overall",        matches: (s) => s === "OVERALL" || s === "BODY" },
  { key: "CAPE",    label: "Cape",           matches: (s) => s === "CAPE" || s === "BACK" },
  { key: "GLOVES",  label: "Gloves",         matches: (s) => s === "GLOVES" || s === "HAND" },
  { key: "SHOES",   label: "Shoes",          matches: (s) => s === "SHOES" || s === "FEET" },
  { key: "WEAPON",  label: "Weapon",         matches: (s) => s === "WEAPON_FRONT" || s === "WEAPON_BACK" },
  { key: "WRIST",   label: "Wrist",          matches: (s) => s === "WRIST" },
];

type SortKey = "DEFAULT" | "COST_ASC" | "COST_DESC" | "RARITY" | "NEWEST";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "DEFAULT",   label: "Default" },
  { value: "COST_ASC",  label: "Cost: low → high" },
  { value: "COST_DESC", label: "Cost: high → low" },
  { value: "RARITY",    label: "Rarity: rare first" },
  { value: "NEWEST",    label: "Newest first" },
];

type OwnedFilter = "ALL" | "UNOWNED" | "OWNED";

const OWNED_OPTIONS: { value: OwnedFilter; label: string }[] = [
  { value: "ALL",     label: "All items" },
  { value: "UNOWNED", label: "Not owned" },
  { value: "OWNED",   label: "Owned" },
];

function rarityLabel(r: Rarity): string {
  return r.charAt(0) + r.slice(1).toLowerCase();
}

function rarityColor(rarity: Rarity, c: ReturnType<typeof useColors>): string {
  switch (rarity) {
    case "COMMON":    return c.fgMuted;
    case "UNCOMMON":  return c.success;
    case "RARE":      return c.activeHighlight;
    case "EPIC":      return c.secondaryAccent;
    case "LEGENDARY": return c.warning;
  }
}

export default function ShopScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();

  const [items, setItems] = useState<AvatarItemDto[]>([]);
  const [ownedIds, setOwnedIds] = useState<Set<number>>(new Set());
  const [balance, setBalance] = useState<number | null>(null);
  const [slotFilter, setSlotFilter] = useState<SlotGroup>("ALL");
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("DEFAULT");
  const [ownedFilter, setOwnedFilter] = useState<OwnedFilter>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  // Currently-open detail modal target.
  const [detailItem, setDetailItem] = useState<AvatarItemDto | null>(null);

  // Fetch full catalog (pageSize=500) + inventory + me.
  const load = useCallback(async () => {
    setError(null);
    const [cat, inv, me] = await Promise.all([
      avatarApi.catalog({ pageNumber: 1, pageSize: 500 }),
      avatarApi.getInventory(1, 500),
      usersApi.getMe(),
    ]);
    if (cat.error || !cat.data) {
      setError(cat.error ?? "Couldn't load shop.");
      return;
    }
    const available = cat.data.data.filter((i: AvatarItemDto) => i.isAvailable);
    setItems(available);
    if (inv.data) {
      setOwnedIds(new Set(inv.data.data.map((r: UserInventoryDto) => r.itemId)));
    }
    if (me.data) setBalance(me.data.currentBalance);
  }, []);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filteredItems = useMemo(() => {
    const slotPred = SLOT_GROUPS.find((g) => g.key === slotFilter)!.matches;
    const filtered = items.filter((i) => {
      if (!slotPred(i.slot)) return false;
      if (rarityFilter !== "ALL" && i.rarity !== rarityFilter) return false;
      if (ownedFilter !== "ALL") {
        const owned = ownedIds.has(i.itemId);
        if (ownedFilter === "OWNED" && !owned) return false;
        if (ownedFilter === "UNOWNED" && owned) return false;
      }
      return true;
    });
    if (sortKey === "DEFAULT") return filtered;
    const arr = filtered.slice();
    switch (sortKey) {
      case "COST_ASC":  return arr.sort((a, b) => a.cost - b.cost);
      case "COST_DESC": return arr.sort((a, b) => b.cost - a.cost);
      case "RARITY":    return arr.sort((a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity]);
      // itemId is server-monotonic.
      case "NEWEST":    return arr.sort((a, b) => b.itemId - a.itemId);
    }
    return arr;
  }, [items, slotFilter, rarityFilter, sortKey, ownedFilter, ownedIds]);

  const purchase = useCallback(async (item: AvatarItemDto, autoEquip: boolean) => {
    if (purchasingId !== null) return;
    if (ownedIds.has(item.itemId)) return;
    if (balance != null && balance < item.cost) {
      Alert.alert("Not enough points", `${item.name} costs ${item.cost} pts.`);
      return;
    }
    setPurchasingId(item.itemId);
    const res = await avatarApi.purchase(item.itemId, { autoEquip });
    setPurchasingId(null);
    if (res.error || !res.data) {
      Alert.alert("Purchase failed", res.error ?? "Unknown error.");
      return;
    }
    setBalance(res.data.newBalance);
    setOwnedIds((prev) => {
      const next = new Set(prev);
      next.add(item.itemId);
      return next;
    });
    setDetailItem(null);
  }, [balance, ownedIds, purchasingId]);

  // 3-col grid; cards stretch to fill row evenly.
  const contentW = screenW - HORIZONTAL_PAD * 2;
  const cols = 3;
  const cardW = Math.floor((contentW - CARD_GAP * (cols - 1)) / cols);
  const previewBox = Math.floor(cardW * 0.88);
  const cardH = previewBox + 56; // preview + footer

  const slotOptions = SLOT_GROUPS.map((g) => ({ value: g.key, label: g.label }));
  const rarityOptions = [
    { value: "ALL" as const, label: "All rarities" },
    ...RARITIES.map((r) => ({ value: r, label: rarityLabel(r) })),
  ];
  const sortOptions = SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
  const ownedOptions = OWNED_OPTIONS.map((o) => ({ value: o.value, label: o.label }));

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
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 32, paddingHorizontal: HORIZONTAL_PAD }}
          showsVerticalScrollIndicator={false}
        >
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
        </ScrollView>
      )}

      {/* Bottom filter tray — chips open modal sheets on tap. */}
      <View
        style={[
          styles.filterTray,
          {
            backgroundColor: c.header,
            borderTopColor: c.borderSoft,
            paddingBottom: 10 + insets.bottom,
          },
        ]}
      >
        <FilterDropdown
          c={c}
          label="Category"
          options={slotOptions}
          value={slotFilter}
          onChange={(v) => setSlotFilter(v as SlotGroup)}
        />
        <FilterDropdown
          c={c}
          label="Rarity"
          options={rarityOptions}
          value={rarityFilter}
          onChange={(v) => setRarityFilter(v as RarityFilter)}
          accentFor={(v) => (v === "ALL" ? null : rarityColor(v as Rarity, c))}
        />
        <FilterDropdown
          c={c}
          label="Sort"
          options={sortOptions}
          value={sortKey}
          // Sort uses DEFAULT as neutral (no ALL).
          inactiveValue="DEFAULT"
          onChange={(v) => setSortKey(v as SortKey)}
        />
        <FilterDropdown
          c={c}
          label="Show"
          options={ownedOptions}
          value={ownedFilter}
          onChange={(v) => setOwnedFilter(v as OwnedFilter)}
        />
        <View style={{ flex: 1 }} />
        {(slotFilter !== "ALL" || rarityFilter !== "ALL" || sortKey !== "DEFAULT" || ownedFilter !== "ALL") ? (
          <Pressable
            onPress={() => {
              setSlotFilter("ALL");
              setRarityFilter("ALL");
              setSortKey("DEFAULT");
              setOwnedFilter("ALL");
            }}
            hitSlop={6}
            style={styles.clearBtn}
          >
            <ThemedText style={[styles.clearBtnLabel, { color: c.fgMuted }]}>CLEAR</ThemedText>
          </Pressable>
        ) : null}
      </View>

      <ItemDetailsModal
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

// Chip trigger that opens a centered modal sheet for filter selection.
function FilterDropdown({
  c,
  label,
  options,
  value,
  onChange,
  accentFor,
  inactiveValue = "ALL",
}: {
  c: ReturnType<typeof useColors>;
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
  accentFor?: (value: string) => string | null;
  // Neutral value that leaves the chip in default style.
  inactiveValue?: string;
}) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  const isActive = value !== inactiveValue;
  const accent = isActive ? (accentFor?.(value) ?? c.activeHighlight) : null;
  const triggerLabel = isActive ? (current?.label ?? label) : label;
  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.chip,
          {
            borderColor: accent ?? c.borderSoft,
            backgroundColor: accent ? `${accent}1A` : "transparent",
          },
        ]}
      >
        <ThemedText
          numberOfLines={1}
          style={[styles.chipLabel, { color: accent ?? c.fg }]}
        >
          {triggerLabel}
        </ThemedText>
        <ThemedText style={[styles.chipChevron, { color: accent ?? c.fgMuted }]}>▾</ThemedText>
      </Pressable>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setOpen(false)}
        >
          <Pressable
            onPress={() => {}}
            style={[
              styles.modalSheet,
              { backgroundColor: c.surface, borderColor: c.borderSoft },
            ]}
          >
            <ThemedText style={[styles.modalTitle, { color: c.fgSubtle }]}>
              {label.toUpperCase()}
            </ThemedText>
            <ScrollView
              style={{ maxHeight: 360 }}
              showsVerticalScrollIndicator={false}
            >
              {options.map((opt) => {
                const active = opt.value === value;
                const optAccent = accentFor?.(opt.value) ?? null;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => { onChange(opt.value); setOpen(false); }}
                    style={({ pressed }) => [
                      styles.modalOption,
                      active ? { backgroundColor: (optAccent ?? c.activeHighlight) + "1A" } : null,
                      pressed && !active ? { backgroundColor: c.surfaceHover } : null,
                    ]}
                  >
                    {optAccent ? (
                      <View style={[styles.modalOptionDot, { backgroundColor: optAccent }]} />
                    ) : (
                      <View style={styles.modalOptionDot} />
                    )}
                    <ThemedText
                      style={{
                        flex: 1,
                        fontSize: 14,
                        color: active ? (optAccent ?? c.activeHighlight) : c.fg,
                        fontWeight: active ? "600" : "400",
                      }}
                    >
                      {opt.label}
                    </ThemedText>
                    {active ? (
                      <ThemedText style={{ color: optAccent ?? c.activeHighlight, fontSize: 14 }}>✓</ThemedText>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function ShopItemCard({
  item,
  owned,
  affordable,
  busy,
  onPress,
  width,
  height,
  previewBox,
  colors,
}: {
  item: AvatarItemDto;
  owned: boolean;
  affordable: boolean;
  busy: boolean;
  onPress: () => void;
  width: number;
  height: number;
  previewBox: number;
  colors: ReturnType<typeof useColors>;
}) {
  const accent = rarityColor(item.rarity, colors);
  // Full-opacity cards; state shown via badge + border (not dimming).
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
            backgroundColor: `${accent}11`,
            overflow: "hidden",
          },
        ]}
      >
        <ShopItemPreview item={item} size={previewBox} />
        <RarityBadge rarity={item.rarity} colors={colors} />
      </View>
      <View style={styles.cardBody}>
        <ThemedText
          numberOfLines={1}
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

// Tap-to-expand purchase confirm modal — preview, description, auto-equip, buy.
function ItemDetailsModal({
  item,
  owned,
  affordable,
  busy,
  balance,
  onClose,
  onBuy,
  colors,
}: {
  item: AvatarItemDto | null;
  owned: boolean;
  affordable: boolean;
  busy: boolean;
  balance: number | null;
  onClose: () => void;
  onBuy: (autoEquip: boolean) => void;
  colors: ReturnType<typeof useColors>;
}) {
  const [autoEquip, setAutoEquip] = useState(false);
  // Reset auto-equip toggle on item change.
  useEffect(() => {
    if (item) setAutoEquip(false);
  }, [item?.itemId]);

  if (!item) {
    return (
      <Modal visible={false} transparent animationType="fade" onRequestClose={onClose}>
        <View />
      </Modal>
    );
  }
  const accent = rarityColor(item.rarity, colors);
  const previewSize = 184;
  const canBuy = !owned && affordable && !busy;
  const buyLabel = owned
    ? "OWNED"
    : !affordable
      ? "Not enough points"
      : busy
        ? "…"
        : `Buy · ${item.cost.toLocaleString()} P`;

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable
          onPress={() => {}}
          style={[
            styles.detailSheet,
            { backgroundColor: colors.surface, borderColor: accent },
          ]}
        >
          <Pressable
            onPress={onClose}
            hitSlop={10}
            style={styles.detailCloseBtn}
          >
            <ThemedText style={{ fontSize: 22, lineHeight: 22, color: colors.fgMuted }}>×</ThemedText>
          </Pressable>

          <View
            style={[
              styles.detailPreviewWrap,
              {
                width: previewSize,
                height: previewSize,
                backgroundColor: `${accent}14`,
                borderColor: `${accent}66`,
              },
            ]}
          >
            <ShopItemPreview item={item} size={previewSize} />
          </View>

          <ThemedText
            style={[styles.detailName, { color: colors.fg }]}
            numberOfLines={2}
          >
            {item.name}
          </ThemedText>

          <View style={styles.detailMetaRow}>
            <View style={[styles.detailMetaPill, { borderColor: accent, backgroundColor: `${accent}1A` }]}>
              <ThemedText style={[styles.detailMetaLabel, { color: accent }]}>
                {item.rarity}
              </ThemedText>
            </View>
            <View style={[styles.detailMetaPill, { borderColor: colors.borderSoft }]}>
              <ThemedText style={[styles.detailMetaLabel, { color: colors.fgMuted }]}>
                {item.slot.replace("_", " ")}
              </ThemedText>
            </View>
          </View>

          {item.description ? (
            <ThemedText style={[styles.detailDescription, { color: colors.fgMuted }]}>
              {item.description}
            </ThemedText>
          ) : null}

          {/* Auto-equip toggle — only when about-to-buy. */}
          {!owned && affordable ? (
            <Pressable
              onPress={() => setAutoEquip((v) => !v)}
              style={[
                styles.toggleRow,
                {
                  borderColor: autoEquip ? accent : colors.borderSoft,
                  backgroundColor: autoEquip ? `${accent}14` : "transparent",
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.toggleLabel,
                  { color: autoEquip ? accent : colors.fg },
                ]}
              >
                Auto-equip after purchase
              </ThemedText>
              <View
                style={[
                  styles.toggleTrack,
                  {
                    backgroundColor: autoEquip ? accent : colors.borderSoft,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleKnob,
                    {
                      backgroundColor: colors.surface,
                      transform: [{ translateX: autoEquip ? 14 : 0 }],
                    },
                  ]}
                />
              </View>
            </Pressable>
          ) : null}

          {/* Post-buy balance hint. */}
          {!owned && affordable && balance != null ? (
            <ThemedText style={[styles.detailBalance, { color: colors.fgSubtle }]}>
              Balance after: {(balance - item.cost).toLocaleString()} P
            </ThemedText>
          ) : null}

          <View style={styles.detailActions}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.detailBtn,
                styles.detailBtnSecondary,
                {
                  borderColor: colors.borderSoft,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <ThemedText style={[styles.detailBtnLabel, { color: colors.fgMuted }]}>
                Cancel
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => onBuy(autoEquip)}
              disabled={!canBuy}
              style={({ pressed }) => [
                styles.detailBtn,
                styles.detailBtnPrimary,
                {
                  backgroundColor: canBuy ? accent : `${accent}55`,
                  opacity: pressed && canBuy ? 0.85 : 1,
                },
              ]}
            >
              {busy ? (
                <ActivityIndicator size="small" color="rgba(255, 255, 255, 0.9)" />
              ) : (
                <ThemedText
                  numberOfLines={1}
                  style={[
                    styles.detailBtnLabel,
                    { color: "rgba(255, 255, 255, 0.95)" },
                  ]}
                >
                  {buyLabel}
                </ThemedText>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// Per-filename perceptual nudge applied to outer wrap.
const SHOP_PREVIEW_NUDGE: Record<string, { translateXPercent?: number; translateYPercent?: number }> = {
  // Wizard hat tip extends past alpha bbox — small leftward balance.
  "hat_wizard_hat.png": { translateXPercent: -10 },
};

// Shop preview centring — bounds-path then contain fallback (skip slot defaults).
function ShopItemPreview({ item: raw, size }: { item: AvatarItemDto; size: number }) {
  const item = applyHints(raw);
  const hasSecondary = !!item.secondaryAssetUrl;
  const secondaryInFront = item.slot === "CAPE";
  // Keyed on bare filename so CDN cache-buster doesn't break match.
  const filename = item.previewAssetUrl?.split("/").pop()?.split("?")[0] ?? "";
  const nudge = SHOP_PREVIEW_NUDGE[filename];
  const nudgeX = nudge?.translateXPercent ? (nudge.translateXPercent / 100) * size : 0;
  const nudgeY = nudge?.translateYPercent ? (nudge.translateYPercent / 100) * size : 0;
  const primaryUri = bustedAssetUrl(item, item.previewAssetUrl);
  const secondaryUri = bustedAssetUrl(item, item.secondaryAssetUrl);

  // Force 1×1 — square shop box, smaller scale fits wide items.
  const auto = boundsTransformFor(item, null, {
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
    const left = (size - scaled) / 2 + tx * auto.scale;
    const top = (size - scaled) / 2 + ty * auto.scale;
    const layerStyle = {
      position: "absolute" as const,
      left,
      top,
      width: scaled,
      height: scaled,
    };
    return (
      <View style={wrapStyle}>
        {hasSecondary && !secondaryInFront && secondaryUri ? (
          <Image source={{ uri: secondaryUri }} style={layerStyle} resizeMode="contain" />
        ) : null}
        {primaryUri ? (
          <Image source={{ uri: primaryUri }} style={layerStyle} resizeMode="contain" />
        ) : null}
        {hasSecondary && secondaryInFront && secondaryUri ? (
          <Image source={{ uri: secondaryUri }} style={layerStyle} resizeMode="contain" />
        ) : null}
      </View>
    );
  }

  // Contain fallback — RN centres each layer in the box.
  const imageStyle = { width: size, height: size };
  return (
    <View style={[wrapStyle, { alignItems: "center", justifyContent: "center" }]}>
      {hasSecondary && !secondaryInFront && secondaryUri ? (
        <Image source={{ uri: secondaryUri }} style={[imageStyle, styles.absoluteFill]} resizeMode="contain" />
      ) : null}
      {primaryUri ? (
        <Image source={{ uri: primaryUri }} style={[imageStyle, styles.absoluteFill]} resizeMode="contain" />
      ) : null}
      {hasSecondary && secondaryInFront && secondaryUri ? (
        <Image source={{ uri: secondaryUri }} style={[imageStyle, styles.absoluteFill]} resizeMode="contain" />
      ) : null}
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
  filterTray: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 10,
    paddingHorizontal: 12,
    borderTopWidth: 1,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 999,
  },
  chipLabel: { fontSize: 12, fontWeight: "600" },
  chipChevron: { fontSize: 10, marginLeft: 6 },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  clearBtnLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 1.2 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalSheet: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 8,
    boxShadow: "0px 12px 32px rgba(0, 0, 0, 0.4)",
    elevation: 24,
  },
  modalTitle: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  modalOptionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
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
  absoluteFill: {
    position: "absolute",
    left: 0,
    top: 0,
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
  cardName: { fontSize: 12, fontWeight: "600" },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  cardCost: { fontSize: 12, fontWeight: "700", fontVariant: ["tabular-nums"] },
  cardBadge: { fontSize: 9, fontWeight: "700", letterSpacing: 1.2 },
  detailSheet: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 14,
    borderWidth: 2,
    padding: 20,
    paddingTop: 16,
    alignItems: "center",
    gap: 12,
    boxShadow: "0px 16px 40px rgba(0, 0, 0, 0.5)",
    elevation: 32,
  },
  detailCloseBtn: {
    position: "absolute",
    top: 8,
    right: 10,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  detailPreviewWrap: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  detailName: { fontSize: 17, fontWeight: "700", textAlign: "center", marginTop: 2 },
  detailMetaRow: { flexDirection: "row", gap: 6, flexWrap: "wrap", justifyContent: "center" },
  detailMetaPill: {
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 999,
  },
  detailMetaLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 1.3 },
  detailDescription: {
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    paddingHorizontal: 4,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  toggleLabel: { fontSize: 13, fontWeight: "600" },
  toggleTrack: {
    width: 32,
    height: 18,
    borderRadius: 999,
    padding: 2,
    justifyContent: "center",
  },
  toggleKnob: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  detailBalance: { fontSize: 11, letterSpacing: 1.2 },
  detailActions: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 4,
  },
  detailBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  detailBtnSecondary: { borderWidth: 1 },
  detailBtnPrimary: {},
  detailBtnLabel: { fontSize: 13, fontWeight: "700", letterSpacing: 0.5 },
});
