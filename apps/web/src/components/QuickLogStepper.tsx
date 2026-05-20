"use client";

import type { CheckInCycleDto } from "@/lib/api/tasks";

interface Props {
  cycleSum: number;
  pendingLog: number;
  showStepper: boolean;
  counterUnit?: string | null;
  counterGoal?: number | null;
  // Disables + once sum hits goal (also enforced server-side).
  capAtGoal?: boolean;
  // Reserved for future use; pendingLog ownership stays at parent.
  cycles?: CheckInCycleDto[];
  onIncrement: () => void;
  onDecrement: () => void;
}

// Presentational +/- counter; parent owns buffer + debounce.
export default function QuickLogStepper({
  cycleSum,
  pendingLog,
  showStepper,
  counterUnit,
  counterGoal,
  capAtGoal,
  onIncrement,
  onDecrement,
}: Props) {
  const sum = cycleSum + pendingLog;
  const goal = counterGoal ?? null;
  const capped = !!capAtGoal && goal != null && sum >= goal;

  // Nothing to show and no input affordance.
  if (cycleSum === 0 && pendingLog === 0 && goal == null && !showStepper) return null;

  const unit = counterUnit ? ` ${counterUnit}` : "";
  const reached = goal != null && sum >= goal;
  const innerText = goal != null
    ? `${sum.toLocaleString()} / ${goal.toLocaleString()}${unit}`
    : `${sum.toLocaleString()}${unit}`;

  const quantity = showStepper ? (
    <span className="goal-stepper" aria-label="Quick log" style={{ height: 20, verticalAlign: "middle" }}>
      <button
        type="button"
        className="goal-stepper-btn"
        onClick={onDecrement}
        disabled={sum <= 0}
        aria-label="Log -1"
      >
        −
      </button>
      <span
        className="goal-stepper-input"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 600,
          color: "var(--color-fg)",
          width: "auto",
          padding: "0 8px",
          whiteSpace: "nowrap",
        }}
        aria-live="polite"
      >
        {innerText}
        {reached && <span style={{ marginLeft: 6, color: "var(--color-success)" }}>✓</span>}
      </span>
      <button
        type="button"
        className="goal-stepper-btn"
        onClick={onIncrement}
        disabled={capped}
        title={capped ? "Capped at goal" : undefined}
        aria-label="Log +1"
      >
        +
      </button>
    </span>
  ) : (
    <span>{innerText}{reached && <span style={{ marginLeft: 6, color: "var(--color-success)" }}>✓</span>}</span>
  );

  const labelStyle = {
    fontSize: 11,
    color: "var(--color-fg)",
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums" as const,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  };

  if (goal == null) {
    return (
      <span style={labelStyle}>
        Today
        {quantity}
      </span>
    );
  }

  const pct = Math.min(100, Math.round((sum / goal) * 100));
  return (
    <div className="flex flex-col items-center gap-1.5" style={{ minWidth: 180 }}>
      <span style={labelStyle}>
        Today
        {quantity}
      </span>
      <div style={{ width: "100%", height: 4, background: "var(--color-track)", borderRadius: 2, overflow: "hidden" }}>
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: reached ? "var(--color-success)" : "var(--color-active-highlight-alt)",
            transition: "width 0.3s",
          }}
        />
      </div>
    </div>
  );
}
