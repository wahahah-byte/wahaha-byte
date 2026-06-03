import { useEffect, useState } from "react";
import { ActivityIndicator, Modal, Pressable, StyleSheet, View } from "react-native";

import { type AvatarItemDto } from "@wahaha/shared";

import { ShopItemPreview } from "@/components/shop-item-preview";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";
import { rarityColor } from "@/lib/shop-theme";

interface Props {
  item: AvatarItemDto | null;
  owned: boolean;
  affordable: boolean;
  busy: boolean;
  balance: number | null;
  onClose: () => void;
  onBuy: (autoEquip: boolean) => void;
  colors: ReturnType<typeof useColors>;
}

// Tap-to-expand purchase confirm modal — preview, name + rarity/slot pills, description,
// auto-equip toggle, post-purchase balance hint, Cancel / Buy actions.
export function ShopItemDetailsModal({
  item,
  owned,
  affordable,
  busy,
  balance,
  onClose,
  onBuy,
  colors,
}: Props) {
  const [autoEquip, setAutoEquip] = useState(false);
  // Reset auto-equip toggle on item change.
  const itemId = item?.itemId;
  useEffect(() => {
    if (itemId) setAutoEquip(false);
  }, [itemId]);

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
          <Pressable onPress={onClose} hitSlop={10} style={styles.detailCloseBtn}>
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

          <ThemedText style={[styles.detailName, { color: colors.fg }]} numberOfLines={2}>
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
                  { backgroundColor: autoEquip ? accent : colors.borderSoft },
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
                { borderColor: colors.borderSoft, opacity: pressed ? 0.7 : 1 },
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

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
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
  detailBtnLabel: { fontSize: 13, fontWeight: "700", letterSpacing: 0.5 },
});
