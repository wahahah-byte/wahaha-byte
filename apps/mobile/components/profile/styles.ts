import { StyleSheet } from "react-native";

// Styles for the profile screen + its extracted sections/footer.
export const styles = StyleSheet.create({
  page: { flex: 1 },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  bannerWrap: {
    borderRadius: 8,
    borderWidth: 1,
    position: "relative",
  },
  banner: {
    width: "100%",
    aspectRatio: 16 / 5,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerImg: { width: "100%", height: "100%", resizeMode: "cover" },
  bannerRemove: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarOverlap: {
    // -56 cancels the parent ScrollView gap (20) + ~36px overlap (50% of 72px avatar).
    marginTop: -56,
    marginLeft: 12,
    alignSelf: "flex-start",
    marginBottom: -8,
  },
  card: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 14,
  },
  divider: { height: 1, marginVertical: 2 },
  nameInput: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.2,
    padding: 0,
  },
  bioInput: {
    fontSize: 12,
    lineHeight: 18,
    minHeight: 54,
    padding: 0,
    textAlignVertical: "top",
  },
  bioReadOnly: {
    fontSize: 12,
    lineHeight: 18,
  },
  editBtn: {
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  swatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
  },
  statGrid: {
    flexDirection: "row",
    gap: 12,
  },
  footerNav: {
    flexDirection: "row",
    borderTopWidth: 1,
  },
  footerTab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingTop: 8,
  },
});
