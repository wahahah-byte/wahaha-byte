import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Svg, { Circle, Path } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { UserProfile } from "@wahaha/shared";
import { usersApi } from "@/lib/api";
import { ProfilePictureUpload } from "@/components/profile-picture-upload";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

// Discord-style extras persisted locally per-user until a backend lands.
interface ProfileExtras {
  bannerUri: string | null;
  displayName: string;
  bio: string;
  accentColor: string;
}

const ACCENT_COLORS = [
  "#7c5cf0", "#5b8be0", "#3e9b87", "#d97757",
  "#c97a07", "#d83232", "#a04ec9", "#6b7280",
] as const;

const DEFAULT_EXTRAS: ProfileExtras = {
  bannerUri: null,
  displayName: "",
  bio: "",
  accentColor: ACCENT_COLORS[0],
};

const storageKey = (userId: string) => `wb-profile-extras:${userId}`;

export default function ProfileScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const [me, setMe] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [extras, setExtras] = useState<ProfileExtras>(DEFAULT_EXTRAS);
  const [bannerBusy, setBannerBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Toggled by the Edit Profile button; controls whether name/bio are
  // editable inputs and whether the accent color picker is shown.
  const [isEditing, setIsEditing] = useState(false);

  const load = useCallback(async () => {
    const res = await usersApi.getMe();
    if (res.data) {
      setMe(res.data);
      const raw = await AsyncStorage.getItem(storageKey(res.data.userId));
      if (raw) {
        try { setExtras({ ...DEFAULT_EXTRAS, ...JSON.parse(raw) }); }
        catch { /* corrupt — fall back to defaults */ }
      } else {
        setExtras(DEFAULT_EXTRAS);
      }
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const patchExtras = useCallback((patch: Partial<ProfileExtras>) => {
    setExtras((prev) => {
      const next = { ...prev, ...patch };
      if (me) AsyncStorage.setItem(storageKey(me.userId), JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, [me]);

  async function pickBanner() {
    if (bannerBusy) return;
    setError(null);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setError("Photo library access denied.");
      return;
    }
    setBannerBusy(true);
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 5],
        quality: 0.8,
      });
      if (result.canceled || !result.assets[0]) return;
      patchExtras({ bannerUri: result.assets[0].uri });
    } finally {
      setBannerBusy(false);
    }
  }

  // Footer nav height + safe area; mirrored into ScrollView bottom padding so
  // the last card isn't hidden behind the nav.
  const footerHeight = 60 + insets.bottom;

  return (
    <View style={[styles.page, { backgroundColor: c.bg }]}>
      {/* Header bar */}
      <View style={[styles.headerBar, { borderBottomColor: c.borderSoft }]}>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <ThemedText style={{ fontSize: 11, color: c.fgSubtle, letterSpacing: 1.6, textTransform: "uppercase", fontWeight: "600" }}>
            ← Back
          </ThemedText>
        </Pressable>
        <ThemedText style={{ fontSize: 12, color: c.fg, letterSpacing: 1.8, textTransform: "uppercase", fontWeight: "600" }}>
          Profile
        </ThemedText>
        <View style={{ width: 40 }} />
      </View>

      {loading || !me ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator color={c.activeHighlight} />
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, gap: 20, paddingBottom: footerHeight + 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Banner + overlapping avatar */}
          <View style={[styles.bannerWrap, { borderColor: c.borderHairline }]}>
            <Pressable
              onPress={pickBanner}
              disabled={bannerBusy}
              accessibilityLabel="Change banner"
              style={[
                styles.banner,
                {
                  backgroundColor: extras.accentColor,
                  opacity: bannerBusy ? 0.6 : 1,
                },
              ]}
            >
              {extras.bannerUri ? (
                <Image source={{ uri: extras.bannerUri }} style={styles.bannerImg} />
              ) : (
                <ThemedText
                  style={{
                    color: "rgba(255,255,255,0.75)",
                    fontSize: 10,
                    letterSpacing: 1.8,
                    textTransform: "uppercase",
                    fontWeight: "600",
                  }}
                >
                  Tap to add banner
                </ThemedText>
              )}
            </Pressable>
            {extras.bannerUri ? (
              <Pressable
                onPress={() => patchExtras({ bannerUri: null })}
                hitSlop={8}
                style={styles.bannerRemove}
              >
                <ThemedText style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 14 }}>×</ThemedText>
              </Pressable>
            ) : null}
          </View>

          {/* Avatar — sibling of banner, negative top margin pulls it up so it
              half-overlaps. */}
          <View style={styles.avatarOverlap}>
            <ProfilePictureUpload
              profilePictureUrl={me.profilePictureUrl ?? null}
              size={72}
              onChange={(url) => setMe((prev) => (prev ? { ...prev, profilePictureUrl: url } : prev))}
            />
          </View>

          {/* Name + bio card — read-only by default, editable in edit mode. */}
          <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.borderHairline, gap: 10 }]}>
            {isEditing ? (
              <>
                <TextInput
                  value={extras.displayName}
                  onChangeText={(v) => patchExtras({ displayName: v })}
                  placeholder="Display name"
                  placeholderTextColor={c.fgSubtle}
                  maxLength={32}
                  style={[styles.nameInput, { color: c.fg }]}
                />
                <ThemedText style={{ color: c.fgMuted, fontSize: 11, marginTop: -6 }}>
                  @{me.username}
                </ThemedText>
                <View style={[styles.divider, { backgroundColor: c.borderHairline }]} />
                <TextInput
                  value={extras.bio}
                  onChangeText={(v) => patchExtras({ bio: v })}
                  placeholder="Tell people about yourself…"
                  placeholderTextColor={c.fgSubtle}
                  maxLength={190}
                  multiline
                  numberOfLines={3}
                  style={[styles.bioInput, { color: c.fg }]}
                />
                <ThemedText style={{ color: c.fgSubtle, fontSize: 9, alignSelf: "flex-end" }}>
                  {extras.bio.length} / 190
                </ThemedText>
              </>
            ) : (
              <>
                <ThemedText style={[styles.nameInput, { color: extras.displayName ? c.fg : c.fgSubtle }]}>
                  {extras.displayName || "Display name"}
                </ThemedText>
                <ThemedText style={{ color: c.fgMuted, fontSize: 11, marginTop: -6 }}>
                  @{me.username}
                </ThemedText>
                <View style={[styles.divider, { backgroundColor: c.borderHairline }]} />
                <ThemedText style={[styles.bioReadOnly, { color: extras.bio ? c.fg : c.fgSubtle }]}>
                  {extras.bio || "Tell people about yourself…"}
                </ThemedText>
              </>
            )}
          </View>

          {/* Edit profile / Done — horizontal pill button. */}
          <Pressable
            onPress={() => setIsEditing((v) => !v)}
            style={({ pressed }) => [
              styles.editBtn,
              {
                borderColor: isEditing ? c.activeHighlight : c.borderHairline,
                backgroundColor: isEditing
                  ? c.activeHighlightBg
                  : pressed ? c.overlayHover : "transparent",
              },
            ]}
          >
            <ThemedText
              style={{
                fontSize: 11,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                fontWeight: "600",
                color: isEditing ? c.activeHighlight : c.fg,
              }}
            >
              {isEditing ? "Done" : "Edit Profile"}
            </ThemedText>
          </Pressable>

          {/* Accent color — visible only while editing. */}
          {isEditing ? (
            <Section title="Accent color" c={c}>
              <View style={styles.swatchRow}>
                {ACCENT_COLORS.map((color) => {
                  const active = extras.accentColor === color;
                  return (
                    <Pressable
                      key={color}
                      onPress={() => patchExtras({ accentColor: color })}
                      accessibilityLabel={`Set accent color ${color}`}
                      style={[
                        styles.swatch,
                        {
                          backgroundColor: color,
                          borderColor: active ? c.fg : "transparent",
                        },
                      ]}
                    />
                  );
                })}
              </View>
              <ThemedText style={{ color: c.fgSubtle, fontSize: 10, marginTop: 4 }}>
                Banner background when no image is set.
              </ThemedText>
            </Section>
          ) : null}

          {/* Stats */}
          <Section title="Stats" c={c}>
            <View style={styles.statGrid}>
              <Stat label="Balance" value={me.currentBalance.toLocaleString()} c={c} />
              <Stat label="Level" value={String(me.level)} c={c} />
              <Stat label="Earned" value={me.totalPointsEarned.toLocaleString()} c={c} />
            </View>
          </Section>

          {/* Account */}
          <Section title="Account" c={c}>
            <Field label="Username" value={me.username} c={c} />
            <Field label="Email" value={me.email} c={c} />
          </Section>

          {error ? (
            <ThemedText style={{ color: c.danger, fontSize: 11, textAlign: "center" }}>{error}</ThemedText>
          ) : null}
        </ScrollView>
      )}

      {/* Footer nav — pinned to bottom, two tabs (Shop, Settings). */}
      <View
        style={[
          styles.footerNav,
          {
            backgroundColor: c.header,
            borderTopColor: c.borderSoft,
            paddingBottom: insets.bottom,
            height: footerHeight,
          },
        ]}
      >
        <FooterTab
          label="Shop"
          icon={<ShopIcon color={c.fgMuted} />}
          onPress={() => router.push("/shop")}
          c={c}
        />
        <FooterTab
          label="Settings"
          icon={<SettingsIcon color={c.fgMuted} />}
          onPress={() => router.push("/settings")}
          c={c}
        />
      </View>
    </View>
  );
}

