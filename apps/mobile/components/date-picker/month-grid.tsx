import { memo } from "react";
import { Pressable, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import type { useColors } from "@/hooks/use-colors";
import { styles } from "@/components/date-picker/styles";

export interface MonthData {
  month: number;
  year: number;
  cells: (number | null)[];
}

export function shiftedMonth(month: number, year: number, delta: number): { month: number; year: number } {
  let m = month + delta;
  let y = year;
  while (m < 0) { m += 12; y -= 1; }
  while (m > 11) { m -= 12; y += 1; }
  return { month: m, year: y };
}

export function buildMonth(month: number, year: number): MonthData {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length < 42) cells.push(null);
  return { month, year, cells };
}

interface MonthGridProps {
  data: MonthData;
  pendingValue: Date | null;
  todayMidnight: Date;
  today: Date;
  onPick: (d: Date) => void;
  c: ReturnType<typeof useColors>;
}

// memo'd — only month with pendingValue repaints during sheet animation.
export const MonthGrid = memo(function MonthGrid({ data, pendingValue, todayMidnight, today, onPick, c }: MonthGridProps) {
  return (
    <View style={styles.grid}>
      {data.cells.map((day, i) => {
        const isPast = day !== null && new Date(data.year, data.month, day) < todayMidnight;
        const isSelected = day !== null && pendingValue !== null
          && pendingValue.getDate() === day
          && pendingValue.getMonth() === data.month
          && pendingValue.getFullYear() === data.year;
        const isToday = day !== null
          && today.getDate() === day
          && today.getMonth() === data.month
          && today.getFullYear() === data.year;

        const dayColor = day === null
          ? "transparent"
          : isPast
            ? c.fgSubtle
            : isSelected || isToday
              ? c.activeHighlight
              : c.fgMuted;

        return (
          <Pressable
            key={i}
            disabled={day === null || isPast}
            onPress={() => {
              if (!day) return;
              onPick(new Date(data.year, data.month, day));
            }}
            style={[
              styles.cell,
              isSelected
                ? { backgroundColor: c.activeHighlightBg, borderColor: c.activeHighlight }
                : null,
            ]}
          >
            <ThemedText
              style={{
                fontSize: 13,
                color: dayColor,
                fontWeight: isSelected || isToday ? "600" : "400",
              }}
            >
              {day ?? ""}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
});
