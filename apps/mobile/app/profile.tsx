import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { UserProfile } from "@wahaha/shared";
import { usersApi } from "@/lib/api";
import { ProfilePictureUpload } from "@/components/profile-picture-upload";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";
import { useAvatarsEnabled } from "@/hooks/use-avatars-enabled";
import {
  ACCENT_COLORS,
  DEFAULT_EXTRAS,
  storageKey,
  type ProfileExtras,
} from "@/lib/profile-extras";
import {
  Field,
  FooterTab,
  Section,
  SettingsIcon,
  ShopIcon,
  Stat,
} from "@/components/profile/profile-parts";
import { styles } from "@/components/profile/styles";

export default function ProfileScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const avatarsEnabled = useAvatarsEnabled();
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
        {avatarsEnabled ? (
          <FooterTab
            label="Shop"
            icon={<ShopIcon color={c.fgMuted} />}
            onPress={() => router.push("/shop")}
            c={c}
          />
        ) : null}
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
