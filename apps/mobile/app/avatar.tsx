import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";

import { ChibiAvatar } from "@/components/chibi-avatar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { InventoryItemMenu } from "@/components/inventory-item-menu";
import { InventoryCard } from "@/components/avatar/inventory-card";
import { useColors } from "@/hooks/use-colors";
import { useAvatarInventory, type Tab } from "@/hooks/use-avatar-inventory";
import {
  CELL_GAP,
  CELL_PX,
  CELL_STEP,
  FRAME_BORDER,
  FRAME_PAD,
  GRID_COLS,
  GRID_ROWS,
} from "@/lib/avatar-grid";

export default function AvatarScreen() {
  const c = useColors();
  const { width: screenW } = useWindowDimensions();
  const {
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
  } = useAvatarInventory();

  if (loading && inventory.length === 0) {
    return (
      <ThemedView style={{ flex: 1, padding: 24, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color={c.activeHighlight} />
      </ThemedView>
    );
  }

  const gridWidth = GRID_COLS * CELL_PX + (GRID_COLS - 1) * CELL_GAP;
  const gridHeight = GRID_ROWS * CELL_PX + (GRID_ROWS - 1) * CELL_GAP;
  // 2·border padding so cells (inside border) don't overflow edges.
  const frameWidth = gridWidth + (FRAME_PAD + FRAME_BORDER) * 2;
  const frameHeight = gridHeight + (FRAME_PAD + FRAME_BORDER) * 2;
  const gridLeftMargin = Math.max(0, Math.floor((screenW - frameWidth) / 2));

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.previewWrap}>
          <ChibiAvatar equipped={equipped} height={160} />
          <ThemedText style={[styles.equippedCount, { color: c.fgSubtle }]}>
            {loading ? "Loading…" : equipped.length === 0 ? "Nothing equipped" : `${equipped.length} equipped`}
          </ThemedText>
        </View>

        <View style={{ alignItems: "center", marginTop: 8 }}>
          <View style={{ width: frameWidth }}>
            <View style={styles.sectionHeaderRow}>
              <ThemedText style={[styles.sectionHeader, { color: c.fgSubtle }]}>
                Inventory {!loading && `(${visibleInventory.length})`}
              </ThemedText>
              <Pressable
                onPress={() => router.push("/shop")}
                hitSlop={8}
                style={({ pressed }) => [
                  styles.shopBtn,
                  {
                    borderColor: c.activeHighlightBorder,
                    backgroundColor: pressed ? c.activeHighlightBg : "transparent",
                  },
                ]}
              >
                <ThemedText style={[styles.shopBtnLabel, { color: c.activeHighlight }]}>
                  SHOP
                </ThemedText>
              </Pressable>
            </View>
            <View style={styles.tabBar}>
              {(["equipment", "hair"] as Tab[]).map((tab) => {
                const active = tab === activeTab;
                return (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={[
                      styles.tabBtn,
                      {
                        borderColor: "rgba(220, 230, 235, 0.55)",
                        backgroundColor: active ? "rgba(40, 44, 48, 0.85)" : "rgba(20, 22, 24, 0.55)",
                      },
                    ]}
                  >
                    <ThemedText
                      style={[
                        styles.tabLabel,
                        { color: active ? "rgba(235, 240, 245, 0.95)" : "rgba(170, 180, 185, 0.6)" },
                      ]}
                    >
                      {tab}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {error ? (
            <ThemedText style={{ color: c.danger, fontSize: 11, marginBottom: 8 }}>
              {error}
            </ThemedText>
          ) : null}

          {visibleInventory.length === 0 ? (
            <ThemedText style={{ color: c.fgSubtle, fontSize: 11, marginTop: 16 }}>
              {activeTab === "hair" ? "No hair items yet." : "You don't own any items yet."}
            </ThemedText>
          ) : (
            <View
              style={[
                styles.frame,
                {
                  width: frameWidth,
                  height: frameHeight,
                  marginLeft: gridLeftMargin > 0 ? 0 : undefined,
                },
              ]}
            >
              {Array.from({ length: GRID_COLS * GRID_ROWS }).map((_, i) => {
                const x = i % GRID_COLS;
                const y = Math.floor(i / GRID_COLS);
                return (
                  <View
                    key={`cell-${x}-${y}`}
                    style={[
                      styles.cell,
                      {
                        left: FRAME_PAD + x * CELL_STEP,
                        top: FRAME_PAD + y * CELL_STEP,
                        width: CELL_PX,
                        height: CELL_PX,
                      },
                    ]}
                  />
                );
              })}

              {visibleInventory
                .filter((inv) => inv.positionX != null && inv.positionY != null)
                .map((inv) => (
                  <InventoryCard
                    key={inv.inventoryId}
                    inv={inv}
                    busy={busyId === inv.inventoryId}
                    dimmed={draggingId != null && draggingId !== inv.inventoryId}
                    isDragging={draggingId === inv.inventoryId}
                    onTap={() => toggle(inv)}
                    onSellRequest={() => onSellRequest(inv)}
                    onDragStart={() => setDraggingId(inv.inventoryId)}
                    onDragEnd={(targetX, targetY) => {
                      setDraggingId(null);
                      return handleMove(inv.inventoryId, targetX, targetY);
                    }}
                  />
                ))}
            </View>
          )}
        </View>
      </ScrollView>

      <InventoryItemMenu
        item={menuItem?.avatarItem ?? null}
        visible={menuItem != null}
        refundPoints={menuItem?.avatarItem ? Math.floor(menuItem.avatarItem.cost * 0.5) : 0}
        busy={menuBusy}
        onSell={confirmSell}
        onCancel={() => { if (!menuBusy) setMenuItem(null); }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  previewWrap: {
    paddingTop: 24,
    paddingBottom: 8,
    alignItems: "center",
  },
  equippedCount: {
    marginTop: 14,
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  sectionHeader: {
    fontSize: 9,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 8,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  shopBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderRadius: 999,
    marginBottom: 6,
  },
  shopBtnLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 1.5 },
  tabBar: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  frame: {
    position: "relative",
    // Brighter than web (0.32 vs 0.18) so 1px grid lines hold at fractional DPRs.
    backgroundColor: "rgba(220, 230, 235, 0.32)",
    borderWidth: 1,
    borderColor: "rgba(220, 230, 235, 0.6)",
  },
  cell: {
    position: "absolute",
    // Cell bg under inset shadow — gives RE4 "recessed pocket" depth.
    backgroundColor: "rgba(28, 30, 32, 0.78)",
    // Inset shadow vignette (RN 0.76+ supports CSS-style inset).
    boxShadow: "inset 0 0 18px rgba(0, 0, 0, 0.55)",
  },
});
