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
  /** SVG node rendered inside the chip. */
  icon: ReactNode;
  /** Tint behind the icon when the chip is pressed; defaults to a muted hover. */
  pressBg?: string;
  onPress: () => void;
}

interface Props {
  actions: SwipeAction[];
  /**
   * Fired after the row's Gesture.Tap recognizes a tap. Receives the touch
   * location relative to the row so consumers can hit-test against interior
   * widgets (e.g. an inline Undo pill) and decide whether to navigate vs.
   * handle the tap locally. Nested GestureDetectors don't reliably win over
   * the row's outer Gesture.Race(pan, tap) — coord-based dispatch is the
   * reliable alternative.
   */
  onTap?: (e: { x: number; y: number }) => void;
  actionWidth?: number;
  backgroundColor?: string;
  children: ReactNode;
  rowId?: string;
  prevId?: string;
  nextId?: string;
  /**
   * Opt-in "full swipe" commit. If provided, swiping the row past
   * `fullSwipeThreshold` (fraction of the row's measured width, default
   * 0.5) and releasing fires this callback and animates the row
   * off-screen — no chip tap required. Used by subtasks to make
   * swipe-far-enough = delete in one motion.
   */
  fullSwipeAction?: () => void;
  fullSwipeThreshold?: number;
  /**
   * Background color the action panel flashes to when swipe progress
   * crosses the full-swipe threshold — visual "release to commit" cue.
   * Only takes effect when `fullSwipeAction` is set. Defaults to the
   * row's danger color from the palette.
   */
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
  // Row width measured via onLayout. Used as the basis for the
  // full-swipe-to-commit threshold (otherwise we'd have no idea what
  // "far enough" means for the row's width). Stored as a shared value so
  // the gesture worklet can read it without bouncing to JS.
  const rowWidth = useSharedValue(0);

  const progress = useDerivedValue(() => {
    "worklet";
    if (panelWidth === 0) return 0;
    const p = -tx.value / panelWidth;
    return Math.max(0, Math.min(1, p));
  }, [panelWidth]);

  // React-side mirror of whether this row is in its committed-open state.
  // The pan's activeOffsetX depends on this — when closed, only LEFT swipes
  // activate the row (so right-swipes fall through to the global drawer);
  // when open, BOTH directions activate so a right-swipe drags the row
  // closed BEFORE the drawer's gesture has a chance to win.
  const [rowOpen, setRowOpen] = useState(false);
  const swipeCtx = useSwipeRow();
  // Pull the stable callbacks out so this effect only re-fires when the row
  // itself changes — not when register/unregister bump the provider's version
  // state. Depending on `swipeCtx` directly caused an infinite loop: every
  // register bumps `version` → new context value identity → effect re-runs →
  // cleanup unregisters → bumps version again → loop.
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

  // When another row opens (openRowId changes to a different id), or when
  // closeAll fires (openRowId → null), auto-close this row if it's open.
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

  // Dynamic axis-activation based on row state:
  //   closed: only LEFT activates  → right-swipes pass to the drawer
  //   open:   BOTH directions       → right-swipe closes the row, winning
  //                                    over the drawer because this gesture
  //                                    is deeper in the tree and activates
  //                                    first (8 px) vs drawer (10 px).
  const pan = Gesture.Pan()
    .activeOffsetX(rowOpen ? [-8, 8] : [-8, 9999])
    .failOffsetY([-12, 12])
    .onStart(() => {
      dragStart.value = tx.value;
    })
    .onUpdate((e) => {
      let next = dragStart.value + e.translationX;
      // Clamp overshoot past 0 — a right-swipe on an open row should bottom
      // out at the closed position without bouncing past.
      if (next > 0) next = 0;
      else if (fullSwipeAction) {
        // Full-swipe mode: let the user drag freely up to the row's
        // measured width (so the swipe-far-enough gesture has somewhere
        // to go). Rubber-banding at panelWidth would fight the gesture
        // and make it feel locked at the chip reveal.
        const w = rowWidth.value;
        if (w > 0 && next < -w) next = -w;
      } else if (next < -panelWidth) {
        next = -panelWidth + rubberBand(next + panelWidth);
      }
      tx.value = next;
    })
    .onEnd(() => {
      // Full-swipe commit (opt-in via fullSwipeAction). If the user
      // dragged past `fullSwipeThreshold` of the row width, slide the
      // row off-screen and fire the action — no chip tap required.
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

  // Full-swipe threshold indicator. When the user has dragged past
  // `fullSwipeThreshold` of the row width, swap the action panel's
  // background from the neutral surfaceDeep to the danger color so the
  // user gets a clear "release to delete" cue. Hard switch (not
  // interpolated) because the actual commit threshold is hard too — a
  // gradient would mislead the user about when the release will fire.
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
    // Wrapper bg fills the area revealed when the row slides left. In
    // full-swipe mode it animates to dangerBg past the threshold so the
    // whole revealed strip (not just the chip's 44px slot) signals
    // "release to commit". Static c.surfaceDeep otherwise — matches the
    // action-panel reveal pattern used by task-list rows.
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
