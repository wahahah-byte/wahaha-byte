import { StyleSheet } from "react-native";

// Shared styles for TaskForm and its extracted CounterSection.
export const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 },
  avatarHero: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
    padding: 0,
    marginBottom: 8,
  },
  descInput: {
    fontSize: 12,
    lineHeight: 18,
    padding: 0,
    marginBottom: 12,
    minHeight: 36,
    textAlignVertical: "top",
  },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  pillCompact: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  // Matches detail-screen footer pill row.
  footerStack: {
    gap: 10,
    paddingTop: 14,
    marginTop: 4,
  },
  pinnedFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  bottomActionRow: {
    flexDirection: "row",
    gap: 8,
  },
  bottomActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomActionLabel: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  counterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  counterDisclosure: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
  },
  capChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  goalCluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
