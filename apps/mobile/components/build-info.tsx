import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import * as Updates from "expo-updates";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

// Surfaces which OTA bundle a build is actually running, so a preview/production
// release can be identified at a glance instead of guessing whether `eas update`
// landed. The "Check for update" button fetches + reloads on demand, sidestepping
// expo-updates' default "apply on next cold start" behavior during testing.
//
// In dev/Expo Go, Updates.isEnabled is false and the imperative calls throw, so the
// button is disabled and the running-update fields read as embedded.
export function BuildInfo() {
  const c = useColors();
  const { currentlyRunning, isUpdateAvailable } = Updates.useUpdates();
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const updateId = currentlyRunning.updateId;
  const createdAt = currentlyRunning.createdAt;
  const isEmbedded = currentlyRunning.isEmbeddedLaunch;

  async function checkForUpdate() {
    if (busy) return;
    if (!Updates.isEnabled) {
      setStatus("Updates are disabled in this build (dev client / Expo Go).");
      return;
    }
    setBusy(true);
    try {
      setStatus("Checking…");
      const res = await Updates.checkForUpdateAsync();
      if (!res.isAvailable) {
        setStatus("You're on the latest update.");
        return;
      }
      setStatus("Downloading…");
      await Updates.fetchUpdateAsync();
      setStatus("Restarting…");
      // Applies the freshly-downloaded bundle immediately.
      await Updates.reloadAsync();
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Update check failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <View style={{ gap: 8 }}>
      <ThemedText
        style={{
          color: c.fgSubtle, fontSize: 9, letterSpacing: 1.8,
          textTransform: "uppercase", fontWeight: "700",
        }}
      >
        Build Info
      </ThemedText>
      <View
        style={{
          backgroundColor: c.surface,
          borderColor: c.borderHairline,
          borderWidth: 1,
          borderRadius: 6,
          padding: 14,
          gap: 8,
        }}
      >
        <InfoRow label="Channel" value={currentlyRunning.channel ?? "—"} />
        <InfoRow label="Runtime" value={currentlyRunning.runtimeVersion ?? "—"} />
        <InfoRow
          label="Update"
          value={isEmbedded || !updateId ? "Embedded (no OTA)" : updateId.slice(0, 8)}
        />
        <InfoRow
          label="Published"
          value={createdAt ? createdAt.toLocaleString() : "—"}
        />
        {isUpdateAvailable ? (
          <ThemedText style={{ color: c.warning, fontSize: 11 }}>
            A newer update is available.
          </ThemedText>
        ) : null}

        <Pressable
          onPress={checkForUpdate}
          disabled={busy}
          style={({ pressed }) => [
            styles.btn,
            {
              borderColor: c.activeHighlightBorder,
              backgroundColor: pressed ? c.activeHighlightBorder : c.activeHighlightBg,
              opacity: busy ? 0.5 : 1,
            },
          ]}
        >
          <ThemedText
            style={{
              color: c.activeHighlight, fontSize: 11, fontWeight: "700",
              letterSpacing: 1.8, textTransform: "uppercase",
            }}
          >
            {busy ? "Working…" : "Check for update"}
          </ThemedText>
        </Pressable>

        {status ? (
          <ThemedText style={{ color: c.fgMuted, fontSize: 11 }}>{status}</ThemedText>
        ) : null}
      </View>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  const c = useColors();
  return (
    <View style={styles.row}>
      <ThemedText style={{ color: c.fgSubtle, fontSize: 12 }}>{label}</ThemedText>
      <ThemedText style={{ color: c.fg, fontSize: 12, fontWeight: "600" }}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  btn: {
    marginTop: 4,
    alignSelf: "stretch",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
});
