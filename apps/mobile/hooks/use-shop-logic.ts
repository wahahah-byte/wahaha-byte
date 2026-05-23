import { useCallback, useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "expo-router";

import { type AvatarItemDto, type UserInventoryDto } from "@wahaha/shared";

import { avatarApi, usersApi } from "@/lib/api";
import {
  RARITY_RANK,
  SLOT_GROUPS,
  type OwnedFilter,
  type RarityFilter,
  type SlotGroup,
  type SortKey,
} from "@/lib/shop-filters";

// Shop screen logic: catalog + inventory + balance fetch, filter/sort/featured derivations,
// purchase action with optimistic balance + ownership updates. Returned as a thin state
// object so the screen can stay focused on layout.
export function useShopLogic() {
  // ---- Server state ----
  const [items, setItems] = useState<AvatarItemDto[]>([]);
  const [ownedIds, setOwnedIds] = useState<Set<number>>(new Set());
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---- Filter state ----
  const [slotFilter, setSlotFilter] = useState<SlotGroup>("ALL");
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("DEFAULT");
  const [ownedFilter, setOwnedFilter] = useState<OwnedFilter>("ALL");

  // ---- Detail-modal + purchase state ----
  const [detailItem, setDetailItem] = useState<AvatarItemDto | null>(null);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);

  // Fetch full catalog (pageSize=500) + inventory + me, in parallel.
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

  // Apply slot/rarity/ownership filters, then sort.
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
      // itemId is server-monotonic — newest first.
      case "NEWEST":    return arr.sort((a, b) => b.itemId - a.itemId);
    }
    return arr;
  }, [items, slotFilter, rarityFilter, sortKey, ownedFilter, ownedIds]);

  // Featured hero pick: rarest unowned; fallback to rarest item overall.
  const featuredItem = useMemo<AvatarItemDto | null>(() => {
    if (items.length === 0) return null;
    const unowned = items.filter((i) => !ownedIds.has(i.itemId));
    const pool = unowned.length > 0 ? unowned : items;
    return [...pool].sort(
      (a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity] || b.itemId - a.itemId,
    )[0] ?? null;
  }, [items, ownedIds]);

  // True when no filter is set — controls hero banner visibility (we hide it during search).
  const filtersAreClear =
    slotFilter === "ALL" && rarityFilter === "ALL" && sortKey === "DEFAULT" && ownedFilter === "ALL";

  const resetFilters = useCallback(() => {
    setSlotFilter("ALL");
    setRarityFilter("ALL");
    setSortKey("DEFAULT");
    setOwnedFilter("ALL");
  }, []);

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

  return {
    // Server state
    items, ownedIds, balance, loading, error,
    // Derived
    filteredItems, featuredItem, filtersAreClear,
    // Filters
    slotFilter, setSlotFilter,
    rarityFilter, setRarityFilter,
    sortKey, setSortKey,
    ownedFilter, setOwnedFilter,
    resetFilters,
    // Purchase + detail modal
    detailItem, setDetailItem,
    purchasingId,
    purchase,
  };
}
