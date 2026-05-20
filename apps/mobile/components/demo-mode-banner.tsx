import { Pressable, StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

// Demo banner for unauthenticated users — sits below status bar via safe inset.
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
