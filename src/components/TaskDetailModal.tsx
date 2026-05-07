"use client";

import { useEffect, useState } from "react";
import { tasksApi, TaskDto, Subtask, CheckInCycleDto } from "@/lib/api/tasks";
import { subtasksApi } from "@/lib/api/subtasks";
import { PRIORITY_DOT, CATEGORIES, CATEGORY_COLOR, COUNTER_UNITS } from "@/lib/constants";
import DatePicker from "@/components/DatePicker";
import SubtaskRow from "@/components/SubtaskRow";

const PRIORITIES = [
  { label: "Low",    value: "low",    color: "var(--color-success)", bg: "var(--color-success-bg)" },
  { label: "Medium", value: "medium", color: "var(--color-warning)", bg: "var(--color-warning-bg)" },
  { label: "High",   value: "high",   color: "var(--color-danger)",  bg: "var(--color-danger-bg)" },
];

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:     { label: "Pending",     color: "var(--color-fg-muted)" },
  in_progress: { label: "In Progress", color: "var(--color-active-highlight)" },
  completed:   { label: "Completed",   color: "var(--color-success)" },
};

export interface EditableTaskFields {
  title: string;
  description: string | null;
  category: string;
  priority: string;
  dueDate: string | null;
  hasCounter?: boolean;
  counterUnit?: string | null;
}

interface Props {
  task: TaskDto;
  currentStreakCount?: number;
  longestStreakCount?: number;
  onClose: () => void;
  onStart?: () => void;
  onCheckIn?: () => void;
  checkInBlocked?: boolean;
  onComplete?: () => void;
  onPause?: () => void;
  onUndo?: () => void;
  onDelete?: () => void;
  onLog?: () => void;
  historyRefreshKey?: number;
  onSave?: (fields: EditableTaskFields) => Promise<string | null>;
  onSubtasksChange?: (subtasks: Subtask[]) => void;
  isActing?: boolean;
  canUndo?: boolean;
  initialEditMode?: boolean;
  mustReschedule?: boolean;
}

function parseDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
}

