import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  selectedCount: number;
  selectedPts: number;
  willAward: number;
  isSubmitting: boolean;
  limitReached: boolean;
  capped: boolean;
  onSubmit: () => void;
}

function CoinIcon({ size = 11, color }: { size?: number; color: string }) {
  // Pixel coin (mirrors web SubmitBar).
  return (
    <Svg width={(size * 9) / 11} height={size} viewBox="0 0 10 12" fill="none">
      <Path
        d="M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z"
        fill={color}
        opacity={0.9}
      />
      <Rect x={4} y={5} width={2} height={2} fill="#000" opacity={0.45} />
    </Svg>
  );
}

// Mobile submit bar — pts summary + File button, replaces action bar when tasks selected.
export function MobileSubmitBar({
  selectedCount, selectedPts, willAward, isSubmitting, limitReached, capped, onSubmit,
}: Props) {
  const c = useColors();
  const buttonLabel = isSubmitting ? "…" : limitReached ? "Limit" : `File ${willAward}p ▶`;

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: c.surface, borderTopColor: c.warningBorder },
      ]}
    >
      <View style={styles.left}>
        <CoinIcon size={11} color={c.warning} />
        <ThemedText style={{ color: c.warning, fontSize: 12, fontWeight: "600" }}>
          {selectedCount} · {selectedPts.toLocaleString()}p
        </ThemedText>
        {limitReached ? (
          <ThemedText
            numberOfLines={1}
            style={{ color: c.danger, fontSize: 9, letterSpacing: 1, textTransform: "uppercase" }}
          >
            Limit
          </ThemedText>
        ) : capped ? (
          <ThemedText
            numberOfLines={1}
            style={{ color: c.danger, fontSize: 9, letterSpacing: 0.5 }}
          >
            −{(selectedPts - willAward).toLocaleString()}p
          </ThemedText>
        ) : null}
      </View>
      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting || limitReached}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: c.warningBg,
            borderColor: c.warningBorder,
            opacity: isSubmitting || limitReached ? 0.3 : pressed ? 0.7 : 1,
          },
        ]}
      >
        <ThemedText
          style={{
            color: c.warning,
            fontSize: 10,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            fontWeight: "600",
          }}
        >
          {buttonLabel}
        </ThemedText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    height: 56,
    borderTopWidth: 1,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minWidth: 0,
  },
  button: {
    height: 30,
    paddingHorizontal: 12,
    borderRadius: 2,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
