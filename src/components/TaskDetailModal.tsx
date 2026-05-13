"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { tasksApi, TaskDto, Subtask, CheckInCycleDto } from "@/lib/api/tasks";
import { PRIORITY_DOT, CATEGORIES, CATEGORY_COLOR, COUNTER_UNITS } from "@/lib/constants";
import DatePicker from "@/components/DatePicker";
import GoalStepper from "@/components/GoalStepper";
import SubtasksSection from "@/components/SubtasksSection";
import HeatmapStrip from "@/components/HeatmapStrip";
import StreakDisplay from "@/components/StreakDisplay";
import { useQuickLog } from "@/hooks/useQuickLog";
import SlideToCheckIn from "@/components/SlideToCheckIn";
import DetailPager from "@/components/DetailPager";
import ChibiAvatar from "@/components/ChibiAvatar";
import QuickLogStepper from "@/components/QuickLogStepper";
import { buildMockEquipped } from "@/lib/mockAvatar";
import { useEquippedAvatar } from "@/hooks/useEquippedAvatar";
import { dateKey } from "@/lib/dateUtils";

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
  // local buffer instead of calling on each tap; the flush fires after a short
  // idle (debounce), when the modal closes or switches tasks, and on
  // page/tab close. Pass `{ keepalive: true }` from unload handlers so the
  // request survives the page being torn down. Signature takes taskId
  // explicitly so cleanup paths route to the right task without a stale
  // closure. Resolves to the appended cycle on success, null on failure.
  onFlushQuickLog?: (taskId: string, delta: number, opts?: { keepalive?: boolean }) => Promise<CheckInCycleDto | null>;
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

  // Pull the user's currently-equipped avatar items so the chibi inside
  // this modal matches whatever's dressed up on the /avatar page. The
  // hook caches across modal opens so each open doesn't pay another
  // network trip.
  //
  // Mock fallback only fires for unauthed sessions (static demo) — for
  // authed users we'd rather render the base chibi with no items for
  // the ~100-300ms a first-time fetch is in flight than briefly show
  // someone else's mock loadout (alien hat etc.) that then flips to
  // their real equipped set. That brief flash was the "old avatar
  // showing up" the user was seeing.
  const hasToken = typeof window !== "undefined" && !!localStorage.getItem("auth_token");
  const userEquipped = useEquippedAvatar();
  const chibiEquipped = hasToken
    ? (userEquipped ?? [])
    : buildMockEquipped();

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

  // Computed once per mount via the useState lazy initializer so we don't
  // call the impure Date.now() in the render body. The lock window is 24h
  // from creation, so it doesn't need to update mid-session anyway.
  const [titleLocked] = useState(() => (Date.now() - new Date(task.createdAt).getTime()) > 24 * 60 * 60 * 1000);

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
  // While true the sheet's transform transition is re-enabled so the final
  // slide-off (after a successful swipe-to-dismiss) animates instead of
  // jumping. Cleared implicitly when the modal unmounts.
  const [dismissing, setDismissing] = useState(false);
  const sheetDragRef = useRef<{ startY: number } | null>(null);

  // Extra check-in history for the heatmap. The embedded `task.recentCycles`
  // slice is bounded (~14 entries) and only covers the last couple of weeks,
  // so we lazily pull a wider window from /checkin-history when the modal
  // opens for a daily/weekdays task. Mock mode (no auth token) skips the
  // fetch and the heatmap falls back to the embedded slice.
  const [heatmapHistory, setHeatmapHistory] = useState<CheckInCycleDto[] | null>(null);

  // Merge fetched history with the embedded slice so optimistic updates from
  // a just-completed check-in (which mutate task.recentCycles via the parent
  // store) stay visible without re-fetching. Local entries win on duplicate
  // cycleIds — they reflect any in-flight edits the server hasn't acked yet.
  // The avatar's cycleSumToday and the heatmap both read from this so they
  // can never disagree about today's committed total.
  const heatmapCycles = useMemo(() => {
    const fetched = heatmapHistory ?? [];
    const local = task.recentCycles ?? [];
    if (fetched.length === 0) return local;
    const byId = new Map<number, CheckInCycleDto>();
    for (const c of fetched) byId.set(c.cycleId, c);
    for (const c of local) byId.set(c.cycleId, c);
    return Array.from(byId.values());
  }, [heatmapHistory, task.recentCycles]);

  const todayKey = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    return dateKey(d);
  }, []);

  // +/- buffered counter for routines (debounced flush, in-flight bookkeeping,
  // page-close keepalive). State lives at modal scope so the avatar and the
  // heatmap on the sibling pager card stay in lockstep — see useQuickLog.
  const {
    pendingLog,
    cycleSumToday,
    handleStepperIncrement,
    handleStepperDecrement,
    handleDeleteClick,
  } = useQuickLog({ task, heatmapCycles, onFlushQuickLog, onDelete });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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
      setDismissing(true);
      setSheetDragY(window.innerHeight);
      setTimeout(onClose, 260);
    } else {
      setSheetDragY(0);
    }
  }, [sheetDragY, onClose]);

  // Same swipe-down-to-dismiss gesture from anywhere in the modal body. Only
  // arms when the scroll container is already at the top so it doesn't hijack
  // mid-page scrolling, and only commits on a clear downward swipe (not a
  // horizontal one — subtask rows have their own left-swipe). The recurring
  // "Slide to check in" zone sits outside this scroll container, so it isn't
  // affected.
  const contentDragRef = useRef<{ startY: number; startX: number; committed: boolean } | null>(null);
  const handleContentTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (e.currentTarget.scrollTop > 0) return;
    contentDragRef.current = {
      startY: e.touches[0].clientY,
      startX: e.touches[0].clientX,
      committed: false,
    };
  }, []);
  const handleContentTouchMove = useCallback((e: React.TouchEvent) => {
    const d = contentDragRef.current;
    if (!d) return;
    const dy = e.touches[0].clientY - d.startY;
    const dx = e.touches[0].clientX - d.startX;
    if (!d.committed) {
      if (Math.abs(dy) < 8 && Math.abs(dx) < 8) return;
      if (dy > 0 && dy > Math.abs(dx)) {
        d.committed = true;
      } else {
        contentDragRef.current = null;
        return;
      }
    }
    setSheetDragY(dy > 0 ? dy : 0);
  }, []);
  const handleContentTouchEnd = useCallback(() => {
    const d = contentDragRef.current;
    contentDragRef.current = null;
    if (!d || !d.committed) return;
    if (sheetDragY > 110) {
      setDismissing(true);
      setSheetDragY(window.innerHeight);
      setTimeout(onClose, 260);
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
        animation: sheetDragY === 0 && !dismissing ? "detail-sheet-in 0.24s cubic-bezier(0.2, 0, 0, 1)" : undefined,
        transform: sheetDragY > 0 ? `translateY(${sheetDragY}px)` : undefined,
        // Snap-back (release before threshold) and slide-off (commit dismiss)
        // both animate; only the active finger-drag runs without transition so
        // the sheet tracks the touch 1:1.
        transition: sheetDragY === 0 || dismissing ? "transform 0.26s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
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
    ? {
        background: "var(--color-modal-overlay)",
        zIndex: 60,
        animation: !dismissing ? "detail-overlay-in 0.18s ease-out" : undefined,
        // Stay fully opaque during the drag — only fade out when the user has
        // committed to dismiss, otherwise a partial-then-snap-back swipe would
        // flicker the backdrop.
        opacity: dismissing ? 0 : 1,
        transition: "opacity 0.26s ease-out",
      }
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
          onTouchStart={isMobile && !inline ? handleContentTouchStart : undefined}
          onTouchMove={isMobile && !inline ? handleContentTouchMove : undefined}
          onTouchEnd={isMobile && !inline ? handleContentTouchEnd : undefined}
          onTouchCancel={isMobile && !inline ? handleContentTouchEnd : undefined}
          style={isMobile && !inline
            ? { overflowY: "auto", padding: "4px 4px 4px", flex: 1, position: "relative", overscrollBehavior: "contain" }
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
          {!isEditing && !(task.isRecurring && task.status === "pending") && (
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

            <StreakDisplay currentStreakCount={currentStreakCount} longestStreakCount={longestStreakCount} />

            {task.description && (
              <p className="text-xs leading-relaxed" style={{ color: "var(--color-fg-muted)" }}>
                {task.description}
              </p>
            )}

            {task.isRecurring && (
              <DetailPager
                height={236}
                labels={(task.recurrenceRule === "daily" || task.recurrenceRule === "weekdays") ? ["Stage", "Stats"] : ["Stage"]}
                cards={[
                  {
                    key: "stage",
                    content: (
                      <div className="flex-1 flex flex-col items-center justify-center gap-2">
                        <ChibiAvatar equipped={chibiEquipped} height={192} />
                        {task.hasCounter && (() => {
                          // hasCounter && pending status && not yet checked in today
                          // is the gate for showing the +/- buttons; otherwise we
                          // render a read-only sum.
                          const checkedInToday = (task.lastCheckInDate ?? "").split("T")[0] === todayKey;
                          const showStepper = !!onFlushQuickLog && task.status === "pending" && !checkedInToday;
                          return (
                            <QuickLogStepper
                              cycleSum={cycleSumToday}
                              pendingLog={pendingLog}
                              showStepper={showStepper}
                              counterUnit={task.counterUnit}
                              counterGoal={task.counterGoal}
                              capAtGoal={task.capLogAtGoal}
                              onIncrement={handleStepperIncrement}
                              onDecrement={handleStepperDecrement}
                            />
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
                          pendingTodayDelta={task.hasCounter ? pendingLog : 0}
                        />
                      </div>
                    ),
                  }] : []),
                ]}
              />
            )}

            <SubtasksSection task={task} onChange={onSubtasksChange} />
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
                  onClick={handleDeleteClick}
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
                  onClick={() => { onCheckIn(); onClose(); }}
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
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <polyline points="4,2 2,4 4,6" style={{ stroke: "var(--color-warning)" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      <path d="M2 4H6.5A2.5 2.5 0 0 1 6.5 9H4" style={{ stroke: "var(--color-warning)" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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
                  onClick={handleDeleteClick}
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
              onConfirm={() => { onCheckIn(); onClose(); }}
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
