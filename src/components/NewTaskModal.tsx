"use client";

import { useState, useEffect } from "react";
import { tasksApi, TaskDto, CreateTaskRequest } from "@/lib/api/tasks";

const CATEGORIES = ["Fitness", "Study", "Health", "Work", "Personal", "Habits", "Finance", "Other"];

const RECURRENCE_RULES = [
  { label: "Daily", value: "daily" },
  { label: "Weekdays", value: "weekdays" },
  { label: "Weekly", value: "weekly" },
  { label: "Biweekly", value: "biweekly" },
  { label: "Monthly", value: "monthly" },
];

const PRIORITIES = [
  { label: "Low", value: "low", color: "#22c55e" },
  { label: "Medium", value: "medium", color: "#f59e0b" },
  { label: "High", value: "high", color: "#ef4444" },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface Props {
  onClose: () => void;
  onCreated: (task: TaskDto) => void;
}

export default function NewTaskModal({ onClose, onCreated }: Props) {
  const today = new Date();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState("medium");
  const [pointValue, setPointValue] = useState(25);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState("daily");
  const [showCalendar, setShowCalendar] = useState(false);
  const [showYearSelect, setShowYearSelect] = useState(false);
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [year, setCalYear] = useState(today.getFullYear());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currYear, setCurrYear] = useState(today.getFullYear());

  useEffect(() => {
    if (isRecurring) setPointValue(1);
  }, [isRecurring]);
  function nextYear() {
    setCurrYear((y) => y + 6);
  }
  function prevYear() {
    setCurrYear((y) => y - 6);
  }
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
      dueDate: dueDate ? `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, "0")}-${String(dueDate.getDate()).padStart(2, "0")}` : undefined,
      isRecurring,
      recurrenceRule: isRecurring ? recurrenceRule : undefined,
    };
    const { data, error: apiError } = await tasksApi.create(dto);
    setSubmitting(false);
    if (apiError) { setError(apiError); return; }
    onCreated(data!);
  }
  let currYear1 = currYear;
  const years: (number | null)[] = [
    ...Array.from({ length: 3 }, (_) => currYear1 += 1),
    ...Array.from({ length: 3 }, (_) => currYear1 += 1),
  ];
  const daysInMonth = new Date(year, calMonth + 1, 0).getDate();
  const firstDay = new Date(year, calMonth, 1).getDay();
  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.72)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-md flex flex-col"
        style={{ background: "#2a2b2f", border: "1px solid #3a3b3f", borderRadius: "4px", boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}
        onClick={() => { setShowCalendar(false); setShowYearSelect(false); }}
      >
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ background: "#23242a", borderBottom: "1px solid #3a3b3f", borderRadius: "4px 4px 0 0" }}
        >
          <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.75)" }}>New Task</h2>
          <button
            onClick={onClose}
            className="text-[#555] transition-colors text-lg leading-none cursor-pointer"
            onMouseEnter={(e) => (e.currentTarget.style.color = "#999")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
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
              style={{ background: "#1e1f22", color: "#f0f0f0", border: "1px solid #3a3b3f", borderRadius: "3px" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#5bb8e0")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#3a3b3f")}
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={2}
              className="w-full px-3 py-2 text-sm outline-none resize-none placeholder-white/20"
              style={{ background: "#1e1f22", color: "#f0f0f0", border: "1px solid #3a3b3f", borderRadius: "3px" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#5bb8e0")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#3a3b3f")}
            />
          </Field>

          <Field label="Priority">
            <div className="flex" style={{ border: "1px solid #3a3b3f", borderRadius: "3px", overflow: "hidden" }}>
              {PRIORITIES.map((p, i) => (
                <button
                  key={p.value}
                  onClick={() => setPriority(p.value)}
                  className="flex-1 py-2 text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
                  style={{
                    background: priority === p.value ? `${p.color}18` : "transparent",
                    color: priority === p.value ? p.color : "rgba(255,255,255,0.3)",
                    borderRight: i < PRIORITIES.length - 1 ? "1px solid #3a3b3f" : "none",
                    fontWeight: priority === p.value ? 600 : 400,
                    borderBottom: priority === p.value ? `2px solid ${p.color}` : "2px solid transparent",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </Field>

          <div className="flex gap-3">
            <Field label="Category" className="flex-1">
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm appearance-none outline-none cursor-pointer"
                  style={{ background: "#1e1f22", color: "#f0f0f0", border: "1px solid #3a3b3f", borderRadius: "3px" }}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} style={{ background: "#1e1f22" }}>{c}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>▾</span>
              </div>
            </Field>

            <Field label="Points" className="w-24">
              <div className="relative">
                <select
                  value={pointValue}
                  onChange={(e) => setPointValue(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm appearance-none outline-none cursor-pointer"
                  style={{ background: "#1e1f22", color: "#5bb8e0", border: "1px solid #3a3b3f", borderRadius: "3px" }}
                >
                  {(isRecurring ? [1, 2, 3, 4, 5] : [5, 10, 15, 20, 25]).map((v) => (
                    <option key={v} value={v} style={{ background: "#1e1f22" }}>{v}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "rgba(91,184,224,0.5)" }}>▾</span>
              </div>
              {isRecurring && (
                <span className="text-[9px] leading-tight mt-1 block" style={{ color: "rgba(167,139,250,0.55)" }}>Max 5 pts</span>
              )}
            </Field>
          </div>

          <Field label="Due Date">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={(e) => { e.stopPropagation(); setShowCalendar((v) => !v); setShowYearSelect(false); }}
                className="w-full px-3 py-2 text-sm text-left cursor-pointer transition-colors"
                style={{
                  background: "#1e1f22",
                  color: dueDate ? "#f0f0f0" : "rgba(255,255,255,0.2)",
                  border: `1px solid ${showCalendar ? "#5bb8e0" : "#3a3b3f"}`,
                  borderRadius: "3px",
                }}
              >
                {dueDate
                  ? dueDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                  : "Select a date"}
              </button>
              {showYearSelect && (
                <div className="flex items-center justify-between mb-3">

                  <div className="absolute mt-1 left-50 right-0 top-10 z-40 p-3">

                    <div
                      className="flex p-3 items-center justify-between mb-3"
                      style={{ background: "#1e1f22", border: "1px solid #3a3b3f", borderRadius: "3px", boxShadow: "0 8px 24px rgba(0,0,0,0.55)" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={prevYear}
                        disabled={currYear === today.getFullYear() - 6}
                        className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm"
                        style={{ color: "rgba(255,255,255,0.4)", background: "transparent", border: "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                      >
                        ‹
                      </button>
                      <div className="grid grid-cols-3 grid-rows-2 gap-y-0.5">
                        {years.map((year, i) => {
                          console.log(year);
                          const isSelected =
                            year !== null &&
                            dueDate !== null &&
                            dueDate.getFullYear() === year;
                          const isToday =
                            year !== null &&
                            today.getFullYear() === year;

                          return (
                            <button
                              key={i}
                              disabled={year === null}
                              onClick={() => {
                                if (!year) return;
                                setCalYear(year);
                                setShowYearSelect(false);
                              }}
                              className="text-center py-2 px-2 text-[11px] transition-colors cursor-pointer disabled:pointer-events-none"
                              style={{
                                color: year === null ? "transparent" : isSelected ? "#0d1f28" : isToday ? "#5bb8e0" : "rgba(255,255,255,0.55)",
                                background: isSelected ? "#5bb8e0" : "transparent",
                                fontWeight: isSelected || isToday ? 600 : 400,
                                borderRadius: "2px",
                                border: "none",
                              }}
                              onMouseEnter={(e) => { if (year && !isSelected) e.currentTarget.style.color = "#fff"; }}
                              onMouseLeave={(e) => { if (year && !isSelected) e.currentTarget.style.color = isToday ? "#5bb8e0" : "rgba(255,255,255,0.55)"; }}
                            >
                              {year ?? ""}
                            </button>
                          );
                        })}

                      </div>
                      <button
                        onClick={nextYear}
                        className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm"
                        style={{ color: "rgba(255,255,255,0.4)", background: "transparent", border: "none" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                      >
                        ›
                      </button>
                    </div>

                  </div>
                </div>

              )}
              {showCalendar && (
                <div
                  className="absolute top-full mt-1 left-0 right-0 z-20 p-3"
                  style={{ background: "#1e1f22", border: "1px solid #3a3b3f", borderRadius: "3px", boxShadow: "0 8px 24px rgba(0,0,0,0.55)" }}
                  onClick={(e) => { e.stopPropagation(); setShowYearSelect(false); }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <button
                      onClick={prevMonth}
                      className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm"
                      style={{ color: "rgba(255,255,255,0.4)", background: "transparent", border: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                    >
                      ‹
                    </button>
                    <div className="flex space-x-2">
                      <span className="text-[11px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {MONTHS[calMonth]}
                      </span>
                      <span className="text-[11px] tracking-widest uppercase cursor-pointer"
                        onClick={(e) => { e.stopPropagation(); setShowYearSelect((v) => !v); }}
                        style={{ color: "rgba(255,255,255,0.6)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = "#5bb8e0"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; }}
                      >
                        {year}
                      </span>
                    </div>
                    <button
                      onClick={nextMonth}
                      className="w-6 h-6 flex items-center justify-center cursor-pointer transition-colors text-sm"
                      style={{ color: "rgba(255,255,255,0.4)", background: "transparent", border: "none" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#aaa")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
                    >
                      ›
                    </button>
                  </div>

                  <div className="grid grid-cols-7 mb-1">
                    {DAYS.map((d) => (
                      <span key={d} className="text-center text-[9px] tracking-wider uppercase py-0.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-y-0.5">
                    {cells.map((day, i) => {
                      const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                      const isPast = day !== null && new Date(year, calMonth, day) < todayMidnight;
                      const isSelected =
                        day !== null &&
                        dueDate !== null &&
                        dueDate.getDate() === day &&
                        dueDate.getMonth() === calMonth &&
                        dueDate.getFullYear() === year;
                      const isToday =
                        day !== null &&
                        today.getDate() === day &&
                        today.getMonth() === calMonth &&
                        today.getFullYear() === year;

                      return (
                        <button
                          key={i}
                          disabled={day === null || isPast}
                          onClick={() => {
                            if (!day) return;
                            setDueDate(new Date(year, calMonth, day));
                            setShowCalendar(false);
                            setShowYearSelect(false);
                          }}
                          className="text-center py-1 text-[11px] transition-colors cursor-pointer disabled:pointer-events-none"
                          style={{
                            color: day === null ? "transparent" : isPast ? "rgba(255,255,255,0.18)" : isSelected ? "#0d1f28" : isToday ? "#5bb8e0" : "rgba(255,255,255,0.55)",
                            background: isSelected ? "#5bb8e0" : "transparent",
                            fontWeight: isSelected || isToday ? 600 : 400,
                            borderRadius: "2px",
                            border: "none",
                          }}
                          onMouseEnter={(e) => { if (day && !isSelected && !isPast) e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={(e) => { if (day && !isSelected && !isPast) e.currentTarget.style.color = isToday ? "#5bb8e0" : "rgba(255,255,255,0.55)"; }}
                        >
                          {day ?? ""}
                        </button>
                      );
                    })}
                  </div>

                  {dueDate && (
                    <button
                      onClick={() => { setDueDate(null); setShowCalendar(false); setShowYearSelect(false); }}
                      className="mt-2 w-full text-[9px] tracking-widest uppercase transition-colors cursor-pointer py-1"
                      style={{ color: "rgba(255,255,255,0.25)", borderTop: "1px solid #3a3b3f", background: "transparent", border: "none" } as React.CSSProperties}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          </Field>

          <div className="flex items-center justify-between">
            <span className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>Recurring</span>
            <button
              onClick={() => setIsRecurring((v) => !v)}
              className="relative w-10 h-[22px] cursor-pointer flex-shrink-0"
              style={{
                background: isRecurring ? "rgba(91,184,224,0.15)" : "rgba(255,255,255,0.06)",
                border: `1px solid ${isRecurring ? "#1e5068" : "#3a3b3f"}`,
                borderRadius: "999px",
              }}
            >
              <span
                className="absolute top-[3px] w-3.5 h-3.5 transition-all"
                style={{
                  left: isRecurring ? "calc(100% - 18px)" : "3px",
                  background: isRecurring ? "#5bb8e0" : "rgba(255,255,255,0.2)",
                  borderRadius: "50%",
                }}
              />
            </button>
          </div>

          {isRecurring && (
            <div className="relative">
              <select
                value={recurrenceRule}
                onChange={(e) => setRecurrenceRule(e.target.value)}
                className="w-full px-3 py-2 text-sm appearance-none outline-none cursor-pointer"
                style={{ background: "#1e1f22", color: "#f0f0f0", border: "1px solid #3a3b3f", borderRadius: "3px" }}
              >
                {RECURRENCE_RULES.map((r) => (
                  <option key={r.value} value={r.value} style={{ background: "#1e1f22" }}>{r.label}</option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>▾</span>
            </div>
          )}

          {error && (
            <p className="text-xs px-3 py-2" style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "3px" }}>
              {error}
            </p>
          )}
        </div>

        <div
          className="flex gap-2 px-5 py-3"
          style={{ borderTop: "1px solid #3a3b3f", background: "#23242a", borderRadius: "0 0 4px 4px" }}
        >
          <button
            onClick={onClose}
            className="flex-1 py-2 text-[10px] tracking-widest uppercase cursor-pointer transition-colors"
            style={{ color: "rgba(255,255,255,0.35)", border: "1px solid #3a3b3f", background: "transparent", borderRadius: "3px" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; e.currentTarget.style.borderColor = "#555"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.35)"; e.currentTarget.style.borderColor = "#3a3b3f"; }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-2 text-[10px] tracking-widest uppercase font-semibold cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "#1a3a4a", color: "#5bb8e0", border: "1px solid #1e5068", borderRadius: "3px" }}
            onMouseEnter={(e) => { if (!submitting) e.currentTarget.style.background = "#1e4d63"; }}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a3a4a")}
          >
            {submitting ? "Creating…" : "Create Task"}
          </button>
        </div>
      </div >
    </div >
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <span className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
        {label}
      </span>
      {children}
    </div>
  );
}
