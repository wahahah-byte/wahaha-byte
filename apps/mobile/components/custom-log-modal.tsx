import { useEffect, useRef, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, StyleSheet, TextInput, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  visible: boolean;
  cycleSum: number;
  pendingLog: number;
  counterGoal: number | null;
  counterUnit: string | null;
  onCancel: () => void;
  // Submit the new absolute total for today (>= 0); parent diffs against the current value.
  onSubmit: (amount: number) => void;
}

const MAX_DIGITS = 5;

export function CustomLogModal({
  visible,
  cycleSum,
  pendingLog,
  counterGoal,
  counterUnit,
  onCancel,
  onSubmit,
}: Props) {
  const c = useColors();
  const [text, setText] = useState("");
  const inputRef = useRef<TextInput>(null);
  // Snapshot current total at open time so live updates from background flushes don't clobber the user's input.
  const currentTotalRef = useRef(0);
  currentTotalRef.current = cycleSum + pendingLog;

  useEffect(() => {
    if (visible) {
      setText(String(currentTotalRef.current));
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const digits = text.replace(/[^0-9]/g, "").slice(0, MAX_DIGITS);
  const amount = digits === "" ? 0 : parseInt(digits, 10);
  const currentTotal = cycleSum + pendingLog;
  const changed = digits !== "" && amount !== currentTotal;
  const canSubmit = changed;
  const unit = counterUnit ? ` ${counterUnit}` : "";
  const willCheckIn = counterGoal != null && amount >= counterGoal;
  const delta = amount - currentTotal;

  function submit() {
    if (!canSubmit) return;
    onSubmit(amount);
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.kbWrap}
        >
          <Pressable onPress={(e) => e.stopPropagation()} style={{ width: "100%" }}>
            <View
              style={[
                styles.sheet,
                { backgroundColor: c.surface, borderColor: c.borderHairline },
              ]}
            >
            <ThemedText
              style={{
                fontSize: 11,
                letterSpacing: 1.6,
                textTransform: "uppercase",
                fontWeight: "700",
                color: c.fgMuted,
              }}
            >
              Set today&apos;s total
            </ThemedText>

            <View
              style={[
                styles.inputWrap,
                { borderColor: canSubmit ? c.activeHighlightAlt : c.borderHairline },
              ]}
            >
              <TextInput
                ref={inputRef}
                value={digits}
                onChangeText={setText}
                keyboardType="number-pad"
                maxLength={MAX_DIGITS}
                placeholder="0"
                placeholderTextColor={c.fgMuted}
                underlineColorAndroid="transparent"
                selectTextOnFocus
                style={[
                  {
                    flex: 1,
                    fontSize: 28,
                    fontWeight: "700",
                    color: c.fg,
                    textAlign: "center",
                    paddingVertical: 12,
                    paddingHorizontal: 0,
                  },
                  // Suppress web's default focus outline (which can render as a left/right edge line under our border).
                  Platform.OS === "web" ? { outlineStyle: "none" as never } : null,
                ]}
                onSubmitEditing={submit}
                returnKeyType="done"
              />
              {unit ? (
                <ThemedText style={{ color: c.fgMuted, fontSize: 14, marginLeft: 8 }}>
                  {unit.trim()}
                </ThemedText>
              ) : null}
            </View>

            <View style={{ gap: 2 }}>
              <ThemedText style={{ color: c.fgMuted, fontSize: 12 }}>
                Was {currentTotal.toLocaleString()}
                {counterGoal != null ? ` / ${counterGoal.toLocaleString()}` : ""}
                {unit}
                {changed ? (
                  <ThemedText
                    style={{
                      color: delta > 0 ? c.success : c.warning,
                      fontWeight: "600",
                    }}
                  >
                    {`   ${delta > 0 ? "+" : "−"}${Math.abs(delta).toLocaleString()}`}
                  </ThemedText>
                ) : null}
              </ThemedText>
              {willCheckIn ? (
                <ThemedText style={{ color: c.success, fontSize: 12, fontWeight: "600" }}>
                  Goal reached — will check in.
                </ThemedText>
              ) : null}
            </View>

            <View style={styles.actionRow}>
              <Pressable
                onPress={onCancel}
                style={({ pressed }) => [
                  styles.actionBtn,
                  {
                    borderColor: c.borderHairline,
                    backgroundColor: pressed ? c.overlayHover : "transparent",
                  },
                ]}
              >
                <ThemedText style={{ color: c.fg, fontSize: 14, fontWeight: "600" }}>
                  Cancel
                </ThemedText>
              </Pressable>
              <Pressable
                onPress={submit}
                disabled={!canSubmit}
                style={({ pressed }) => [
                  styles.actionBtn,
                  {
                    borderColor: c.activeHighlightAlt,
                    backgroundColor: canSubmit
                      ? pressed
                        ? c.activeHighlightBg
                        : c.activeHighlightAlt
                      : "transparent",
                    opacity: canSubmit ? 1 : 0.4,
                  },
                ]}
              >
                <ThemedText
                  style={{
                    color: canSubmit ? c.onActiveHighlightAlt : c.fgMuted,
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  {willCheckIn ? "Set & Check in" : "Set"}
                </ThemedText>
              </Pressable>
            </View>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  kbWrap: {
    width: "100%",
    padding: 16,
  },
  sheet: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    gap: 14,
    marginBottom: 24,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    overflow: "hidden",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
