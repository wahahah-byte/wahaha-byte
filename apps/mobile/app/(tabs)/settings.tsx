import { Button, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { clearToken } from "@/lib/api";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";
import { useTheme } from "@/context/theme-context";

export default function SettingsScreen() {
  const c = useColors();
  const { theme, toggleTheme } = useTheme();

  async function handleSignOut() {
    await clearToken();
    router.replace("/");
  }

  return (
    <ThemedView style={styles.container}>
      <ThemedText
        style={{
          fontSize: 11, color: c.fg, fontWeight: "600",
          letterSpacing: 2, textTransform: "uppercase",
        }}
      >
        Settings
      </ThemedText>

      <View style={styles.row}>
        <ThemedText>Theme</ThemedText>
        <Button
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          onPress={toggleTheme}
          color={c.activeHighlight}
        />
      </View>

      <Button title="Sign out" onPress={handleSignOut} color={c.danger} />

      <ThemedText style={{ color: c.fgSubtle, fontSize: 11, textAlign: "center", marginTop: 12 }}>
        Looking for profile customization? Open the account menu → Profile.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 64, gap: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
