import { useCallback, useEffect, useState } from "react";
import {
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

import { type UserProfile } from "@wahaha/shared";
import { getToken } from "@/lib/api";
import { signOut } from "@/lib/session";
import { profileCache } from "@/lib/profile-cache";
import { useTheme } from "@/context/theme-context";
import { useColors } from "@/hooks/use-colors";
import { useAvatarsEnabled } from "@/hooks/use-avatars-enabled";
import { DrawerPanel } from "@/components/mobile-edge-drawer/drawer-panel";

const DRAWER_WIDTH = 220;
// ~55px drag commits open (0.25 of width).
const COMMIT_FRACTION = 0.25;
// End-velocity threshold to commit on flick regardless of position.
const COMMIT_VELOCITY = 600;
// Bottom region excluded so filter-strip/action-bar gestures aren't hijacked.
const BOTTOM_EXCLUSION_PX = 96;

interface Props {
  children: React.ReactNode;
}

export function MobileEdgeDrawer({ children }: Props) {
  const c = useColors();
  const { theme, toggleTheme } = useTheme();
  const avatarsEnabled = useAvatarsEnabled();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { height: screenH } = useWindowDimensions();

  const [open, setOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  // Seed from the shared cache (populated at app boot by the To Do screen +
  // disk hydration) so the drawer paints identity + caps on first frame instead
  // of flashing empty and popping data in as you swipe it open.
  const [me, setMe] = useState<UserProfile | null>(() => profileCache.read());
  // A cached profile means we're signed in; avoids a Sign In → user-row flash.
  const [hasToken, setHasToken] = useState(() => profileCache.read() != null);

  // Mirror the shared cache into local state for background updates.
  useEffect(() => {
    return profileCache.subscribe((next) => {
      setMe(next);
      // A profile is proof of a token; keep the auth signal in sync on update
      // but never flip to false here — token-absence is decided by the check below.
      if (next != null) setHasToken(true);
    });
  }, []);

  // Refresh user identity + balance on drawer open / nav. Token check keeps the
  // auth signal exact (a valid token whose getMe fails still shows the user row).
  useEffect(() => {
    let cancelled = false;
    getToken().then((token) => {
      if (!cancelled) setHasToken(!!token);
    });
    profileCache.revalidate();
    return () => { cancelled = true; };
  }, [pathname, open]);

  useEffect(() => {
    if (!open) setAccountMenuOpen(false);
  }, [open]);

  // Content-layer translateX (0=closed → DRAWER_WIDTH=open); single source of truth.
  const dragX = useSharedValue(0);
  // Baseline captured at gesture start.
  const startedOpen = useSharedValue(false);
  // True when touch began in bottom exclusion band.
  const blocked = useSharedValue(false);

  const commit = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
  }, []);

  // Sync dragX on external `open` changes (nav, backdrop, mount).
  useEffect(() => {
    dragX.value = withTiming(open ? DRAWER_WIDTH : 0, {
      duration: 220,
      easing: Easing.bezier(0.2, 0, 0, 1),
    });
  }, [open, dragX]);

  // Disable edge-pan when a transparent modal route is open.
  const modalRouteOpen =
    pathname.startsWith("/task/") || pathname.startsWith("/new-task");

  const pan = Gesture.Pan()
    .enabled(!modalRouteOpen)
    // 10px activation — lets child pans (8px) win first.
    .activeOffsetX([-10, 10])
    .failOffsetY([-12, 12])
    .onStart((e) => {
      "worklet";
      startedOpen.value = open;
      // e.y is screen-Y (detector wraps full screen).
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
        // Snap back to startedOpen position for jitter cases.
        dragX.value = withTiming(startedOpen.value ? DRAWER_WIDTH : 0, {
          duration: 220,
          easing: Easing.bezier(0.2, 0, 0, 1),
        });
        return;
      }
      const current = dragX.value;
      // Velocity-first commit; position as fallback for slow releases.
      let nextOpen = startedOpen.value;
      if (e.velocityX > COMMIT_VELOCITY) nextOpen = true;
      else if (e.velocityX < -COMMIT_VELOCITY) nextOpen = false;
      else if (startedOpen.value) {
        if (current < DRAWER_WIDTH * (1 - COMMIT_FRACTION)) nextOpen = false;
      } else {
        if (current > DRAWER_WIDTH * COMMIT_FRACTION) nextOpen = true;
      }
      // Animate from dragX's current position; dragX stays source of truth.
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
    };
  });

  const goAndClose = useCallback((href: string) => {
    setAccountMenuOpen(false);
    // Push first, close second so new screen paints before reveal.
    router.push(href as never);
    setOpen(false);
  }, []);

  // signOut wipes the token + caches + emits refresh so live screens
  // (TaskList, tabs/index) clear their state instead of holding the
  // previous user's data after navigation.
  const handleSignOut = useCallback(async () => {
    setOpen(false);
    await signOut();
    router.replace("/");
  }, []);

  return (
    <GestureDetector gesture={pan}>
      <View style={{ flex: 1 }}>
        {/* Drawer panel — stationary at left, revealed when content slides right. */}
        <DrawerPanel
          c={c}
          insets={insets}
          pathname={pathname}
          theme={theme}
          toggleTheme={toggleTheme}
          avatarsEnabled={avatarsEnabled}
          me={me}
          hasToken={hasToken}
          accountMenuOpen={accountMenuOpen}
          setAccountMenuOpen={setAccountMenuOpen}
          goAndClose={goAndClose}
          onSignOut={handleSignOut}
        />

        {/* Content layer — slides right to reveal panel beneath. */}
        <Animated.View
          style={[
            StyleSheet.absoluteFillObject,
            {
              // Soft left-edge shadow for depth when open.
              boxShadow: open ? "-2px 0px 14px rgba(0, 0, 0, 0.25)" : "none",
              elevation: open ? 12 : 0,
            },
            contentStyle,
          ]}
        >
          {children}

          {/* Backdrop inside content wrapper so it slides with the page. */}
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
