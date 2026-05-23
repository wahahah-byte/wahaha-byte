// Small utilities shared across the task detail surface (date labels + bottom-sheet
// factories that need to close over palette/inset state).

import React from "react";
import { StyleSheet, View } from "react-native";
import type { BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";

import { parseLocalDate } from "@wahaha/shared";

import { useColors } from "@/hooks/use-colors";

export function fmtShort(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function fmtFull(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Drag handle pill at top of sheet; always a guaranteed drag target. Returns a stable
// component so BottomSheet doesn't re-mount its handle on each render of the parent.
export function makeSheetHandle(c: ReturnType<typeof useColors>, topInset: number) {
  return function SheetHandle() {
    return (
      <View
        style={[
          styles.dragZone,
          { paddingTop: topInset + 10, backgroundColor: c.bg },
        ]}
      >
        <View style={[styles.dragHandle, { backgroundColor: c.border }]} />
      </View>
    );
  };
}

// Solid sheet bg — opaque against the transparent-modal route's underlying screen.
export function makeSheetBackground(bg: string) {
  return function SheetBackground({ style }: BottomSheetBackgroundProps) {
    return <View style={[style, { backgroundColor: bg }]} />;
  };
}

const styles = StyleSheet.create({
  dragZone: {
    paddingTop: 10,
    paddingBottom: 8,
    alignItems: "center",
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
});
