"use client";

import { CheckInCycleDto } from "@/lib/api/tasks";
import { dateKey } from "@/lib/dateUtils";

const HEATMAP_WEEKS = 12;
const CELL_SIZE = 14;
const CELL_GAP = 3;
const LABEL_COL = 22;
// Empty + 4 filled levels via opacity.
const LEVEL_OPACITY = [0, 0.30, 0.55, 0.80, 1.0];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface Props {
  rule: string;
  hasCounter: boolean;
  cycles: CheckInCycleDto[];
  pendingTodayDelta?: number;
}

export default function HeatmapStrip({ rule, hasCounter, cycles, pendingTodayDelta = 0 }: Props) {
  // GitHub-style 7xN grid: rows = day-of-week, cols = weeks oldest-first.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = dateKey(today);
  const todayDow = today.getDay(); // 0=Sun..6=Sat

  const start = new Date(today);
  start.setDate(start.getDate() - todayDow - (HEATMAP_WEEKS - 1) * 7);

  type Cell = { date: Date; key: string; dow: number; isFuture: boolean; isWeekend: boolean };
  const columns: Cell[][] = [];
  for (let c = 0; c < HEATMAP_WEEKS; c++) {
    const col: Cell[] = [];
    for (let r = 0; r < 7; r++) {
      const d = new Date(start);
      d.setDate(start.getDate() + c * 7 + r);
      col.push({
        date: d,
        key: dateKey(d),
        dow: r,
        isFuture: d.getTime() > today.getTime(),
        isWeekend: r === 0 || r === 6,
      });
    }
    columns.push(col);
  }

  // Aggregate cycles per date (sum counterValue, track presence).
  const dayByDate = new Map<string, { sum: number; hasValue: boolean }>();
  for (const c of cycles) {
    const key = c.checkInDate.split("T")[0];
    const entry = dayByDate.get(key) ?? { sum: 0, hasValue: false };
    if (typeof c.counterValue === "number") {
      entry.sum += c.counterValue;
      entry.hasValue = true;
    }
    dayByDate.set(key, entry);
  }
  // Fold buffered +/- delta into today's cell so heatmap matches avatar.
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

  // Tally over visible window; weekdays rule excludes weekends.
  const visibleCells = columns.flat().filter((c) => !c.isFuture);
  const totalExpected = rule === "weekdays"
    ? visibleCells.filter((c) => !c.isWeekend).length
    : visibleCells.length;
  const checkedCount = visibleCells.reduce((n, c) => (dayByDate.has(c.key) ? n + 1 : n), 0);

  // Month label per column, only when month changes from prior column.
  const monthLabels: (string | null)[] = columns.map((col, ci) => {
    const m = col[0].date.getMonth();
    if (ci === 0) return MONTHS_SHORT[m];
    return m !== columns[ci - 1][0].date.getMonth() ? MONTHS_SHORT[m] : null;
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Last {HEATMAP_WEEKS} weeks
        </span>
        <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.05em", fontVariantNumeric: "tabular-nums" }}>
          {checkedCount}/{totalExpected}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          role="img"
          aria-label={`Check-in heatmap for the last ${HEATMAP_WEEKS} weeks: ${checkedCount} of ${totalExpected}`}
          style={{
            display: "grid",
            gridTemplateColumns: `${LABEL_COL}px repeat(${HEATMAP_WEEKS}, ${CELL_SIZE}px)`,
            gridTemplateRows: `10px repeat(7, ${CELL_SIZE}px)`,
            columnGap: CELL_GAP,
            rowGap: CELL_GAP,
          }}
        >
          {/* Corner spacer */}
          <div style={{ gridColumn: 1, gridRow: 1 }} />

          {/* Month labels (overflow allowed) */}
          {monthLabels.map((m, c) => (
            <div
              key={`m-${c}`}
              style={{
                gridColumn: c + 2,
                gridRow: 1,
                fontSize: 8,
                color: "var(--color-fg-subtle)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                lineHeight: "10px",
                whiteSpace: "nowrap",
                overflow: "visible",
              }}
            >
              {m ?? ""}
            </div>
          ))}

          {/* Day-of-week labels (Mon/Wed/Fri only) */}
          {[0, 1, 2, 3, 4, 5, 6].map((r) => (
            <div
              key={`d-${r}`}
              style={{
                gridColumn: 1,
                gridRow: r + 2,
                fontSize: 8,
                color: "var(--color-fg-subtle)",
                letterSpacing: "0.05em",
                lineHeight: `${CELL_SIZE}px`,
                textAlign: "right",
                paddingRight: 2,
              }}
            >
              {r === 1 ? "Mon" : r === 3 ? "Wed" : r === 5 ? "Fri" : ""}
            </div>
          ))}

          {/* Cells: 7 rows x HEATMAP_WEEKS cols */}
          {columns.flatMap((col, c) =>
            col.map((cell, r) => {
              if (cell.isFuture) {
                return (
                  <div
                    key={cell.key}
                    style={{ gridColumn: c + 2, gridRow: r + 2, visibility: "hidden" }}
                  />
                );
              }
              const isWeekendOff = rule === "weekdays" && cell.isWeekend;
              const day = dayByDate.get(cell.key);
              const checked = !!day;
              const level = levelFor(cell);
              const isToday = cell.key === todayKey;
              const value = day?.hasValue ? day.sum : null;
              const tooltip = isWeekendOff && !checked
                ? `${fmtCycleDate(cell.key)} · off-day`
                : `${fmtCycleDate(cell.key)}${
                    checked
                      ? hasCounter
                        ? value != null ? ` · ${value.toLocaleString()}` : " · checked in"
                        : " · checked in"
                      : " · no check-in"
                  }`;
              return (
                <div
                  key={cell.key}
                  title={tooltip}
                  style={{
                    gridColumn: c + 2,
                    gridRow: r + 2,
                    borderRadius: 2,
                    background: checked
                      ? "var(--color-active-highlight-alt)"
                      : isWeekendOff
                        ? "transparent"
                        : "var(--color-border-soft)",
                    opacity: checked ? LEVEL_OPACITY[level] : 1,
                    border: isWeekendOff && !checked
                      ? "1px dashed var(--color-border-faint)"
                      : undefined,
                    // Inset today ring; outset would clip in DetailPager.
                    boxShadow: isToday
                      ? "inset 0 0 0 1.5px var(--color-active-highlight)"
                      : undefined,
                  }}
                />
              );
            }),
          )}
        </div>
      </div>

      {/* Legend (counter tasks only) */}
      {hasCounter && (
        <div
          className="flex items-center self-end"
          style={{
            gap: 4,
            fontSize: 8,
            color: "var(--color-fg-subtle)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          <span>Less</span>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--color-border-soft)" }} />
          {[1, 2, 3, 4].map((lvl) => (
            <span
              key={lvl}
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: "var(--color-active-highlight-alt)",
                opacity: LEVEL_OPACITY[lvl],
              }}
            />
          ))}
          <span>More</span>
        </div>
      )}
    </div>
  );
}

function fmtCycleDate(iso: string): string {
  const [y, m, d] = iso.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
