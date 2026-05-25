"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  avatarApi,
  type AvatarItemDto,
  type ItemSlot,
  type Rarity,
} from "@/lib/api/avatar";
import { usersApi } from "@/lib/api/users";
import ShopItemPreview from "@/components/ShopItemPreview";
import { useToast } from "@/context/ToastContext";
import { usePoints } from "@/context/PointsContext";

// ---- Filter primitives ----------------------------------------------------

type RarityFilter = "ALL" | Rarity;
type OwnedFilter = "ALL" | "UNOWNED" | "OWNED";
type SortKey = "DEFAULT" | "COST_ASC" | "COST_DESC" | "RARITY" | "NEWEST";

// Slot filter collapses HAIR_*/WEAPON_* variants into single chips.
type SlotGroup =
  | "ALL" | "HAT" | "HAIR" | "FACE" | "EYE" | "EAR"
  | "TOP" | "BOTTOM" | "OVERALL" | "CAPE" | "GLOVES" | "SHOES"
  | "WEAPON" | "OFFHAND" | "WRIST";

const SLOT_GROUPS: { key: SlotGroup; label: string; matches: (s: ItemSlot) => boolean }[] = [
  { key: "ALL",     label: "All",      matches: () => true },
  { key: "HAT",     label: "Hat",      matches: (s) => s === "HAT" || s === "HEAD" },
  { key: "HAIR",    label: "Hair",     matches: (s) => s === "HAIR" || s === "HAIR_FRONT" || s === "HAIR_BACK" },
  { key: "FACE",    label: "Face",     matches: (s) => s === "FACE" },
  { key: "EYE",     label: "Eye",      matches: (s) => s === "EYE" },
  { key: "EAR",     label: "Ear",      matches: (s) => s === "EAR" },
  { key: "TOP",     label: "Top",      matches: (s) => s === "TOP" },
  { key: "BOTTOM",  label: "Bottom",   matches: (s) => s === "BOTTOM" },
  { key: "OVERALL", label: "Overall",  matches: (s) => s === "OVERALL" || s === "BODY" },
  { key: "CAPE",    label: "Cape",     matches: (s) => s === "CAPE" || s === "BACK" },
  { key: "GLOVES",  label: "Gloves",   matches: (s) => s === "GLOVES" || s === "HAND" },
  { key: "SHOES",   label: "Shoes",    matches: (s) => s === "SHOES" || s === "FEET" },
  { key: "WEAPON",  label: "Weapon",   matches: (s) => s === "WEAPON_FRONT" || s === "WEAPON_BACK" },
  { key: "OFFHAND", label: "Off-hand", matches: (s) => s === "OFFHAND" },
  { key: "WRIST",   label: "Wrist",    matches: (s) => s === "WRIST" },
];

const RARITIES: Rarity[] = ["COMMON", "UNCOMMON", "RARE", "EPIC", "LEGENDARY"];
const RARITY_RANK: Record<Rarity, number> = {
  COMMON: 0, UNCOMMON: 1, RARE: 2, EPIC: 3, LEGENDARY: 4,
};

function rarityColor(r: Rarity): string {
  switch (r) {
    case "COMMON":    return "var(--color-fg-muted)";
    case "UNCOMMON":  return "var(--color-success)";
    case "RARE":      return "var(--color-active-highlight)";
    case "EPIC":      return "var(--color-active-highlight-alt)";
    case "LEGENDARY": return "var(--color-warning)";
  }
}

function rarityLabel(r: Rarity): string {
  return r.charAt(0) + r.slice(1).toLowerCase();
}

// Uniform dark icon-showcase panel behind every preview — Discord-style.
const PREVIEW_BG = "#2b2d31";

// ---- Page -----------------------------------------------------------------

