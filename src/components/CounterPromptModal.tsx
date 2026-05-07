"use client";

import { useEffect, useRef, useState } from "react";

type Mode = "checkin" | "log";

interface Props {
  taskTitle: string;
  unit?: string | null;
  mode?: Mode;
  recentValues?: number[];
  onSubmit: (counterValue?: number) => void;
  onClose: () => void;
}

export default function CounterPromptModal({ taskTitle, unit, mode = "checkin", recentValues, onSubmit, onClose }: Props) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLog = mode === "log";

  // Most-recent distinct numeric values, capped at 3 — quick-pick chips.
  const chips = (recentValues ?? [])
    .filter((v): v is number => typeof v === "number" && Number.isFinite(v) && v >= 0)
    .filter((v, i, arr) => arr.indexOf(v) === i)
    .slice(0, 3);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function commit() {
    const trimmed = value.trim();
    if (trimmed === "") {
      if (isLog) { setError("Enter a value to log."); return; }
      onSubmit(undefined);
      return;
    }
    if (!/^\d+$/.test(trimmed)) {
      setError(isLog ? "Enter a whole number." : "Enter a whole number, or leave blank.");
      return;
    }
    const n = Number(trimmed);
    if (n < 0) { setError("Must be 0 or greater."); return; }
    onSubmit(n);
  }

  function pickChip(n: number) {
    setValue(String(n));
    if (error) setError(null);
    inputRef.current?.focus();
  }

  function step(delta: number) {
    const trimmed = value.trim();
    const current = trimmed === "" || !/^\d+$/.test(trimmed) ? 0 : Number(trimmed);
    const next = Math.max(0, current + delta);
    setValue(String(next));
    if (error) setError(null);
    inputRef.current?.focus();
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center px-4"
      style={{ background: "var(--color-modal-overlay)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-xs relative"
        style={{
          background: "var(--color-panel)",
          border: "1px solid var(--color-border)",
          borderRadius: "6px",
          boxShadow: "var(--shadow-popover)",
          padding: "18px 18px 14px",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2 right-2 transition-colors text-base leading-none cursor-pointer flex items-center justify-center"
          style={{
            color: "var(--color-fg-subtle)",
            background: "transparent",
            border: "none",
            width: 26,
            height: 26,
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
        >
          ✕
        </button>

        <div className="mb-3 pr-8">
          <div className="text-[9px] tracking-widest uppercase mb-1" style={{ color: "var(--color-fg-subtle)" }}>{isLog ? "Log progress" : "Check in"}</div>
          <div className="truncate" style={{ color: "var(--color-fg)", fontSize: "14px", fontWeight: 600 }}>{taskTitle}</div>
        </div>

        <label className="text-[9px] tracking-widest uppercase block mb-1" style={{ color: "var(--color-fg-subtle)" }}>
          {isLog ? "Counter" : "Counter (optional)"}{unit ? ` · ${unit}` : ""}
        </label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => step(-5)}
            aria-label="Decrease by 5"
            className="cursor-pointer transition-colors"
            style={{
              background: "var(--color-input)",
              color: "var(--color-fg-muted)",
              border: "1px solid var(--color-border-hairline)",
              borderRadius: "3px",
              width: 32,
              padding: "6px 0",
              fontSize: "12px",
              fontVariantNumeric: "tabular-nums",
              fontWeight: 600,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-muted)")}
          >−5</button>
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={(e) => { setValue(e.target.value); if (error) setError(null); }}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); commit(); }
              else if (e.key === "Escape") { e.preventDefault(); onClose(); }
            }}
            placeholder="e.g. 47"
            className="flex-1 outline-none text-center"
            style={{
              background: "var(--color-input)",
              color: "var(--color-input-fg)",
              border: "1px solid var(--color-border-hairline)",
              borderRadius: "3px",
              padding: "6px 8px",
              fontSize: "13px",
              fontVariantNumeric: "tabular-nums",
              minWidth: 0,
            }}
          />
          <button
            type="button"
            onClick={() => step(5)}
            aria-label="Increase by 5"
            className="cursor-pointer transition-colors"
            style={{
              background: "var(--color-input)",
              color: "var(--color-fg-muted)",
              border: "1px solid var(--color-border-hairline)",
              borderRadius: "3px",
              width: 32,
              padding: "6px 0",
              fontSize: "12px",
              fontVariantNumeric: "tabular-nums",
              fontWeight: 600,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-muted)")}
          >+5</button>
          {unit && (
            <span style={{ color: "var(--color-fg-muted)", fontSize: "12px", fontWeight: 500 }}>{unit}</span>
          )}
        </div>
        {chips.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[9px] tracking-widest uppercase" style={{ color: "var(--color-fg-subtle)" }}>Recent</span>
            {chips.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => pickChip(n)}
                className="cursor-pointer transition-colors"
                style={{
                  background: "transparent",
                  color: "var(--color-fg-muted)",
                  border: "1px solid var(--color-border-hairline)",
                  borderRadius: "999px",
                  padding: "2px 9px",
                  fontSize: "11px",
                  fontVariantNumeric: "tabular-nums",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-active-highlight)";
                  e.currentTarget.style.borderColor = "var(--color-active-highlight-border)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-fg-muted)";
                  e.currentTarget.style.borderColor = "var(--color-border-hairline)";
                }}
              >
                {n.toLocaleString()}
              </button>
            ))}
          </div>
        )}
        {error && (
          <p className="text-xs mt-2" style={{ color: "var(--color-danger)" }}>{error}</p>
        )}
        <p className="text-[10px] mt-2" style={{ color: "var(--color-fg-subtle)" }}>
          {isLog
            ? "Logs progress for today without advancing the cycle."
            : "Leave blank to check in without logging a number."}
        </p>

        <div className="flex justify-end items-center gap-3 mt-3">
          <button
            onClick={onClose}
            className="text-[10px] tracking-widest uppercase cursor-pointer transition-colors"
            style={{
              color: "var(--color-fg-subtle)",
              background: "transparent",
              border: "none",
              padding: "4px 8px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
          >
            Cancel
          </button>
          <button
            onClick={commit}
            className="pixel-btn"
            style={{ fontSize: "10px", padding: "5px 14px" }}
          >
            {isLog ? "Log" : "Check in"}
          </button>
        </div>
      </div>
    </div>
  );
}
