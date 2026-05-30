import { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { getItemSize, resolveCardTransform, type UserInventoryDto } from "@wahaha/shared";
import { ItemLayers } from "@/components/item-layers";
import {
  CELL_GAP,
  CELL_PX,
  CELL_STEP,
  DRAG_TAP_TOLERANCE,
  FRAME_PAD,
  GRID_COLS,
  GRID_ROWS,
  LONG_PRESS_MS,
} from "@/lib/avatar-grid";

interface InventoryCardProps {
  inv: UserInventoryDto;
  busy: boolean;
  dimmed: boolean;
  isDragging: boolean;
  onTap: () => void;
  // Long-press without dragging — opens the sell-back confirm.
  onSellRequest: () => void;
  onDragStart: () => void;
  onDragEnd: (targetX: number, targetY: number) => boolean;
}

// 70% snap-hysteresis to kill boundary flicker during drag.
const SNAP_HYSTERESIS = CELL_STEP * 0.7;

export function InventoryCard({ inv, busy, dimmed, isDragging, onTap, onSellRequest, onDragStart, onDragEnd }: InventoryCardProps) {
  const item = inv.avatarItem!;
  const size = getItemSize(item);
  const cols = size.cols;
  const rows = size.rows;
  const w = cols * CELL_PX + (cols - 1) * CELL_GAP;
  const h = rows * CELL_PX + (rows - 1) * CELL_GAP;

  const hasSecondary = !!item.secondaryAssetUrl;
  const t = resolveCardTransform(item, { cols: size.cols, rows: size.rows, isTwoLayer: hasSecondary });

  // SharedValue-driven layout; avoids one-frame jump on drop.
  const cellX = useSharedValue(inv.positionX ?? 0);
  const cellY = useSharedValue(inv.positionY ?? 0);
  // Captured at drag start so onUpdate doesn't closure stale state.
  const dragStartX = useSharedValue(inv.positionX ?? 0);
  const dragStartY = useSharedValue(inv.positionY ?? 0);
  // Flips true the moment a drag actually moves the finger past a small threshold.
  // If a long-press fires + ends without movement, we treat that as a sell request.
  const dragMoved = useSharedValue(false);
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
      dragMoved.value = false;
      runOnJS(onDragStart)();
    })
    .onUpdate((e) => {
      "worklet";
      // Anything beyond a small jitter counts as a real drag — anything below = stationary long-press.
      if (!dragMoved.value && (Math.abs(e.translationX) > 4 || Math.abs(e.translationY) > 4)) {
        dragMoved.value = true;
      }
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
      // Long-press without movement = sell intent. Bail out of the drop logic so we don't
      // accidentally persist a no-op move + fire the parent's "dropped at origin" handler.
      if (!dragMoved.value) {
        runOnJS(onSellRequest)();
        return;
      }
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
        <ItemLayers item={item} renderImage={(uri, key) => (
          <LayerImage key={key} uri={uri} w={w} h={h} tx={tx} ty={ty} scale={t.scale} />
        )} />

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
