import { StyleSheet } from "react-native";

// Shared styles for the task-detail screen and its extracted sub-components.
export const styles = StyleSheet.create({
  // Page = sheet content root; explicit relative for 3 absolute children.
  // (dragZone/dragHandle moved to lib/task-detail-helpers.ts with makeSheetHandle.
  //  pageHeader/backBtn/backArrow/backLabel/headerRight moved to components/task-detail/page-header.tsx.)
  page: { flex: 1, position: "relative" },
  overflowBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  overflowMenu: {
    position: "absolute",
    // Anchored to the lower-right; `bottom` set inline so it can include
    // insets.bottom + footer trigger height for the correct upward offset.
    // right matches footerStack's paddingHorizontal so the menu's right
    // edge aligns with the ⋮ trigger.
    right: 16,
    minWidth: 140,
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.3)",
    elevation: 12,
  },
  overflowMenuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  overflowMenuLabel: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  // Body between header + footer; absolute top/bottom gives bounded height.
  body: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 4,
    gap: 14,
  },
  // Header anchor — onLayout feeds height back to body's `top`.
  headerAnchor: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  // Non-scrolling top: title/chips/streak/description/actions/counter.
  topBlock: { gap: 14 },
  // Subtasks panel — flex:1 + minHeight:0 so inner ScrollView respects bounds.
  subtasksPanel: { flex: 1, minHeight: 0 },
  subtasksScroll: { flex: 1 },
  subtasksContent: { paddingTop: 4, paddingBottom: 16 },
  // Footer anchor — absolute at sheet bottom; height feeds body padding.
  footerAnchor: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Invisible full-screen tap target behind SubtaskAddBar; zIndex between sheet + bar.
  // (SubtaskAddBar's own styles live in components/task-detail/subtask-add-bar.tsx.)
  subtaskAddBarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
  },
  // Footer column: TapSlideCheckIn + Edit/Delete row.
  footerStack: {
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  // Horizontal row that holds the primary action (slider / CTA buttons) on
  // the left and the ⋮ overflow trigger on the right. alignItems:center keeps
  // the trigger vertically centered against the taller CTA / slider.
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Non-counter slider host — caps + centers the slider to the same width as
  // the counter task's LogCheckinButton (maxWidth 280).
  sliderHost: {
    flex: 1,
    alignItems: "center",
  },
  sliderWrap: {
    width: "100%",
    maxWidth: 280,
  },
  // Primary CTA — filled fill, icon + label. Solid bg is unique in the
  // modal so it reads unambiguously as the action. Secondary CTA (Pause
  // beside Complete) keeps the outlined variant to demote it to a "less
  // common" action without losing recognizability.
  primaryCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  secondaryCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  primaryCtaLabel: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  // Compact pill row sized to label. (chip + iconActionBtn moved to
  // components/task-detail/meta-chip.tsx with MetaChip/IconActionBtn.)
  chipRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6 },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    // minHeight (not fixed height) so a wrapped 2-line subtask title doesn't
    // get clipped against the row's box.
    minHeight: 28,
    gap: 8,
  },
  // Subtask row padding inside SwipeableRow for breathing room.
  subRowPadded: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    minHeight: 36,
  },
  subCheckbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  subTrash: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  // Fitness-only chip on the right of a subtask row; tap to open the inline editor.
  setsChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
  },
});
