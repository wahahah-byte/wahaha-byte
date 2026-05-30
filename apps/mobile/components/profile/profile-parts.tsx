import { Pressable, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

import { ThemedText } from "@/components/themed-text";
import type { useColors } from "@/hooks/use-colors";
import { styles } from "@/components/profile/styles";

type Colors = ReturnType<typeof useColors>;

export function Section({ title, children, c }: { title: string; children: React.ReactNode; c: Colors }) {
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

export function Field({ label, value, c }: { label: string; value: string; c: Colors }) {
  return (
    <View style={{ gap: 2, marginBottom: 8 }}>
      <ThemedText style={{ color: c.fgSubtle, fontSize: 9, letterSpacing: 1.2, textTransform: "uppercase" }}>
        {label}
      </ThemedText>
      <ThemedText style={{ color: c.fg, fontSize: 12 }}>{value}</ThemedText>
    </View>
  );
}

export function Stat({ label, value, c }: { label: string; value: string; c: Colors }) {
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

export function FooterTab({
  label, icon, onPress, c,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  c: Colors;
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

export function SettingsIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx={12} cy={12} r={3} />
      <Path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.65 8.6a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34H9a1.7 1.7 0 0 0 1.03-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87V9a1.7 1.7 0 0 0 1.56 1.03H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.56 1.03Z" />
    </Svg>
  );
}

export function ShopIcon({ color }: { color: string }) {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M5 8h14l-1 12H6L5 8Z" />
      <Path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </Svg>
  );
}
