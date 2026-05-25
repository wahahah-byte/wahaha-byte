import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { getToken } from "@/lib/api";
import { taskEvents } from "@/lib/task-events";
import { useColors } from "@/hooks/use-colors";
import { ThemedText } from "@/components/themed-text";

// Small persistent tab pinned to the right edge of the screen when unauthed.
// Mirrors the web's top-right SignInButton in spirit but uses the side-tab idiom
// that works inside the mobile drawer layout (where there's no global top header).
// Hidden on /login and /register so it doesn't sit on top of the form.
const HIDDEN_ROUTES = new Set<string>(["/login", "/register"]);

export function SignInTab() {
  const c = useColors();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [hasToken, setHasToken] = useState<boolean | null>(null);

  // Re-check token on every route change (sign-in/out propagates via nav). Also
  // listens for the cross-screen refresh event signOut() emits so the tab appears
  // immediately after sign-out instead of waiting for the next navigation.
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const t = await getToken();
      if (!cancelled) setHasToken(!!t);
    };
    check();
    const unsubscribe = taskEvents.subscribeRefreshRequested(check);
    return () => { cancelled = true; unsubscribe(); };
  }, [pathname]);

  // Don't render until we know the auth state — avoids a brief flash of the tab.
  if (hasToken !== false) return null;
  if (HIDDEN_ROUTES.has(pathname)) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.host,
        {
          // Anchored near the bottom — sits above the safe-area inset plus enough room to
          // clear the FilterStrip + MobileActionBar that live at the bottom of tab screens.
          bottom: insets.bottom + 140,
        },
      ]}
    >
      <Pressable
        onPress={() => router.push("/login")}
        accessibilityRole="link"
        accessibilityLabel="Sign in"
        style={({ pressed }) => [
          styles.tab,
          {
            backgroundColor: pressed ? c.activeHighlightBorder : c.activeHighlightBg,
            borderColor: c.activeHighlightBorder,
          },
        ]}
      >
        {/* Vertical text — letters stacked top-to-bottom so the tab reads cleanly
            while staying narrow against the screen edge. */}
        {"SIGN IN".split("").map((ch, i) => (
          <ThemedText
            key={`${ch}-${i}`}
            style={{
              color: c.activeHighlight,
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 1,
              lineHeight: 12,
              textAlign: "center",
            }}
          >
            {ch === " " ? "·" : ch}
          </ThemedText>
        ))}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: "absolute",
    right: 0,
    zIndex: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderRightWidth: 0,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 22,
  },
});
