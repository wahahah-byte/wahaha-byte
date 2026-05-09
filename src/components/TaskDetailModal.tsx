"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { tasksApi, TaskDto, Subtask, CheckInCycleDto } from "@/lib/api/tasks";
import { subtasksApi } from "@/lib/api/subtasks";
import { PRIORITY_DOT, CATEGORIES, CATEGORY_COLOR, COUNTER_UNITS } from "@/lib/constants";
import DatePicker from "@/components/DatePicker";
import GoalStepper from "@/components/GoalStepper";
import SubtaskRow from "@/components/SubtaskRow";
import SlideToCheckIn from "@/components/SlideToCheckIn";
import DetailPager from "@/components/DetailPager";
import ChibiAvatar from "@/components/ChibiAvatar";
import { buildMockEquipped } from "@/lib/mockAvatar";

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
  counterGoal?: number | null;
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
  // Quick-log buffered delta flush. The +/- buttons under the avatar mutate a
  // local buffer instead of calling on each tap; the flush fires once when the
  // modal closes or switches tasks. Signature takes taskId explicitly so the
  // useEffect cleanup can route to the right task without a stale closure.
  onFlushQuickLog?: (taskId: string, delta: number) => void;
  onSave?: (fields: EditableTaskFields) => Promise<string | null>;
  onSubtasksChange?: (subtasks: Subtask[]) => void;
  isActing?: boolean;
  canUndo?: boolean;
  initialEditMode?: boolean;
  mustReschedule?: boolean;
  // Render inline as a panel (no overlay, no portal, no mobile bottom-sheet).
  // Used by the desktop 3-column shell as the right-hand detail column.
  inline?: boolean;
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
  onFlushQuickLog,
  onSave, onSubtasksChange,
  isActing, canUndo, initialEditMode, mustReschedule, inline,
}: Props) {
  const dot = PRIORITY_DOT[task.priority.toLowerCase()] ?? "var(--color-fg-muted)";
  const status = STATUS_LABEL[task.status] ?? { label: task.status, color: "var(--color-fg-muted)" };

  const isAuthenticated = typeof window !== "undefined" && !!localStorage.getItem("auth_token");
  const [subtasks, setSubtasksState] = useState<Subtask[]>(task.subtasks ?? []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newSubtaskSets, setNewSubtaskSets] = useState("");
  const [newSubtaskReps, setNewSubtaskReps] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);
  const isFitness = task.category === "Fitness";
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
    const setsTarget = isFitness && newSubtaskSets.trim() && Number(newSubtaskSets) > 0
      ? Number(newSubtaskSets) : null;
    const repsTarget = isFitness && newSubtaskReps.trim() && Number(newSubtaskReps) > 0
      ? Number(newSubtaskReps) : null;
    const optimistic: Subtask = {
      subtaskId: nextLocalId(),
      taskId: task.taskId,
      title,
      completed: false,
      sortOrder,
      createdAt: new Date().toISOString(),
      setsTarget,
      repsTarget,
      setsCompleted: setsTarget != null ? 0 : null,
    };
    const optimisticList = [...snapshot, optimistic];
    commitSubtasks(optimisticList);
    setNewSubtaskTitle("");
    setNewSubtaskSets("");
    setNewSubtaskReps("");
    if (!isAuthenticated) { setAddingSubtask(false); return; }
    const { data, error } = await subtasksApi.create(task.taskId, {
      title,
      setsTarget,
      repsTarget,
    });
    setAddingSubtask(false);
    if (error) {
      commitSubtasks(snapshot);
      return;
    }
    commitSubtasks(optimisticList.map((x) => x.subtaskId === optimistic.subtaskId ? data! : x));
  }

  async function handleIncrementSet(s: Subtask) {
    if (s.setsTarget == null) return;
    const currentDone = s.setsCompleted ?? 0;
    if (currentDone >= s.setsTarget) return;
    const nextDone = currentDone + 1;
    const nextCompleted = nextDone >= s.setsTarget;
    const snapshot = subtasks;
    const next = snapshot.map((x) => x.subtaskId === s.subtaskId
      ? { ...x, setsCompleted: nextDone, completed: nextCompleted || x.completed }
      : x);
    commitSubtasks(next);
    if (!isAuthenticated || s.subtaskId < 0) return;
    const { error } = await subtasksApi.update(s.subtaskId, {
      setsCompleted: nextDone,
      ...(nextCompleted && !s.completed ? { completed: true } : {}),
    });
    if (error) commitSubtasks(snapshot);
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
  const [editCounterGoal, setEditCounterGoal] = useState<string>(task.counterGoal != null ? String(task.counterGoal) : "");
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
    setEditCounterGoal(task.counterGoal != null ? String(task.counterGoal) : "");
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
      counterGoal: task.isRecurring
        ? (editHasCounter && editCounterGoal.trim() && Number(editCounterGoal) > 0 ? Number(editCounterGoal) : null)
        : undefined,
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

  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sheetDragY, setSheetDragY] = useState(0);
  const sheetDragRef = useRef<{ startY: number } | null>(null);

  // Extra check-in history for the heatmap. The embedded `task.recentCycles`
  // slice is bounded (~14 entries) and only covers the last couple of weeks,
  // so we lazily pull a wider window from /checkin-history when the modal
  // opens for a daily/weekdays task. Mock mode (no auth token) skips the
  // fetch and the heatmap falls back to the embedded slice.
  const [heatmapHistory, setHeatmapHistory] = useState<CheckInCycleDto[] | null>(null);

  // Buffered delta from the +/- stepper. Resets when the modal switches tasks
  // and flushes (one API call) on unmount or task change. Mirror in a ref so
  // the cleanup function reads the latest value without re-binding the effect.
  const [pendingLog, setPendingLog] = useState(0);
  const pendingLogRef = useRef(0);
  useEffect(() => { pendingLogRef.current = pendingLog; }, [pendingLog]);
  // flushRef holds the latest onFlushQuickLog so the cleanup can call it
  // without listing the prop in deps (which would re-run cleanup every render).
  const flushRef = useRef(onFlushQuickLog);
  useEffect(() => { flushRef.current = onFlushQuickLog; });

  useEffect(() => {
    // Fresh task = fresh buffer.
    setPendingLog(0);
    pendingLogRef.current = 0;
    const taskId = task.taskId;
    return () => {
      const delta = pendingLogRef.current;
      if (delta !== 0) flushRef.current?.(taskId, delta);
      pendingLogRef.current = 0;
    };
  }, [task.taskId]);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!task.isRecurring) return;
    if (task.recurrenceRule !== "daily" && task.recurrenceRule !== "weekdays") return;
    if (typeof window === "undefined") return;
    if (!localStorage.getItem("auth_token")) return;
    let cancelled = false;
    (async () => {
      // 12 weeks ≈ 84 days; round up to leave headroom for any paging quirks.
      const result = await tasksApi.getCheckInHistory(task.taskId, 1, 100);
      if (cancelled || result.error) return;
      setHeatmapHistory(result.data!.data);
    })();
    return () => { cancelled = true; };
  }, [task.taskId, task.isRecurring, task.recurrenceRule]);

  // Merge fetched history with the embedded slice so optimistic updates from
  // a just-completed check-in (which mutate task.recentCycles via the parent
  // store) stay visible without re-fetching. Local entries win on duplicate
  // cycleIds — they reflect any in-flight edits the server hasn't acked yet.
  const heatmapCycles = useMemo(() => {
    const fetched = heatmapHistory ?? [];
    const local = task.recentCycles ?? [];
    if (fetched.length === 0) return local;
    const byId = new Map<number, CheckInCycleDto>();
    for (const c of fetched) byId.set(c.cycleId, c);
    for (const c of local) byId.set(c.cycleId, c);
    return Array.from(byId.values());
  }, [heatmapHistory, task.recentCycles]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Lock background scroll while the sheet is open on mobile (matches DatePicker pattern).
  useEffect(() => {
    if (!isMobile || inline) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isMobile, inline]);

  const handleHandleTouchStart = useCallback((e: React.TouchEvent) => {
    sheetDragRef.current = { startY: e.touches[0].clientY };
    setSheetDragY(0);
  }, []);
  const handleHandleTouchMove = useCallback((e: React.TouchEvent) => {
    const d = sheetDragRef.current;
    if (!d) return;
    const dy = e.touches[0].clientY - d.startY;
    setSheetDragY(dy > 0 ? dy : 0);
  }, []);
  const handleHandleTouchEnd = useCallback(() => {
    const d = sheetDragRef.current;
    sheetDragRef.current = null;
    if (!d) return;
    if (sheetDragY > 110) {
      // Past dismiss threshold — slide off-screen, then close.
      setSheetDragY(window.innerHeight);
      setTimeout(onClose, 180);
    } else {
      setSheetDragY(0);
    }
  }, [sheetDragY, onClose]);

  if (!mounted) return null;

  const sheetWrapperClass = inline
    ? "w-full h-full flex flex-col relative"
    : isMobile
      ? "fixed left-0 right-0 flex flex-col"
      : "w-full max-w-md sm:max-w-lg flex flex-col relative";

  const sheetWrapperStyle: React.CSSProperties = inline
    ? {
        background: "var(--color-panel)",
        padding: "20px 20px 14px",
        overflowY: "auto",
        flex: 1,
      }
    : isMobile
    ? {
        bottom: 0,
        zIndex: 61,
        background: "var(--color-panel)",
        borderTop: "1px solid var(--color-border)",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.4)",
        maxHeight: "92vh",
        padding: "0 16px calc(16px + env(safe-area-inset-bottom, 0px))",
        animation: sheetDragY === 0 ? "detail-sheet-in 0.24s cubic-bezier(0.2, 0, 0, 1)" : undefined,
        transform: sheetDragY > 0 ? `translateY(${sheetDragY}px)` : undefined,
        transition: sheetDragY === 0 ? "transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
      }
    : {
        background: "var(--color-panel)",
        border: "1px solid var(--color-border)",
        borderRadius: "6px",
        boxShadow: "var(--shadow-popover)",
        padding: "20px 20px 14px",
      };

  const overlayClass = isMobile
    ? "fixed inset-0"
    : "fixed inset-0 z-50 flex items-center justify-center px-4";

  const overlayStyle: React.CSSProperties = isMobile
    ? { background: "var(--color-modal-overlay)", zIndex: 60, animation: "detail-overlay-in 0.18s ease-out" }
    : { background: "var(--color-modal-overlay)" };

  const sheet = (
    <div
      className={sheetWrapperClass}
      style={sheetWrapperStyle}
      onClick={(e) => e.stopPropagation()}
      data-edge-drawer-block={inline ? "" : undefined}
    >
        {isMobile && !inline && (
          <div
            onTouchStart={handleHandleTouchStart}
            onTouchMove={handleHandleTouchMove}
            onTouchEnd={handleHandleTouchEnd}
            onTouchCancel={handleHandleTouchEnd}
            style={{
              flexShrink: 0,
              padding: "10px 0 6px",
              display: "flex",
              justifyContent: "center",
              cursor: "grab",
              touchAction: "none",
            }}
          >
            <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--color-border)" }} />
          </div>
        )}
        <div
          style={isMobile && !inline
            ? { overflowY: "auto", padding: "4px 4px 4px", flex: 1, position: "relative" }
            : undefined
          }
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
                    ? "This routine is overdue. Confirm the new due date or pick a different one to resume."
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
                  {editHasCounter && (
                    <div className="flex items-center gap-1.5">
                      <span style={{ color: "var(--color-fg-subtle)", fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                        Goal
                      </span>
                      <GoalStepper value={editCounterGoal} onChange={setEditCounterGoal} />
                      {editCounterUnit && editCounterGoal.trim() && (
                        <span style={{ color: "var(--color-fg-subtle)", fontSize: "10px" }}>
                          {editCounterUnit} / {task.recurrenceRule === "weekly" ? "wk" : task.recurrenceRule === "monthly" ? "mo" : "day"}
                        </span>
                      )}
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

            {task.isRecurring && ((task.recurrenceRule === "daily" || task.recurrenceRule === "weekdays") || task.hasCounter) && (
              <DetailPager
                height={236}
                labels={(task.recurrenceRule === "daily" || task.recurrenceRule === "weekdays") ? ["Stage", "Stats"] : ["Stage"]}
                cards={[
                  {
                    key: "stage",
                    content: (
                      <div className="flex-1 flex flex-col items-center justify-center gap-2">
                        <ChibiAvatar equipped={buildMockEquipped()} height={192} />
                        {(() => {
                          if (!task.hasCounter) return null;
                          const today = new Date(); today.setHours(0, 0, 0, 0);
                          const todayKey = dateKey(today);
                          let cycleSum = 0; let count = 0;
                          for (const c of task.recentCycles ?? []) {
                            if (c.checkInDate.split("T")[0] === todayKey && typeof c.counterValue === "number") {
                              cycleSum += c.counterValue; count++;
                            }
                          }
                          // Display reflects buffered +/- taps so the user sees their
                          // intent immediately; the actual API call happens on flush.
                          const sum = cycleSum + pendingLog;
                          const goal = task.counterGoal ?? null;
                          if (count === 0 && pendingLog === 0 && goal == null && !onFlushQuickLog) return null;
                          const unit = task.counterUnit ? ` ${task.counterUnit}` : "";
                          const reached = goal != null && sum >= goal;
                          const innerText = goal != null
                            ? `${sum.toLocaleString()} / ${goal.toLocaleString()}${unit}`
                            : `${sum.toLocaleString()}${unit}`;
                          const labelStyle = { fontSize: 11, color: "var(--color-fg)", fontWeight: 600, fontVariantNumeric: "tabular-nums" as const, display: "inline-flex", alignItems: "center", gap: 6 };
                          // lastCheckInDate is only written by handleCheckIn — never by
                          // logCounter — so it's a clean signal that today's check-in is
                          // committed. Hide the +/- once that's true to keep the slider
                          // as the unambiguous "complete the day" affordance.
                          const checkedInToday = (task.lastCheckInDate ?? "").split("T")[0] === todayKey;
                          const quantity = onFlushQuickLog && task.status === "pending" && !checkedInToday ? (
                            <span className="goal-stepper" aria-label="Quick log" style={{ height: 20, verticalAlign: "middle" }}>
                              <button
                                type="button"
                                className="goal-stepper-btn"
                                onClick={() => setPendingLog((p) => p - 1)}
                                disabled={sum <= 0}
                                aria-label="Log -1"
                              >
                                −
                              </button>
                              <span
                                className="goal-stepper-input"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontWeight: 600,
                                  color: "var(--color-fg)",
                                  width: "auto",
                                  padding: "0 8px",
                                  whiteSpace: "nowrap",
                                }}
                                aria-live="polite"
                              >
                                {innerText}
                                {reached && <span style={{ marginLeft: 6, color: "var(--color-success)" }}>✓</span>}
                              </span>
                              <button
                                type="button"
                                className="goal-stepper-btn"
                                onClick={() => setPendingLog((p) => p + 1)}
                                aria-label="Log +1"
                              >
                                +
                              </button>
                            </span>
                          ) : (
                            <span>{innerText}{reached && <span style={{ marginLeft: 6, color: "var(--color-success)" }}>✓</span>}</span>
                          );
                          if (count === 0 && pendingLog === 0 && goal == null && !onFlushQuickLog) return null;
                          if (goal == null) {
                            return (
                              <span style={labelStyle}>
                                Today
                                {quantity}
                              </span>
                            );
                          }
                          const pct = Math.min(100, Math.round((sum / goal) * 100));
                          return (
                            <div className="flex flex-col items-center gap-1.5" style={{ minWidth: 180 }}>
                              <span style={labelStyle}>
                                Today
                                {quantity}
                              </span>
                              <div style={{ width: "100%", height: 4, background: "var(--color-track)", borderRadius: 2, overflow: "hidden" }}>
                                <div
                                  style={{
                                    width: `${pct}%`,
                                    height: "100%",
                                    background: reached ? "var(--color-success)" : "var(--color-active-highlight-alt)",
                                    transition: "width 0.3s",
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    ),
                  },
                  ...((task.recurrenceRule === "daily" || task.recurrenceRule === "weekdays") ? [{
                    key: "stats",
                    content: (
                      <div className="flex flex-col gap-3" style={{ overflowY: "auto", flex: 1 }}>
                        <HeatmapStrip
                          rule={task.recurrenceRule}
                          hasCounter={task.hasCounter ?? false}
                          cycles={heatmapCycles}
                        />
                      </div>
                    ),
                  }] : []),
                ]}
              />
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
                    onIncrementSet={() => handleIncrementSet(s)}
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
                      placeholder={isFitness ? "Exercise…" : "Add subtask…"}
                      disabled={addingSubtask}
                      className="flex-1 text-xs outline-none bg-transparent"
                      style={{ color: "var(--color-fg)", border: "none", padding: "2px 0", minWidth: 0 }}
                    />
                    {isFitness && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <input
                          type="number"
                          inputMode="numeric"
                          min="1"
                          value={newSubtaskSets}
                          onChange={(e) => setNewSubtaskSets(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") { e.preventDefault(); handleAddSubtask(); }
                          }}
                          placeholder="sets"
                          aria-label="Sets"
                          className="num-input-themed"
                        />
                        <span style={{ color: "var(--color-fg-subtle)", fontSize: 10, fontWeight: 600 }}>×</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          min="1"
                          value={newSubtaskReps}
                          onChange={(e) => setNewSubtaskReps(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") { e.preventDefault(); handleAddSubtask(); }
                          }}
                          placeholder="reps"
                          aria-label="Reps"
                          className="num-input-themed"
                        />
                      </div>
                    )}
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

              {task.status === "pending" && task.isRecurring && onCheckIn && !isMobile && (
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

        {/* Pinned slider zone (mobile only) — sits outside the scroll container
            so it stays at the user's thumb regardless of how much content is
            above it. Only renders for recurring tasks where check-in is unlocked. */}
        {isMobile && !inline && !isEditing && task.status === "pending" && task.isRecurring && onCheckIn && (
          <div
            style={{
              flexShrink: 0,
              paddingTop: 12,
              marginTop: 6,
              borderTop: "1px solid var(--color-border-hairline)",
            }}
          >
            <SlideToCheckIn
              label="Slide to check in"
              disabled={isActing}
              onConfirm={onCheckIn}
            />
          </div>
        )}
      </div>
  );

  // Inline mode (desktop right-panel) skips the overlay + portal and renders
  // just the sheet content sized to fill its container.
  if (inline) return sheet;

  const tree = (
    <div
      data-edge-drawer-block
      className={overlayClass}
      style={overlayStyle}
      onClick={isEditing ? undefined : onClose}
    >
      {sheet}
    </div>
  );

  // Mobile sheet renders into <body> so it sits above page-level layout.
  return isMobile ? createPortal(tree, document.body) : tree;
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
const HEATMAP_WEEKS = 12;
const CELL_SIZE = 14;
const CELL_GAP = 3;
const LABEL_COL = 22;
// Empty / 4 filled levels — driven via opacity on the highlight color.
const LEVEL_OPACITY = [0, 0.30, 0.55, 0.80, 1.0];
const MONTHS_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function HeatmapStrip({ rule, hasCounter, cycles }: { rule: string; hasCounter: boolean; cycles: CheckInCycleDto[] }) {
  // GitHub-style 7×N grid: rows are days-of-week (Sun..Sat), columns are weeks
  // oldest-on-left. Today always sits in the rightmost column at row=todayDow;
  // any cells in that column past today render invisibly so the grid keeps shape.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayKey = dateKey(today);
  const todayDow = today.getDay(); // 0=Sun..6=Sat

  const start = new Date(today);
  start.setDate(start.getDate() - todayDow - (HEATMAP_WEEKS - 1) * 7);

  type Cell = { date: Date; key: string; dow: number; isFuture: boolean; isWeekend: boolean };
  const columns: Cell[][] = [];
  for (let c = 0; c < HEATMAP_WEEKS; c++) {
    const col: Cell[] = [];
    for (let r = 0; r < 7; r++) {
      const d = new Date(start);
      d.setDate(start.getDate() + c * 7 + r);
      col.push({
        date: d,
        key: dateKey(d),
        dow: r,
        isFuture: d.getTime() > today.getTime(),
        isWeekend: r === 0 || r === 6,
      });
    }
    columns.push(col);
  }

  const cycleByDate = new Map(cycles.map((c) => [c.checkInDate.split("T")[0], c]));
  const maxValue = Math.max(
    1,
    ...cycles.map((c) => (typeof c.counterValue === "number" ? c.counterValue : 0)),
  );

  function levelFor(cell: Cell): number {
    const cycle = cycleByDate.get(cell.key);
    if (!cycle) return 0;
    if (!hasCounter) return 4;
    const v = typeof cycle.counterValue === "number" ? cycle.counterValue : 0;
    if (v <= 0) return 1;
    const ratio = v / maxValue;
    if (ratio < 0.34) return 1;
    if (ratio < 0.67) return 2;
    if (ratio < 1.0) return 3;
    return 4;
  }

  // Tally over the visible window. For "weekdays" tasks, weekends aren't
  // expected check-in days so they shouldn't count against the denominator.
  const visibleCells = columns.flat().filter((c) => !c.isFuture);
  const totalExpected = rule === "weekdays"
    ? visibleCells.filter((c) => !c.isWeekend).length
    : visibleCells.length;
  const checkedCount = visibleCells.reduce((n, c) => (cycleByDate.has(c.key) ? n + 1 : n), 0);

  // Month label per column — only shown when the month changes from the column to its left.
  const monthLabels: (string | null)[] = columns.map((col, ci) => {
    const m = col[0].date.getMonth();
    if (ci === 0) return MONTHS_SHORT[m];
    return m !== columns[ci - 1][0].date.getMonth() ? MONTHS_SHORT[m] : null;
  });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Last {HEATMAP_WEEKS} weeks
        </span>
        <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.05em", fontVariantNumeric: "tabular-nums" }}>
          {checkedCount}/{totalExpected}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          role="img"
          aria-label={`Check-in heatmap for the last ${HEATMAP_WEEKS} weeks: ${checkedCount} of ${totalExpected}`}
          style={{
            display: "grid",
            gridTemplateColumns: `${LABEL_COL}px repeat(${HEATMAP_WEEKS}, ${CELL_SIZE}px)`,
            gridTemplateRows: `10px repeat(7, ${CELL_SIZE}px)`,
            columnGap: CELL_GAP,
            rowGap: CELL_GAP,
          }}
        >
          {/* Top-left corner spacer */}
          <div style={{ gridColumn: 1, gridRow: 1 }} />

          {/* Month labels along the top. Allow overflow so a label can extend past
              its single-column track without clipping the next column's start. */}
          {monthLabels.map((m, c) => (
            <div
              key={`m-${c}`}
              style={{
                gridColumn: c + 2,
                gridRow: 1,
                fontSize: 8,
                color: "var(--color-fg-subtle)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                lineHeight: "10px",
                whiteSpace: "nowrap",
                overflow: "visible",
              }}
            >
              {m ?? ""}
            </div>
          ))}

          {/* Day-of-week labels (Mon/Wed/Fri only — matches GitHub's compact style) */}
          {[0, 1, 2, 3, 4, 5, 6].map((r) => (
            <div
              key={`d-${r}`}
              style={{
                gridColumn: 1,
                gridRow: r + 2,
                fontSize: 8,
                color: "var(--color-fg-subtle)",
                letterSpacing: "0.05em",
                lineHeight: `${CELL_SIZE}px`,
                textAlign: "right",
                paddingRight: 2,
              }}
            >
              {r === 1 ? "Mon" : r === 3 ? "Wed" : r === 5 ? "Fri" : ""}
            </div>
          ))}

          {/* Cells: 7 rows × HEATMAP_WEEKS cols */}
          {columns.flatMap((col, c) =>
            col.map((cell, r) => {
              if (cell.isFuture) {
                return (
                  <div
                    key={cell.key}
                    style={{ gridColumn: c + 2, gridRow: r + 2, visibility: "hidden" }}
                  />
                );
              }
              const isWeekendOff = rule === "weekdays" && cell.isWeekend;
              const cycle = cycleByDate.get(cell.key);
              const checked = !!cycle;
              const level = levelFor(cell);
              const isToday = cell.key === todayKey;
              const value = typeof cycle?.counterValue === "number" ? cycle!.counterValue : null;
              const tooltip = isWeekendOff && !checked
                ? `${fmtCycleDate(cell.key)} · off-day`
                : `${fmtCycleDate(cell.key)}${
                    checked
                      ? hasCounter
                        ? value != null ? ` · ${value.toLocaleString()}` : " · checked in"
                        : " · checked in"
                      : " · no check-in"
                  }`;
              return (
                <div
                  key={cell.key}
                  title={tooltip}
                  style={{
                    gridColumn: c + 2,
                    gridRow: r + 2,
                    borderRadius: 2,
                    background: checked
                      ? "var(--color-active-highlight-alt)"
                      : isWeekendOff
                        ? "transparent"
                        : "var(--color-border-soft)",
                    opacity: checked ? LEVEL_OPACITY[level] : 1,
                    border: isWeekendOff && !checked
                      ? "1px dashed var(--color-border-faint)"
                      : undefined,
                    // Inset ring on today so the highlight stays inside the cell —
                    // an outset outline gets clipped by DetailPager's overflow: hidden.
                    boxShadow: isToday
                      ? "inset 0 0 0 1.5px var(--color-active-highlight)"
                      : undefined,
                  }}
                />
              );
            }),
          )}
        </div>
      </div>

      {/* Legend — meaningful only when intensity varies (counter tasks). */}
      {hasCounter && (
        <div
          className="flex items-center self-end"
          style={{
            gap: 4,
            fontSize: 8,
            color: "var(--color-fg-subtle)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          <span>Less</span>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: "var(--color-border-soft)" }} />
          {[1, 2, 3, 4].map((lvl) => (
            <span
              key={lvl}
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: "var(--color-active-highlight-alt)",
                opacity: LEVEL_OPACITY[lvl],
              }}
            />
          ))}
          <span>More</span>
        </div>
      )}
    </div>
  );
}

function fmtCycleDate(iso: string): string {
  const [y, m, d] = iso.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

