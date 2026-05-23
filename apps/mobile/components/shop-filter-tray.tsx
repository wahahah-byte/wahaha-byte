import { useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { type Rarity } from "@wahaha/shared";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";
import {
  OWNED_OPTIONS,
  RARITIES,
  SLOT_GROUPS,
  SORT_OPTIONS,
  rarityLabel,
  type OwnedFilter,
  type RarityFilter,
  type SlotGroup,
  type SortKey,
} from "@/lib/shop-filters";

interface Props {
  slotFilter: SlotGroup;
  rarityFilter: RarityFilter;
  sortKey: SortKey;
  ownedFilter: OwnedFilter;
  setSlotFilter: (v: SlotGroup) => void;
  setRarityFilter: (v: RarityFilter) => void;
  setSortKey: (v: SortKey) => void;
  setOwnedFilter: (v: OwnedFilter) => void;
  onClear: () => void;
  // Maps a rarity value to its accent colour for the rarity chip's active state.
  rarityColorFor: (r: Rarity) => string;
}

// Bottom filter tray for the shop: four chip-dropdowns + a Clear button that appears
// when any filter is set. Each chip opens a centered modal sheet for selection.
export function ShopFilterTray({
  slotFilter,
  rarityFilter,
  sortKey,
  ownedFilter,
  setSlotFilter,
  setRarityFilter,
  setSortKey,
  setOwnedFilter,
  onClear,
  rarityColorFor,
}: Props) {
  const c = useColors();
  const insets = useSafeAreaInsets();

  const slotOptions = SLOT_GROUPS.map((g) => ({ value: g.key, label: g.label }));
  const rarityOptions = [
    { value: "ALL" as const, label: "All rarities" },
    ...RARITIES.map((r) => ({ value: r, label: rarityLabel(r) })),
  ];
  const sortOptions = SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }));
  const ownedOptions = OWNED_OPTIONS.map((o) => ({ value: o.value, label: o.label }));

  const anyActive =
    slotFilter !== "ALL" || rarityFilter !== "ALL" || sortKey !== "DEFAULT" || ownedFilter !== "ALL";

  return (
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
        label="Category"
        options={slotOptions}
        value={slotFilter}
        onChange={(v) => setSlotFilter(v as SlotGroup)}
      />
      <FilterDropdown
        label="Rarity"
        options={rarityOptions}
        value={rarityFilter}
        onChange={(v) => setRarityFilter(v as RarityFilter)}
        accentFor={(v) => (v === "ALL" ? null : rarityColorFor(v as Rarity))}
      />
      <FilterDropdown
        label="Sort"
        options={sortOptions}
        value={sortKey}
        // Sort uses DEFAULT as the neutral state (no ALL).
        inactiveValue="DEFAULT"
        onChange={(v) => setSortKey(v as SortKey)}
      />
      <FilterDropdown
        label="Show"
        options={ownedOptions}
        value={ownedFilter}
        onChange={(v) => setOwnedFilter(v as OwnedFilter)}
      />
      <View style={{ flex: 1 }} />
      {anyActive ? (
        <Pressable onPress={onClear} hitSlop={6} style={styles.clearBtn}>
          <ThemedText style={[styles.clearBtnLabel, { color: c.fgMuted }]}>CLEAR</ThemedText>
        </Pressable>
      ) : null}
    </View>
  );
}

// Chip trigger that opens a centered modal sheet for filter selection.
function FilterDropdown({
  label,
  options,
  value,
  onChange,
  accentFor,
  inactiveValue = "ALL",
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (next: string) => void;
  accentFor?: (value: string) => string | null;
  // Neutral value that leaves the chip in default style.
  inactiveValue?: string;
}) {
  const c = useColors();
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
        <ThemedText numberOfLines={1} style={[styles.chipLabel, { color: accent ?? c.fg }]}>
          {triggerLabel}
        </ThemedText>
        <ThemedText style={[styles.chipChevron, { color: accent ?? c.fgMuted }]}>▾</ThemedText>
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.modalBackdrop} onPress={() => setOpen(false)}>
          <Pressable
            onPress={() => {}}
            style={[styles.modalSheet, { backgroundColor: c.surface, borderColor: c.borderSoft }]}
          >
            <ThemedText style={[styles.modalTitle, { color: c.fgSubtle }]}>
              {label.toUpperCase()}
            </ThemedText>
            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
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

const styles = StyleSheet.create({
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
});
