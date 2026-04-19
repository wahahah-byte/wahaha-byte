"use client";

import { useState, useEffect } from "react";
import { tasksApi, TaskDto, CreateTaskRequest } from "@/lib/api/tasks";

const CATEGORIES = ["Fitness", "Study", "Health", "Work", "Personal", "Habits", "Finance", "Other"];

const RECURRENCE_RULES = [
  { label: "Daily",     value: "daily" },
  { label: "Weekdays",  value: "weekdays" },
  { label: "Weekly",    value: "weekly" },
  { label: "Biweekly",  value: "biweekly" },
  { label: "Monthly",   value: "monthly" },
];

const PRIORITIES = [
  { label: "Low",    value: "low",    color: "#22c55e" },
  { label: "Medium", value: "medium", color: "#f59e0b" },
  { label: "High",   value: "high",   color: "#ef4444" },
];

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["Su","Mo","Tu","We","Th","Fr","Sa"];

interface Props {
  onClose: () => void;
  onCreated: (task: TaskDto) => void;
}

export default function NewTaskModal({ onClose, onCreated }: Props) {
  const today = new Date();

  const [title, setTitle]               = useState("");
  const [description, setDescription]   = useState("");
  const [category, setCategory]         = useState(CATEGORIES[0]);
  const [priority, setPriority]         = useState("medium");
  const [pointValue, setPointValue]     = useState(100);
  const [dueDate, setDueDate]           = useState<Date | null>(null);
  const [isRecurring, setIsRecurring]   = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState("daily");
  const [showCalendar, setShowCalendar] = useState(false);
  const [calMonth, setCalMonth]         = useState(today.getMonth());
  const [calYear, setCalYear]           = useState(today.getFullYear());
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState<string | null>(null);

  useEffect(() => {
    if (isRecurring) setPointValue((v) => Math.min(v, 5));
  }, [isRecurring]);

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear((y) => y - 1); }
    else setCalMonth((m) => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear((y) => y + 1); }
    else setCalMonth((m) => m + 1);
  }

  async function handleSubmit() {
    if (!title.trim()) { setError("Title is required."); return; }
    setSubmitting(true);
    setError(null);
    const dto: CreateTaskRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      priority,
      pointValue,
      dueDate: dueDate ? `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2,"0")}-${String(dueDate.getDate()).padStart(2,"0")}` : undefined,
      isRecurring,
      recurrenceRule: isRecurring ? recurrenceRule : undefined,
    };
    const { data, error: apiError } = await tasksApi.create(dto);
    setSubmitting(false);
    if (apiError) { setError(apiError); return; }
    onCreated(data!);
  }

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedPriorityColor = PRIORITIES.find((p) => p.value === priority)?.color ?? "#888";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md flex flex-col gap-5 p-6 rounded"
        style={{ background: "#3e3f42", border: "1px solid #2a2a2a" }}
        onClick={() => setShowCalendar(false)}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-widest uppercase text-white">New Task</h2>
          <button
            onClick={onClose}
            className="text-[#555] transition-colors text-lg leading-none cursor-pointer"
            onMouseEnter={(e) => (e.currentTarget.style.color = "#999")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          >
            ✕
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>Title</label>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="What needs to be done?"
            className="w-full px-3 py-2 text-sm bg-transparent outline-none placeholder-white/20"
            style={{ color: "#f0f0f0", border: "1px solid #2a2a2a" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#1e5068")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a2a")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional details..."
            rows={2}
            className="w-full px-3 py-2 text-sm bg-transparent outline-none resize-none placeholder-white/20"
            style={{ color: "#f0f0f0", border: "1px solid #2a2a2a" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#1e5068")}
            onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a2a")}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>Priority</label>
          <div className="flex gap-0" style={{ border: "1px solid #2a2a2a" }}>
            {PRIORITIES.map((p, i) => (
              <button
                key={p.value}
                onClick={() => setPriority(p.value)}
                className="flex-1 py-2 text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
                style={{
                  background:  priority === p.value ? `${p.color}20` : "transparent",
                  color:       priority === p.value ? p.color : "#717171",
                  borderRight: i < PRIORITIES.length - 1 ? "1px solid #2a2a2a" : "none",
                  fontWeight:  priority === p.value ? 600 : 400,
                  borderBottom: priority === p.value ? `2px solid ${p.color}` : "2px solid transparent",
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col gap-1.5 flex-1">
            <label className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm appearance-none outline-none cursor-pointer"
                style={{ background: "#2a2b2e", color: "#f0f0f0", border: "1px solid #2a2a2a" }}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} style={{ background: "#2a2b2e" }}>{c}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>▾</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-24">
            <label className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>Points</label>
            <input
              type="number"
              min={0}
              max={isRecurring ? 5 : undefined}
              value={pointValue}
              onChange={(e) => setPointValue(Math.max(0, Math.min(isRecurring ? 5 : Infinity, Number(e.target.value))))}
              className="w-full px-3 py-2 text-sm bg-transparent outline-none"
              style={{ color: "#5bb8e0", border: "1px solid #2a2a2a" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1e5068")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "#2a2a2a")}
            />
            {isRecurring && (
              <span className="text-[9px] leading-tight" style={{ color: "rgba(167,139,250,0.65)" }}>Max 5 pts / occurrence</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 relative">
          <label className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>Due Date</label>
          <button
            onClick={(e) => { e.stopPropagation(); setShowCalendar((v) => !v); }}
            className="w-full px-3 py-2 text-sm text-left cursor-pointer transition-colors"
            style={{
              background:   "transparent",
              color:        dueDate ? "#f0f0f0" : "#717171",
              border:       `1px solid ${showCalendar ? "#1e5068" : "#2a2a2a"}`,
            }}
          >
            {dueDate
              ? dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
              : "Select a date"}
          </button>

          {showCalendar && (
            <div
              className="absolute top-full mt-1 left-0 right-0 z-20 p-3"
              style={{ background: "#2a2b2e", border: "1px solid #2a2a2a" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <button
                  onClick={prevMonth}
                  className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                >
                  ‹
                </button>
                <span className="text-[11px] tracking-widest uppercase" style={{ color: "#aaa" }}>
                  {MONTHS[calMonth]} {calYear}
                </span>
                <button
                  onClick={nextMonth}
                  className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm"
                  style={{ color: "rgba(255,255,255,0.55)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
                >
                  ›
                </button>
              </div>

              <div className="grid grid-cols-7 mb-1">
                {DAYS.map((d) => (
                  <span key={d} className="text-center text-[9px] tracking-wider uppercase py-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                    {d}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-y-0.5">
                {cells.map((day, i) => {
                  const isSelected =
                    day !== null &&
                    dueDate !== null &&
                    dueDate.getDate() === day &&
                    dueDate.getMonth() === calMonth &&
                    dueDate.getFullYear() === calYear;
                  const isToday =
                    day !== null &&
                    today.getDate() === day &&
                    today.getMonth() === calMonth &&
                    today.getFullYear() === calYear;

                  return (
                    <button
                      key={i}
                      disabled={day === null}
                      onClick={() => {
                        if (!day) return;
                        setDueDate(new Date(calYear, calMonth, day));
                        setShowCalendar(false);
                      }}
                      className="text-center py-1 text-[11px] transition-colors cursor-pointer disabled:pointer-events-none"
                      style={{
                        color:      day === null ? "transparent" : isSelected ? "#0d1f28" : isToday ? "#5bb8e0" : "#999",
                        background: isSelected ? "#5bb8e0" : "transparent",
                        fontWeight: isSelected || isToday ? 600 : 400,
                      }}
                      onMouseEnter={(e) => { if (day && !isSelected) e.currentTarget.style.color = "#fff"; }}
                      onMouseLeave={(e) => { if (day && !isSelected) e.currentTarget.style.color = isToday ? "#5bb8e0" : "#999"; }}
                    >
                      {day ?? ""}
                    </button>
                  );
                })}
              </div>

              {dueDate && (
                <button
                  onClick={() => { setDueDate(null); setShowCalendar(false); }}
                  className="mt-2 w-full text-[9px] tracking-widest uppercase transition-colors cursor-pointer py-1"
                  style={{ color: "#444", borderTop: "1px solid #3e3f42" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#888")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#444")}
                >
                  Clear
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>Recurring</span>
            <button
              onClick={() => setIsRecurring((v) => !v)}
              className="relative w-10 h-[22px] cursor-pointer transition-colors flex-shrink-0"
              style={{
                background:   isRecurring ? "#1a3a4a" : "#888",
                border:       `1px solid ${isRecurring ? "#1e5068" : "#2a2a2a"}`,
                borderRadius: "999px",
              }}
            >
              <span
                className="absolute top-[3px] w-3.5 h-3.5 transition-all"
                style={{
                  left:         isRecurring ? "calc(100% - 18px)" : "3px",
                  background:   isRecurring ? "#5bb8e0" : "#333",
                  borderRadius: "50%",
                }}
              />
            </button>
          </div>

          {isRecurring && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>Recurrence Rule</label>
              <div className="relative">
                <select
                  value={recurrenceRule}
                  onChange={(e) => setRecurrenceRule(e.target.value)}
                  className="w-full px-3 py-2 text-sm appearance-none outline-none cursor-pointer"
                  style={{ background: "#2a2b2e", color: "#f0f0f0", border: "1px solid #2a2a2a" }}
                >
                  {RECURRENCE_RULES.map((r) => (
                    <option key={r.value} value={r.value} style={{ background: "#2a2b2e" }}>{r.label}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>▾</span>
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-xs" style={{ color: "#ef4444" }}>{error}</p>}

        <div className="flex gap-2 pt-1">
          <button
            onClick={onClose}
            className="flex-1 py-2 text-[10px] tracking-widest uppercase cursor-pointer transition-colors"
            style={{ color: "#717171", border: "1px solid #2a2a2a", background: "transparent" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#999")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-2 text-[10px] tracking-widest uppercase font-semibold cursor-pointer transition-colors"
            style={{
              background: "#1a3a4a",
              color:      "#5bb8e0",
              border:     "1px solid #1e5068",
              opacity:    submitting ? 0.5 : 1,
            }}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "#1e4d63"; }}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a3a4a")}
          >
            {submitting ? "Creating…" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
