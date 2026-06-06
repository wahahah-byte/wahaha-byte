import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View, type PressableProps } from "react-native";
import { router } from "expo-router";

import { usersApi } from "@/lib/api";
import { signOut } from "@/lib/session";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BuildInfo } from "@/components/build-info";
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
    <ThemedView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
      <ThemedText
        style={{
          fontSize: 11, color: c.fg, fontWeight: "600",
          letterSpacing: 2, textTransform: "uppercase",
        }}
      >
        Settings
      </ThemedText>

      <SettingsSection title="Appearance">
        <SettingsRow
          label="Theme"
          control={
            <PillButton
              label={theme === "dark" ? "Dark" : "Light"}
              onPress={toggleTheme}
              tone="accent"
            />
          }
        />
      </SettingsSection>

      <SettingsSection title="Features">
        <SettingsRow
          label="Avatars"
          description="Hides the chibi avatar, inventory, and shop. Your unlocked items stay safe."
          control={
            <PillButton
              label={avatarsEnabled ? "On" : "Off"}
              onPress={() => { setAvatarsEnabled(!avatarsEnabled); }}
              tone={avatarsEnabled ? "accent" : "muted"}
            />
          }
        />
      </SettingsSection>

      <SettingsSection title="Account">
        <PillButton
          label="Sign Out"
          onPress={handleSignOut}
          tone="muted"
          full
        />
      </SettingsSection>

      <ThemedText style={{ color: c.fgSubtle, fontSize: 11, textAlign: "center", marginTop: 4 }}>
        Looking for profile customization? Open the account menu → Profile.
      </ThemedText>

      <BuildInfo />

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
      </ScrollView>

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

// Section wrapper — uppercase eyebrow above a card-style surface, matches the
// web Settings page's `Section` component.
function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  const c = useColors();
  return (
    <View style={{ gap: 8 }}>
      <ThemedText
        style={{
          color: c.fgSubtle,
          fontSize: 9,
          letterSpacing: 1.8,
          textTransform: "uppercase",
          fontWeight: "700",
        }}
      >
        {title}
      </ThemedText>
      <View
        style={{
          backgroundColor: c.surface,
          borderColor: c.borderHairline,
          borderWidth: 1,
          borderRadius: 6,
          padding: 14,
          gap: 10,
        }}
      >
        {children}
      </View>
    </View>
  );
}

// Row inside a section: label (optional description) on the left, control on the right.
function SettingsRow({
  label,
  description,
  control,
}: {
  label: string;
  description?: string;
  control: React.ReactNode;
}) {
  const c = useColors();
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, paddingRight: 12 }}>
        <ThemedText style={{ color: c.fg, fontSize: 13 }}>{label}</ThemedText>
        {description ? (
          <ThemedText style={{ color: c.fgSubtle, fontSize: 11, lineHeight: 15, marginTop: 2 }}>
            {description}
          </ThemedText>
        ) : null}
      </View>
      {control}
    </View>
  );
}

// RE4-style flat pill button. Two tones cover every settings button:
//   accent — active-highlight tint with bordered background (toggles ON, theme)
//   muted  — neutral subtle border, mainly text-on-transparent (toggles OFF, sign out)
function PillButton({
  label,
  onPress,
  tone,
  full,
}: {
  label: string;
  onPress: () => void;
  tone: "accent" | "muted";
  full?: boolean;
} & Pick<PressableProps, never>) {
  const c = useColors();
  const accent = tone === "accent";
  const fg = accent ? c.activeHighlight : c.fgMuted;
  const border = accent ? c.activeHighlightBorder : c.border;
  const bgIdle = accent ? c.activeHighlightBg : "transparent";
  const bgPressed = accent ? c.activeHighlightBorder : c.overlayHover;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        full ? { alignSelf: "stretch" } : null,
        {
          borderColor: border,
          backgroundColor: pressed ? bgPressed : bgIdle,
        },
      ]}
    >
      <ThemedText
        style={{
          color: fg,
          fontSize: 11,
          fontWeight: "700",
          letterSpacing: 1.8,
          textTransform: "uppercase",
        }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 64, gap: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 72,
  },
  dangerZone: {
    marginTop: 12,
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
