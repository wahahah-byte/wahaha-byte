"use client";

import { useEffect, useState } from "react";
import { TaskDto, Subtask } from "@/lib/api/tasks";
import { subtasksApi } from "@/lib/api/subtasks";
import { PRIORITY_DOT, CATEGORIES, CATEGORY_COLOR } from "@/lib/constants";
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
  const [showEditDescription, setShowEditDescription] = useState(!!editDescription);

  function startEdit() {
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
    setShowEditDescription(!!(task.description ?? ""));
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setEditDueDate(mustReschedule ? rescheduleDefault() : (task.dueDate ? parseDateOnly(task.dueDate) : null));
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

            {/* Streak / bonus — same whitespace-only spacing */}
            {(currentStreakCount ?? 0) >= 3 && (() => {
              const c = currentStreakCount ?? 0;
              const multiplier = c >= 30 ? 2.0 : c >= 14 ? 1.8 : c >= 7 ? 1.5 : 1.2;
              const nextTier = c >= 30 ? null : c >= 14 ? { at: 30, mult: 2.0 } : c >= 7 ? { at: 14, mult: 1.8 } : { at: 7, mult: 1.5 };
              const fmt = (m: number) => Number.isInteger(m) ? m.toFixed(0) : m.toFixed(1);
              return (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]" style={{ color: "var(--color-active-highlight-alt)" }}>
                  <span>
                    🔥{" "}
                    <span style={{ fontWeight: 600 }}>{currentStreakCount}</span>
                    {longestStreakCount != null && (
                      <span style={{ opacity: 0.55 }}> / {longestStreakCount}</span>
                    )}
                  </span>
                  <span><span style={{ fontWeight: 600 }}>{fmt(multiplier)}×</span> bonus</span>
                  {nextTier && (
                    <span style={{ color: "var(--color-fg-subtle)", fontSize: "10px" }}>
                      {nextTier.at - c} to {fmt(nextTier.mult)}×
                    </span>
                  )}
                </div>
              );
            })()}

            {task.description && (
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
                {task.description}
              </p>
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
