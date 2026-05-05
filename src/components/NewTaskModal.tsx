"use client";

import { useState, useEffect } from "react";
import { tasksApi, TaskDto, CreateTaskRequest } from "@/lib/api/tasks";
import DatePicker from "@/components/DatePicker";
import { CATEGORIES, maxPointsFor } from "@/lib/constants";

const REPEAT_OPTIONS: { label: string; value: string; rule: string | null }[] = [
  { label: "Once", value: "once", rule: null },
  { label: "Daily", value: "daily", rule: "daily" },
  { label: "Wkdys", value: "weekdays", rule: "weekdays" },
  { label: "Weekly", value: "weekly", rule: "weekly" },
  { label: "Biweek", value: "biweekly", rule: "biweekly" },
  { label: "Monthly", value: "monthly", rule: "monthly" },
];

const PRIORITIES = [
  { label: "Low", value: "low", color: "#22c55e" },
  { label: "Medium", value: "medium", color: "#f59e0b" },
  { label: "High", value: "high", color: "var(--color-danger)" },
];

interface Props {
  onClose: () => void;
  onCreated: (task: TaskDto) => void;
  initialRecurring?: boolean;
}

export default function NewTaskModal({ onClose, onCreated, initialRecurring = false }: Props) {
  const today = new Date();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState("medium");
  const [pointValue, setPointValue] = useState(initialRecurring ? 1 : 25);
  const [dueDate, setDueDate] = useState<Date | null>(
    initialRecurring ? new Date(today.getFullYear(), today.getMonth(), today.getDate()) : null,
  );
  const [isRecurring, setIsRecurring] = useState(initialRecurring);
  const [recurrenceRule, setRecurrenceRule] = useState("daily");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isRecurring) {
      setPointValue(1);
      if (!dueDate) setDueDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
    }
  }, [isRecurring]);

  useEffect(() => {
    if (isRecurring) return;
    const cap = maxPointsFor(category);
    if (pointValue > cap) setPointValue(cap);
  }, [category, isRecurring]);

  async function handleSubmit() {
    if (!title.trim()) { setError("Title is required."); return; }
    if (dueDate) {
      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (dueDate < todayMidnight) { setError("Due date cannot be in the past."); return; }
    }
    setSubmitting(true);
    setError(null);
    const dto: CreateTaskRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      pointValue,
      dueDate: dueDate
        ? `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, "0")}-${String(dueDate.getDate()).padStart(2, "0")}`
        : undefined,
      isRecurring,
      recurrenceRule: isRecurring ? recurrenceRule : undefined,
    };
    const { data, error: apiError } = await tasksApi.create(dto);
    setSubmitting(false);
    if (apiError) { setError(apiError); return; }
    onCreated(data!);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4"
      style={{ background: "rgba(0,0,0,0.72)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`w-full max-w-md flex flex-col${isRecurring ? " recurring-scope" : ""}`}
        style={{ background: "var(--color-panel)", border: "1px solid var(--color-border)", borderRadius: "4px", boxShadow: "var(--shadow-popover)" }}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ background: "var(--color-panel-header)", borderBottom: "1px solid var(--color-border)", borderRadius: "4px 4px 0 0" }}
        >
          <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--color-fg)" }}>New Task</h2>
          <button
            onClick={onClose}
            className="transition-colors text-lg leading-none cursor-pointer flex items-center justify-center min-w-[32px] min-h-[32px]"
            style={{ color: "var(--color-fg-subtle)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-4 px-5 py-4">
          <Field label="Title">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 text-sm outline-none placeholder-white/20"
              style={{ background: "var(--color-input)", color: "var(--color-input-fg)", border: "1px solid var(--color-border)", borderRadius: "3px" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-active-highlight)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
            <span className="text-[9px] leading-tight mt-1 block" style={{ color: "var(--color-fg-subtle)" }}>
              Title and points cannot be edited 24 hours after creation.
            </span>
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={2}
              className="w-full px-3 py-2 text-sm outline-none resize-none placeholder-white/20"
              style={{ background: "var(--color-input)", color: "var(--color-input-fg)", border: "1px solid var(--color-border)", borderRadius: "3px" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-active-highlight)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
            />
          </Field>

          <Field label={isRecurring ? "First Due" : "Due Date"}>
            <DatePicker value={dueDate} onChange={setDueDate} />
          </Field>

          <div className="flex gap-3">
            <Field label="Category" className="flex-1">
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm appearance-none outline-none cursor-pointer"
                  style={{ background: "var(--color-input)", color: "var(--color-input-fg)", border: "1px solid var(--color-border)", borderRadius: "3px" }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} style={{ background: "var(--color-input)" }}>{c}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--color-fg-subtle)" }}>▾</span>
              </div>
            </Field>

            <Field label="Points" className="w-24">
              <div className="relative">
                <select
                  value={pointValue}
                  onChange={(e) => setPointValue(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm appearance-none outline-none cursor-pointer"
                  style={{ background: "var(--color-input)", color: "var(--color-active-highlight)", border: "1px solid var(--color-border)", borderRadius: "3px" }}
                >
                  {(isRecurring
                    ? [1, 2, 3, 4, 5]
                    : [5, 10, 15, 20, 25].filter((v) => v <= maxPointsFor(category))
                  ).map((v) => (
                    <option key={v} value={v} style={{ background: "var(--color-input)" }}>{v}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "var(--color-active-highlight)", opacity: 0.6 }}>▾</span>
              </div>
              <span className="text-[9px] leading-tight mt-1 block" style={{ color: "var(--color-active-highlight)", opacity: 0.65 }}>
                Max {isRecurring ? 5 : maxPointsFor(category)} pts
              </span>
            </Field>
          </div>

          <Field label="Repeat">
            <div className="flex" style={{ border: "1px solid var(--color-border)", borderRadius: "3px", overflow: "hidden" }}>
              {REPEAT_OPTIONS.map((opt, i) => {
                const active = opt.rule === null ? !isRecurring : isRecurring && recurrenceRule === opt.rule;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      if (opt.rule === null) {
                        setIsRecurring(false);
                      } else {
                        setIsRecurring(true);
                        setRecurrenceRule(opt.rule);
                      }
                    }}
                    className="flex-1 py-2 text-[9px] tracking-widest uppercase transition-colors cursor-pointer"
                    style={{
                      background: active ? "var(--color-active-highlight-bg)" : "transparent",
                      color: active ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                      borderRight: i < REPEAT_OPTIONS.length - 1 ? "1px solid var(--color-border)" : "none",
                      fontWeight: active ? 600 : 400,
                      borderBottom: active ? "2px solid var(--color-active-highlight)" : "2px solid transparent",
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Priority">
            <div className="flex" style={{ border: "1px solid var(--color-border)", borderRadius: "3px", overflow: "hidden" }}>
              {PRIORITIES.map((p, i) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className="flex-1 py-2 text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
                  style={{
                    background: priority === p.value ? `${p.color}18` : "transparent",
                    color: priority === p.value ? p.color : "var(--color-fg-subtle)",
                    borderRight: i < PRIORITIES.length - 1 ? "1px solid var(--color-border)" : "none",
                    fontWeight: priority === p.value ? 600 : 400,
                    borderBottom: priority === p.value ? `2px solid ${p.color}` : "2px solid transparent",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Field>

          {error && (
            <p className="text-xs px-3 py-2" style={{ color: "var(--color-danger)", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "3px" }}>
              {error}
            </p>
          )}
        </div>

        <div
          className="flex gap-2 px-5 py-3"
          style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-panel-header)", borderRadius: "0 0 4px 4px" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-xs tracking-widest uppercase cursor-pointer transition-colors"
            style={{ color: "var(--color-fg-subtle)", border: "1px solid var(--color-border)", background: "transparent", borderRadius: "3px" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-fg-muted)"; e.currentTarget.style.borderColor = "var(--color-button-border)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-fg-subtle)"; e.currentTarget.style.borderColor = "var(--color-border)"; }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="pixel-btn flex-1 justify-center"
            style={{ fontSize: "12px", padding: "10px 12px" }}
          >
            {submitting ? "Creating…" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-[9px] tracking-widest uppercase" style={{ color: "var(--color-fg-subtle)" }}>
        {label}
      </span>
      {children}
    </div>
  );
}
