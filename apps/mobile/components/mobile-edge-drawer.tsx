import { useCallback, useEffect, useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { router, usePathname } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Circle, Path, Line, Polyline, Rect } from "react-native-svg";

import { REGULAR_CAP, RECURRING_CAP, type UserProfile } from "@wahaha/shared";
import { clearToken, getToken, usersApi } from "@/lib/api";
import { useTheme } from "@/context/theme-context";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

const DRAWER_WIDTH = 220;
// Lower commit fraction = less drag needed before the gesture snaps open.
// At 0.25, a ~55 px horizontal swipe is enough to commit, vs the previous
// ~110 px (0.5).
const COMMIT_FRACTION = 0.25;
// Above this end-velocity (px/s) the gesture commits regardless of position,
// so a quick flick reliably opens or closes the drawer.
const COMMIT_VELOCITY = 600;
// Bottom region that should NOT initiate a drawer-open swipe — matches the
// FilterStrip (28) + MobileActionBar (56) + handle (~12) so a touch on the
// filter strip or its handle never opens the drawer. The action bar / strip
// own their own pan gestures and would compete poorly with the drawer's.
const BOTTOM_EXCLUSION_PX = 96;

const ITEMS: { route: "/" | "/recurring" | "/archive" | "/settings"; label: string }[] = [
  { route: "/", label: "To Do" },
  { route: "/recurring", label: "Routines" },
  { route: "/archive", label: "Archive" },
  { route: "/settings", label: "Settings" },
];

interface Props {
  children: React.ReactNode;
}

