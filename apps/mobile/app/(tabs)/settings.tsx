import { useState } from "react";
import { Button, Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { signOut, usersApi } from "@/lib/api";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { DeleteAccountModal } from "@/components/delete-account-modal";
import { useColors } from "@/hooks/use-colors";
import { useTheme } from "@/context/theme-context";
import { setAvatarsEnabled, useAvatarsEnabled } from "@/hooks/use-avatars-enabled";

export default function SettingsScreen() {
  const c = useColors();
  const { theme, toggleTheme } = useTheme();
  const avatarsEnabled = useAvatarsEnabled();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignOut() {
    // signOut wipes caches + emits refresh so live screens clear their state.
    await signOut();
    router.replace("/");
  }

  async function handleDeleteAccount() {
    if (deleting) return;
    setError(null);
    setDeleting(true);
    const res = await usersApi.deleteAccount();
    setDeleting(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    await signOut();
    setDeleteOpen(false);
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

      <View style={styles.row}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <ThemedText>Avatars</ThemedText>
          <ThemedText style={{ color: c.fgSubtle, fontSize: 11, lineHeight: 15, marginTop: 2 }}>
            Hides the chibi avatar, inventory, and shop. Your unlocked items stay safe.
          </ThemedText>
        </View>
        <Button
          title={avatarsEnabled ? "On" : "Off"}
          onPress={() => { setAvatarsEnabled(!avatarsEnabled); }}
          color={avatarsEnabled ? c.activeHighlight : c.fgMuted}
        />
      </View>

      <Button title="Sign out" onPress={handleSignOut} color={c.danger} />

      <ThemedText style={{ color: c.fgSubtle, fontSize: 11, textAlign: "center", marginTop: 12 }}>
        Looking for profile customization? Open the account menu → Profile.
      </ThemedText>

      <View
        style={[
          styles.dangerZone,
          { borderColor: c.dangerBorder, backgroundColor: c.surface },
        ]}
      >
        <ThemedText
          style={{
            fontSize: 9, color: c.danger, fontWeight: "700",
            letterSpacing: 1.6, textTransform: "uppercase",
          }}
        >
          Danger Zone
        </ThemedText>
        <ThemedText style={{ color: c.fg, fontSize: 12, fontWeight: "600", marginTop: 6 }}>
          Delete account
        </ThemedText>
        <ThemedText style={{ color: c.fgMuted, fontSize: 11, lineHeight: 16, marginTop: 2 }}>
          Permanently removes your account, all tasks, streaks, inventory, points history, and
          profile picture. This cannot be undone.
        </ThemedText>
        {error ? (
          <ThemedText style={{ color: c.danger, fontSize: 11, marginTop: 6 }}>
            {error}
          </ThemedText>
        ) : null}
        <Pressable
          onPress={() => setDeleteOpen(true)}
          style={({ pressed }) => [
            styles.dangerBtn,
            {
              borderColor: c.dangerBorder,
              backgroundColor: pressed ? c.dangerBg : "transparent",
            },
          ]}
        >
          <ThemedText
            style={{
              color: c.danger, fontSize: 11, fontWeight: "700",
              letterSpacing: 1.6, textTransform: "uppercase",
            }}
          >
            Delete my account
          </ThemedText>
        </Pressable>
      </View>

      <DeleteAccountModal
        visible={deleteOpen}
        busy={deleting}
        requiredText="delete my account"
        onConfirm={handleDeleteAccount}
        onCancel={() => { if (!deleting) setDeleteOpen(false); }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 64, gap: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  dangerZone: {
    marginTop: 24,
    padding: 14,
    borderWidth: 1,
    borderRadius: 6,
  },
  dangerBtn: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 3,
  },
});
