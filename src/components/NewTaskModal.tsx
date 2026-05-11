"use client";

import { useState, useEffect } from "react";
import { tasksApi, TaskDto, CreateTaskRequest } from "@/lib/api/tasks";
import DatePicker from "@/components/DatePicker";
import GoalStepper from "@/components/GoalStepper";
import { CATEGORIES, COUNTER_UNITS, maxPointsFor } from "@/lib/constants";

const REPEAT_OPTIONS: { label: string; value: string; rule: string | null }[] = [
  { label: "Once",    value: "once",     rule: null },
  { label: "Daily",   value: "daily",    rule: "daily" },
  { label: "Wkdys",   value: "weekdays", rule: "weekdays" },
  { label: "Weekly",  value: "weekly",   rule: "weekly" },
  { label: "Biweek",  value: "biweekly", rule: "biweekly" },
  { label: "Monthly", value: "monthly",  rule: "monthly" },
];

const PRIORITIES = [
  { label: "Low",    value: "low",    color: "var(--color-success)", bg: "var(--color-success-bg)" },
  { label: "Medium", value: "medium", color: "var(--color-warning)", bg: "var(--color-warning-bg)" },
  { label: "High",   value: "high",   color: "var(--color-danger)",  bg: "var(--color-danger-bg)" },
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
  const [showDescription, setShowDescription] = useState(false);
  const [showDetails, setShowDetails] = useState(initialRecurring);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState("medium");
  const [pointValue, setPointValue] = useState(initialRecurring ? 1 : 25);
  const [dueDate, setDueDate] = useState<Date | null>(
    initialRecurring ? new Date(today.getFullYear(), today.getMonth(), today.getDate()) : null,
  );
  const [isRange, setIsRange] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isRecurring, setIsRecurring] = useState(initialRecurring);
  const [recurrenceRule, setRecurrenceRule] = useState("daily");
  const [hasCounter, setHasCounter] = useState(false);
  const [counterUnit, setCounterUnit] = useState<string>("");
  const [counterGoal, setCounterGoal] = useState<string>("");
  const [capLogAtGoal, setCapLogAtGoal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isRecurring && hasCounter) setHasCounter(false);
  }, [isRecurring, hasCounter]);

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
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (dueDate && dueDate < todayMidnight) { setError("Due date cannot be in the past."); return; }
    if (isRange) {
      if (!startDate) { setError("Pick a start date."); return; }
      if (!dueDate) { setError("Pick an end date."); return; }
      if (dueDate < startDate) { setError("End date must be on or after start date."); return; }
    }
    setSubmitting(true);
    setError(null);
    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const dto: CreateTaskRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      pointValue,
      dueDate: dueDate ? fmt(dueDate) : undefined,
      startDate: isRange && startDate ? fmt(startDate) : undefined,
      isRecurring,
      recurrenceRule: isRecurring ? recurrenceRule : undefined,
      hasCounter: isRecurring ? hasCounter : false,
      counterUnit: isRecurring && hasCounter && counterUnit ? counterUnit : null,
      counterGoal: isRecurring && hasCounter && counterGoal.trim() && Number(counterGoal) > 0
        ? Number(counterGoal)
        : null,
      capLogAtGoal: isRecurring && hasCounter && capLogAtGoal && counterGoal.trim() && Number(counterGoal) > 0
        ? true
        : false,
    };
    const { data, error: apiError } = await tasksApi.create(dto);
    setSubmitting(false);
    if (apiError) { setError(apiError); return; }
    onCreated(data!);
  }

  return (
    <div
      data-edge-drawer-block
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "var(--color-modal-overlay)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={`w-full max-w-sm relative${isRecurring ? " recurring-scope" : ""}`}
        style={{
          background: "var(--color-panel)",
          border: "1px solid var(--color-border)",
          borderRadius: "6px",
          boxShadow: "var(--shadow-popover)",
          padding: "20px 20px 16px",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2.5 right-2.5 transition-colors text-base leading-none cursor-pointer flex items-center justify-center"
          style={{
            color: "var(--color-fg-subtle)",
            background: "transparent",
            border: "none",
            width: 28,
            height: 28,
            padding: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
        >
          ✕
        </button>

        {/* Title — borderless, prominent */}
        <input
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } }}
          placeholder="What needs to be done?"
          className="w-full bg-transparent outline-none mb-2 pr-8"
          style={{
            color: "var(--color-fg)",
            fontSize: "16px",
            fontWeight: 600,
            border: "none",
            padding: 0,
            letterSpacing: "0.01em",
          }}
        />

        {/* Description (lazy-revealed) */}
        {showDescription || description ? (
          <textarea
            autoFocus={!description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            rows={2}
            className="w-full bg-transparent outline-none resize-none mb-3"
            style={{
              color: "var(--color-fg-muted)",
              fontSize: "12px",
              border: "none",
              padding: 0,
              lineHeight: 1.5,
            }}
          />
        ) : (
          <button
            onClick={() => setShowDescription(true)}
            className="cursor-pointer transition-colors mb-3"
            style={{
              color: "var(--color-fg-subtle)",
              background: "transparent",
              border: "none",
              padding: 0,
              fontSize: "11px",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
          >
            + Description
          </button>
        )}

        {/* Priority pills — always visible */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {PRIORITIES.map((p) => {
            const active = priority === p.value;
            return (
              <button
                key={p.value}
                onClick={() => setPriority(p.value)}
                className="text-[10px] tracking-widest uppercase cursor-pointer transition-colors"
                style={{
                  background: active ? p.bg : "transparent",
                  color: active ? p.color : "var(--color-fg-subtle)",
                  border: `1px solid ${active ? p.color : "var(--color-border-hairline)"}`,
                  borderRadius: "999px",
                  fontWeight: active ? 600 : 400,
                  padding: "3px 10px",
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* More details disclosure (collapsed by default unless recurring) */}
        {!showDetails ? (
          <button
            onClick={() => setShowDetails(true)}
            className="cursor-pointer transition-colors mb-3"
            style={{
              color: "var(--color-fg-subtle)",
              background: "transparent",
              border: "none",
              padding: 0,
              fontSize: "11px",
              letterSpacing: "0.05em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg-muted)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
          >
            More details ▾
          </button>
        ) : (
          <div className="flex flex-col gap-3 mb-3 mt-1">
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[8px] tracking-widest uppercase" style={{ color: "var(--color-fg-subtle)" }}>
                  {isRange ? (isRecurring ? "Start / End" : "Range") : isRecurring ? "First Due" : "Due"}
                </span>
                <button
                  onClick={() => {
                    setIsRange((v) => {
                      const next = !v;
                      if (!next) setStartDate(null);
                      else if (!startDate && dueDate) setStartDate(dueDate);
                      return next;
                    });
                  }}
                  className="text-[9px] tracking-widest uppercase cursor-pointer transition-colors"
                  style={{
                    background: isRange ? "var(--color-active-highlight-bg)" : "transparent",
                    color: isRange ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                    border: `1px solid ${isRange ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                    borderRadius: "999px",
                    fontWeight: isRange ? 600 : 400,
                    padding: "2px 8px",
                  }}
                >
                  Range
                </button>
              </div>
              {isRange ? (
                <div className="flex gap-2">
                  <div className="flex-1 min-w-0">
                    <DatePicker value={startDate} onChange={setStartDate} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <DatePicker value={dueDate} onChange={setDueDate} />
                  </div>
                </div>
              ) : (
                <DatePicker value={dueDate} onChange={setDueDate} />
              )}
            </div>

            <div className="flex gap-3">
              <Field label="Category" className="flex-1 min-w-0">
                <CompactSelect
                  value={category}
                  onChange={setCategory}
                  options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                />
              </Field>
              <Field label="Points" className="w-20">
                <CompactSelect
                  value={String(pointValue)}
                  onChange={(v) => setPointValue(Number(v))}
                  options={(isRecurring
                    ? [1, 2, 3, 4, 5]
                    : [5, 10, 15, 20, 25].filter((v) => v <= maxPointsFor(category))
                  ).map((v) => ({ value: String(v), label: String(v) }))}
                  highlight
                />
              </Field>
            </div>

            <Field label="Repeat">
              <div className="flex flex-wrap gap-1">
                {REPEAT_OPTIONS.map((opt) => {
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
                      className="text-[10px] tracking-widest uppercase cursor-pointer transition-colors"
                      style={{
                        background: active ? "var(--color-active-highlight-bg)" : "transparent",
                        color: active ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                        border: `1px solid ${active ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                        borderRadius: "999px",
                        fontWeight: active ? 600 : 400,
                        padding: "3px 10px",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            {isRecurring && (
              <Field label="Counter">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setHasCounter((v) => !v)}
                    className="text-[10px] tracking-widest uppercase cursor-pointer transition-colors"
                    style={{
                      background: hasCounter ? "var(--color-active-highlight-bg)" : "transparent",
                      color: hasCounter ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                      border: `1px solid ${hasCounter ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                      borderRadius: "999px",
                      fontWeight: hasCounter ? 600 : 400,
                      padding: "3px 10px",
                    }}
                  >
                    {hasCounter ? "On" : "Off"}
                  </button>
                  {hasCounter && (
                    <CompactSelect
                      value={counterUnit}
                      onChange={setCounterUnit}
                      options={[{ value: "", label: "(no unit)" }, ...COUNTER_UNITS.map((u) => ({ value: u, label: u }))]}
                    />
                  )}
                  {hasCounter && (
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: "var(--color-fg-subtle)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                        Goal
                      </span>
                      <GoalStepper value={counterGoal} onChange={setCounterGoal} />
                      {counterUnit && counterGoal.trim() && (
                        <span style={{ color: "var(--color-fg-subtle)", fontSize: "10px" }}>
                          {counterUnit} / {isRecurring && recurrenceRule === "weekly" ? "wk" : isRecurring && recurrenceRule === "monthly" ? "mo" : "day"}
                        </span>
                      )}
                    </div>
                  )}
                  {hasCounter && counterGoal.trim() && Number(counterGoal) > 0 && (
                    <button
                      onClick={() => setCapLogAtGoal((v) => !v)}
                      title="Refuse logs that would push the day's total past the goal"
                      className="text-[10px] tracking-widest uppercase cursor-pointer transition-colors"
                      style={{
                        background: capLogAtGoal ? "var(--color-active-highlight-bg)" : "transparent",
                        color: capLogAtGoal ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                        border: `1px solid ${capLogAtGoal ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                        borderRadius: "999px",
                        fontWeight: capLogAtGoal ? 600 : 400,
                        padding: "3px 10px",
                      }}
                    >
                      Cap at goal
                    </button>
                  )}
                </div>
              </Field>
            )}
          </div>
        )}

        {error && (
          <p className="text-xs mb-3" style={{ color: "var(--color-danger)" }}>
            {error}
          </p>
        )}

        <div className="flex justify-end items-center gap-3 mt-1">
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
            onClick={handleSubmit}
            disabled={submitting || !title.trim()}
            className="pixel-btn"
            style={{ fontSize: "10px", padding: "5px 14px" }}
          >
            {submitting ? "Creating…" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1 ${className ?? ""}`}>
      <span className="text-[8px] tracking-widest uppercase" style={{ color: "var(--color-fg-subtle)" }}>
        {label}
      </span>
      {children}
    </div>
  );
}

function CompactSelect({ value, onChange, options, highlight }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  highlight?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2 py-1.5 text-xs appearance-none outline-none cursor-pointer"
        style={{
          background: "var(--color-input)",
          color: highlight ? "var(--color-active-highlight)" : "var(--color-input-fg)",
          border: "1px solid var(--color-border-hairline)",
          borderRadius: "3px",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} style={{ background: "var(--color-input)" }}>{o.label}</option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]" style={{ color: highlight ? "var(--color-active-highlight)" : "var(--color-fg-subtle)" }}>▾</span>
    </div>
  );
}
