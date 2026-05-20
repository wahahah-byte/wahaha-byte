import React from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Rect } from "react-native-svg";

import { type CheckInCycleDto, dateKey } from "@wahaha/shared";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";

const HEATMAP_WEEKS = 12;
const CELL_SIZE = 14;
const CELL_GAP = 3;
const LABEL_COL = 22;
const TOP_LABEL_ROW = 10;
const LEVEL_OPACITY = [0, 0.30, 0.55, 0.80, 1.0];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface Props {
  rule: string;
  hasCounter: boolean;
  cycles: CheckInCycleDto[];
  pendingTodayDelta?: number;
}

export function HeatmapStrip({ rule, hasCounter, cycles, pendingTodayDelta = 0 }: Props) {
  const c = useColors();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = dateKey(today);
  const todayDow = today.getDay();

  const start = new Date(today);
  start.setDate(start.getDate() - todayDow - (HEATMAP_WEEKS - 1) * 7);

  type Cell = { date: Date; key: string; dow: number; isFuture: boolean; isWeekend: boolean };
  const columns: Cell[][] = [];
  for (let col = 0; col < HEATMAP_WEEKS; col++) {
    const cells: Cell[] = [];
    for (let r = 0; r < 7; r++) {
      const d = new Date(start);
      d.setDate(start.getDate() + col * 7 + r);
      cells.push({
        date: d,
        key: dateKey(d),
        dow: r,
        isFuture: d.getTime() > today.getTime(),
        isWeekend: r === 0 || r === 6,
      });
    }
    columns.push(cells);
  }

  const dayByDate = new Map<string, { sum: number; hasValue: boolean }>();
  for (const cy of cycles) {
    const key = cy.checkInDate.split("T")[0];
    const entry = dayByDate.get(key) ?? { sum: 0, hasValue: false };
    if (typeof cy.counterValue === "number") {
      entry.sum += cy.counterValue;
      entry.hasValue = true;
    }
    dayByDate.set(key, entry);
  }
  if (pendingTodayDelta !== 0) {
    const entry = dayByDate.get(todayKey) ?? { sum: 0, hasValue: false };
    entry.sum += pendingTodayDelta;
    entry.hasValue = true;
    dayByDate.set(todayKey, entry);
  }
  const maxValue = Math.max(
    1,
    ...Array.from(dayByDate.values()).map((d) => d.sum),
  );

  function levelFor(cell: Cell): number {
    const day = dayByDate.get(cell.key);
    if (!day) return 0;
    if (!hasCounter) return 4;
    const v = day.sum;
    if (v <= 0) return 1;
    const ratio = v / maxValue;
    if (ratio < 0.34) return 1;
    if (ratio < 0.67) return 2;
    if (ratio < 1.0) return 3;
    return 4;
  }

  const visibleCells = columns.flat().filter((cc) => !cc.isFuture);
  const totalExpected = rule === "weekdays"
    ? visibleCells.filter((cc) => !cc.isWeekend).length
    : visibleCells.length;
  const checkedCount = visibleCells.reduce((n, cc) => (dayByDate.has(cc.key) ? n + 1 : n), 0);

  const monthLabels: (string | null)[] = columns.map((col, ci) => {
    const m = col[0].date.getMonth();
    if (ci === 0) return MONTHS_SHORT[m];
    return m !== columns[ci - 1][0].date.getMonth() ? MONTHS_SHORT[m] : null;
  });

  const gridWidth = LABEL_COL + CELL_GAP + HEATMAP_WEEKS * CELL_SIZE + (HEATMAP_WEEKS - 1) * CELL_GAP;
  const gridHeight = TOP_LABEL_ROW + CELL_GAP + 7 * CELL_SIZE + 6 * CELL_GAP;

  function cellX(c: number) { return LABEL_COL + CELL_GAP + c * (CELL_SIZE + CELL_GAP); }
  function cellY(r: number) { return TOP_LABEL_ROW + CELL_GAP + r * (CELL_SIZE + CELL_GAP); }

  return (
    // pointerEvents: none so DetailPager swipe gesture isn't intercepted.
    <View style={{ gap: 8, pointerEvents: "none" }}>
      <View style={styles.headerRow}>
        <ThemedText style={[styles.captionUpper, { color: c.fgSubtle }]}>
          Last {HEATMAP_WEEKS} weeks
        </ThemedText>
        <ThemedText style={[styles.caption, { color: c.fgSubtle, fontVariant: ["tabular-nums"] }]}>
          {checkedCount}/{totalExpected}
        </ThemedText>
      </View>

      <View style={{ alignItems: "center" }}>
        {/* Width-pinned wrapper so absolute labels share Svg coords. */}
        <View style={{ width: gridWidth, height: gridHeight, position: "relative" }}>
        <Svg width={gridWidth} height={gridHeight}>
          {/* Cells */}
          {columns.flatMap((col, ci) =>
            col.map((cell, r) => {
              if (cell.isFuture) return null;
              const x = cellX(ci);
              const y = cellY(r);
              const isWeekendOff = rule === "weekdays" && cell.isWeekend;
              const checked = dayByDate.has(cell.key);
              const level = levelFor(cell);
              const isToday = cell.key === todayKey;
              const fill = checked
                ? c.activeHighlightAlt
                : isWeekendOff
                  ? "transparent"
                  : c.borderSoft;
              const op = checked ? LEVEL_OPACITY[level] : 1;
              return (
                <React.Fragment key={cell.key}>
                  <Rect
                    x={x}
                    y={y}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    rx={2}
                    ry={2}
                    fill={fill}
                    fillOpacity={op}
                    stroke={isWeekendOff && !checked ? c.borderFaint : undefined}
                    strokeDasharray={isWeekendOff && !checked ? "2,2" : undefined}
                    strokeWidth={isWeekendOff && !checked ? 1 : 0}
                  />
                  {isToday ? (
                    <Rect
                      x={x + 0.75}
                      y={y + 0.75}
                      width={CELL_SIZE - 1.5}
                      height={CELL_SIZE - 1.5}
                      rx={1.5}
                      ry={1.5}
                      fill="none"
                      stroke={c.activeHighlight}
                      strokeWidth={1.5}
                    />
                  ) : null}
                </React.Fragment>
              );
            }),
          )}
        </Svg>

        {/* DOW + month labels overlaid via absolute positioning. */}
        <View style={[StyleSheet.absoluteFillObject, { width: gridWidth, pointerEvents: "none" }]}>
          {[0, 1, 2, 3, 4, 5, 6].map((r) => {
            const label = r === 1 ? "Mon" : r === 3 ? "Wed" : r === 5 ? "Fri" : "";
            if (!label) return null;
            return (
              <ThemedText
                key={`d-${r}`}
                style={{
                  position: "absolute",
                  left: 0,
                  top: cellY(r) + (CELL_SIZE - 10) / 2,
                  width: LABEL_COL - 2,
                  fontSize: 8,
                  textAlign: "right",
                  color: c.fgSubtle,
                  lineHeight: 10,
                }}
              >
                {label}
              </ThemedText>
            );
          })}
          {monthLabels.map((m, ci) => {
            if (!m) return null;
            return (
              <ThemedText
                key={`m-${ci}`}
                style={{
                  position: "absolute",
                  left: cellX(ci),
                  top: 0,
                  fontSize: 8,
                  color: c.fgSubtle,
                  letterSpacing: 0.6,
                  textTransform: "uppercase",
                  lineHeight: 10,
                }}
              >
                {m}
              </ThemedText>
            );
          })}
        </View>
        </View>
      </View>

      {hasCounter ? (
        <View style={[styles.legend, { alignSelf: "flex-end" }]}>
          <ThemedText style={[styles.caption, { color: c.fgSubtle, textTransform: "uppercase", letterSpacing: 0.4 }]}>
            Less
          </ThemedText>
          <View style={[styles.legendDot, { backgroundColor: c.borderSoft }]} />
          {[1, 2, 3, 4].map((lvl) => (
            <View
              key={lvl}
              style={[
                styles.legendDot,
                { backgroundColor: c.activeHighlightAlt, opacity: LEVEL_OPACITY[lvl] },
              ]}
            />
          ))}
          <ThemedText style={[styles.caption, { color: c.fgSubtle, textTransform: "uppercase", letterSpacing: 0.4 }]}>
            More
          </ThemedText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  caption: { fontSize: 9 },
  captionUpper: { fontSize: 9, letterSpacing: 1.6, textTransform: "uppercase" },
  legend: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 10, height: 10, borderRadius: 2 },
});
