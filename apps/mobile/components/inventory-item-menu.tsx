import { Modal, Pressable, StyleSheet, View } from "react-native";

import type { AvatarItemDto } from "@wahaha/shared";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  // The item being acted on; null while closed (preserved during close-animation by parent).
  item: AvatarItemDto | null;
  visible: boolean;
  // Refund amount the parent has already computed (floor(cost * SELL_RATIO)).
  refundPoints: number;
  // True while the parent's sell request is in flight — disables actions to prevent double-fire.
  busy: boolean;
  onSell: () => void;
  onCancel: () => void;
}

// Long-press action sheet for an inventory item. Slides up from bottom, themed via useColors().
// Currently only exposes Sell + Cancel; add more actions here if/when we surface item details,
// "drop without refund", etc.
export function InventoryItemMenu({ item, visible, refundPoints, busy, onSell, onCancel }: Props) {
  const c = useColors();
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={busy ? undefined : onCancel}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.sheet,
            { backgroundColor: c.surface, borderColor: c.borderHairline },
          ]}
        >
          {/* Visual handle — communicates dismissable sheet on iOS/Android. */}
          <View style={[styles.handle, { backgroundColor: c.borderSoft }]} />

          <ThemedText
            style={{
              fontSize: 10,
              letterSpacing: 1.6,
              textTransform: "uppercase",
              fontWeight: "700",
              color: c.fgMuted,
              marginBottom: 4,
            }}
          >
            Item
          </ThemedText>
          <ThemedText
            numberOfLines={1}
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: c.fg,
            }}
          >
            {item?.name ?? ""}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 11,
              color: c.fgSubtle,
              letterSpacing: 0.5,
              marginTop: 2,
            }}
          >
            {item?.slot ?? ""}{item?.category ? ` · ${item.category}` : ""}
          </ThemedText>

          {/* Sell action — destructive accent so it reads as a one-way action. */}
          <Pressable
            onPress={busy ? undefined : onSell}
            disabled={busy}
            style={({ pressed }) => [
              styles.actionRow,
              {
                borderColor: c.dangerBorder,
                backgroundColor: pressed && !busy ? c.dangerBg : "transparent",
                opacity: busy ? 0.5 : 1,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <ThemedText style={{ color: c.danger, fontSize: 14, fontWeight: "700" }}>
                Sell
              </ThemedText>
              <ThemedText style={{ color: c.fgMuted, fontSize: 11, marginTop: 2 }}>
                Removes the item and credits {refundPoints.toLocaleString()} pts to your balance.
              </ThemedText>
            </View>
            <ThemedText style={{ color: c.danger, fontSize: 15, fontWeight: "800" }}>
              +{refundPoints.toLocaleString()}P
            </ThemedText>
          </Pressable>

          <Pressable
            onPress={busy ? undefined : onCancel}
            disabled={busy}
            style={({ pressed }) => [
              styles.actionRow,
              styles.cancelRow,
              {
                borderColor: c.borderHairline,
                backgroundColor: pressed && !busy ? c.overlayHover : "transparent",
                opacity: busy ? 0.5 : 1,
              },
            ]}
          >
            <ThemedText
              style={{
                color: c.fg,
                fontSize: 14,
                fontWeight: "600",
                textAlign: "center",
                flex: 1,
              }}
            >
              Cancel
            </ThemedText>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    gap: 10,
  },
  // 36px-wide grab handle centred at the top of the sheet.
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 6,
  },
  cancelRow: {
    justifyContent: "center",
  },
});
