import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import { router, useFocusEffect } from "expo-router";

import type { UserProfile } from "@wahaha/shared";
import { clearToken, usersApi } from "@/lib/api";
import { ProfilePictureUpload } from "@/components/profile-picture-upload";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";
import { useTheme } from "@/context/theme-context";

export default function SettingsScreen() {
  const c = useColors();
  const { theme, toggleTheme } = useTheme();
  const [me, setMe] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await usersApi.getMe();
    if (res.data) setMe(res.data);
  }, []);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

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

      {loading && !me ? (
        <ActivityIndicator color={c.activeHighlight} />
      ) : me ? (
        <View style={[styles.profile, { borderColor: c.borderSoft, backgroundColor: c.panel }]}>
          <ProfilePictureUpload
            profilePictureUrl={me.profilePictureUrl ?? null}
            onChange={(url) =>
              setMe((prev) => (prev ? { ...prev, profilePictureUrl: url } : prev))
            }
          />
          <ThemedText type="subtitle">{me.username}</ThemedText>
          <ThemedText style={{ color: c.fgMuted }}>{me.email}</ThemedText>
          <View style={styles.statRow}>
            <Stat label="Balance" value={me.currentBalance.toLocaleString()} c={c} />
            <Stat label="Level" value={String(me.level)} c={c} />
            <Stat label="Today" value={String(me.pointsSubmittedToday)} c={c} />
          </View>
        </View>
      ) : null}

      <View style={styles.row}>
        <ThemedText>Theme</ThemedText>
        <Button
          title={theme === "dark" ? "Switch to light" : "Switch to dark"}
          onPress={toggleTheme}
          color={c.activeHighlight}
        />
      </View>

      <Button title="Sign out" onPress={handleSignOut} color={c.danger} />
    </ThemedView>
  );
}

function Stat({ label, value, c }: { label: string; value: string; c: ReturnType<typeof useColors> }) {
  return (
    <View>
      <ThemedText style={{ color: c.fgMuted, fontSize: 11 }}>{label.toUpperCase()}</ThemedText>
      <ThemedText type="defaultSemiBold" style={{ fontSize: 18 }}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 64, gap: 16 },
  profile: { padding: 16, borderRadius: 8, borderWidth: 1, gap: 8 },
  statRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
});
