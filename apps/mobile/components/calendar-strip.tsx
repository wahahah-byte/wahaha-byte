import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

// 7-day strip centered on today: 3 days before, today, 3 days after.
// Decorative for now — tap targets can be wired later.
const DAYS_BEFORE = 3;
const DAYS_AFTER = 3;

function buildDays(): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const out: Date[] = [];
  for (let i = -DAYS_BEFORE; i <= DAYS_AFTER; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    out.push(d);
  }
  return out;
}

const WEEKDAY_FMT = new Intl.DateTimeFormat("en-US", { weekday: "short" });

export function CalendarStrip() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  // Compute on mount so the date is correct relative to local timezone.
  const [days, setDays] = useState<Date[] | null>(null);
  useEffect(() => { setDays(buildDays()); }, []);

  if (!days) {
    // Reserve space so layout doesn't jump on hydration; keeps the safe-area
    // padding so the status bar doesn't overlap whatever's beneath.
    return <View style={{ height: 50 + insets.top, backgroundColor: c.bg }} />;
  }

  const todayKey = days[DAYS_BEFORE].toDateString();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: c.bg,
          borderBottomColor: c.borderSoft,
          paddingTop: 6 + insets.top,
        },
      ]}
    >
      {days.map((d) => {
        const isToday = d.toDateString() === todayKey;
        return (
          <View
            key={d.toISOString()}
            style={[
              styles.day,
              {
                backgroundColor: isToday ? c.activeHighlightBg : "transparent",
                borderColor: isToday ? c.activeHighlightBorder : "transparent",
              },
            ]}
          >
            <ThemedText
              style={{
                fontSize: 9,
                fontWeight: "600",
                letterSpacing: 1.4,
                textTransform: "uppercase",
                color: isToday ? c.activeHighlight : c.fgMuted,
              }}
            >
              {WEEKDAY_FMT.format(d)}
            </ThemedText>
            <ThemedText
              style={{
                fontSize: 16,
                fontWeight: "600",
                fontVariant: ["tabular-nums"],
                color: isToday ? c.activeHighlight : c.fgMuted,
                lineHeight: 18,
              }}
            >
              {d.getDate()}
            </ThemedText>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
  },
  day: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
});
