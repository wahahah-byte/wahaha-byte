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
import { useFocusEffect } from "expo-router";
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
// Inner padding between the dark frame's border and the first/last cell —
// gives the grid a small breathing room from the bright border so the border
// reads as a frame rather than touching the cells directly.
const FRAME_PAD = 1;
// Outer border thickness on the frame. Must be reflected in frameWidth /
// frameHeight below because RN positions absolute children relative to the
// PADDING BOX (inside the border) — so the frame's outer width has to be
// gridWidth + 2·(FRAME_PAD + FRAME_BORDER) for cells at `left: FRAME_PAD …
// FRAME_PAD + gridWidth` to fit inside the padding box without overflowing
// over (and covering) the border on the right and bottom edges.
const FRAME_BORDER = 1;
// 150 ms long-press to start a drag — same as web's TouchSensor activation
// delay so a quick tap goes to equip/unequip and an intentional hold begins
// drag-to-rearrange.
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
  // Items with a valid persisted position go down first so subsequent
  // unplaced rows can't collide with them.
  const placed: Placed[] = [];
  const out: UserInventoryDto[] = new Array(rows.length);

  // Phase 1 — honour rows that already carry a valid position.
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

  // Phase 2 — first-fit scan for everything still missing a slot.
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
      // Hydrate positionX/Y from the mobile-shape backend columns so the
      // rest of the screen (which reads positionX/Y) renders the user's
      // RN layout. Falls back to the desktop column if no mobile coord is
      // stored yet — gives existing users a sane first paint before they
      // rearrange. Writes go to the mobile column via handleMove.
      .map((r) => ({
        ...r,
        avatarItem: applyHints(r.avatarItem!),
        positionX: r.positionXMobile ?? r.positionX ?? null,
        positionY: r.positionYMobile ?? r.positionY ?? null,
      }));
    // Auto-place per tab — hair and equipment share grid coords, so they
    // need separate placement passes.
    const equipRows = hinted.filter((r) => !isHairSlot(r.avatarItem?.slot));
    const hairRows = hinted.filter((r) => isHairSlot(r.avatarItem?.slot));
    const placed = [...autoPlace(equipRows), ...autoPlace(hairRows)];
    setInventory(placed);
    // Persist freshly auto-placed items (those without a stored mobile
    // position) so the layout sticks across reloads.
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
    // Push the new equipped set into the module-level cache so the next
    // detail-modal open renders the chibi instantly with the latest gear.
    equippedCache.revalidate();
  }

  // Drag commit — called from the card on drag end. Returns true when the
  // proposed slot was accepted; the card uses this to decide whether to
  // animate back to its starting position or pin at the new cell.
  const handleMove = useCallback(
    (invId: number, newX: number, newY: number): boolean => {
      const moving = inventory.find((r) => r.inventoryId === invId);
      if (!moving?.avatarItem) return false;
      const size = getItemSize(moving.avatarItem);
      // Same-tab collision check — hair and equipment have independent
      // coordinate spaces so a drop only competes with cards in its own tab.
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
      // Persist to the mobile-shape backend column. Fire-and-forget — local
      // state is already optimistic and rollback on transient API errors
      // would just bounce the card back unexpectedly. A reload will reconcile.
      avatarApi.setPosition(invId, newX, newY, undefined, "mobile").catch(() => {
        // Ignore; the next load() will reflect whatever the server actually has.
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
  // Add 2·border so the cells (positioned in the padding box, inside the
  // border) don't overflow and cover the right/bottom borders.
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
            <ThemedText style={[styles.sectionHeader, { color: c.fgSubtle }]}>
              Inventory {!loading && `(${visibleInventory.length})`}
            </ThemedText>
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

// Hysteresis fraction — matches web's SNAP_HYSTERESIS_FRACTION. The dragged
// card only flips to the next cell once the finger has crossed 70% of the
// cell step from the last snapped position, killing the back-and-forth
// flicker that happens when the finger hovers near a cell boundary.
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

  // Layout is driven by these SharedValues, NOT by React state. This is the
  // only way to avoid a one-frame visual jump on drop: when the drag commits,
  // we update cellX/cellY directly in the gesture's onEnd worklet and the
  // view re-positions atomically on the UI thread. React state (inv.positionX)
  // is updated via runOnJS for collision-detection logic only — when it
  // changes externally (e.g. an unrelated drop displaces this row, or the
  // parent refetches inventory), the useEffect below mirrors it back.
  const cellX = useSharedValue(inv.positionX ?? 0);
  const cellY = useSharedValue(inv.positionY ?? 0);
  // Captured at drag start so onUpdate can derive the delta-cells from the
  // gesture translation without closure-capturing a stale inv.positionX.
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
      // Snap-to-cell during drag with 70% hysteresis: the card only flips to
      // the next cell once the finger crosses 70% of CELL_STEP past the
      // current snapped position. Without it the card flickers between two
      // cells when the finger hovers near a boundary.
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
      // Drop landed on an occupied cell — animate the card back to its
      // original slot. cellX/Y are still at the target position from the
      // drag's onUpdate, so withTiming smoothly returns them.
      cellX.value = withTiming(origX, { duration: 180, easing: Easing.bezier(0.22, 1, 0.36, 1) });
      cellY.value = withTiming(origY, { duration: 180, easing: Easing.bezier(0.22, 1, 0.36, 1) });
    }
    // On accept, cellX/Y is already at target; the React state update from
    // onDragEnd → handleMove will eventually flow through useEffect but the
    // values match what's already on the worklet so it's a no-op visually.
  }

  const tap = Gesture.Tap()
    .maxDistance(DRAG_TAP_TOLERANCE)
    .onEnd(() => {
      "worklet";
      runOnJS(onTap)();
    });

  // Pan + Tap race so a quick press goes to equip and a held press starts
  // drag. Reanimated handles both natively without needing a wrapper.
  const composed = Gesture.Race(pan, tap);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: FRAME_PAD + cellX.value * CELL_STEP },
      { translateY: FRAME_PAD + cellY.value * CELL_STEP },
    ],
  }));

  // Each layer's transform mirrors the chosen card transform. translate
  // percentages convert to px against the card box.
  const tx = (t.translateXPercent / 100) * w;
  const ty = (t.translateYPercent / 100) * h;

  // Drag visual — bright yellow accent tint (active-highlight) on the
  // moving card, matching web's `var(--color-active-highlight-bg)` fill +
  // 2 px inset border. Drives via React props since these are static
  // per-render (dragging state changes via React state, not worklet).
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
            // Lift the dragged card above its neighbours so its drag-yellow
            // border doesn't get clipped by adjacent cards. Static zIndex
            // here (not in the animated style) keeps the render order stable.
            zIndex: isDragging ? 10 : 1,
            elevation: isDragging ? 10 : 0,
          },
          cardStyle,
        ]}
      >
        {/* Each layer is a View with explicit pixel dimensions matching the
            card, and the transform applied to the View. The Image inside
            fills the View with resizeMode="contain". This keeps RN's
            transform composition predictable — applying transform directly
            to <Image> can interact unevenly with Image's intrinsic-size
            handling on some RN versions, leaving the sprite uncentered
            even when the math is right. */}
        {hasSecondary && !secondaryInFront ? (
          <LayerImage uri={item.secondaryAssetUrl!} w={w} h={h} tx={tx} ty={ty} scale={t.scale} />
        ) : null}
        <LayerImage uri={item.previewAssetUrl!} w={w} h={h} tx={tx} ty={ty} scale={t.scale} />
        {hasSecondary && secondaryInFront ? (
          <LayerImage uri={item.secondaryAssetUrl!} w={w} h={h} tx={tx} ty={ty} scale={t.scale} />
        ) : null}

        {inv.isEquipped ? (
          <View style={styles.equippedDot} />
        ) : null}
      </Animated.View>
    </GestureDetector>
  );
}

