import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";

// Compact metadata pill — used in the task detail chip row (priority, category, points,
// due date, recurrence). Background is a 10% tint of the chip color when color is a hex.
export function MetaChip({
  color,
  label,
  leading,
}: {
  color: string;
  label: string;
  leading?: React.ReactNode;
}) {
  // Translucent tint: ${color}1A appends 10% alpha for hex.
  const bg = color.startsWith("#") ? `${color}1A` : color;
  return (
    <View
      style={[
        styles.chip,
        {
          borderColor: color,
          backgroundColor: color.startsWith("#") ? bg : "transparent",
        },
      ]}
    >
      {leading}
      <ThemedText
        style={{
          color,
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 1.2,
        }}
      >
        {label}
      </ThemedText>
    </View>
  );
}

// Round icon button used for task-status actions (start / complete / pause / undo).
export function IconActionBtn({
  color,
  bg,
  onPress,
  icon,
}: {
  color: string;
  bg: string;
  onPress: () => void;
  icon: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconBtn,
        {
          borderColor: color,
          backgroundColor: pressed ? color : bg,
        },
      ]}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
