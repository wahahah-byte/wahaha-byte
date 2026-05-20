import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  applyHints,
  getItemSize,
  isHairSlot,
  isWeaponSlot,
  resolveCardTransform,
  type AvatarItemDto,
  type UserInventoryDto,
} from "@wahaha/shared";

import { avatarApi } from "@/lib/api";
import { bustedAssetUrl } from "@/lib/avatar-asset";
import { equippedCache } from "@/lib/equipped-cache";
import { ChibiAvatar } from "@/components/chibi-avatar";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";

const GRID_COLS = 5;
const GRID_ROWS = 7;
const CELL_PX = 56;
const CELL_GAP = 1;
const CELL_STEP = CELL_PX + CELL_GAP;
// Inner padding between frame border and first/last cell.
const FRAME_PAD = 1;
// Outer border thickness; frame width sums FRAME_PAD + FRAME_BORDER.
const FRAME_BORDER = 1;
// 150ms long-press starts drag (tap=equip, hold=drag).
const LONG_PRESS_MS = 150;
const DRAG_TAP_TOLERANCE = 8;

type Tab = "equipment" | "hair";

type Placed = { positionX: number; positionY: number; cols: number; rows: number };

function rectFits(
  placed: Placed[],
  x: number,
  y: number,
  cols: number,
  rows: number,
): boolean {
  if (x < 0 || y < 0 || x + cols > GRID_COLS || y + rows > GRID_ROWS) return false;
  for (const p of placed) {
    const overlap =
      x < p.positionX + p.cols
      && x + cols > p.positionX
      && y < p.positionY + p.rows
      && y + rows > p.positionY;
    if (overlap) return false;
  }
  return true;
}

function autoPlace(rows: UserInventoryDto[]): UserInventoryDto[] {
  // Persisted positions go down first to avoid collisions.
  const placed: Placed[] = [];
  const out: UserInventoryDto[] = new Array(rows.length);

  // Phase 1: honour rows with valid stored position.
  rows.forEach((row, idx) => {
    if (!row.avatarItem) { out[idx] = row; return; }
    const size = getItemSize(row.avatarItem);
    if (
      row.positionX != null
      && row.positionY != null
      && rectFits(placed, row.positionX, row.positionY, size.cols, size.rows)
    ) {
      placed.push({ positionX: row.positionX, positionY: row.positionY, cols: size.cols, rows: size.rows });
      out[idx] = row;
    }
  });

  // Phase 2: first-fit scan for missing slots.
  rows.forEach((row, idx) => {
    if (out[idx] || !row.avatarItem) return;
    const size = getItemSize(row.avatarItem);
    let assigned: { x: number; y: number } | null = null;
    outer: for (let y = 0; y < GRID_ROWS; y++) {
      for (let x = 0; x < GRID_COLS; x++) {
        if (rectFits(placed, x, y, size.cols, size.rows)) {
          assigned = { x, y };
          break outer;
        }
      }
    }
    if (assigned) {
      placed.push({ positionX: assigned.x, positionY: assigned.y, cols: size.cols, rows: size.rows });
      out[idx] = { ...row, positionX: assigned.x, positionY: assigned.y };
    } else {
      out[idx] = { ...row, positionX: null, positionY: null };
    }
  });
  return out;
}