export default function ShopPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [items, setItems] = useState<AvatarItemDto[]>([]);
  const [ownedIds, setOwnedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  const [slotFilter, setSlotFilter] = useState<SlotGroup>("ALL");
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("ALL");
  const [ownedFilter, setOwnedFilter] = useState<OwnedFilter>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("DEFAULT");

  const [detailItem, setDetailItem] = useState<AvatarItemDto | null>(null);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);

  const { setError, setSuccess } = useToast();
  const { balance, setBalance } = usePoints();

  useEffect(() => {
    setIsMounted(true);
    const token = !!localStorage.getItem("auth_token");
    setHasToken(token);
    if (!token) { setLoading(false); return; }
    (async () => {
      const [cat, inv, me] = await Promise.all([
        avatarApi.catalog({ pageNumber: 1, pageSize: 500 }),
        avatarApi.getInventory(1, 500),
        usersApi.getMe(),
      ]);
      setLoading(false);
      if (cat.error || !cat.data) {
        setError(cat.error ?? "Couldn't load shop.");
        return;
      }
      setItems(cat.data.data.filter((i) => i.isAvailable));
      if (inv.data) setOwnedIds(new Set(inv.data.data.map((r) => r.itemId)));
      if (me.data) setBalance(me.data.currentBalance);
    })();
  }, [setError, setBalance]);

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
      case "NEWEST":    return arr.sort((a, b) => b.itemId - a.itemId);
    }
    return arr;
  }, [items, slotFilter, rarityFilter, sortKey, ownedFilter, ownedIds]);

  const purchase = useCallback(async (item: AvatarItemDto, autoEquip: boolean) => {
    if (purchasingId !== null) return;
    if (ownedIds.has(item.itemId)) return;
    if (balance != null && balance < item.cost) {
      setError(`${item.name} costs ${item.cost} pts.`);
      return;
    }
    setPurchasingId(item.itemId);
    const res = await avatarApi.purchase(item.itemId, { autoEquip });
    setPurchasingId(null);
    if (res.error || !res.data) {
      setError(res.error ?? "Purchase failed.");
      return;
    }
    setBalance(res.data.newBalance);
    setOwnedIds((prev) => {
      const next = new Set(prev);
      next.add(item.itemId);
      return next;
    });
    setSuccess(`Purchased ${item.name}.`);
    setDetailItem(null);
  }, [balance, ownedIds, purchasingId, setBalance, setError, setSuccess]);

  if (!isMounted) return null;

  if (!hasToken) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <p style={{ color: "var(--color-fg-muted)", fontSize: 12 }}>Sign in to browse the shop.</p>
          <Link
            href="/login"
            className="text-[10px] tracking-widest uppercase font-semibold"
            style={{
              color: "var(--color-fg)",
              border: "1px solid var(--color-border-hairline)",
              borderRadius: 999,
              padding: "6px 14px",
              textDecoration: "none",
            }}
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      {/* Header */}
      <header
        className="flex items-center gap-3 px-4 py-3"
        style={{ borderBottom: "1px solid var(--color-border-soft)" }}
      >
        <Link
          href="/"
          className="text-[10px] tracking-widest uppercase font-semibold"
          style={{ color: "var(--color-fg-subtle)", textDecoration: "none" }}
        >
          ← Back
        </Link>
        <h1
          className="text-xs font-semibold flex-1"
          style={{ color: "var(--color-fg)", letterSpacing: "0.2em", textTransform: "uppercase" }}
        >
          Shop
        </h1>
        <div
          className="flex items-center gap-1.5"
          style={{
            border: "1px solid var(--color-border-soft)",
            background: "var(--color-surface)",
            borderRadius: 999,
            padding: "4px 10px",
          }}
        >
          <span style={{ color: "var(--color-fg-subtle)", fontSize: 9, letterSpacing: "0.16em", fontWeight: 700 }}>BAL</span>
          <span style={{ color: "var(--color-fg)", fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
            {balance == null ? "—" : balance.toLocaleString()}
          </span>
        </div>
      </header>

      {/* Filter row */}
      <div
        className="flex flex-wrap items-center gap-2 px-4 py-2"
        style={{ borderBottom: "1px solid var(--color-border-hairline)" }}
      >
        <FilterSelect<SlotGroup>
          label="Slot"
          value={slotFilter}
          onChange={setSlotFilter}
          options={SLOT_GROUPS.map((g) => ({ value: g.key, label: g.label }))}
        />
        <FilterSelect<RarityFilter>
          label="Rarity"
          value={rarityFilter}
          onChange={setRarityFilter}
          options={[
            { value: "ALL", label: "All" },
            ...RARITIES.map((r) => ({ value: r, label: rarityLabel(r) })),
          ]}
        />
        <FilterSelect<OwnedFilter>
          label="Owned"
          value={ownedFilter}
          onChange={setOwnedFilter}
          options={[
            { value: "ALL",     label: "All" },
            { value: "UNOWNED", label: "Not owned" },
            { value: "OWNED",   label: "Owned" },
          ]}
        />
        <FilterSelect<SortKey>
          label="Sort"
          value={sortKey}
          onChange={setSortKey}
          options={[
            { value: "DEFAULT",   label: "Default" },
            { value: "COST_ASC",  label: "Cost: low → high" },
            { value: "COST_DESC", label: "Cost: high → low" },
            { value: "RARITY",    label: "Rarity" },
            { value: "NEWEST",    label: "Newest" },
          ]}
        />
        <span className="ml-auto text-[10px] tracking-widest uppercase" style={{ color: "var(--color-fg-subtle)" }}>
          {filteredItems.length} item{filteredItems.length === 1 ? "" : "s"}
        </span>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-accent)" }} />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-sm tracking-widest uppercase" style={{ color: "var(--color-fg-subtle)" }}>
              No items match
            </p>
          </div>
        ) : (
          // Grid: target ~156px cards, capped at 1100px wide so icons stay
          // sensibly sized on desktop. Centered via mx-auto + max-width.
          <div
            className="grid gap-3 p-4 mx-auto"
            style={{
              maxWidth: 1100,
              gridTemplateColumns: "repeat(auto-fill, minmax(156px, 1fr))",
            }}
          >
            {filteredItems.map((item) => (
              <ShopCard
                key={item.itemId}
                item={item}
                owned={ownedIds.has(item.itemId)}
                affordable={balance == null ? true : balance >= item.cost}
                busy={purchasingId === item.itemId}
                onClick={() => setDetailItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {detailItem && (
        <DetailModal
          item={detailItem}
          owned={ownedIds.has(detailItem.itemId)}
          affordable={balance == null ? true : balance >= detailItem.cost}
          busy={purchasingId === detailItem.itemId}
          balance={balance}
          onClose={() => setDetailItem(null)}
          onBuy={(autoEquip) => purchase(detailItem, autoEquip)}
        />
      )}
    </main>
  );
}

// ---- Card -----------------------------------------------------------------

function ShopCard({
  item, owned, affordable, busy, onClick,
}: {
  item: AvatarItemDto;
  owned: boolean;
  affordable: boolean;
  busy: boolean;
  onClick: () => void;
}) {
  const accent = rarityColor(item.rarity);
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      style={{
        background: "var(--color-surface)",
        border: `1px solid ${accent}`,
        borderRadius: 8,
        overflow: "hidden",
        padding: 0,
        textAlign: "left",
        cursor: busy ? "wait" : "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Preview panel — dark icon-showcase regardless of theme. */}
      <div
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          background: PREVIEW_BG,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ShopItemPreview item={item} />
        {/* Rarity coin */}
        <span
          aria-hidden
          style={{
            position: "absolute",
            top: 6,
            right: 6,
            width: 22,
            height: 22,
            borderRadius: 11,
            background: accent,
            border: "1.5px solid rgba(255,255,255,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "rgba(255,255,255,0.98)",
            fontSize: 11,
            fontWeight: 800,
            lineHeight: 1,
            boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
          }}
        >
          {item.rarity[0]}
        </span>
      </div>
      {/* Footer */}
      <div
        style={{
          padding: "8px 10px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
          minHeight: 60,
        }}
      >
        <span
          style={{
            color: "var(--color-fg)",
            fontSize: 12,
            fontWeight: 700,
            lineHeight: 1.25,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.name}
        </span>
        <div className="flex items-center justify-between">
          <span style={{ color: "var(--color-warning)", fontSize: 12, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
            {item.cost.toLocaleString()}P
          </span>
          {owned ? (
            <span style={{ color: "var(--color-success)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em" }}>OWNED</span>
          ) : busy ? (
            <span style={{ color: "var(--color-fg-subtle)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em" }}>…</span>
          ) : !affordable ? (
            <span style={{ color: "var(--color-danger)", fontSize: 9, fontWeight: 700, letterSpacing: "0.14em" }}>—</span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

// ---- Detail modal ---------------------------------------------------------

function DetailModal({
  item, owned, affordable, busy, balance, onClose, onBuy,
}: {
  item: AvatarItemDto;
  owned: boolean;
  affordable: boolean;
  busy: boolean;
  balance: number | null;
  onClose: () => void;
  onBuy: (autoEquip: boolean) => void;
}) {
  const [autoEquip, setAutoEquip] = useState(true);
  const accent = rarityColor(item.rarity);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "var(--color-modal-overlay)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--color-panel)",
          border: `1px solid ${accent}`,
          borderRadius: 8,
          width: "100%",
          maxWidth: 380,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          boxShadow: "var(--shadow-popover)",
        }}
      >
        {/* Preview */}
        <div
          style={{
            aspectRatio: "1 / 1",
            background: PREVIEW_BG,
            borderRadius: 6,
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <ShopItemPreview item={item} />
        </div>

        {/* Name + rarity */}
        <div className="flex items-start justify-between gap-2">
          <h2 style={{ color: "var(--color-fg)", fontSize: 15, fontWeight: 700 }}>{item.name}</h2>
          <span
            style={{
              color: accent,
              border: `1px solid ${accent}`,
              borderRadius: 999,
              padding: "2px 8px",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            {rarityLabel(item.rarity)}
          </span>
        </div>

        {item.description ? (
          <p style={{ color: "var(--color-fg-muted)", fontSize: 12, lineHeight: 1.5 }}>
            {item.description}
          </p>
        ) : null}

        <div className="flex items-center justify-between" style={{ borderTop: "1px solid var(--color-border-hairline)", paddingTop: 10 }}>
          <span style={{ color: "var(--color-fg-subtle)", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600 }}>
            Cost
          </span>
          <span style={{ color: "var(--color-warning)", fontSize: 16, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
            {item.cost.toLocaleString()}P
          </span>
        </div>

        {!owned && (
          <label className="flex items-center gap-2 cursor-pointer" style={{ color: "var(--color-fg-muted)", fontSize: 11 }}>
            <input
              type="checkbox"
              checked={autoEquip}
              onChange={(e) => setAutoEquip(e.target.checked)}
            />
            Equip after purchase
          </label>
        )}

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 6,
              border: "1px solid var(--color-border-hairline)",
              background: "transparent",
              color: "var(--color-fg-muted)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => onBuy(autoEquip)}
            disabled={owned || !affordable || busy}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: 6,
              border: `1px solid ${owned ? "var(--color-success)" : !affordable ? "var(--color-border-hairline)" : "var(--color-active-highlight)"}`,
              background: owned ? "var(--color-success-bg)" : !affordable ? "transparent" : "var(--color-active-highlight-bg)",
              color: owned ? "var(--color-success)" : !affordable ? "var(--color-fg-subtle)" : "var(--color-active-highlight)",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              cursor: owned || !affordable || busy ? "not-allowed" : "pointer",
              opacity: busy ? 0.6 : 1,
            }}
          >
            {owned ? "Owned" : busy ? "Buying…" : !affordable
              ? (balance != null ? `Need ${(item.cost - balance).toLocaleString()}P` : "Can't afford")
              : "Buy"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Filter select --------------------------------------------------------

function FilterSelect<T extends string>({
  label, value, onChange, options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <label
      className="flex items-center gap-1.5"
      style={{ fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--color-fg-subtle)" }}
    >
      <span>{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        style={{
          fontSize: 11,
          color: "var(--color-fg)",
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-hairline)",
          borderRadius: 4,
          padding: "3px 6px",
          cursor: "pointer",
          letterSpacing: "0.06em",
          textTransform: "none",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
