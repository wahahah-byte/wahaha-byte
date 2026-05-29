import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

interface Props {
  c: ReturnType<typeof useColors>;
  onBack: () => void;
  backLabel?: string;
  right?: React.ReactNode;
}

// Full-page header with back arrow + optional right slot. Used at the top of the task
// detail sheet (and the edit-mode variant inside the same screen).
export function PageHeader({ c, onBack, backLabel, right }: Props) {
  return (
    <View style={styles.pageHeader}>
      <Pressable
        onPress={onBack}
        hitSlop={10}
        style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.5 : 1 }]}
      >
        <ThemedText style={[styles.backArrow, { color: c.fg }]}>‹</ThemedText>
        {backLabel ? (
          <ThemedText style={[styles.backLabel, { color: c.fg }]}>{backLabel}</ThemedText>
        ) : null}
      </Pressable>
      <View style={styles.headerRight}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 0,
    minHeight: 26,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  backArrow: {
    fontSize: 26,
    lineHeight: 26,
    fontWeight: "300",
  },
  backLabel: {
    fontSize: 14,
    marginLeft: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
});
