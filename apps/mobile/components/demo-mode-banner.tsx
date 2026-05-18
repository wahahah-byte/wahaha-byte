import { Pressable, StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

// Shown to unauthenticated users so they know their changes only live in
// memory until they sign in. Mirrors web's DemoModeBanner copy + visual: a
// thin highlight-tinted strip with a Sign-in CTA on the right. We sit at the
// very top of the screen, so the bar pushes itself below the status bar via
// the safe-area inset (Android edge-to-edge mode means the screen extends
// behind the status bar by default).
export function DemoModeBanner() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: c.activeHighlightBg,
          borderColor: c.activeHighlightBorder,
          marginTop: insets.top + 8,
        },
      ]}
    >
      <ThemedText
        style={{
          color: c.activeHighlight,
          fontSize: 10,
          letterSpacing: 1.8,
          textTransform: "uppercase",
          opacity: 0.85,
        }}
      >
        Demo · changes are not saved
      </ThemedText>
      <Link href="/login" asChild>
        <Pressable hitSlop={8}>
          <ThemedText
            style={{
              color: c.activeHighlight,
              fontSize: 10,
              letterSpacing: 1.8,
              fontWeight: "700",
              textTransform: "uppercase",
            }}
          >
            Sign in →
          </ThemedText>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 16,
    marginBottom: 4,
    borderWidth: 1,
    borderRadius: 3,
  },
});
