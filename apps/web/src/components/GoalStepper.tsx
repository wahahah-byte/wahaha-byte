"use client";

interface Props {
  value: string;
  onChange: (next: string) => void;
  min?: number;
  max?: number;
  step?: number;
}

export default function GoalStepper({ value, onChange, min = 0, max = 99999, step = 1 }: Props) {
  const numeric = value.trim() === "" ? null : Number(value);
  const valid = numeric != null && Number.isFinite(numeric);

  function nudge(delta: number) {
    const base = valid ? numeric! : 0;
    const next = Math.max(min, Math.min(max, base + delta));
    onChange(String(next));
  }

  const atMin = valid && numeric! <= min;
  const atMax = valid && numeric! >= max;

  return (
    <div className="goal-stepper">
      <button
        type="button"
        className="goal-stepper-btn"
        onClick={() => nudge(-step)}
        disabled={atMin}
        aria-label="Decrease goal"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        className="goal-stepper-input"
      />
      <button
        type="button"
        className="goal-stepper-btn"
        onClick={() => nudge(step)}
        disabled={atMax}
        aria-label="Increase goal"
      >
        +
      </button>
    </div>
  );
}