export default function AvatarScreen() {
  const c = useColors();
  const { width: screenW } = useWindowDimensions();
  const [inventory, setInventory] = useState<UserInventoryDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("equipment");
  const [draggingId, setDraggingId] = useState<number | null>(null);

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
    const placed = [...autoPlace(equipRows), ...autoPlace(hairRows)];
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
    const nextEquipped = !inv.isEquipped;
    setInventory((prev) =>
      prev.map((r) => {
        if (r.inventoryId === inv.inventoryId) return { ...r, isEquipped: nextEquipped };
        if (!nextEquipped) return r;
        const rSlot = r.avatarItem?.slot;
        if (isWeapon && rSlot && isWeaponSlot(rSlot)) return { ...r, isEquipped: false };
        if (!isWeapon && r.isEquipped && rSlot === slot) return { ...r, isEquipped: false };
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
      if (!rectFits(placed, newX, newY, size.cols, size.rows)) return false;
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
    </ThemedView>
  );
}

interface InventoryCardProps {
  inv: UserInventoryDto;
  busy: boolean;
  dimmed: boolean;
  isDragging: boolean;
  onTap: () => void;
  onDragStart: () => void;
  onDragEnd: (targetX: number, targetY: number) => boolean;
}

// 70% snap-hysteresis to kill boundary flicker during drag.
const SNAP_HYSTERESIS = CELL_STEP * 0.7;

function InventoryCard({ inv, busy, dimmed, isDragging, onTap, onDragStart, onDragEnd }: InventoryCardProps) {
  const item = inv.avatarItem!;
  const size = getItemSize(item);
  const cols = size.cols;
  const rows = size.rows;
  const w = cols * CELL_PX + (cols - 1) * CELL_GAP;
  const h = rows * CELL_PX + (rows - 1) * CELL_GAP;

  const hasSecondary = !!item.secondaryAssetUrl;
  const secondaryInFront = item.slot === "CAPE";
  const t = resolveCardTransform(item, { cols: size.cols, rows: size.rows, isTwoLayer: hasSecondary });

  // SharedValue-driven layout; avoids one-frame jump on drop.
  const cellX = useSharedValue(inv.positionX ?? 0);
  const cellY = useSharedValue(inv.positionY ?? 0);
  // Captured at drag start so onUpdate doesn't closure stale state.
  const dragStartX = useSharedValue(inv.positionX ?? 0);
  const dragStartY = useSharedValue(inv.positionY ?? 0);
  useEffect(() => {
    cellX.value = inv.positionX ?? 0;
    cellY.value = inv.positionY ?? 0;
  }, [inv.positionX, inv.positionY, cellX, cellY]);

  const pan = Gesture.Pan()
    .activateAfterLongPress(LONG_PRESS_MS)
    .onStart(() => {
      "worklet";
      dragStartX.value = cellX.value;
      dragStartY.value = cellY.value;
      runOnJS(onDragStart)();
    })
    .onUpdate((e) => {
      "worklet";
      // Snap-to-cell with 70% hysteresis.
      const curDCol = cellX.value - dragStartX.value;
      const curDRow = cellY.value - dragStartY.value;
      let dCol = curDCol;
      let dRow = curDRow;
      if (Math.abs(e.translationX - curDCol * CELL_STEP) >= SNAP_HYSTERESIS) {
        dCol = Math.round(e.translationX / CELL_STEP);
      }
      if (Math.abs(e.translationY - curDRow * CELL_STEP) >= SNAP_HYSTERESIS) {
        dRow = Math.round(e.translationY / CELL_STEP);
      }
      // Clamp to grid bounds.
      const minDCol = -dragStartX.value;
      const maxDCol = GRID_COLS - dragStartX.value - cols;
      const minDRow = -dragStartY.value;
      const maxDRow = GRID_ROWS - dragStartY.value - rows;
      dCol = Math.max(minDCol, Math.min(maxDCol, dCol));
      dRow = Math.max(minDRow, Math.min(maxDRow, dRow));
      cellX.value = dragStartX.value + dCol;
      cellY.value = dragStartY.value + dRow;
    })
    .onEnd(() => {
      "worklet";
      const targetX = cellX.value;
      const targetY = cellY.value;
      const origX = dragStartX.value;
      const origY = dragStartY.value;
      runOnJS(handleDropEnd)(targetX, targetY, origX, origY);
    });

  function handleDropEnd(targetX: number, targetY: number, origX: number, origY: number) {
    const accepted = onDragEnd(targetX, targetY);
    if (!accepted) {
      // Animate back to origin on rejected drop.
      cellX.value = withTiming(origX, { duration: 180, easing: Easing.bezier(0.22, 1, 0.36, 1) });
      cellY.value = withTiming(origY, { duration: 180, easing: Easing.bezier(0.22, 1, 0.36, 1) });
    }
    // On accept, cellX/Y is already at target; useEffect mirror is a no-op.
  }

  const tap = Gesture.Tap()
    .maxDistance(DRAG_TAP_TOLERANCE)
    .onEnd(() => {
      "worklet";
      runOnJS(onTap)();
    });

  // Race pan + tap: quick press = equip, held press = drag.
  const composed = Gesture.Race(pan, tap);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: FRAME_PAD + cellX.value * CELL_STEP },
      { translateY: FRAME_PAD + cellY.value * CELL_STEP },
    ],
  }));

  // Per-layer transform; translate % → px against card box.
  const tx = (t.translateXPercent / 100) * w;
  const ty = (t.translateYPercent / 100) * h;

  // Drag visual — active-highlight bg + 2px inset border.
  const bg = isDragging
    ? "rgba(243, 236, 206, 0.18)"
    : inv.isEquipped
      ? "rgba(48, 52, 56, 0.85)"
      : "rgba(28, 30, 32, 0.85)";
  const borderColor = isDragging
    ? "rgba(243, 236, 206, 0.85)"
    : inv.isEquipped
      ? "rgba(230, 235, 240, 0.9)"
      : "transparent";
  const borderWidth = isDragging ? 2 : inv.isEquipped ? 1 : 0;

  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[
          styles.card,
          {
            width: w,
            height: h,
            backgroundColor: bg,
            borderColor,
            borderWidth,
            opacity: busy ? 0.5 : dimmed ? 0.35 : 1,
            // Lift dragged card so its border isn't clipped by neighbours.
            zIndex: isDragging ? 10 : 1,
            elevation: isDragging ? 10 : 0,
          },
          cardStyle,
        ]}
      >
        {/* View-on-View layers so RN transform composition stays predictable. */}
        {hasSecondary && !secondaryInFront ? (
          <LayerImage uri={bustedAssetUrl(item, item.secondaryAssetUrl)!} w={w} h={h} tx={tx} ty={ty} scale={t.scale} />
        ) : null}
        <LayerImage uri={bustedAssetUrl(item, item.previewAssetUrl)!} w={w} h={h} tx={tx} ty={ty} scale={t.scale} />
        {hasSecondary && secondaryInFront ? (
          <LayerImage uri={bustedAssetUrl(item, item.secondaryAssetUrl)!} w={w} h={h} tx={tx} ty={ty} scale={t.scale} />
        ) : null}

        {inv.isEquipped ? (
          <View style={styles.equippedDot} />
        ) : null}
      </Animated.View>
    </GestureDetector>
  );
}

// Layer image with pre-computed left/top/scaled-size; equivalent to CSS scale+translate.
function LayerImage({
  uri,
  w,
  h,
  tx,
  ty,
  scale,
}: {
  uri: string;
  w: number;
  h: number;
  tx: number;
  ty: number;
  scale: number;
}) {
  const scaledW = w * scale;
  const scaledH = h * scale;
  const left = (w - scaledW) / 2 + tx * scale;
  const top = (h - scaledH) / 2 + ty * scale;
  return (
    <Image
      source={{ uri }}
      style={{
        position: "absolute",
        left,
        top,
        width: scaledW,
        height: scaledH,
      }}
      resizeMode="contain"
    />
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
  card: {
    position: "absolute",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    padding: 0,
  },
  equippedDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(235, 240, 245, 0.95)",
    boxShadow: "0px 0px 3px rgba(235, 240, 245, 0.7)",
  },
});
