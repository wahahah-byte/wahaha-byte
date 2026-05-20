import { Modal, Pressable, StyleSheet, View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  visible: boolean;
  selectedPts: number;
  willAward: number;
  remaining: number;
  onClose: () => void;
  onConfirm: () => void;
}

// Daily-cap confirmation when submitting more pts than remaining daily cap.
export function CapWarningModal({
  visible, selectedPts, willAward, remaining, onClose, onConfirm,
}: Props) {
  const c = useColors();
  const lost = (selectedPts - willAward).toLocaleString();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[
            styles.card,
            {
              backgroundColor: c.surface,
              borderColor: c.dangerBorder,
            },
          ]}
          onPress={(e) => e.stopPropagation?.()}
        >
          <View style={styles.header}>
            <Svg width={20} height={20} viewBox="0 0 20 20" fill="none" style={{ marginTop: 2 }}>
              <Path d="M10 2L18 17H2L10 2Z" stroke={c.danger} strokeWidth={1.5} strokeLinejoin="round" />
              <Line x1="10" y1="8" x2="10" y2="12" stroke={c.danger} strokeWidth={1.5} strokeLinecap="round" />
              <Circle cx={10} cy={14.5} r={0.9} fill={c.danger} />
            </Svg>
            <View style={{ flex: 1, gap: 4 }}>
              <ThemedText style={{ color: c.danger, fontSize: 14, fontWeight: "600", letterSpacing: 0.5 }}>
                Daily Cap Exceeded
              </ThemedText>
              <ThemedText style={{ color: c.fgMuted, fontSize: 12, lineHeight: 17 }}>
                You&apos;re submitting{" "}
                <ThemedText style={{ color: c.fg, fontWeight: "600" }}>
                  {selectedPts.toLocaleString()} pts
                </ThemedText>{" "}
                but only{" "}
                <ThemedText style={{ color: c.fg, fontWeight: "600" }}>{remaining} pts</ThemedText>{" "}
                of your regular daily limit remain.
              </ThemedText>
              <ThemedText style={{ color: c.danger, fontSize: 12, fontWeight: "600" }}>
                {lost} pts will be lost.
              </ThemedText>
            </View>
          </View>
          <View style={styles.actions}>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                styles.button,
                { borderColor: c.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <ThemedText style={{ color: c.fgMuted, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" }}>
                Cancel
              </ThemedText>
            </Pressable>
            <Pressable
              onPress={() => { onClose(); onConfirm(); }}
              style={({ pressed }) => [
                styles.button,
                {
                  borderColor: c.dangerBorder,
                  backgroundColor: c.dangerBg,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <ThemedText style={{ color: c.danger, fontSize: 11, letterSpacing: 1.4, textTransform: "uppercase" }}>
                Submit anyway ({willAward}p)
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: "100%",
    maxWidth: 360,
    borderWidth: 1,
    borderRadius: 4,
    padding: 18,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 3,
  },
});
