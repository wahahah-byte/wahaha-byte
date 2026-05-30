import { StyleSheet } from "react-native";

// Shared styles for the edge drawer panel + its rows/caps/popover.
export const styles = StyleSheet.create({
  panel: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    borderRightWidth: 1,
    flexDirection: "column",
    overflow: "hidden",
  },
  navRow: {
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    gap: 12,
    borderLeftWidth: 2,
  },
  navIconCell: { width: 18, alignItems: "center", justifyContent: "center" },
  capsBlock: {
    padding: 12,
    paddingTop: 12,
    paddingBottom: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  capsHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  capsHeaderLabel: { fontSize: 9, letterSpacing: 1.8, textTransform: "uppercase", fontWeight: "600" },
  capRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 },
  capLabel: { fontSize: 9, letterSpacing: 1.8, textTransform: "uppercase" },
  capValue: { fontSize: 9, fontWeight: "600", letterSpacing: 0.3 },
  capTrack: { width: "100%", height: 3, borderRadius: 999, overflow: "hidden" },
  userRow: {
    position: "relative",
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderTopWidth: 1,
  },
  // Whole-row trigger that opens the account menu — tap anywhere on avatar
  // or username collapses to a single tap target.
  userTrigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  avatarBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  popover: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: "100%",
    // Lifted off the user row so the popover doesn't hug it.
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
    elevation: 8,
  },
  popoverItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  popoverLabel: { fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase", fontWeight: "500" },
});
