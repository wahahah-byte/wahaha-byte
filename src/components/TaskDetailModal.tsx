"use client";

import { useState } from "react";
import { TaskDto } from "@/lib/api/tasks";
import { PRIORITY_DOT, CATEGORIES, CATEGORY_COLOR } from "@/lib/constants";
import DatePicker from "@/components/DatePicker";

const PRIORITIES = [
  { label: "Low",    value: "low",    color: "#22c55e" },
  { label: "Medium", value: "medium", color: "var(--color-warning)" },
  { label: "High",   value: "high",   color: "var(--color-danger)" },
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
  isActing?: boolean;
  canUndo?: boolean;
  initialEditMode?: boolean;
  mustReschedule?: boolean;
}

function parseDateOnly(dateStr: string): Date {
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
}

function fmt(dateStr: string | null) {
  if (!dateStr) return "—";
  return parseDateOnly(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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
      className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs sm:text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ color, background: "transparent", border: `1px solid ${color}44`, borderRadius: "3px" }}
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
  onSave, isActing, canUndo, initialEditMode, mustReschedule,
}: Props) {
  const dot = PRIORITY_DOT[task.priority.toLowerCase()] ?? "var(--color-fg-muted)";
  const status = STATUS_LABEL[task.status] ?? { label: task.status, color: "var(--color-fg-muted)" };

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

  function startEdit() {
    setEditTitle(task.title);
    setEditDescription(task.description ?? "");
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-2 sm:px-4"
      style={{ background: "rgba(0,0,0,0.72)" }}
      onClick={isEditing ? undefined : onClose}
    >
      <div
        className={`w-full max-w-md flex flex-col rounded${isEditing ? "" : " overflow-hidden"}`}
        style={{ background: "var(--color-panel)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-popover)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ background: "var(--color-panel-header)", borderBottom: "1px solid var(--color-border)", ...(isEditing && { borderRadius: "4px 4px 0 0" }) }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: isEditing ? (PRIORITY_DOT[editPriority] ?? "var(--color-fg-muted)") : dot }} />
            <span
              className="text-sm font-semibold tracking-wide truncate"
              style={{
                color: !isEditing && task.status === "completed" ? "var(--color-fg-muted)" : "var(--color-input-fg)",
                textDecoration: !isEditing && task.status === "completed" ? "line-through" : "none",
              }}
            >
              {isEditing ? (editTitle || "Edit Task") : task.title}
            </span>
            {isEditing && (
              <span
                className="flex-shrink-0 text-[8px] tracking-widest uppercase px-1.5 py-0.5"
                style={{ color: "var(--color-active-highlight)", border: "1px solid var(--color-active-highlight-border)", borderRadius: "2px" }}
              >
                Editing
              </span>
            )}
          </div>
          <button
            onClick={isEditing ? () => setIsEditing(false) : onClose}
            className="flex-shrink-0 ml-3 transition-colors text-lg leading-none cursor-pointer"
            style={{ color: "var(--color-fg-subtle)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-fg)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg-subtle)")}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        {isEditing ? (
          <div className="flex flex-col gap-3 px-5 py-4">
            {mustReschedule && (
              <div
                className="px-3 py-2 text-xs leading-relaxed flex items-start gap-2"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "3px", color: "rgba(239,68,68,0.9)" }}
              >
                <span style={{ fontSize: "11px", lineHeight: 1.4, flexShrink: 0 }}>⚠</span>
                <span style={{ fontSize: "11px", lineHeight: 1.4 }}>
                  {task.isRecurring
                    ? "This recurring task is overdue. Confirm the new due date or pick a different one to resume."
                    : "This task is overdue. Pick a new due date after today to start it, or delete the task."}
                </span>
              </div>
            )}
            <EditField label="Title">
              <input
                autoFocus={!titleLocked}
                value={editTitle}
                disabled={titleLocked}
                title={titleLocked ? "Title is locked 24 hours after creation." : undefined}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                className="w-full px-3 py-2 text-sm outline-none disabled:cursor-not-allowed"
                style={{
                  background: titleLocked ? "var(--color-surface-deep)" : "var(--color-input)",
                  color: titleLocked ? "var(--color-fg-subtle)" : "var(--color-input-fg)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "3px",
                }}
                onFocus={(e) => { if (!titleLocked) e.currentTarget.style.borderColor = "var(--color-active-highlight)"; }}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              />
            </EditField>

            <EditField label="Description">
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Optional details…"
                rows={2}
                className="w-full px-3 py-2 text-sm outline-none resize-none placeholder-white/20"
                style={{ background: "var(--color-input)", color: "var(--color-input-fg)", border: "1px solid var(--color-border)", borderRadius: "3px" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-active-highlight)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              />
            </EditField>

            <EditField label="Priority">
              <div className="flex" style={{ border: "1px solid var(--color-border)", borderRadius: "3px", overflow: "hidden" }}>
                {PRIORITIES.map((p, i) => (
                  <button
                    key={p.value}
                    onClick={() => setEditPriority(p.value)}
                    className="flex-1 py-2 text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
                    style={{
                      background: editPriority === p.value ? `${p.color}18` : "transparent",
                      color: editPriority === p.value ? p.color : "var(--color-fg-subtle)",
                      borderRight: i < PRIORITIES.length - 1 ? "1px solid var(--color-border)" : "none",
                      fontWeight: editPriority === p.value ? 600 : 400,
                      borderBottom: editPriority === p.value ? `2px solid ${p.color}` : "2px solid transparent",
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </EditField>

            <EditField label="Category">
              <div className="relative">
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm appearance-none outline-none cursor-pointer"
                  style={{
                    background: "var(--color-input)",
                    color: CATEGORY_COLOR[editCategory] ?? "var(--color-input-fg)",
                    border: `1px solid ${(CATEGORY_COLOR[editCategory] ?? "var(--color-border)") + "55"}`,
                    borderRadius: "3px",
                    fontWeight: 600,
                  }}
                >
                  {categoryOptions.map((c) => (
                    <option key={c} value={c} style={{ background: "var(--color-input)", color: "var(--color-input-fg)", fontWeight: 400 }}>{c}</option>
                  ))}
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: CATEGORY_COLOR[editCategory] ?? "var(--color-fg-subtle)" }}>▾</span>
              </div>
            </EditField>

            {(!task.isRecurring || mustReschedule) && (
              <EditField label="Due Date">
                <DatePicker value={editDueDate} onChange={setEditDueDate} />
              </EditField>
            )}

            {editError && (
              <p className="text-xs px-3 py-2" style={{ color: "var(--color-danger)", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "3px" }}>
                {editError}
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4 px-5 py-4">
            {task.description && (
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
                {task.description}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <Row label="Status">
                <span style={{ color: status.color, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                  {status.label}
                </span>
              </Row>

              <Row label="Priority">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
                  <span style={{ color: dot, fontSize: "11px", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                    {task.priority}
                  </span>
                </div>
              </Row>

              <Row label="Category">
                <span style={{
                  color: CATEGORY_COLOR[task.category] ?? "var(--color-fg)",
                  fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600,
                }}>
                  {task.category || "—"}
                </span>
              </Row>

              <Row label="Points">
                <div className="flex items-center gap-1">
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" shapeRendering="crispEdges">
                    <path d="M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z" style={{ fill: "var(--color-warning)" }} opacity="0.95" />
                    <rect x="4" y="5" width="2" height="2" style={{ fill: "var(--color-bg)" }} opacity="0.4" />
                  </svg>
                  <span style={{ color: "var(--color-warning)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.03em" }}>
                    {task.pointValue.toLocaleString()}
                  </span>
                </div>
              </Row>

              <Row label={task.isRecurring ? "Cycle Due" : "Due Date"}>
                <span style={{ color: "var(--color-fg-muted)", fontSize: "11px" }}>{fmt(task.dueDate)}</span>
              </Row>

              <Row label="Created">
                <span style={{ color: "var(--color-fg-muted)", fontSize: "11px" }}>{fmtLocalDate(task.createdAt)}</span>
              </Row>

              {task.completedAt && (
                <Row label="Completed">
                  <span style={{ color: "var(--color-success)", fontSize: "11px" }}>{fmtFull(task.completedAt)}</span>
                </Row>
              )}

              {task.isRecurring && task.recurrenceRule && (
                <Row label="Recurrence">
                  <div className="flex items-center gap-1.5">
                    <span style={{ color: "var(--color-secondary-accent)", fontSize: "11px", lineHeight: 1 }}>↻</span>
                    <span style={{ color: "var(--color-secondary-accent)", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                      {task.recurrenceRule.charAt(0).toUpperCase() + task.recurrenceRule.slice(1)}
                    </span>
                  </div>
                </Row>
              )}

              {(currentStreakCount ?? 0) >= 3 && (
                <Row label="Streak">
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontSize: "12px" }}>🔥</span>
                    <span style={{ color: "var(--color-secondary-accent)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
                      {currentStreakCount} &nbsp;
                      <span style={{ color: "rgba(167,139,250,0.5)", fontWeight: 400 }}>
                        / best {longestStreakCount}
                      </span>
                    </span>
                  </div>
                </Row>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div
          className="flex items-center gap-2 flex-wrap px-5 py-3"
          style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-panel-header)" }}
        >
          {isEditing ? (
            <>
              <button
                onClick={() => mustReschedule ? onClose() : setIsEditing(false)}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs sm:text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer disabled:opacity-40"
                style={{ color: "var(--color-fg-subtle)", background: "transparent", border: "1px solid var(--color-border-faint)", borderRadius: "3px" }}
                onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.background = "var(--color-overlay-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="pixel-btn"
                style={{ fontSize: "10px", padding: "6px 12px" }}
              >
                {isSaving ? "Saving…" : mustReschedule ? (task.isRecurring ? "Save & Resume" : "Save & Start") : "Save"}
              </button>
              {mustReschedule && onDelete && (
                <button
                  onClick={onDelete}
                  disabled={isSaving}
                  className="flex items-center gap-1.5 px-3 py-2 sm:py-1.5 text-xs sm:text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer disabled:opacity-40 ml-auto"
                  style={{ color: "var(--color-danger)", background: "transparent", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "3px" }}
                  onMouseEnter={(e) => { if (!isSaving) e.currentTarget.style.background = "rgba(239,68,68,0.12)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                >
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                    <path d="M3.8 2V1.3h2.4V2" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.9" strokeLinecap="round" />
                    <line x1="1.3" y1="2.5" x2="8.7" y2="2.5" style={{ stroke: "var(--color-danger)" }} strokeWidth="1" strokeLinecap="round" />
                    <path d="M2.6 3L3.1 8.5h3.8L7.4 3" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <line x1="4.2" y1="4.5" x2="4.2" y2="7.5" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.7" strokeLinecap="round" />
                    <line x1="5.8" y1="4.5" x2="5.8" y2="7.5" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.7" strokeLinecap="round" />
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
                  color="var(--color-secondary-accent)"
                  hoverBg="rgba(167,139,250,0.12)"
                  label="Start"
                  icon={
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <polygon points="2,1 9,5 2,9" style={{ fill: "var(--color-secondary-accent)" }} />
                    </svg>
                  }
                />
              )}

              {task.status === "pending" && task.isRecurring && onCheckIn && (
                <ActionBtn
                  onClick={onCheckIn}
                  disabled={isActing}
                  color="var(--color-secondary-accent)"
                  hoverBg="rgba(167,139,250,0.12)"
                  label="Check In"
                  icon={
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <polyline points="1,5 4,8 9,2" style={{ stroke: "var(--color-secondary-accent)" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                />
              )}

              {checkInBlocked && (
                <div className="flex items-center gap-1.5 px-3 py-1.5" style={{ border: "1px solid rgba(245,158,11,0.25)", borderRadius: "3px", background: "rgba(245,158,11,0.04)" }}>
                  <svg width="8" height="9" viewBox="0 0 10 12" fill="none">
                    <rect x="2" y="5" width="6" height="6" rx="0.8" stroke="rgba(245,158,11,0.6)" strokeWidth="1.2" fill="none"/>
                    <path d="M3.5 5V3.5a1.5 1.5 0 0 1 3 0V5" stroke="rgba(245,158,11,0.6)" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                  </svg>
                  <span style={{ color: "rgba(245,158,11,0.65)", fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    {fmtShort(task.dueDate)}
                  </span>
                </div>
              )}

              {task.status === "in_progress" && onPause && (
                <ActionBtn
                  onClick={onPause}
                  disabled={isActing}
                  color="var(--color-warning)"
                  hoverBg="rgba(245,158,11,0.12)"
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
                  hoverBg="rgba(74,222,128,0.12)"
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
                  hoverBg="rgba(245,158,11,0.12)"
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
                  hoverBg="rgba(239,68,68,0.12)"
                  label="Delete"
                  icon={
                    <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                      <path d="M3.8 2V1.3h2.4V2" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.9" strokeLinecap="round" />
                      <line x1="1.3" y1="2.5" x2="8.7" y2="2.5" style={{ stroke: "var(--color-danger)" }} strokeWidth="1" strokeLinecap="round" />
                      <path d="M2.6 3L3.1 8.5h3.8L7.4 3" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <line x1="4.2" y1="4.5" x2="4.2" y2="7.5" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.7" strokeLinecap="round" />
                      <line x1="5.8" y1="4.5" x2="5.8" y2="7.5" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.7" strokeLinecap="round" />
                    </svg>
                  }
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-2"
          style={{ borderTop: "1px solid var(--color-border)", background: "var(--color-panel-header)", ...(isEditing && { borderRadius: "0 0 4px 4px" }) }}
        >
          <span style={{ color: "var(--color-border-faint)", fontSize: "9px", letterSpacing: "0.15em", fontFamily: "monospace" }}>
            {task.taskId.slice(0, 8).toUpperCase()}
          </span>
          <span style={{ color: "var(--color-border-faint)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {task.submitted ? "Banked" : "Unbanked"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}

function EditField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
        {label}
      </span>
      {children}
    </div>
  );
}
