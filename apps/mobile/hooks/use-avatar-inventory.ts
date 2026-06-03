import { useCallback, useEffect, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";

import {
  applyHints,
  getItemSize,
  isHairSlot,
  isTwoHanded,
  isWeaponSlot,
  shouldDropOnEquip,
  type UserInventoryDto,
} from "@wahaha/shared";
import { avatarApi } from "@/lib/api";
import { equippedCache } from "@/lib/equipped-cache";
import { autoPlace, rectFits, type Placed } from "@/lib/grid-collision";
import { GRID } from "@/lib/avatar-grid";

export type Tab = "equipment" | "hair";

// Inventory data + equip/sell/drag logic for the avatar screen.
export function useAvatarInventory() {
  const [inventory, setInventory] = useState<UserInventoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("equipment");
  const [draggingId, setDraggingId] = useState<number | null>(null);
  // Inventory item the long-press menu is open for; null = closed.
  const [menuItem, setMenuItem] = useState<UserInventoryDto | null>(null);
  // True while the sell request is mid-flight; locks the menu actions.
  const [menuBusy, setMenuBusy] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    const res = await avatarApi.getInventory(1, 200);
    if (!res.data) {
      setError(res.error ?? "Failed to load inventory.");
      return;
    }
    const hinted = res.data.data
      .filter((r) => r.avatarItem?.previewAssetUrl)
      // Hydrate from mobile columns; fall back to desktop columns.
      .map((r) => ({
        ...r,
        avatarItem: applyHints(r.avatarItem!),
        positionX: r.positionXMobile ?? r.positionX ?? null,
        positionY: r.positionYMobile ?? r.positionY ?? null,
      }));
    // Auto-place per tab — hair and equipment share coords.
    const equipRows = hinted.filter((r) => !isHairSlot(r.avatarItem?.slot));
    const hairRows = hinted.filter((r) => isHairSlot(r.avatarItem?.slot));
    const placed = [...autoPlace(equipRows, GRID), ...autoPlace(hairRows, GRID)];
    setInventory(placed);
    // Persist freshly auto-placed items.
    for (let i = 0; i < placed.length; i++) {
      const row = placed[i];
      const original = hinted[i];
      const wasUnplaced = original.positionXMobile == null || original.positionYMobile == null;
      if (wasUnplaced && row.positionX != null && row.positionY != null) {
        avatarApi.setPosition(row.inventoryId, row.positionX, row.positionY, undefined, "mobile");
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const equipped = useMemo(() => inventory.filter((inv) => inv.isEquipped), [inventory]);

  const visibleInventory = useMemo(
    () =>
      inventory.filter((inv) =>
        activeTab === "hair"
          ? isHairSlot(inv.avatarItem?.slot)
          : !isHairSlot(inv.avatarItem?.slot),
      ),
    [inventory, activeTab],
  );

  async function toggle(inv: UserInventoryDto) {
    if (busyId) return;
    setBusyId(inv.inventoryId);
    const slot = inv.avatarItem?.slot;
    const isWeapon = slot && isWeaponSlot(slot);
    const newIsOffhand = slot === "OFFHAND";
    const newIs2H = isTwoHanded(inv.avatarItem);
    const nextEquipped = !inv.isEquipped;
    setInventory((prev) =>
      prev.map((r) => {
        if (r.inventoryId === inv.inventoryId) return { ...r, isEquipped: nextEquipped };
        if (!nextEquipped) return r;
        const rSlot = r.avatarItem?.slot;
        if (!r.isEquipped) return r;
        // Same-slot mutex (always applies — server enforces this too).
        if (rSlot === slot) return { ...r, isEquipped: false };
        // Cross-weapon mutex with the 1H + OFFHAND coexistence rule. Mirrors
        // apps/web/src/app/avatar/page.tsx crossWeaponRows and the C# EquipAsync.
        if (isWeapon && rSlot && isWeaponSlot(rSlot)) {
          // OFFHAND vs WEAPON_FRONT: only drop when the WEAPON_FRONT side is 2H.
          if (newIsOffhand && rSlot === "WEAPON_FRONT") {
            return isTwoHanded(r.avatarItem) ? { ...r, isEquipped: false } : r;
          }
          if (rSlot === "OFFHAND" && slot === "WEAPON_FRONT") {
            return newIs2H ? { ...r, isEquipped: false } : r;
          }
          // All other weapon-slot combos (HAND / WEAPON_FRONT / WEAPON_BACK) stay mutex.
          return { ...r, isEquipped: false };
        }
        // Cross-slot mutex outside the weapon family: only one hair at a time, and
        // outfit (OVERALL/BODY ↔ TOP/BOTTOM) + hat (HAT/HEAD) groups. Mirrors the
        // server's EquipAsync so the just-unequipped item disappears immediately
        // instead of lingering until the next reload.
        if (shouldDropOnEquip(slot, rSlot)) return { ...r, isEquipped: false };
        return r;
      }),
    );
    const fn = nextEquipped ? avatarApi.equip : avatarApi.unequip;
    const res = await fn(inv.inventoryId);
    setBusyId(null);
    if (res.error) {
      setError(res.error);
      await load();
      return;
    }
    // Refresh equipped cache for next detail-modal open.
    equippedCache.revalidate();
  }

  // Open the long-press action menu for an inventory item. Triggered from InventoryCard
  // when the user long-presses without dragging.
  function onSellRequest(inv: UserInventoryDto) {
    // The long-press path activates pan ⇒ parent sets draggingId. Clear it before opening
    // the menu so the card returns to its idle visual state behind the sheet.
    setDraggingId(null);
    if (busyId) return;
    if (!inv.avatarItem) return;
    setMenuItem(inv);
  }

  // Sell-back. 50% refund matches SellInventoryHandler.SellRefundRatio on the backend.
  async function confirmSell() {
    const inv = menuItem;
    if (!inv || menuBusy) return;
    setMenuBusy(true);
    const res = await avatarApi.sellInventory(inv.inventoryId);
    setMenuBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    // Splice the row out locally; chibi re-renders without it.
    setInventory((prev) => prev.filter((row) => row.inventoryId !== inv.inventoryId));
    equippedCache.revalidate();
    setMenuItem(null);
  }

  // Drag commit — returns true on accept (card pins at new cell).
  const handleMove = useCallback(
    (invId: number, newX: number, newY: number): boolean => {
      const moving = inventory.find((r) => r.inventoryId === invId);
      if (!moving?.avatarItem) return false;
      const size = getItemSize(moving.avatarItem);
      // Same-tab collision — hair and equipment have independent coords.
      const movingIsHair = isHairSlot(moving.avatarItem.slot);
      const sameTab = inventory.filter(
        (r) =>
          isHairSlot(r.avatarItem?.slot) === movingIsHair
          && r.inventoryId !== invId
          && r.positionX != null
          && r.positionY != null,
      );
      const placed: Placed[] = sameTab.map((r) => {
        const s = getItemSize(r.avatarItem!);
        return {
          positionX: r.positionX!,
          positionY: r.positionY!,
          cols: s.cols,
          rows: s.rows,
        };
      });
      if (!rectFits(placed, newX, newY, size.cols, size.rows, GRID)) return false;
      if (moving.positionX === newX && moving.positionY === newY) return true;
      setInventory((prev) =>
        prev.map((r) =>
          r.inventoryId === invId ? { ...r, positionX: newX, positionY: newY } : r,
        ),
      );
      // Fire-and-forget persist; reload reconciles on transient errors.
      avatarApi.setPosition(invId, newX, newY, undefined, "mobile").catch(() => {
        // Next load() reconciles with server state.
      });
      return true;
    },
    [inventory],
  );

  return {
    inventory,
    loading,
    busyId,
    error,
    activeTab,
    setActiveTab,
    draggingId,
    setDraggingId,
    menuItem,
    setMenuItem,
    menuBusy,
    equipped,
    visibleInventory,
    toggle,
    onSellRequest,
    confirmSell,
    handleMove,
  };
}