function Section({ title, children, c }: { title: string; children: React.ReactNode; c: ReturnType<typeof useColors> }) {
  return (
    <View style={{ gap: 8 }}>
      <ThemedText style={{ color: c.fgSubtle, fontSize: 9, letterSpacing: 1.8, textTransform: "uppercase", fontWeight: "600" }}>
        {title}
      </ThemedText>
      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.borderHairline }]}>
        {children}
      </View>
    </View>
  );
}

function Field({ label, value, c }: { label: string; value: string; c: ReturnType<typeof useColors> }) {
  return (
    <View style={{ gap: 2, marginBottom: 8 }}>
      <ThemedText style={{ color: c.fgSubtle, fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase" }}>
        {label}
      </ThemedText>
      <ThemedText style={{ color: c.fg, fontSize: 12 }}>{value}</ThemedText>
    </View>
  );
}

function Stat({ label, value, c }: { label: string; value: string; c: ReturnType<typeof useColors> }) {
  return (
    <View style={{ flex: 1, gap: 2 }}>
      <ThemedText style={{ color: c.fgSubtle, fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase" }}>
        {label}
      </ThemedText>
      <ThemedText style={{ color: c.fg, fontSize: 16, fontWeight: "600", fontVariant: ["tabular-nums"] }}>
        {value}
      </ThemedText>
    </View>
  );
}

function FooterTab({
  label, icon, onPress, c,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.footerTab,
        { backgroundColor: pressed ? c.overlayHover : "transparent" },
      ]}
      accessibilityLabel={label}
    >
      {icon}
      <ThemedText
        style={{
          fontSize: 9,
          color: c.fgMuted,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          fontWeight: "600",
        }}
      >
        {label}
      </ThemedText>
    </Pressable>
  );
}

function SettingsIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={3} />
      <Path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 8.6a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03Z" />
    </Svg>
  );
}

function ShopIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 8h14l-1 12H6L5 8Z" />
      <Path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1 },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  bannerWrap: {
    borderRadius: 8,
    borderWidth: 1,
    position: "relative",
  },
  banner: {
    width: "100%",
    aspectRatio: 16 / 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerImg: { width: "100%", height: "100%", resizeMode: "cover" },
  bannerRemove: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarOverlap: {
    // -56 cancels the parent ScrollView gap (20) + ~36px overlap (50% of 72px avatar).
    marginTop: -56,
    marginLeft: 12,
    alignSelf: "flex-start",
    marginBottom: -8,
  },
  card: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 14,
  },
  divider: { height: 1, marginVertical: 2 },
  nameInput: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.2,
    padding: 0,
  },
  bioInput: {
    fontSize: 12,
    lineHeight: 18,
    minHeight: 54,
    padding: 0,
    textAlignVertical: "top",
  },
  bioReadOnly: {
    fontSize: 12,
    lineHeight: 18,
  },
  editBtn: {
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  statGrid: {
    flexDirection: "row",
    gap: 12,
  },
  footerNav: {
    flexDirection: "row",
    borderTopWidth: 1,
  },
  footerTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingTop: 8,
  },
});
