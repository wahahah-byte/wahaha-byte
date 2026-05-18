"use client";

import { useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/constants";
import { parseQuickTask, formatParsedHint } from "@/lib/quickTask";

type Props = {
  onSubmit: (parsed: { title: string; dueDate: Date | null; priority: "low" | "medium" | "high"; category: string | null }) => Promise<void> | void;
  disabled?: boolean;
};

export default function QuickAddInput({ onSubmit, disabled }: Props) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);

  const parsed = useMemo(() => parseQuickTask(value, CATEGORIES), [value]);
  const hint = formatParsedHint(parsed);
  const canSubmit = !!parsed.title && !disabled && !busy;

  async function commit() {
    if (!canSubmit) return;
    setBusy(true);
    try {
      await onSubmit({
        title: parsed.title,
        dueDate: parsed.dueDate,
        priority: parsed.priority,
        category: parsed.category,
      });
      setValue("");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="relative flex-1 min-w-0 flex items-center"
      style={{
        background: "var(--color-input)",
        border: `1px solid ${value ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
        borderRadius: "2px",
        height: "30px",
        transition: "border-color 0.15s",
      }}
    >
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commit(); } }}
        placeholder={disabled ? "Sign in to add" : "Add task…  (try: gym tomorrow !high)"}
        aria-label="Quick add task"
        className="flex-1 min-w-0 bg-transparent outline-none text-xs px-2"
        style={{
          color: "var(--color-input-fg)",
          letterSpacing: "0.02em",
          height: "100%",
        }}
      />
      {value && hint && (
        <span
          aria-hidden
          className="hidden xs:inline text-[8px] tracking-wider uppercase whitespace-nowrap pr-1"
          style={{ color: "var(--color-active-highlight)", opacity: 0.85 }}
        >
          {hint}
        </span>
      )}
      {value && (
        <button
          onClick={commit}
          disabled={!canSubmit}
          aria-label="Add task"
          className="flex-shrink-0 flex items-center justify-center"
          style={{
            width: 30, height: 28,
            background: "transparent",
            border: "none",
            color: canSubmit ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
            cursor: canSubmit ? "pointer" : "not-allowed",
            padding: 0,
          }}
        >
          {busy ? (
            <span className="w-3 h-3 border rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-active-highlight)" }} />
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <line x1="2" y1="6" x2="10" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <polyline points="6.5,2.5 10,6 6.5,9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
