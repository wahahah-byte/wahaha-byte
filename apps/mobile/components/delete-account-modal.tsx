import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  visible: boolean;
  // True while the parent's deleteAccount request is in flight — disables actions to prevent double-fire.
  busy: boolean;
  // String the user must type verbatim before the Delete button arms.
  requiredText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Two-step deletion modal — typed confirmation prevents accidental destructive taps.
// Mirrors the web DeleteAccountModal so behaviour is identical across platforms.
export function DeleteAccountModal({ visible, busy, requiredText, onConfirm, onCancel }: Props) {
  const c = useColors();
  const [typed, setTyped] = useState("");

  // Reset on each open so a previous attempt doesn't pre-arm the delete button.
  useEffect(() => {
    if (visible) setTyped("");
  }, [visible]);

  const confirmed = typed.trim() === requiredText;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={busy ? undefined : onCancel}
    >
      <Pressable style={styles.backdrop} onPress={busy ? undefined : onCancel}>
        <Pressable
          onPress={(e) => e.stopPropagation()}
          style={[
            styles.sheet,
            { backgroundColor: c.surface, borderColor: c.dangerBorder },
          ]}
        >
          <ThemedText
            style={{
              fontSize: 10,
              letterSpacing: 1.6,
              textTransform: "uppercase",
              fontWeight: "700",
              color: c.danger,
              marginBottom: 4,
            }}
          >
            Delete account
          </ThemedText>

          <ThemedText style={{ color: c.fgMuted, fontSize: 12, lineHeight: 18 }}>
            This permanently deletes your account, all tasks, streaks, inventory, points history,
            and profile picture.{" "}
            <ThemedText style={{ color: c.fg, fontWeight: "700" }}>
              This cannot be undone.
            </ThemedText>
          </ThemedText>

          <View style={{ marginTop: 10, gap: 6 }}>
            <ThemedText
              style={{
                fontSize: 10,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                fontWeight: "700",
                color: c.fgMuted,
              }}
            >
              Type{" "}
              <ThemedText style={{ color: c.danger, fontFamily: "Courier", textTransform: "none" }}>
                {requiredText}
              </ThemedText>{" "}
              to confirm
            </ThemedText>
            <TextInput
              value={typed}
              onChangeText={setTyped}
              editable={!busy}
              autoFocus
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              style={{
                backgroundColor: c.input,
                color: c.inputFg,
                borderWidth: 1,
                borderColor: confirmed ? c.dangerBorder : c.border,
                borderRadius: 3,
                paddingHorizontal: 12,
                paddingVertical: 10,
                fontSize: 14,
                fontFamily: "Courier",
              }}
            />
          </View>

          <View style={styles.actionRowGroup}>
            <Pressable
              onPress={busy ? undefined : onCancel}
              disabled={busy}
              style={({ pressed }) => [
                styles.btn,
                {
                  borderColor: c.border,
                  backgroundColor: pressed && !busy ? c.overlayHover : "transparent",
                  opacity: busy ? 0.5 : 1,
                  flex: 1,
                },
              ]}
            >
              <ThemedText style={{ color: c.fg, fontSize: 12, fontWeight: "600", letterSpacing: 1, textTransform: "uppercase" }}>
                Cancel
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={busy || !confirmed ? undefined : onConfirm}
              disabled={busy || !confirmed}
              style={({ pressed }) => [
                styles.btn,
                {
                  borderColor: c.dangerBorder,
                  backgroundColor: pressed && !busy && confirmed ? c.dangerBg : "transparent",
                  opacity: busy || !confirmed ? 0.4 : 1,
                  flex: 1.2,
                },
              ]}
            >
              <ThemedText style={{ color: c.danger, fontSize: 12, fontWeight: "700", letterSpacing: 1, textTransform: "uppercase" }}>
                {busy ? "Deleting…" : "Delete forever"}
              </ThemedText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  sheet: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 6,
    gap: 4,
  },
  actionRowGroup: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  btn: {
    paddingVertical: 11,
    borderWidth: 1,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
  },
});
