import { useEffect, useState, type ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { useColors } from "@/hooks/use-colors";
import { useSwipeRow } from "@/components/swipe-row-context";

export interface SwipeAction {
  key: string;
  // SVG node rendered inside the chip.
  icon: ReactNode;
  // Tint behind icon on press (default muted hover).
  pressBg?: string;
  onPress: () => void;
}

interface Props {
  actions: SwipeAction[];
  // Tap callback with row-relative coords for interior hit-testing.
  onTap?: (e: { x: number; y: number }) => void;
  actionWidth?: number;
  backgroundColor?: string;
  children: ReactNode;
  rowId?: string;
  prevId?: string;
  nextId?: string;
  // Opt-in swipe-past-threshold commit (default 0.5 of row width).
  fullSwipeAction?: () => void;
  fullSwipeThreshold?: number;
  // Bg color flash when past full-swipe threshold (default danger).
  fullSwipeColor?: string;
}

const COMMIT_RATIO = 0.5;
const RUBBER_C = 60;
const OPEN_CORNER = 6;
const NEIGHBOR_CORNER = 10;
const CHIP_SIZE = 28;
const DEFAULT_FULL_SWIPE_THRESHOLD = 0.5;

export function SwipeableRow({
  actions,
  onTap,
  actionWidth = 44,
  backgroundColor,
  children,
  rowId,
  prevId,
  nextId,
  fullSwipeAction,
  fullSwipeThreshold = DEFAULT_FULL_SWIPE_THRESHOLD,
  fullSwipeColor,
}: Props) {
  const c = useColors();
  const bg = backgroundColor ?? c.surface;
  const panelWidth = actions.length * actionWidth;
  const tx = useSharedValue(0);
  const dragStart = useSharedValue(0);
  // Row width via onLayout; shared value so worklet reads without JS bounce.
  const rowWidth = useSharedValue(0);

  const progress = useDerivedValue(() => {
    "worklet";
    if (panelWidth === 0) return 0;
    const p = -tx.value / panelWidth;
    return Math.max(0, Math.min(1, p));
  }, [panelWidth]);

  // React mirror of committed-open state; closed=left-only, open=both.
  const [rowOpen, setRowOpen] = useState(false);
  const swipeCtx = useSwipeRow();
  // Pull stable callbacks to avoid version-bump infinite loop.
  const register = swipeCtx?.register;
  const unregister = swipeCtx?.unregister;
  useEffect(() => {
    if (!register || !unregister || !rowId) return;
    register(rowId, progress);
    return () => unregister(rowId);
  }, [register, unregister, rowId, progress]);

  const prevProgress = swipeCtx?.get(prevId) ?? null;
  const nextProgress = swipeCtx?.get(nextId) ?? null;
  const openRowId = swipeCtx?.openRowId ?? null;

  // Snap closed whenever this row's identity changes (e.g. the SectionList cell
  // is reused for a different task) and, on unmount-while-open (e.g. the row is
  // archived/removed straight out of an open swipe), release the shared open
  // flag so a re-mounted or neighbouring row can't inherit a stale "open".
  useEffect(() => {
    tx.value = 0;
    setRowOpen(false);
    return () => {
      if (openRowId && openRowId.value === rowId) openRowId.value = null;
    };
  }, [rowId, tx, openRowId]);

  // Auto-close when another row opens or closeAll fires.
  useAnimatedReaction(
    () => openRowId?.value ?? null,
    (current) => {
      if (current !== rowId && tx.value < 0) {
        tx.value = withTiming(0, { duration: 220, easing: Easing.bezier(0.2, 0, 0, 1) });
        runOnJS(setRowOpen)(false);
      }
    },
    [rowId]
  );

  function rubberBand(x: number): number {
    "worklet";
    const abs = Math.abs(x);
    return (Math.sign(x) * (abs * RUBBER_C)) / (abs + RUBBER_C);
  }

  // Dynamic axis: closed=left-only (right falls to drawer), open=both.
  const pan = Gesture.Pan()
    .activeOffsetX(rowOpen ? [-8, 8] : [-8, 9999])
    .failOffsetY([-12, 12])
    .onStart(() => {
      dragStart.value = tx.value;
    })
    .onUpdate((e) => {
      let next = dragStart.value + e.translationX;
      // Clamp overshoot past 0 — right-swipe on open row stops at closed.
      if (next > 0) next = 0;
      else if (fullSwipeAction) {
        // Full-swipe mode: drag freely up to row width.
        const w = rowWidth.value;
        if (w > 0 && next < -w) next = -w;
      } else if (next < -panelWidth) {
        next = -panelWidth + rubberBand(next + panelWidth);
      }
      tx.value = next;
    })
    .onEnd(() => {
      // Full-swipe commit — past threshold slides row off-screen + fires action.
      const w = rowWidth.value;
      if (fullSwipeAction && w > 0 && tx.value < -w * fullSwipeThreshold) {
        tx.value = withTiming(
          -w,
          { duration: 200, easing: Easing.bezier(0.2, 0, 0, 1) },
          (finished) => {
            if (finished) runOnJS(fullSwipeAction)();
          },
        );
        if (openRowId && rowId && openRowId.value === rowId) {
          openRowId.value = null;
        }
        runOnJS(setRowOpen)(false);
        return;
      }
      const open = tx.value < -panelWidth * COMMIT_RATIO;
      tx.value = withTiming(open ? -panelWidth : 0, {
        duration: 220,
        easing: Easing.bezier(0.2, 0, 0, 1),
      });
      if (openRowId && rowId) {
        if (open) {
          openRowId.value = rowId;
        } else if (openRowId.value === rowId) {
          openRowId.value = null;
        }
      }
      runOnJS(setRowOpen)(open);
    });

  const tap = Gesture.Tap()
    .maxDistance(8)
    .onEnd((e) => {
      if (tx.value < -8) {
        tx.value = withTiming(0, { duration: 220, easing: Easing.bezier(0.2, 0, 0, 1) });
        runOnJS(setRowOpen)(false);
        return;
      }
      if (onTap) runOnJS(onTap)({ x: e.x, y: e.y });
    });

  const composed = Gesture.Race(pan, tap);

  const rowStyle = useAnimatedStyle(() => {
    const my = progress.value;
    const prev = prevProgress?.value ?? 0;
    const next = nextProgress?.value ?? 0;
    return {
      transform: [{ translateX: tx.value }],
      borderTopRightRadius: OPEN_CORNER * my + NEIGHBOR_CORNER * prev,
      borderBottomRightRadius: OPEN_CORNER * my + NEIGHBOR_CORNER * next,
    };
  });

  // Hard-switch action panel bg to danger past threshold (matches hard commit).
  const dangerBg = fullSwipeColor ?? c.danger;
  const actionsPanelStyle = useAnimatedStyle(() => {
    if (!fullSwipeAction) return { backgroundColor: c.surfaceDeep };
    const w = rowWidth.value;
    const pastThreshold =
      w > 0 && tx.value < -w * fullSwipeThreshold;
    return {
      backgroundColor: pastThreshold ? dangerBg : c.surfaceDeep,
    };
  }, [fullSwipeAction, fullSwipeThreshold, c.surfaceDeep, dangerBg]);

  function handleAction(action: SwipeAction) {
    tx.value = withTiming(0, { duration: 220, easing: Easing.bezier(0.2, 0, 0, 1) });
    if (openRowId && rowId && openRowId.value === rowId) openRowId.value = null;
    setRowOpen(false);
    action.onPress();
  }

  return (
    // Wrapper bg fills slide-reveal area; flashes danger in full-swipe mode.
    <Animated.View
      style={[styles.wrapper, actionsPanelStyle]}
      onLayout={(e) => {
        rowWidth.value = e.nativeEvent.layout.width;
      }}
    >
      <View style={[styles.actionsRow, { width: panelWidth }]}>
        {actions.map((action) => (
          <Pressable
            key={action.key}
            onPress={() => handleAction(action)}
            style={[styles.actionBtn, { width: actionWidth }]}
          >
            {({ pressed }) => (
              <>
                <View
                  style={[
                    styles.chip,
                    {
                      backgroundColor: pressed
                        ? action.pressBg ?? c.surfaceHover
                        : c.surface,
                    },
                  ]}
                />
                <View style={styles.iconWrap}>{action.icon}</View>
              </>
            )}
          </Pressable>
        ))}
      </View>

      <GestureDetector gesture={composed}>
        <Animated.View style={[{ backgroundColor: bg, overflow: "hidden" }, rowStyle]}>
          <View style={{ pointerEvents: "none" }}>{children}</View>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: { position: "relative" },
  actionsRow: {
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    flexDirection: "row",
  },
  actionBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  chip: {
    position: "absolute",
    width: CHIP_SIZE,
    height: CHIP_SIZE,
    borderRadius: CHIP_SIZE / 2,
    top: "50%",
    left: "50%",
    marginTop: -CHIP_SIZE / 2,
    marginLeft: -CHIP_SIZE / 2,
  },
  iconWrap: { zIndex: 1 },
});
