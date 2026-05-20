import { useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

import { usersApi } from "@/lib/api";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  profilePictureUrl?: string | null;
  // Fires with new URL (null on remove) after successful upload/delete.
  onChange?: (newUrl: string | null) => void;
  // Rendered diameter in px (default 88).
  size?: number;
}

// Mobile profile picture uploader via expo-image-picker → FormData upload.
export function ProfilePictureUpload({ profilePictureUrl, onChange, size = 88 }: Props) {
  const c = useColors();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pickAndUpload() {
    if (busy) return;
    setError(null);
    // Picker prompts on native first time; no-op on web.
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      setError("Photo library access denied.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];

    setBusy(true);
    const res = await usersApi.uploadProfilePicture(asset.uri, asset.mimeType);
    setBusy(false);
    if (res.error || !res.data) {
      setError(res.error ?? "Upload failed");
      return;
    }
    onChange?.(res.data.profilePictureUrl ?? null);
  }

  async function handleRemove() {
    if (!profilePictureUrl || busy) return;
    setBusy(true);
    setError(null);
    const res = await usersApi.deleteProfilePicture();
    setBusy(false);
    if (res.error) {
      setError(res.error);
      return;
    }
    onChange?.(null);
  }

  return (
    <View style={styles.row}>
      <Pressable
        onPress={pickAndUpload}
        disabled={busy}
        accessibilityLabel={profilePictureUrl ? "Change profile picture" : "Upload profile picture"}
        style={({ pressed }) => [
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderColor: c.borderHairline,
            backgroundColor: c.input,
            opacity: busy ? 0.5 : pressed ? 0.8 : 1,
          },
        ]}
      >
        {profilePictureUrl ? (
          <Image
            source={{ uri: profilePictureUrl }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
          />
        ) : (
          <ThemedText
            style={{ fontSize: size * 0.32, color: c.fgSubtle }}
          >
            +
          </ThemedText>
        )}
      </Pressable>

      <View style={{ gap: 8, alignItems: "flex-start" }}>
        <Pressable
          onPress={pickAndUpload}
          disabled={busy}
          style={({ pressed }) => [
            styles.btn,
            {
              borderColor: c.borderHairline,
              opacity: busy ? 0.4 : pressed ? 0.7 : 1,
            },
          ]}
        >
          <ThemedText
            style={{
              fontSize: 10,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              fontWeight: "600",
              color: c.fgSubtle,
            }}
          >
            {busy ? "Uploading…" : profilePictureUrl ? "Change" : "Upload"}
          </ThemedText>
        </Pressable>
        {profilePictureUrl ? (
          <Pressable
            onPress={handleRemove}
            disabled={busy}
            style={({ pressed }) => [{ opacity: busy ? 0.4 : pressed ? 0.6 : 1 }]}
          >
            <ThemedText
              style={{
                fontSize: 10,
                letterSpacing: 1.4,
                textTransform: "uppercase",
                fontWeight: "600",
                color: c.danger,
              }}
            >
              Remove
            </ThemedText>
          </Pressable>
        ) : null}
        {error ? (
          <ThemedText style={{ fontSize: 10, color: c.danger }}>{error}</ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    borderWidth: 2,
    borderStyle: "dashed",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
});
