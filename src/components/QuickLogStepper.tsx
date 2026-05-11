"use client";

import type { CheckInCycleDto } from "@/lib/api/tasks";

interface Props {
  cycleSum: number;
  pendingLog: number;
  showStepper: boolean;
  counterUnit?: string | null;
  counterGoal?: number | null;
  // When true, the + button disables once sum reaches goal. The cap is also
  // enforced server-side; this prop only suppresses optimistic taps so we
  // don't queue deltas the API will reject and toast about.
  capAtGoal?: boolean;
  // Reserved for future external use; not read here. Keeps the parent's
  // state-coordination clean — the parent owns pendingLog because the
  // heatmap (a sibling) also reads it.
  cycles?: CheckInCycleDto[];
  onIncrement: () => void;
  onDecrement: () => void;
}

// Presentational +/- counter under the avatar. The pendingLog buffer, debounce
// timer, and unload handlers all live in the parent (TaskDetailModal) so that
// the heatmap on the sibling pager card can reflect pendingLog too — without
// it the avatar and heatmap drift by `pendingLog` for the duration of an
// in-flight flush.
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

  // Render nothing if there's nothing to display and no input affordance.
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
