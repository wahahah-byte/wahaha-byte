import { StyleSheet, View } from "react-native";

import { TaskList } from "@/components/task-list";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";

export default function ArchiveScreen() {
  const c = useColors();
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText
          style={{
            fontSize: 11, color: c.fg, fontWeight: "600",
            letterSpacing: 2, textTransform: "uppercase",
          }}
        >
          Archive
        </ThemedText>
      </View>
      <View style={styles.listWrap}>
        <TaskList
          filters={{ isArchived: true }}
          activeFilter="all"
          emptyText="Nothing archived."
        />
      </View>
    </ThemedView>
  );
}

// Matches web mobile archive layout (px-3, flush header).
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 12, paddingTop: 64, paddingBottom: 10 },
  listWrap: { flex: 1, paddingHorizontal: 12 },
});