// Renders a single item layer by pre-computing the final absolute position
// and pixel dimensions of the (scaled) Image — equivalent to applying
// `transform: scale(s) translate(tx%, ty%)` in CSS, but expressed as
// position + size so RN's layout pipeline handles it unambiguously.
//
// Math — CSS `transform: scale(s) translate(tx, ty)` with transform-origin
// at the element centre produces the matrix M = S × T:
//
//   [ s  0  s·tx ]
//   [ 0  s  s·ty ]
//   [ 0  0   1   ]
//
// Note the `s·` factor on the translate: with the scale applied AFTER
// translate, the px-distance of the visual shift is multiplied by `s`.
// For w=56, scale=1.7, ty=22%, the translate y in screen px is
// 22%×56×1.7 = 20.94 — NOT 22%×56 = 12.32 (which is what an earlier
// version of this code computed). Hats/capes/shoes look correctly
// centred only when the *s multiplier is included.
//
// Top-left of the transformed box:
//   left = (w − scaledW) / 2 + tx · scale
//   top  = (h − scaledH) / 2 + ty · scale
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
    // Brighter than web's 0.18 so the 1 px CELL_GAP between cells reads
    // reliably as a grid line at all device pixel ratios — at fractional
    // zooms the gap can sub-pixel out and disappear if the frame fill is
    // too close to the cell fill in luminance.
    backgroundColor: "rgba(220, 230, 235, 0.32)",
    borderWidth: 1,
    borderColor: "rgba(220, 230, 235, 0.6)",
  },
  cell: {
    position: "absolute",
    // Background sits between the brighter frame fill and the inset shadow
    // — closer to web's 0.65 alpha so the inset vignette has something to
    // darken (a fully-opaque cell would absorb the shadow). The shadow is
    // what gives the RE4 attaché-case "recessed pocket" depth.
    backgroundColor: "rgba(28, 30, 32, 0.78)",
    // Web uses `boxShadow: "inset 0 0 18px rgba(0, 0, 0, 0.55)"` on its
    // .re-cell. RN supports the same CSS-style shorthand (including
    // `inset`) since 0.76 — produces an identical radial darken-from-edges
    // vignette inside each pocket.
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