export function MobileEdgeDrawer({ children }: Props) {
  const c = useColors();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { height: screenH } = useWindowDimensions();

  const [hasToken, setHasToken] = useState(false);
  const [open, setOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [me, setMe] = useState<UserProfile | null>(null);

  // Refresh user identity + balance when drawer opens or the user navigates.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const token = await getToken();
      if (cancelled) return;
      setHasToken(!!token);
      if (!token) {
        setMe(null);
        return;
      }
      const res = await usersApi.getMe();
      if (cancelled) return;
      if (res.data) setMe(res.data);
    })();
    return () => { cancelled = true; };
  }, [pathname, open]);

  useEffect(() => {
    if (!open) setAccountMenuOpen(false);
  }, [open]);

  // dragX is the CONTENT layer's translateX — single source of truth for
  // both the content slide and the backdrop opacity. The drawer panel sits
  // stationary behind the content; opening drags the content to the right
  // to reveal the panel. Range: 0 (closed) → DRAWER_WIDTH (open).
  //
  // We deliberately do NOT use a "null sentinel + fall back to React `open`"
  // pattern — that races against React commits when the release-animation
  // finishes, since the worklet may read the stale `open` for one frame.
  const dragX = useSharedValue(0);
  // Captured at gesture start so we know whether to add or subtract from baseline.
  const startedOpen = useSharedValue(false);
  // True if the touch began in the bottom exclusion band (filter strip / action
  // bar). Set in onStart; respected by onUpdate so a touch that began there
  // doesn't drag the drawer even if the finger moves up.
  const blocked = useSharedValue(false);

  const commit = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
  }, []);

  // Sync dragX whenever `open` changes from outside the drag (nav links,
  // backdrop tap, mount, etc.). The drag handler also animates dragX
  // directly so the explicit setOpen → effect chain only matters for
  // non-gesture transitions.
  useEffect(() => {
    dragX.value = withTiming(open ? DRAWER_WIDTH : 0, {
      duration: 220,
      easing: Easing.bezier(0.2, 0, 0, 1),
    });
  }, [open, dragX]);

  // Disable the drawer's edge-pan entirely when a transparent-modal route is
  // open. The modal owns the whole screen visually; letting the drawer's pan
  // compete eats taps on Pressables inside the sheet (only the title TextInput
  // still worked, because native focus handling bypasses the JS responder).
  const modalRouteOpen =
    pathname.startsWith("/task/") || pathname.startsWith("/new-task");

  const pan = Gesture.Pan()
    .enabled(!modalRouteOpen)
    // Only activate after 10px of horizontal motion — keeps the gesture out
    // of vertical-scroll territory and lets child pans (filter strip, row
    // swipes) activate first since they trigger at 8px.
    .activeOffsetX([-10, 10])
    .failOffsetY([-12, 12])
    .onStart((e) => {
      "worklet";
      startedOpen.value = open;
      // e.y is touch-Y relative to the gesture detector's frame. Since the
      // detector wraps the full screen, this is effectively screen-Y.
      blocked.value = (screenH - e.y) < BOTTOM_EXCLUSION_PX;
    })
    .onUpdate((e) => {
      "worklet";
      if (blocked.value) return;
      const base = startedOpen.value ? DRAWER_WIDTH : 0;
      const next = Math.max(0, Math.min(DRAWER_WIDTH, base + e.translationX));
      dragX.value = next;
    })
    .onEnd((e) => {
      "worklet";
      if (blocked.value) {
        blocked.value = false;
        // Snap back to wherever `open` says we should be — handles cases
        // where the touch jittered enough to register a small drag.
        dragX.value = withTiming(startedOpen.value ? DRAWER_WIDTH : 0, {
          duration: 220,
          easing: Easing.bezier(0.2, 0, 0, 1),
        });
        return;
      }
      const current = dragX.value;
      // Velocity-first commit: a quick flick should decide the outcome even
      // if the user didn't drag past the position threshold. Position is the
      // fallback when the release is slow.
      let nextOpen = startedOpen.value;
      if (e.velocityX > COMMIT_VELOCITY) nextOpen = true;
      else if (e.velocityX < -COMMIT_VELOCITY) nextOpen = false;
      else if (startedOpen.value) {
        if (current < DRAWER_WIDTH * (1 - COMMIT_FRACTION)) nextOpen = false;
      } else {
        if (current > DRAWER_WIDTH * COMMIT_FRACTION) nextOpen = true;
      }
      // Always animate to the snapped position from dragX's current
      // position. dragX stays the source of truth all the way through —
      // no null sentinel, no last-frame fallback to React state.
      dragX.value = withTiming(nextOpen ? DRAWER_WIDTH : 0, {
        duration: 220,
        easing: Easing.bezier(0.2, 0, 0, 1),
      });
      if (nextOpen !== startedOpen.value) runOnJS(commit)(nextOpen);
    });

  const contentStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: dragX.value }] };
  });

  const backdropStyle = useAnimatedStyle(() => {
    const fraction = dragX.value / DRAWER_WIDTH;
    return {
      opacity: 0.4 * fraction,
      // Pointer-events: backdrop is interactive only when at least partially
      // visible. When fully closed (fraction=0) the View is still rendered to
      // avoid layout thrash; we just disable hit-testing.
    };
  });

  const goAndClose = useCallback((href: string) => {
    setAccountMenuOpen(false);
    // Push first, close second — gives the new screen a frame to mount
    // and paint its background before the drawer's close animation
    // exposes it. The previous order (close → push) put the screen's
    // first paint and the drawer's reveal on the same frame, which
    // showed a brief flash of the underlying card colour on the side.
    router.push(href as never);
    setOpen(false);
  }, []);

  return (
    <GestureDetector gesture={pan}>
      <View style={{ flex: 1 }}>
        {/* Drawer panel — stationary, full-height, anchored at the left.
            Rendered FIRST so it sits behind the content layer; revealed
            when the content slides right. No animated transform — the
            slide effect comes from translating the content layer instead. */}
        <View
          style={[
            styles.panel,
            {
              width: DRAWER_WIDTH,
              backgroundColor: c.header,
              borderRightColor: c.borderSoft,
              paddingTop: 12 + insets.top,
              paddingBottom: 8 + insets.bottom,
            },
          ]}
        >
          <View style={{ marginTop: "auto" }}>
            {/* Avatar link only when not signed in (matches web's pattern). */}
            {!hasToken ? (
              <NavRow
                label="Avatar"
                active={pathname === "/avatar"}
                onPress={() => goAndClose("/avatar")}
                icon={<AvatarIcon color={pathname === "/avatar" ? c.activeHighlight : c.fgMuted} />}
                c={c}
              />
            ) : null}

            {ITEMS.map((item) => {
              const active = pathname === item.route;
              return (
                <NavRow
                  key={item.route}
                  label={item.label}
                  active={active}
                  onPress={() => goAndClose(item.route)}
                  icon={
                    item.label === "To Do" ? <TasksIcon color={active ? c.activeHighlight : c.fgMuted} />
                    : item.label === "Routines" ? <RecurringIcon color={active ? c.activeHighlight : c.fgMuted} />
                    : item.label === "Archive" ? <ArchiveIcon color={active ? c.activeHighlight : c.fgMuted} />
                    : <SettingsIcon color={active ? c.activeHighlight : c.fgMuted} />
                  }
                  c={c}
                />
              );
            })}

            {hasToken && me ? (() => {
              const regSubmitted = Math.min(
                me.pointsSubmittedToday - me.recurringPointsSubmittedToday,
                REGULAR_CAP,
              );
              const recSubmitted = Math.min(me.recurringPointsSubmittedToday, RECURRING_CAP);
              const regPct = Math.round((Math.max(0, regSubmitted) / REGULAR_CAP) * 100);
              const recPct = Math.round((Math.max(0, recSubmitted) / RECURRING_CAP) * 100);
              return (
                <View style={[styles.capsBlock, { borderTopColor: c.borderSoft }]}>
                  <View style={styles.capsHeader}>
                    <ThemedText style={[styles.capsHeaderLabel, { color: c.fgSubtle }]}>Points</ThemedText>
                    <ThemedText style={{ fontSize: 12, fontWeight: "600", color: c.fg }}>
                      {me.currentBalance.toLocaleString()}
                    </ThemedText>
                  </View>
                  <CapBar
                    label="Regular"
                    cur={Math.max(0, regSubmitted)}
                    cap={REGULAR_CAP}
                    pct={regPct}
                    capped={regSubmitted >= REGULAR_CAP}
                    fill={regSubmitted >= REGULAR_CAP ? c.success : regPct >= 75 ? c.warning : c.activeHighlight}
                    track={c.track}
                    c={c}
                  />
                  <CapBar
                    label="Routines"
                    cur={Math.max(0, recSubmitted)}
                    cap={RECURRING_CAP}
                    pct={recPct}
                    capped={recSubmitted >= RECURRING_CAP}
                    fill={recSubmitted >= RECURRING_CAP ? c.success : recPct >= 75 ? c.warning : c.activeHighlightAlt}
                    track={c.track}
                    c={c}
                  />
                </View>
              );
            })() : null}

            {/* User row */}
            <View style={[styles.userRow, { borderTopColor: c.borderSoft }]}>
              <Pressable
                onPress={() => setAccountMenuOpen((v) => !v)}
                style={[styles.avatarBtn, { backgroundColor: c.buttonBg, borderColor: c.buttonBorder }]}
              >
                {me?.profilePictureUrl ? (
                  <Image
                    source={{ uri: me.profilePictureUrl }}
                    style={{ width: 28, height: 28 }}
                  />
                ) : (
                  <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                    <Circle cx={12} cy={8} r={4} fill={c.fgMuted} opacity={0.8} />
                    <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" fill={c.fgMuted} opacity={0.5} />
                  </Svg>
                )}
              </Pressable>
              <ThemedText
                style={{
                  flex: 1,
                  color: c.fg,
                  fontSize: 12,
                  fontWeight: "500",
                }}
                numberOfLines={1}
              >
                {me?.username ?? "Guest"}
              </ThemedText>
              <Pressable
                onPress={() => goAndClose("/settings")}
                hitSlop={8}
                style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center" }}
              >
                <SettingsIcon color={c.fgMuted} />
              </Pressable>

              {/* Account menu popover — anchored inside the user row so its
                  bottom:'100%' resolves to the row's top edge (i.e. directly
                  above the avatar icon). When it was a sibling of userRow the
                  bottom:'100%' resolved against the drawer panel instead and
                  the popover floated above the nav buttons. */}
              {accountMenuOpen ? (
                <View
                  style={[
                    styles.popover,
                    {
                      backgroundColor: c.surface,
                      borderColor: c.border,
                    },
                  ]}
                >
                  <Pressable
                    style={styles.popoverItem}
                    onPress={() => toggleTheme()}
                  >
                    <ThemedText style={[styles.popoverLabel, { color: c.fgMuted }]}>Theme</ThemedText>
                    <ThemedText style={{ fontSize: 11, color: c.activeHighlight, fontWeight: "600", letterSpacing: 1.8, textTransform: "uppercase" }}>
                      {theme === "dark" ? "Dark" : "Light"}
                    </ThemedText>
                  </Pressable>
                  <Pressable
                    style={[styles.popoverItem, { borderTopColor: c.borderSoft, borderTopWidth: 1 }]}
                    onPress={() => goAndClose("/avatar")}
                  >
                    <ThemedText style={[styles.popoverLabel, { color: c.fgMuted }]}>Avatar</ThemedText>
                  </Pressable>
                  {hasToken ? (
                    <Pressable
                      style={[styles.popoverItem, { borderTopColor: c.borderSoft, borderTopWidth: 1 }]}
                      onPress={async () => {
                        setAccountMenuOpen(false);
                        setOpen(false);
                        await clearToken();
                        // Mirror web: stay in-app after sign-out (the home
                        // tab's DemoModeBanner is what prompts a re-login).
                        router.replace("/");
                      }}
                    >
                      <ThemedText style={[styles.popoverLabel, { color: c.fgMuted }]}>Sign Out</ThemedText>
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {/* Content layer — fills the parent, slides RIGHT to reveal the
            drawer panel beneath. Rendered AFTER the panel so it visually
            sits on top when at translateX 0 (closed). */}
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              // Drop a soft shadow on the left edge of the content so the
              // revealed drawer area has a sense of depth — the content
              // looks like it's lifted above the panel rather than swapping
              // layers. Negative X = shadow cast leftward.
              boxShadow: open ? "-2px 0px 14px rgba(0, 0, 0, 0.25)" : "none",
              elevation: open ? 12 : 0,
            },
            contentStyle,
          ]}
        >
          {children}

          {/* Backdrop over the visible content. Inside the content wrapper
              so it slides with the page — keeping the dim layer anchored to
              the page rather than the screen. */}
          <Animated.View
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: "#000", pointerEvents: open ? "auto" : "none" },
              backdropStyle,
            ]}
          >
            <Pressable style={{ flex: 1 }} onPress={() => setOpen(false)} />
          </Animated.View>
        </Animated.View>
      </View>
    </GestureDetector>
  );
}