function fmtShort(dateStr: string | null) {
  if (!dateStr) return "—";
  return parseDateOnly(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtLocalDate(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtFull(dateStr: string | null) {
  if (!dateStr) return "—";
  let s = dateStr.replace(/(\.\d{3})\d+/, "$1");
  if (!s.includes("T")) {
    return parseDateOnly(s).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
  }
  if (!/Z|[+-]\d{2}:?\d{2}$/.test(s)) s += "Z";
  const d = new Date(s);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function ActionBtn({
  onClick, disabled, color, hoverBg, label, icon,
}: {
  onClick: () => void;
  disabled?: boolean;
  color: string;
  hoverBg: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      style={{
        color,
        background: "transparent",
        border: `1px solid color-mix(in srgb, ${color} 28%, transparent)`,
        borderRadius: "999px",
        padding: "5px 10px",
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.background = hoverBg; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
    >
      {icon}
      {label}
    </button>
  );
}


export default function TaskDetailModal({
  task, currentStreakCount, longestStreakCount, onClose,
  onStart, onCheckIn, checkInBlocked, onComplete, onPause, onUndo, onDelete,
  onLog, historyRefreshKey,
  onSave, onSubtasksChange, isActing, canUndo, initialEditMode, mustReschedule,
}: Props) {
  const dot = PRIORITY_DOT[task.priority.toLowerCase()] ?? "var(--color-fg-muted)";
  const status = STATUS_LABEL[task.status] ?? { label: task.status, color: "var(--color-fg-muted)" };

  const isAuthenticated = typeof window !== "undefined" && !!localStorage.getItem("auth_token");
  const [subtasks, setSubtasksState] = useState<Subtask[]>(task.subtasks ?? []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);
  useEffect(() => { setSubtasksState(task.subtasks ?? []); }, [task.taskId, task.subtasks]);

  function commitSubtasks(next: Subtask[]) {
    setSubtasksState(next);
    onSubtasksChange?.(next);
  }

  function nextLocalId(): number {
    const min = subtasks.reduce((m, s) => Math.min(m, s.subtaskId), 0);
    return Math.min(min, 0) - 1;
  }

  async function handleToggleSubtask(s: Subtask) {
    const snapshot = subtasks;
    const next = snapshot.map((x) => x.subtaskId === s.subtaskId ? { ...x, completed: !x.completed } : x);
    commitSubtasks(next);
    if (!isAuthenticated || s.subtaskId < 0) return;
    const { error } = await subtasksApi.update(s.subtaskId, { completed: !s.completed });
    if (error) commitSubtasks(snapshot);
  }

  async function handleDeleteSubtask(s: Subtask) {
    const snapshot = subtasks;
    const next = snapshot.filter((x) => x.subtaskId !== s.subtaskId);
    commitSubtasks(next);
    if (!isAuthenticated || s.subtaskId < 0) return;
    const { error } = await subtasksApi.delete(s.subtaskId);
    if (error) commitSubtasks(snapshot);
  }

  async function handleAddSubtask() {
    const title = newSubtaskTitle.trim();
    if (!title || addingSubtask || task.status === "completed") return;
    setAddingSubtask(true);
    const snapshot = subtasks;
    const sortOrder = (snapshot[snapshot.length - 1]?.sortOrder ?? -1) + 1;
    const optimistic: Subtask = {
      subtaskId: nextLocalId(),
      taskId: task.taskId,
      title,
      completed: false,
      sortOrder,
      createdAt: new Date().toISOString(),
    };
    const optimisticList = [...snapshot, optimistic];
    commitSubtasks(optimisticList);
    setNewSubtaskTitle("");
    if (!isAuthenticated) { setAddingSubtask(false); return; }
    const { data, error } = await subtasksApi.create(task.taskId, title);
    setAddingSubtask(false);
    if (error) {
      commitSubtasks(snapshot);
      return;
    }
    commitSubtasks(optimisticList.map((x) => x.subtaskId === optimistic.subtaskId ? data! : x));
  }

  const subtaskDoneCount = subtasks.filter((s) => s.completed).length;

  function todayMidnight() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function rescheduleDefault(): Date {
    const d = todayMidnight();
    if ((task.recurrenceRule ?? "").toLowerCase() === "weekdays") {
      while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
    }
    return d;
  }

  const titleLocked = (Date.now() - new Date(task.createdAt).getTime()) > 24 * 60 * 60 * 1000;

  const [isEditing, setIsEditing] = useState(initialEditMode ?? false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description ?? "");
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editCategory, setEditCategory] = useState(task.category);
  const [editDueDate, setEditDueDate] = useState<Date | null>(
    mustReschedule
      ? rescheduleDefault()
      : task.dueDate ? parseDateOnly(task.dueDate) : null
  );
  const [editHasCounter, setEditHasCounter] = useState<boolean>(!!task.hasCounter);
  const [editCounterUnit, setEditCounterUnit] = useState<string>(task.counterUnit ?? "");
  const [showEditDescription, setShowEditDescription] = useState(!!editDescription);

  function startEdit() {
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
    setShowEditDescription(!!(task.description ?? ""));
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setEditDueDate(mustReschedule ? rescheduleDefault() : (task.dueDate ? parseDateOnly(task.dueDate) : null));
    setEditHasCounter(!!task.hasCounter);
    setEditCounterUnit(task.counterUnit ?? "");
    setEditError(null);
    setIsEditing(true);
  }

  async function handleSave() {
    if (!editTitle.trim()) { setEditError("Title is required."); return; }
    if (mustReschedule) {
      const today = todayMidnight();
      if (!editDueDate || editDueDate < today) {
        setEditError("Due date cannot be in the past.");
        return;
      }
    }
    if (!onSave) return;
    setIsSaving(true);
    setEditError(null);
    const err = await onSave({
      title: editTitle.trim(),
      description: editDescription.trim() || null,
      category: editCategory,
      priority: editPriority,
      dueDate: editDueDate
        ? `${editDueDate.getFullYear()}-${String(editDueDate.getMonth() + 1).padStart(2, "0")}-${String(editDueDate.getDate()).padStart(2, "0")}`
        : null,
      hasCounter: task.isRecurring ? editHasCounter : undefined,
      counterUnit: task.isRecurring ? (editHasCounter && editCounterUnit ? editCounterUnit : null) : undefined,
    });
    setIsSaving(false);
    if (err) { setEditError(err); return; }
    setIsEditing(false);
  }

  const categoryOptions = CATEGORIES.includes(task.category)
    ? CATEGORIES
    : [...CATEGORIES, task.category].sort();

  const titleColor = !isEditing && task.status === "completed" ? "var(--color-fg-muted)" : "var(--color-fg)";
  const titleDecoration = !isEditing && task.status === "completed" ? "line-through" : "none";

  const priorityDot = isEditing ? (PRIORITY_DOT[editPriority] ?? "var(--color-fg-muted)") : dot;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "var(--color-modal-overlay)" }}
      onClick={isEditing ? undefined : onClose}
    >
      <div
        className="w-full max-w-md sm:max-w-lg flex flex-col relative"
        style={{
          background: "var(--color-panel)",
          border: "1px solid var(--color-border)",
          borderRadius: "6px",
          boxShadow: "var(--shadow-popover)",
          padding: "20px 20px 14px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={isEditing ? () => setIsEditing(false) : onClose}
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

        {/* Title row: priority dot + title (or input) + status pill */}
        <div className="flex items-center gap-2.5 min-w-0 pr-8 mb-2">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: priorityDot }} />
          {isEditing ? (
            <input
              autoFocus={!titleLocked}
              value={editTitle}
              disabled={titleLocked}
              title={titleLocked ? "Title is locked 24 hours after creation." : undefined}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }}
              className="flex-1 min-w-0 bg-transparent outline-none disabled:cursor-not-allowed"
              style={{
                color: titleLocked ? "var(--color-fg-muted)" : "var(--color-fg)",
                fontSize: "16px",
                fontWeight: 600,
                border: "none",
                padding: 0,
                letterSpacing: "0.01em",
              }}
            />
          ) : (
            <span
              className="truncate"
              style={{
                color: titleColor,
                textDecoration: titleDecoration,
                fontSize: "16px",
                fontWeight: 600,
                letterSpacing: "0.01em",
              }}
            >
              {task.title}
            </span>
          )}
          {!isEditing && (
            <span
              className="flex-shrink-0 text-[8px] tracking-widest uppercase"
              style={{
                color: status.color,
                border: `1px solid color-mix(in srgb, ${status.color} 30%, transparent)`,
                borderRadius: "999px",
                padding: "2px 7px",
                fontWeight: 600,
              }}
            >
              {status.label}
            </span>
          )}
        </div>

        {/* Body */}
        {isEditing ? (
          <div className="flex flex-col gap-3 mt-1">
            {mustReschedule && (
              <div
                className="flex items-start gap-2 px-3 py-2"
                style={{ background: "var(--color-danger-bg)", border: "1px solid var(--color-danger-border)", borderRadius: "3px", color: "var(--color-danger)" }}
              >
                <span style={{ fontSize: "11px", lineHeight: 1.4, flexShrink: 0 }}>⚠</span>
                <span style={{ fontSize: "11px", lineHeight: 1.4 }}>
                  {task.isRecurring
                    ? "This recurring task is overdue. Confirm the new due date or pick a different one to resume."
                    : "This task is overdue. Pick a new due date after today to start it, or delete the task."}
                </span>
              </div>
            )}

            {/* Description (lazy) */}
            {showEditDescription ? (
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Description"
                rows={2}
                className="w-full bg-transparent outline-none resize-none"
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
                onClick={() => setShowEditDescription(true)}
                className="self-start cursor-pointer transition-colors"
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

            {/* Inline metadata fields */}
            {(!task.isRecurring || mustReschedule) && (
              <Field label="Due">
                <DatePicker value={editDueDate} onChange={setEditDueDate} />
              </Field>
            )}

            <div className="flex gap-3">
              <Field label="Category" className="flex-1 min-w-0">
                <div className="relative">
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs appearance-none outline-none cursor-pointer"
                    style={{
                      background: "var(--color-input)",
                      color: CATEGORY_COLOR[editCategory] ?? "var(--color-input-fg)",
                      border: `1px solid color-mix(in srgb, ${CATEGORY_COLOR[editCategory] ?? "var(--color-border-hairline)"} 35%, transparent)`,
                      borderRadius: "3px",
                      fontWeight: 600,
                    }}
                  >
                    {categoryOptions.map((c) => (
                      <option key={c} value={c} style={{ background: "var(--color-input)", color: "var(--color-input-fg)", fontWeight: 400 }}>{c}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]" style={{ color: CATEGORY_COLOR[editCategory] ?? "var(--color-fg-subtle)" }}>▾</span>
                </div>
              </Field>
            </div>

            <Field label="Priority">
              <div className="flex flex-wrap gap-1.5">
                {PRIORITIES.map((p) => {
                  const active = editPriority === p.value;
                  return (
                    <button
                      key={p.value}
                      onClick={() => setEditPriority(p.value)}
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
            </Field>

            {task.isRecurring && (
              <Field label="Counter">
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setEditHasCounter((v) => !v)}
                    className="text-[10px] tracking-widest uppercase cursor-pointer transition-colors"
                    style={{
                      background: editHasCounter ? "var(--color-active-highlight-bg)" : "transparent",
                      color: editHasCounter ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                      border: `1px solid ${editHasCounter ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                      borderRadius: "999px",
                      fontWeight: editHasCounter ? 600 : 400,
                      padding: "3px 10px",
                    }}
                  >
                    {editHasCounter ? "On" : "Off"}
                  </button>
                  {editHasCounter && (
                    <div className="relative">
                      <select
                        value={editCounterUnit}
                        onChange={(e) => setEditCounterUnit(e.target.value)}
                        className="px-2 py-1.5 text-xs appearance-none outline-none cursor-pointer pr-6"
                        style={{
                          background: "var(--color-input)",
                          color: "var(--color-input-fg)",
                          border: "1px solid var(--color-border-hairline)",
                          borderRadius: "3px",
                        }}
                      >
                        <option value="" style={{ background: "var(--color-input)" }}>(no unit)</option>
                        {COUNTER_UNITS.map((u) => (
                          <option key={u} value={u} style={{ background: "var(--color-input)" }}>{u}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px]" style={{ color: "var(--color-fg-subtle)" }}>▾</span>
                    </div>
                  )}
                </div>
              </Field>
            )}

            {editError && (
              <p className="text-xs" style={{ color: "var(--color-danger)" }}>
                {editError}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 mt-1">
            {/* Metadata — items separated by whitespace, no middle-dots */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]" style={{ color: "var(--color-fg-muted)" }}>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
                <span style={{ color: dot, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>{task.priority}</span>
              </span>
              {task.category && (
                <span style={{ color: CATEGORY_COLOR[task.category] ?? "var(--color-fg)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                  {task.category}
                </span>
              )}
              <span className="inline-flex items-center gap-1" style={{ color: "var(--color-warning)", fontWeight: 600 }}>
                <svg width="9" height="11" viewBox="0 0 10 12" fill="none" shapeRendering="crispEdges">
                  <path d="M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z" style={{ fill: "var(--color-warning)" }} opacity="0.95" />
                </svg>
                {task.pointValue.toLocaleString()}p
              </span>
              <span style={{ color: "var(--color-fg)", fontWeight: 600 }}>
                {task.completedAt ? fmtFull(task.completedAt) : fmtShort(task.dueDate)}
              </span>
              {task.isRecurring && task.recurrenceRule && (
                <span className="inline-flex items-center gap-1" style={{ color: "var(--color-active-highlight-alt)", fontWeight: 600 }}>
                  <span style={{ fontSize: "12px", lineHeight: 1 }}>↻</span>
                  <span style={{ textTransform: "lowercase" }}>{task.recurrenceRule}</span>
                </span>
              )}
            </div>

            {/* Streak / bonus — segmented pixel bar showing progress to the next tier */}
            {(currentStreakCount ?? 0) >= 3 && (() => {
              const c = currentStreakCount ?? 0;
              const multiplier = c >= 30 ? 2.0 : c >= 14 ? 1.8 : c >= 7 ? 1.5 : 1.2;
              const nextTier = c >= 30 ? null : c >= 14 ? { at: 30, mult: 2.0 } : c >= 7 ? { at: 14, mult: 1.8 } : { at: 7, mult: 1.5 };
              const tierStart = c >= 14 ? 14 : c >= 7 ? 7 : 3;
              const SEGMENTS = 12;
              const filled = nextTier
                ? Math.max(1, Math.min(SEGMENTS, Math.round(((c - tierStart) / (nextTier.at - tierStart)) * SEGMENTS)))
                : SEGMENTS;
              const fmt = (m: number) => Number.isInteger(m) ? m.toFixed(0) : m.toFixed(1);
              return (
                <div className="flex flex-col gap-1.5" style={{ color: "var(--color-active-highlight-alt)" }}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-baseline gap-1.5">
                      <span aria-hidden style={{ fontSize: "11px", lineHeight: 1 }}>🔥</span>
                      <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{c}</span>
                      {longestStreakCount != null && longestStreakCount > c && (
                        <span style={{ opacity: 0.55, fontVariantNumeric: "tabular-nums" }}>/ {longestStreakCount}</span>
                      )}
                      <span style={{ marginLeft: 6, fontWeight: 600 }}>{fmt(multiplier)}×</span>
                    </span>
                    {nextTier ? (
                      <span style={{ color: "var(--color-fg-subtle)", fontSize: "10px", letterSpacing: "0.05em", fontVariantNumeric: "tabular-nums" }}>
                        {nextTier.at - c} → {fmt(nextTier.mult)}×
                      </span>
                    ) : (
                      <span style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 700 }}>
                        Max
                      </span>
                    )}
                  </div>
                  <div className="flex" style={{ gap: 2 }} aria-hidden>
                    {Array.from({ length: SEGMENTS }).map((_, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: 6,
                          background: i < filled ? "var(--color-active-highlight-alt)" : "var(--color-border-soft)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              );
            })()}

            {task.description && (
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
                {task.description}
              </p>
            )}

            {task.isRecurring && (task.recurrenceRule === "daily" || task.recurrenceRule === "weekdays") && (
              <HeatmapStrip
                rule={task.recurrenceRule}
                hasCounter={task.hasCounter ?? false}
                cycles={task.recentCycles ?? []}
              />
            )}

            {task.isRecurring && task.hasCounter && (
              <CounterHistory taskId={task.taskId} unit={task.counterUnit ?? null} isAuthenticated={isAuthenticated} refreshKey={historyRefreshKey ?? 0} seed={task.recentCycles ?? null} />
            )}

            {/* Subtasks — hidden entirely when completed and there's nothing to read */}
            {(task.status !== "completed" || subtasks.length > 0) && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                    Subtasks
                  </span>
                  {subtasks.length > 0 && (
                    <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.05em" }}>
                      {subtaskDoneCount}/{subtasks.length} done
                    </span>
                  )}
                </div>
                {subtasks.map((s) => (
                  <SubtaskRow
                    key={s.subtaskId}
                    subtask={s}
                    onToggle={() => handleToggleSubtask(s)}
                    onDelete={() => handleDeleteSubtask(s)}
                  />
                ))}
                {task.status !== "completed" && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center" style={{ color: "var(--color-fg-subtle)", fontSize: "12px", lineHeight: 1 }}>+</span>
                    <input
                      type="text"
                      value={newSubtaskTitle}
                      onChange={(e) => setNewSubtaskTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); handleAddSubtask(); }
                      }}
                      placeholder="Add subtask…"
                      disabled={addingSubtask}
                      className="flex-1 text-xs outline-none bg-transparent"
                      style={{ color: "var(--color-fg)", border: "none", padding: "2px 0" }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-wrap mt-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="pixel-btn"
                style={{ fontSize: "10px", padding: "5px 12px" }}
              >
                {isSaving ? "Saving…" : mustReschedule ? (task.isRecurring ? "Save & Resume" : "Save & Start") : "Save"}
              </button>
              <button
                onClick={() => mustReschedule ? onClose() : setIsEditing(false)}
                disabled={isSaving}
                className="text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer disabled:opacity-40"
                style={{
                  color: "var(--color-fg-subtle)",
                  background: "transparent",
                  border: "1px solid var(--color-border-hairline)",
                  borderRadius: "999px",
                  padding: "5px 12px",
                }}
                onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.background = "var(--color-overlay-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Cancel
              </button>
              {mustReschedule && onDelete && (
                <button
                  onClick={onDelete}
                  disabled={isSaving}
                  className="ml-auto flex items-center gap-1.5 text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer disabled:opacity-40"
                  style={{
                    color: "var(--color-danger)",
                    background: "transparent",
                    border: "1px solid var(--color-danger-border)",
                    borderRadius: "999px",
                    padding: "5px 12px",
                  }}
                  onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.background = "var(--color-danger-bg)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <path d="M3.8 2V1.3h2.4V2" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.9" strokeLinecap="round" />
                    <line x1="1.3" y1="2.5" x2="8.7" y2="2.5" style={{ stroke: "var(--color-danger)" }} strokeWidth="1" strokeLinecap="round" />
                    <path d="M2.6 3L3.1 8.5h3.8L7.4 3" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                  Delete
                </button>
              )}
            </>
          ) : (
            <>
              {task.status === "pending" && !task.isRecurring && onStart && (
                <ActionBtn
                  onClick={onStart}
                  disabled={isActing}
                  color="var(--color-active-highlight)"
                  hoverBg="var(--color-active-highlight-bg)"
                  label="Start"
                  icon={
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <polygon points="2,1 9,5 2,9" style={{ fill: "var(--color-active-highlight)" }} />
                    </svg>
                  }
                />
              )}

              {task.status === "pending" && task.isRecurring && onCheckIn && (
                <ActionBtn
                  onClick={onCheckIn}
                  disabled={isActing}
                  color="var(--color-active-highlight-alt)"
                  hoverBg="var(--color-active-highlight-alt-bg)"
                  label="Check In"
                  icon={
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <polyline points="1,5 4,8 9,2" style={{ stroke: "var(--color-active-highlight-alt)" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                />
              )}

              {task.isRecurring && task.hasCounter && onLog && (
                <ActionBtn
                  onClick={onLog}
                  disabled={isActing}
                  color="var(--color-active-highlight)"
                  hoverBg="var(--color-active-highlight-bg)"
                  label="Log"
                  icon={
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <line x1="5" y1="1.5" x2="5" y2="8.5" style={{ stroke: "var(--color-active-highlight)" }} strokeWidth="1.5" strokeLinecap="round" />
                      <line x1="1.5" y1="5" x2="8.5" y2="5" style={{ stroke: "var(--color-active-highlight)" }} strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  }
                />
              )}

              {checkInBlocked && (
                <div className="flex items-center gap-1.5 px-2.5" style={{ border: "1px solid var(--color-warning-border)", borderRadius: "999px", background: "var(--color-warning-bg)", padding: "5px 10px" }}>
                  <svg width="8" height="9" viewBox="0 0 10 12" fill="none">
                    <rect x="2" y="5" width="6" height="6" rx="0.8" stroke="var(--color-warning)" strokeWidth="1.2" fill="none"/>
                    <path d="M3.5 5V3.5a1.5 1.5 0 0 1 3 0V5" stroke="var(--color-warning)" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                  </svg>
                  <span style={{ color: "var(--color-warning)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    {fmtShort(task.dueDate)}
                  </span>
                </div>
              )}

              {task.status === "in_progress" && onPause && (
                <ActionBtn
                  onClick={onPause}
                  disabled={isActing}
                  color="var(--color-warning)"
                  hoverBg="var(--color-warning-bg)"
                  label="Pause"
                  icon={
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <rect x="1.5" y="1" width="3" height="8" style={{ fill: "var(--color-warning)" }} />
                      <rect x="5.5" y="1" width="3" height="8" style={{ fill: "var(--color-warning)" }} />
                    </svg>
                  }
                />
              )}

              {task.status === "in_progress" && onComplete && (
                <ActionBtn
                  onClick={onComplete}
                  disabled={isActing}
                  color="var(--color-success)"
                  hoverBg="var(--color-success-bg)"
                  label="Complete"
                  icon={
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <polyline points="1,5 4,8 9,2" style={{ stroke: "var(--color-success)" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                />
              )}

              {canUndo && onUndo && (
                <ActionBtn
                  onClick={onUndo}
                  disabled={isActing}
                  color="var(--color-warning)"
                  hoverBg="var(--color-warning-bg)"
                  label="Undo"
                  icon={
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path d="M7 2H4C2.3 2 1 3.3 1 5s1.3 3 3 3h4" style={{ stroke: "var(--color-warning)" }} strokeWidth="1.5" strokeLinecap="round" />
                      <polyline points="4,4.5 1.5,2 4,0" style={{ stroke: "var(--color-warning)" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  }
                />
              )}

              {onSave && task.status !== "completed" && (
                <ActionBtn
                  onClick={startEdit}
                  disabled={isActing}
                  color="var(--color-fg-muted)"
                  hoverBg="var(--color-overlay-hover)"
                  label="Edit"
                  icon={
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path d="M7 1.5L8.5 3 3.5 8H2V6.5L7 1.5Z" style={{ stroke: "var(--color-fg-muted)" }} strokeWidth="1.2" strokeLinejoin="round" fill="none" />
                    </svg>
                  }
                />
              )}

              {onDelete && (
                <ActionBtn
                  onClick={onDelete}
                  disabled={isActing}
                  color="var(--color-danger)"
                  hoverBg="var(--color-danger-bg)"
                  label="Delete"
                  icon={
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path d="M3.8 2V1.3h2.4V2" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.9" strokeLinecap="round" />
                      <line x1="1.3" y1="2.5" x2="8.7" y2="2.5" style={{ stroke: "var(--color-danger)" }} strokeWidth="1" strokeLinecap="round" />
                      <path d="M2.6 3L3.1 8.5h3.8L7.4 3" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  }
                />
              )}
            </>
          )}
        </div>

        {/* Tiny footer (view mode only) */}
        {!isEditing && (
          <div className="flex items-center justify-between mt-3 pt-2 gap-3" style={{ borderTop: "1px solid var(--color-border-hairline)" }}>
            <span className="flex items-center gap-2" style={{ color: "var(--color-fg-subtle)", opacity: 0.6, fontSize: "9px", letterSpacing: "0.1em" }}>
              <span style={{ fontFamily: "monospace", letterSpacing: "0.15em" }}>{task.taskId.slice(0, 8).toUpperCase()}</span>
              <span style={{ opacity: 0.5 }}>·</span>
              <span style={{ textTransform: "uppercase" }}>created {fmtLocalDate(task.createdAt)}</span>
            </span>
            <span
              style={{
                color: task.submitted ? "var(--color-warning)" : "var(--color-fg-subtle)",
                opacity: task.submitted ? 0.85 : 0.6,
                fontSize: "9px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: task.submitted ? 600 : 400,
              }}
            >
              {task.submitted ? "Banked" : "Unbanked"}
            </span>
          </div>
        )}
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

const HISTORY_PAGE_SIZE = 30;
const HEATMAP_DAYS = 14;

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function HeatmapStrip({ rule, hasCounter, cycles }: { rule: string; hasCounter: boolean; cycles: CheckInCycleDto[] }) {
  // Build the last N expected check-in dates walking backwards from today.
  // For "weekdays" we skip Sat/Sun so each cell represents an actual opportunity,
  // not a calendar day where missing it would be misleading.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expected: string[] = [];
  const cursor = new Date(today);
  while (expected.length < HEATMAP_DAYS) {
    const dow = cursor.getDay();
    if (rule !== "weekdays" || (dow !== 0 && dow !== 6)) {
      expected.push(dateKey(cursor));
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  expected.reverse();
  const todayKey = dateKey(today);

  const cycleByDate = new Map(cycles.map((c) => [c.checkInDate.split("T")[0], c]));
  // Only used to scale opacity when hasCounter — clamp to 1 so a single zero-only
  // task still renders solid cells.
  const maxValue = Math.max(
    1,
    ...cycles.map((c) => (typeof c.counterValue === "number" ? c.counterValue : 0)),
  );

  const checkedCount = expected.reduce((n, k) => (cycleByDate.has(k) ? n + 1 : n), 0);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Last {HEATMAP_DAYS} {rule === "weekdays" ? "weekdays" : "days"}
        </span>
        <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.05em", fontVariantNumeric: "tabular-nums" }}>
          {checkedCount}/{HEATMAP_DAYS}
        </span>
      </div>
      <div className="flex" style={{ gap: 2 }}>
        {expected.map((k) => {
          const cycle = cycleByDate.get(k);
          const isToday = k === todayKey;
          const checked = !!cycle;
          const value = typeof cycle?.counterValue === "number" ? cycle!.counterValue : null;
          const intensity = checked && hasCounter && value != null && value > 0
            ? 0.4 + 0.6 * (value / maxValue)
            : checked ? 1 : 1;
          const tooltip = `${fmtCycleDate(k)}${
            checked
              ? hasCounter
                ? value != null ? ` · ${value.toLocaleString()}` : " · checked in"
                : " · checked in"
              : " · no check-in"
          }`;
          return (
            <div
              key={k}
              title={tooltip}
              style={{
                flex: 1,
                height: 18,
                borderRadius: 2,
                background: checked ? "var(--color-active-highlight-alt)" : "var(--color-border-soft)",
                opacity: checked ? intensity : 1,
                outline: isToday ? "1px solid var(--color-active-highlight)" : "none",
                outlineOffset: 1,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function fmtCycleDate(iso: string): string {
  const [y, m, d] = iso.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtCycleTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function CounterHistory({ taskId, unit, isAuthenticated, refreshKey, seed }: { taskId: string; unit: string | null; isAuthenticated: boolean; refreshKey: number; seed: CheckInCycleDto[] | null }) {
  // Seed synchronously from TaskDto.recentCycles so first paint already shows
  // history. The effect below still refetches in the background so stale seeds
  // (e.g. after a fresh check-in) get reconciled and we pick up TotalCount.
  const [items, setItems] = useState<CheckInCycleDto[]>(seed ?? []);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(seed?.length ?? 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingCycleId, setEditingCycleId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [savingCycleId, setSavingCycleId] = useState<number | null>(null);

  const hasMore = items.length < totalCount;

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    // Only show the spinner if we have nothing to render yet — otherwise the
    // background refresh stays invisible and seeded rows remain in place.
    const hasSeededContent = items.length > 0;
    if (!hasSeededContent) setLoading(true);
    setError(null);
    tasksApi.getCheckInHistory(taskId, 1, HISTORY_PAGE_SIZE).then(({ data, error }) => {
      if (cancelled) return;
      setLoading(false);
      if (error) { setError(error); return; }
      setItems(data!.data);
      setTotalCount(data!.totalCount);
      setPage(1);
    });
    return () => { cancelled = true; };
    // items.length is intentionally omitted — we only want this effect to fire
    // on identity/auth/refresh changes, and the spinner-skip check is read once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId, isAuthenticated, refreshKey]);

  async function loadMore() {
    if (loading || !hasMore) return;
    setLoading(true);
    const next = page + 1;
    const { data, error } = await tasksApi.getCheckInHistory(taskId, next, HISTORY_PAGE_SIZE);
    setLoading(false);
    if (error) { setError(error); return; }
    setItems((prev) => [...prev, ...data!.data]);
    setPage(next);
  }

  function startEdit(c: CheckInCycleDto) {
    setEditingCycleId(c.cycleId);
    setEditValue(c.counterValue == null ? "" : String(c.counterValue));
    setError(null);
  }

  function cancelEdit() {
    setEditingCycleId(null);
    setEditValue("");
  }

  async function saveEdit(c: CheckInCycleDto) {
    const trimmed = editValue.trim();
    let newValue: number | null;
    if (trimmed === "") {
      newValue = null;
    } else if (!/^\d+$/.test(trimmed)) {
      setError("Enter a whole number, or leave blank to clear.");
      return;
    } else {
      newValue = Number(trimmed);
      if (newValue < 0) { setError("Must be 0 or greater."); return; }
    }
    if (newValue === c.counterValue) {
      cancelEdit();
      return;
    }
    setSavingCycleId(c.cycleId);
    const { error: apiError } = await tasksApi.updateCheckInCycle(taskId, c.cycleId, newValue);
    setSavingCycleId(null);
    if (apiError) { setError(apiError); return; }
    setItems((prev) => prev.map((x) => x.cycleId === c.cycleId ? { ...x, counterValue: newValue } : x));
    cancelEdit();
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-1.5">
        <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          History
        </span>
        <p className="text-xs" style={{ color: "var(--color-fg-subtle)" }}>Sign in to see counter history.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          History{unit ? ` · ${unit}` : ""}
        </span>
        {totalCount > 0 && (
          <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.05em" }}>
            {items.length}/{totalCount}
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs" style={{ color: "var(--color-danger)" }}>{error}</p>
      )}

      {!loading && items.length === 0 && !error && (
        <p className="text-xs" style={{ color: "var(--color-fg-subtle)" }}>No check-ins yet.</p>
      )}

      {items.length > 0 && (() => {
        const groups: { dateKey: string; entries: CheckInCycleDto[] }[] = [];
        for (const c of items) {
          const dateKey = c.checkInDate.split("T")[0];
          const last = groups[groups.length - 1];
          if (last && last.dateKey === dateKey) last.entries.push(c);
          else groups.push({ dateKey, entries: [c] });
        }
        return (
          <div
            style={{
              maxHeight: 150,
              overflowY: "auto",
              borderRadius: 6,
              background: "var(--color-surface-deep)",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.22), inset 0 -1px 2px rgba(0, 0, 0, 0.08)",
              padding: "6px 10px 10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {groups.map(({ dateKey, entries }, gIdx) => (
              <div key={dateKey}>
                <div className={`flex items-center gap-3 ${gIdx === 0 ? "mb-1" : "mt-4 mb-1"}`}>
                  <span
                    className="tracking-widest uppercase text-[11px] font-semibold"
                    style={{ color: "var(--color-fg-muted)" }}
                  >
                    {fmtCycleDate(dateKey)}
                  </span>
                  <div className="flex-1 h-px" style={{ background: "var(--color-border-soft)" }} />
                </div>
                <div className="flex flex-col">
                  {entries.map((c, idx) => {
                    const isEditing = editingCycleId === c.cycleId;
                    const isSaving = savingCycleId === c.cycleId;
                    return (
                      <div
                        key={c.cycleId}
                        className="flex items-center justify-between gap-3"
                        style={{
                          fontSize: "11px",
                          color: "var(--color-fg-muted)",
                          padding: "5px 0",
                          borderBottom: idx === entries.length - 1
                            ? "none"
                            : "1px dashed var(--color-border-hairline)",
                        }}
                      >
                        <span style={{ fontVariantNumeric: "tabular-nums" }}>
                          {fmtCycleTime(c.createdAt)}
                        </span>
                        {isEditing ? (
                          <span className="inline-flex items-center gap-1">
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              autoFocus
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") { e.preventDefault(); saveEdit(c); }
                                else if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
                              }}
                              onBlur={() => saveEdit(c)}
                              disabled={isSaving}
                              placeholder="—"
                              className="outline-none text-right"
                              style={{
                                width: 64,
                                background: "var(--color-input)",
                                color: "var(--color-input-fg)",
                                border: "1px solid var(--color-active-highlight-border)",
                                borderRadius: "3px",
                                padding: "2px 6px",
                                fontSize: "11px",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            />
                            {unit && <span style={{ color: "var(--color-fg-subtle)", fontSize: "10px" }}>{unit}</span>}
                          </span>
                        ) : (
                          <button
                            onClick={() => startEdit(c)}
                            className="inline-flex items-baseline gap-1 cursor-text"
                            style={{
                              background: "transparent",
                              border: "none",
                              padding: "1px 4px",
                              borderRadius: "3px",
                              color: c.counterValue == null ? "var(--color-fg-subtle)" : "var(--color-fg)",
                              fontWeight: 600,
                              fontVariantNumeric: "tabular-nums",
                              fontSize: "11px",
                            }}
                            title="Click to edit"
                          >
                            {c.counterValue == null ? "—" : c.counterValue.toLocaleString()}
                            {unit && c.counterValue != null && (
                              <span style={{ color: "var(--color-fg-subtle)", fontWeight: 400, fontSize: "10px" }}>{unit}</span>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        );
      })()}

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="self-start text-[10px] tracking-widest uppercase cursor-pointer disabled:opacity-40"
          style={{
            color: "var(--color-active-highlight)",
            background: "transparent",
            border: "1px solid var(--color-active-highlight-border)",
            borderRadius: "999px",
            padding: "3px 10px",
          }}
        >
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
