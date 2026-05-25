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

// Tap-the-image-to-change profile picture uploader. Borderless circle with an
// optional Remove action stacked beneath when a picture exists.
export function ProfilePictureUpload({ profilePictureUrl, onChange, size = 88 }: Props) {
  const c = useColors();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pickAndUpload() {
    if (busy) return;
    setError(null);
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
    <View style={styles.col}>
      <Pressable
        onPress={pickAndUpload}
        disabled={busy}
        accessibilityLabel={profilePictureUrl ? "Change profile picture" : "Upload profile picture"}
        style={({ pressed }) => [
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: profilePictureUrl ? "transparent" : c.input,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
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
          <ThemedText style={{ fontSize: size * 0.32, color: c.fgSubtle }}>
            +
          </ThemedText>
        )}
      </Pressable>

      {profilePictureUrl ? (
        <Pressable
          onPress={handleRemove}
          disabled={busy}
          style={({ pressed }) => [{ opacity: busy ? 0.4 : pressed ? 0.6 : 1, paddingVertical: 2, paddingHorizontal: 6 }]}
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
            {busy ? "…" : "Remove"}
          </ThemedText>
        </Pressable>
      ) : null}

      {error ? (
        <ThemedText style={{ fontSize: 10, color: c.danger }}>{error}</ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  col: {
    alignItems: "center",
    gap: 6,
  },
});