function NavRow({
  label,
  active,
  onPress,
  icon,
  c,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  icon: React.ReactNode;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navRow,
        {
          backgroundColor: active
            ? c.activeHighlightBg
            : pressed ? c.overlayHover : "transparent",
          borderLeftColor: active ? c.activeHighlight : "transparent",
        },
      ]}
    >
      <View style={styles.navIconCell}>{icon}</View>
      <ThemedText
        style={{
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: active ? c.activeHighlight : c.fgMuted,
          fontWeight: active ? "600" : "500",
        }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function CapBar({
  label,
  cur,
  cap,
  pct,
  capped,
  fill,
  track,
  c,
}: {
  label: string;
  cur: number;
  cap: number;
  pct: number;
  capped: boolean;
  fill: string;
  track: string;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <View>
      <View style={styles.capRow}>
        <ThemedText style={[styles.capLabel, { color: c.fgSubtle }]}>{label}</ThemedText>
        <ThemedText style={[styles.capValue, { color: capped ? c.success : c.fgMuted }]}>
          {cur} / {cap}
        </ThemedText>
      </View>
      <View style={[styles.capTrack, { backgroundColor: track }]}>
        <View style={{ width: `${pct}%`, height: "100%", backgroundColor: fill }} />
      </View>
    </View>
  );
}

function TasksIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Line x1="9" y1="6" x2="20" y2="6" />
      <Line x1="9" y1="12" x2="20" y2="12" />
      <Line x1="9" y1="18" x2="20" y2="18" />
      <Polyline points="3,6 4,7 6,5" />
      <Polyline points="3,12 4,13 6,11" />
      <Polyline points="3,18 4,19 6,17" />
    </Svg>
  );
}
function RecurringIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M21 12a9 9 0 1 1-3-6.7" />
      <Polyline points="21 4 21 10 15 10" />
    </Svg>
  );
}
function ArchiveIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3} y={4} width={18} height={4} rx={1} />
      <Path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" />
      <Line x1={10} y1={12} x2={14} y2={12} />
    </Svg>
  );
}
function AvatarIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </Svg>
  );
}
function SettingsIcon({ color }: { color: string }) {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={3} />
      <Path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 8.6a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03Z" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    borderRightWidth: 1,
    flexDirection: "column",
    overflow: "hidden",
  },
  navRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
    borderLeftWidth: 2,
  },
  navIconCell: { width: 18, alignItems: "center", justifyContent: "center" },
  capsBlock: {
    padding: 12,
    paddingTop: 12,
    paddingBottom: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  capsHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  capsHeaderLabel: { fontSize: 9, letterSpacing: 1.8, textTransform: "uppercase", fontWeight: "600" },
  capRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  capLabel: { fontSize: 9, letterSpacing: 1.8, textTransform: "uppercase" },
  capValue: { fontSize: 9, fontWeight: "600", letterSpacing: 0.3 },
  capTrack: { width: "100%", height: 3, borderRadius: 999, overflow: "hidden" },
  userRow: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  avatarBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  popover: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: "100%",
    marginBottom: 4,
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
    elevation: 8,
  },
  popoverItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  popoverLabel: { fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase", fontWeight: "500" },
});
