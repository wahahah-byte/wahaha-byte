"use client";

import { useEffect, useRef, useState } from "react";
import { TaskDto } from "@/lib/api/tasks";
import { canCheckInNow, getNextOccurrenceLabel, getUnlockInfo, parseLocalDate, isOverdue, getCyclesOverdue } from "@/lib/dateUtils";
import { PRIORITY_DOT, CATEGORY_COLOR } from "@/lib/constants";
import BankBurstEffect from "@/components/BankBurstEffect";

// iOS-style rubber-band damping: maps any |x| asymptotically to RUBBER_C.
// Small excess feels nearly linear; large excess approaches RUBBER_C.
const RUBBER_C = 60;
function rubberBand(x: number): number {
  const abs = Math.abs(x);
  return Math.sign(x) * (abs * RUBBER_C) / (abs + RUBBER_C);
}

interface TaskRowProps {
  task: TaskDto;
  activeFilter: string;
  advancing: string | null;
  pausing: string | null;
  slashingId: string | null;
  filingIds: Set<string>;
  recentlyFiledIds: Set<string>;
  errorIds?: Set<string>;
  selectedIds: Set<string>;
  submittedTaskIds: Set<string>;
  recurringPopup: number | undefined;
  penalizedTaskIds?: Set<string>;
  onRestartOverdue?: (task: TaskDto) => void;
  onAdvance: (task: TaskDto) => void;
  onCheckIn: (task: TaskDto) => void;
  onPause: (task: TaskDto) => void;
  onDelete: (id: string) => void;
  onSkip: (task: TaskDto) => void;
  onToggleSelect: (id: string) => void;
  onOpenDetail: (task: TaskDto) => void;
}

export default function TaskRow({
  task, activeFilter, advancing, pausing, slashingId,
  filingIds, recentlyFiledIds, errorIds, selectedIds, submittedTaskIds,
  recurringPopup, penalizedTaskIds, onRestartOverdue, onAdvance, onCheckIn, onPause, onDelete,
  onSkip, onToggleSelect, onOpenDetail,
}: TaskRowProps) {
  const isInProgress = task.status === "in_progress";
  const isCompleted = task.status === "completed";
  const isGreyedOut = activeFilter === "pending" && (
    (task.isRecurring && !canCheckInNow(task.dueDate, task.recurrenceRule, task.lastCheckInDate))
    || task.status === "in_progress"
  );
  const dot = PRIORITY_DOT[task.priority.toLowerCase()] ?? "var(--color-fg-muted)";
  const isAdvancing = advancing === task.taskId;
  const isFiling = filingIds.has(task.taskId);
  const canUndo = !isFiling && isCompleted && task.submitted === false && !task.pointsAwarded && !submittedTaskIds.has(task.taskId);
  const isSubmitted = isFiling || (isCompleted && (task.submitted === true || submittedTaskIds.has(task.taskId) || !!task.pointsAwarded));
  const isSelectable = activeFilter === "completed" && isCompleted && !isSubmitted;
  const overdueRecurring = task.isRecurring && !isInProgress && !isCompleted && isOverdue(task.dueDate);

  const hasError = errorIds?.has(task.taskId) ?? false;

  const [revealed, setRevealed] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startOffset: number;
    panelWidth: number;
    axis: "none" | "horizontal" | "vertical";
    lastX: number;
    lastT: number;
    velocity: number;
    revealedDispatched: boolean;
  } | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const actions = actionsRef.current;
    if (!wrapper || !actions) return;
    const sync = () => {
      wrapper.style.setProperty("--actions-width", `${actions.offsetWidth}px`);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(actions);
    return () => ro.disconnect();
  }, []);

  // Native non-passive touchmove listener: once the drag commits to horizontal,
  // preventDefault tells the browser "JS owns this gesture" so it won't fire
  // touchcancel and switch to vertical scroll mid-swipe.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const onTouchMoveNative = (e: TouchEvent) => {
      const drag = dragRef.current;
      if (drag && drag.axis === "horizontal") {
        e.preventDefault();
      }
    };
    wrapper.addEventListener("touchmove", onTouchMoveNative, { passive: false });
    return () => wrapper.removeEventListener("touchmove", onTouchMoveNative);
  }, []);

  function handleTouchStart(e: React.TouchEvent) {
    if (e.touches.length > 1) {
      dragRef.current = null;
      return;
    }
    const t = e.touches[0];
    const panelWidth = actionsRef.current?.offsetWidth ?? 0;
    dragRef.current = {
      startX: t.clientX,
      startY: t.clientY,
      startOffset: revealed ? -panelWidth : 0,
      panelWidth,
      axis: "none",
      lastX: t.clientX,
      lastT: performance.now(),
      velocity: 0,
      revealedDispatched: revealed,
    };
  }

  function handleTouchMove(e: React.TouchEvent) {
    const drag = dragRef.current;
    if (!drag || e.touches.length > 1) return;
    const t = e.touches[0];
    const dx = t.clientX - drag.startX;
    const dy = t.clientY - drag.startY;

    if (drag.axis === "none") {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        drag.axis = "horizontal";
      } else {
        drag.axis = "vertical";
        dragRef.current = null;
        return;
      }
    }
    if (drag.axis !== "horizontal" || drag.panelWidth === 0) return;

    const now = performance.now();
    const dt = Math.max(1, now - drag.lastT);
    drag.velocity = (t.clientX - drag.lastX) / dt;
    drag.lastX = t.clientX;
    drag.lastT = now;

    const raw = drag.startOffset + dx;
    let offset: number;
    if (raw < -drag.panelWidth) {
      const excess = raw + drag.panelWidth; // negative
      offset = -drag.panelWidth + rubberBand(excess);
    } else if (raw > 0) {
      offset = rubberBand(raw);
    } else {
      offset = raw;
    }
    const inner = innerRef.current;
    if (inner) {
      inner.style.transition = "none";
      inner.style.transform = `translateX(${offset}px)`;
    }
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.setAttribute("data-dragging", "true");
      const parent = wrapper.parentElement;
      if (parent) {
        parent.style.setProperty("--button-scale", String(-offset / drag.panelWidth));
      }
    }

    if (!drag.revealedDispatched && offset < 0) {
      drag.revealedDispatched = true;
      setRevealed(true);
      window.dispatchEvent(new CustomEvent("task-row-reveal", { detail: { id: task.taskId } }));
    }
  }

  function settleDrag() {
    const drag = dragRef.current;
    dragRef.current = null;
    const inner = innerRef.current;
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.removeAttribute("data-dragging");
      const parent = wrapper.parentElement;
      if (parent) {
        parent.style.removeProperty("--button-scale");
      }
    }
    if (!drag || drag.axis !== "horizontal" || !inner) {
      if (inner) {
        inner.style.transition = "";
        inner.style.transform = "";
      }
      return;
    }
    const match = inner.style.transform.match(/translateX\((-?[\d.]+)px\)/);
    const offset = match ? parseFloat(match[1]) : drag.startOffset;
    const FLICK = 0.4;
    let willOpen: boolean;
    if (drag.velocity < -FLICK) willOpen = true;
    else if (drag.velocity > FLICK) willOpen = false;
    else willOpen = Math.abs(offset) > drag.panelWidth / 2;

    inner.style.transition = "";
    inner.style.transform = "";
    setRevealed(willOpen);
    if (willOpen && !drag.revealedDispatched) {
      window.dispatchEvent(new CustomEvent("task-row-reveal", { detail: { id: task.taskId } }));
    }
  }

  function handleTouchEnd() {
    settleDrag();
  }

  useEffect(() => {
    function onOtherReveal(e: Event) {
      const detail = (e as CustomEvent<{ id: string }>).detail;
      if (detail && detail.id !== task.taskId) setRevealed(false);
    }
    function onScroll() {
      setRevealed(false);
    }
    function onOutsidePointer(e: PointerEvent) {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      if (!wrapper.contains(e.target as Node)) setRevealed(false);
    }
    window.addEventListener("task-row-reveal", onOtherReveal);
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("pointerdown", onOutsidePointer, true);
    return () => {
      window.removeEventListener("task-row-reveal", onOtherReveal);
      window.removeEventListener("scroll", onScroll, { capture: true } as EventListenerOptions);
      window.removeEventListener("pointerdown", onOutsidePointer, true);
    };
  }, [task.taskId]);

  function handleRowClick() {
    if (revealed) {
      setRevealed(false);
      return;
    }
    onOpenDetail(task);
  }

  const eligibleCheckIn = task.isRecurring && canCheckInNow(task.dueDate, task.recurrenceRule, task.lastCheckInDate);
  const overdueRegular = !task.isRecurring && task.status === "pending" && isOverdue(task.dueDate);

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      ref={wrapperRef}
      className={`task-row-wrapper${slashingId === task.taskId ? " task-row-deleting" : ""}`}
      style={{ position: "relative", height: "60px", touchAction: "pan-y", overflow: "visible" }}
      data-revealed={revealed ? "true" : undefined}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        ref={actionsRef}
        className="task-actions"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute", top: 0, bottom: 0, right: 0,
          flexDirection: "row",
          alignItems: "center",
          gap: "4px",
          padding: "0 6px",
          overflow: "hidden",
        }}
      >
        {task.status === "pending" && task.isRecurring && !isInProgress && (() => {
          if (overdueRecurring) {
            return (
              <button
                onClick={() => onRestartOverdue ? onRestartOverdue(task) : onSkip(task)}
                disabled={isAdvancing}
                title="Resume — reschedule to today"
                style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: isAdvancing ? "not-allowed" : "pointer", background: "var(--color-surface-deep)", border: "none", opacity: isAdvancing ? 0.3 : 1 }}
                onMouseEnter={(e) => { if (!isAdvancing) e.currentTarget.style.background = "rgba(239,68,68,0.15)"; }}
                onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-surface-deep)")}
              >
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                  <polygon points="2,1 9,5 2,9" style={{ fill: "var(--color-danger)" }} />
                </svg>
              </button>
            );
          }
          const eligible = canCheckInNow(task.dueDate, task.recurrenceRule, task.lastCheckInDate);
          return (
            <button
              onClick={eligible ? () => onCheckIn(task) : undefined}
              disabled={isAdvancing || !eligible}
              title={eligible ? "Check In" : "Not yet available"}
              style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: eligible ? "pointer" : "not-allowed", background: "var(--color-surface-deep)", border: "none", opacity: isAdvancing || !eligible ? 0.3 : 1 }}
              onMouseEnter={(e) => { if (eligible) e.currentTarget.style.background = "rgba(167,139,250,0.15)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-surface-deep)")}
            >
              {eligible ? (
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                  <polyline points="1,5 4,8 9,2" style={{ stroke: "var(--color-secondary-accent)" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                  <rect x="2.5" y="4.5" width="5" height="4" rx="0.5" style={{ stroke: "var(--color-secondary-accent)" }} strokeWidth="1.2" fill="none" />
                  <path d="M3.5 4.5V3a1.5 1.5 0 0 1 3 0v1.5" style={{ stroke: "var(--color-secondary-accent)" }} strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
              )}
            </button>
          );
        })()}

        {task.status === "pending" && !task.isRecurring && !isGreyedOut && (() => {
          const overdueRegular = isOverdue(task.dueDate);
          const startColor = overdueRegular ? "var(--color-danger)" : "var(--color-secondary-accent)";
          const hoverBg = overdueRegular ? "rgba(239,68,68,0.15)" : "rgba(167,139,250,0.15)";
          return (
            <button
              onClick={() => overdueRegular && onRestartOverdue ? onRestartOverdue(task) : onAdvance(task)}
              disabled={isAdvancing}
              title={overdueRegular ? "Overdue — reschedule to start" : "Start"}
              style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "var(--color-surface-deep)", border: "none", opacity: isAdvancing ? 0.4 : 1 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-surface-deep)")}
            >
              <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
                <polygon points="2,1 9,5 2,9" style={{ fill: startColor }} />
              </svg>
            </button>
          );
        })()}

        {isInProgress && (
          <button
            onClick={() => onPause(task)}
            disabled={pausing === task.taskId}
            title="Pause"
            style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "var(--color-surface-deep)", border: "none", opacity: pausing === task.taskId ? 0.4 : 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-surface-deep)")}
          >
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
              <rect x="1.5" y="1" width="3" height="8" style={{ fill: "var(--color-warning)" }} />
              <rect x="5.5" y="1" width="3" height="8" style={{ fill: "var(--color-warning)" }} />
            </svg>
          </button>
        )}

        {isInProgress && !isGreyedOut && (
          <button
            onClick={() => onAdvance(task)}
            disabled={isAdvancing}
            title="Complete"
            style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "var(--color-surface-deep)", border: "none", opacity: isAdvancing ? 0.4 : 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(74,222,128,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-surface-deep)")}
          >
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
              <polyline points="1,5 4,8 9,2" style={{ stroke: "var(--color-success)" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {canUndo && !isGreyedOut && (
          <button
            onClick={() => onAdvance(task)}
            disabled={isAdvancing}
            title="Undo"
            style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "var(--color-surface-deep)", border: "none", opacity: isAdvancing ? 0.4 : 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-surface-deep)")}
          >
            <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
              <path d="M7 2H4C2.3 2 1 3.3 1 5s1.3 3 3 3h4" style={{ stroke: "var(--color-warning)" }} strokeWidth="1.5" strokeLinecap="round" />
              <polyline points="4,4.5 1.5,2 4,0" style={{ stroke: "var(--color-warning)" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>
        )}

        <button
          onClick={() => onDelete(task.taskId)}
          disabled={slashingId === task.taskId}
          title="Delete"
          style={{ width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "var(--color-surface-deep)", border: "none", opacity: slashingId === task.taskId ? 0.4 : 1 }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-surface-deep)")}
        >
          <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
            <path d="M3.8 2V1.3h2.4V2" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.9" strokeLinecap="round" />
            <line x1="1.3" y1="2.5" x2="8.7" y2="2.5" style={{ stroke: "var(--color-danger)" }} strokeWidth="1" strokeLinecap="round" />
            <path d="M2.6 3L3.1 8.5h3.8L7.4 3" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="4.2" y1="4.5" x2="4.2" y2="7.5" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.7" strokeLinecap="round" />
            <line x1="5.8" y1="4.5" x2="5.8" y2="7.5" style={{ stroke: "var(--color-danger)" }} strokeWidth="0.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        ref={innerRef}
        className={[
          "task-row-inner grid items-center px-4",
          isGreyedOut ? "greyed" : "",
        ].filter(Boolean).join(" ")}
        onClick={handleRowClick}
        style={{
          position: "absolute",
          inset: 0,
          gridTemplateColumns: "1fr 64px 80px",
          borderLeft: isInProgress
            ? "2px solid var(--color-active-highlight)"
            : canUndo
              ? "2px solid rgba(245,158,11,0.7)"
              : overdueRecurring
                ? "2px solid rgba(239,68,68,0.55)"
                : undefined,
          background: isCompleted && !canUndo ? "var(--color-bg)" : undefined,
          cursor: "pointer",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {isSelectable ? (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSelect(task.taskId); }}
              className="w-4 h-4 flex-shrink-0 flex items-center justify-center transition-all duration-150"
              style={{
                border: `1px solid ${selectedIds.has(task.taskId) ? "var(--color-success)" : "var(--color-border-faint)"}`,
                borderRadius: "2px",
                background: selectedIds.has(task.taskId) ? "rgba(74,222,128,0.12)" : "transparent",
              }}
            >
              {selectedIds.has(task.taskId) && (
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <polyline points="1,3 3,5 7,1" style={{ stroke: "var(--color-success)" }} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />
          )}
          <div className="min-w-0">
            <p
              className="text-sm truncate"
              style={{
                color: isCompleted && !canUndo ? "var(--color-fg-muted)" : "var(--color-fg)",
                textDecoration: isCompleted ? "line-through" : "none",
              }}
            >
              {task.title}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5" style={{ overflow: "hidden" }}>
              {task.category && (() => {
                const cc = CATEGORY_COLOR[task.category] ?? "var(--color-fg-muted)";
                return (
                  <span style={{
                    fontSize: "8px", letterSpacing: "0.14em", textTransform: "uppercase",
                    color: cc,
                    background: `${cc}18`,
                    border: `1px solid ${cc}40`,
                    borderRadius: "2px",
                    padding: "1px 5px", whiteSpace: "nowrap", flexShrink: 0,
                  }}>
                    {task.category}
                  </span>
                );
              })()}
              {isInProgress && (
                <>
                  <span style={{ color: "var(--color-active-highlight)", fontSize: "8px", lineHeight: 1, flexShrink: 0 }}>█</span>
                  <span style={{ color: "var(--color-active-highlight)", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", flexShrink: 0 }}>Active</span>
                </>
              )}
              {task.status === "pending" && !task.isRecurring && penalizedTaskIds?.has(task.taskId) && (
                <>
                  <span style={{ color: "rgba(239,68,68,0.35)", fontSize: "8px", flexShrink: 0 }}>·</span>
                  <span style={{ color: "rgba(239,68,68,0.65)", fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", flexShrink: 0 }}>↩ overdue reset</span>
                </>
              )}
              {canUndo && (
                <>
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M7 1.5H4C2.3 1.5 1 2.8 1 4.5s1.3 3 3 3h4" style={{ stroke: "var(--color-warning)" }} strokeWidth="1.4" strokeLinecap="round" />
                    <polyline points="3.5,4 1,1.5 3.5,0" style={{ stroke: "var(--color-warning)" }} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                  <span style={{ color: "var(--color-warning)", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", flexShrink: 0 }}>Undo</span>
                </>
              )}
              {task.isRecurring && task.recurrenceRule && !isInProgress && !canUndo && (() => {
                const isLocked = !canCheckInNow(task.dueDate, task.recurrenceRule, task.lastCheckInDate);
                const overdue = isLocked && isOverdue(task.dueDate);
                const cyclesOverdue = overdue ? getCyclesOverdue(task.dueDate, task.recurrenceRule) : 0;
                const isPenalized = cyclesOverdue >= 3;
                const unlockInfo = isLocked && !overdue ? getUnlockInfo(task.dueDate) : null;
                const ruleLabel = task.recurrenceRule === "daily" ? "Daily"
                  : task.recurrenceRule === "weekdays" ? "Weekdays"
                  : task.recurrenceRule === "biweekly" ? "Biweekly"
                  : getNextOccurrenceLabel(task.dueDate, task.recurrenceRule);
                const baseColor = overdue ? "rgba(239,68,68,0.85)" : isLocked ? "rgba(245,158,11,0.65)" : "var(--color-secondary-accent)";
                const streakCount = task.currentStreakCount ?? 0;
                return (
                  <>
                    <span style={{ color: baseColor, fontSize: "9px", lineHeight: 1, flexShrink: 0 }}>↻</span>
                    <span style={{ color: baseColor, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", flexShrink: 0 }}>
                      {ruleLabel}
                    </span>
                    {overdue && (
                      <>
                        <span style={{ color: "rgba(239,68,68,0.4)", fontSize: "8px", flexShrink: 0 }}>·</span>
                        <span style={{ color: "rgba(239,68,68,0.85)", fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 600, flexShrink: 0 }}>
                          ⚠ OVERDUE
                        </span>
                        {isPenalized && (
                          <>
                            <span style={{ color: "rgba(239,68,68,0.4)", fontSize: "8px", flexShrink: 0 }}>·</span>
                            <span style={{
                              color: "rgba(239,68,68,0.9)", fontSize: "7px", letterSpacing: "0.15em",
                              textTransform: "uppercase", fontWeight: 700, flexShrink: 0,
                              background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)",
                              borderRadius: "2px", padding: "1px 4px",
                            }}>
                              PENALIZED ×{cyclesOverdue}
                            </span>
                          </>
                        )}
                        {streakCount >= 3 && (
                          <>
                            <span style={{ color: "rgba(239,68,68,0.4)", fontSize: "8px", flexShrink: 0 }}>·</span>
                            <span style={{ color: "rgba(239,68,68,0.75)", fontSize: "8px", letterSpacing: "0.1em", flexShrink: 0 }}>
                              🔥{streakCount}→0
                            </span>
                          </>
                        )}
                      </>
                    )}
                    {!overdue && isLocked && unlockInfo && (
                      <>
                        <span style={{ color: "rgba(245,158,11,0.35)", fontSize: "8px", flexShrink: 0 }}>·</span>
                        <svg width="7" height="8" viewBox="0 0 10 12" fill="none" style={{ flexShrink: 0 }}>
                          <rect x="2" y="5" width="6" height="6" rx="0.8" stroke="rgba(245,158,11,0.55)" strokeWidth="1.2" fill="none"/>
                          <path d="M3.5 5V3.5a1.5 1.5 0 0 1 3 0V5" stroke="rgba(245,158,11,0.55)" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                        </svg>
                        <span style={{ color: "rgba(245,158,11,0.6)", fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", flexShrink: 0 }}>
                          {(task.recurrenceRule === "biweekly" || task.recurrenceRule === "monthly")
                            ? unlockInfo.date
                            : unlockInfo.days === 1 ? "tomorrow" : `in ${unlockInfo.days} days`}
                        </span>
                      </>
                    )}
                    {!overdue && streakCount >= 3 && (
                      <span style={{ color: baseColor, fontSize: "8px", letterSpacing: "0.1em", opacity: 0.75, flexShrink: 0 }}>
                        · 🔥 {streakCount}
                      </span>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <span className="text-[10px]" style={{ color: "var(--color-fg-muted)" }}>
            {task.dueDate
              ? parseLocalDate(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
              : "—"}
          </span>
        </div>

        <div className="flex items-center justify-center gap-1">
          {isSubmitted ? (
            <div
              className={`flex items-center gap-1 px-1.5 py-0.5${recentlyFiledIds.has(task.taskId) ? " filed-badge-enter" : ""}`}
              style={{ border: "1px solid rgba(74,222,128,0.35)", borderRadius: "2px", background: "rgba(74,222,128,0.06)" }}
            >
              <svg width="9" height="9" viewBox="0 0 12 10" fill="none" shapeRendering="crispEdges">
                <rect x="3" y="1" width="6" height="1" style={{ fill: "var(--color-success)" }} opacity="0.55" />
                <rect x="2" y="2" width="8" height="2" style={{ fill: "var(--color-success)" }} opacity="0.55" />
                <rect x="3" y="4" width="6" height="1" style={{ fill: "var(--color-success)" }} opacity="0.55" />
                <rect x="3" y="5" width="6" height="1" style={{ fill: "var(--color-success)" }} opacity="0.95" />
                <rect x="2" y="6" width="8" height="2" style={{ fill: "var(--color-success)" }} opacity="0.95" />
                <rect x="3" y="8" width="6" height="1" style={{ fill: "var(--color-success)" }} opacity="0.95" />
              </svg>
              <span style={{ color: "rgba(74,222,128,0.75)", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>
                Banked
              </span>
            </div>
          ) : canUndo ? (
            <div
              className="flex items-center gap-1 px-1.5 py-0.5"
              style={{ border: "1px solid rgba(245,158,11,0.35)", borderRadius: "2px", background: "rgba(245,158,11,0.06)" }}
            >
              <svg width="8" height="10" viewBox="0 0 10 12" fill="none" shapeRendering="crispEdges">
                <path d="M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z" style={{ fill: "var(--color-warning)" }} opacity="0.85" />
                <rect x="4" y="5" width="2" height="2" style={{ fill: "var(--color-bg)" }} opacity="0.5" />
              </svg>
              <span style={{ color: "rgba(245,158,11,0.9)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.03em" }}>
                {task.pointValue.toLocaleString()}
              </span>
            </div>
          ) : (
            <>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none" shapeRendering="crispEdges">
                <path d="M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z" style={{ fill: "var(--color-warning)" }} opacity="0.95" />
                <rect x="4" y="5" width="2" height="2" style={{ fill: "var(--color-bg)" }} opacity="0.4" />
              </svg>
              <span className="text-xs font-semibold" style={{ color: "var(--color-warning)" }}>
                {task.pointValue.toLocaleString()}
              </span>
            </>
          )}
        </div>
      </div>

      {slashingId === task.taskId && (
        <div style={{ position: "absolute", inset: 0, zIndex: 25, pointerEvents: "none" }}>
          <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "drop-shadow(0 0 6px rgba(239,68,68,1)) drop-shadow(0 0 14px rgba(239,68,68,0.6))" }}>
            <line x1="1" y1="30" x2="99" y2="30" style={{ stroke: "var(--color-danger)" }} strokeWidth="2" strokeLinecap="round" className="slash-line" />
            <line x1="1" y1="30" x2="99" y2="30" stroke="rgba(255,180,180,0.45)" strokeWidth="5" strokeLinecap="round" className="slash-line" />
          </svg>
        </div>
      )}

      {hasError && (
        <div style={{ position: "absolute", inset: 0, zIndex: 25, pointerEvents: "none" }}>
          <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "drop-shadow(0 0 4px rgba(239,68,68,0.85)) drop-shadow(0 0 10px rgba(239,68,68,0.45))" }}>
            <rect x="0.75" y="0.75" width="98.5" height="58.5" fill="none" style={{ stroke: "var(--color-danger)" }} strokeWidth="1.25" className="error-outline" />
          </svg>
        </div>
      )}

      {recurringPopup !== undefined && isInProgress && (
        <div
          className="recurring-pts-popup"
          style={{
            position: "absolute", right: "80px", top: "4px", zIndex: 30,
            color: "var(--color-secondary-accent)", fontSize: "12px", fontWeight: 700,
            letterSpacing: "0.06em", textShadow: "0 0 8px rgba(167,139,250,0.7)",
          }}
        >
          +{recurringPopup} pts
        </div>
      )}

      <div className="row-toolbar" onClick={stop}>
        {task.status === "pending" && task.isRecurring && !isInProgress && (
          overdueRecurring ? (
            <button
              onClick={(e) => { e.stopPropagation(); onRestartOverdue ? onRestartOverdue(task) : onSkip(task); }}
              disabled={isAdvancing}
              title="Resume — reschedule to today"
            >
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                <polygon points="2,1 9,5 2,9" fill="currentColor" />
              </svg>
            </button>
          ) : (
            <button
              onClick={eligibleCheckIn ? (e) => { e.stopPropagation(); onCheckIn(task); } : undefined}
              disabled={isAdvancing || !eligibleCheckIn}
              title={eligibleCheckIn ? "Check In" : "Not yet available"}
            >
              {eligibleCheckIn ? (
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <polyline points="1,5 4,8 9,2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <rect x="2.5" y="4.5" width="5" height="4" rx="0.5" stroke="currentColor" strokeWidth="1.2" fill="none" />
                  <path d="M3.5 4.5V3a1.5 1.5 0 0 1 3 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
              )}
            </button>
          )
        )}
        {task.status === "pending" && !task.isRecurring && !isGreyedOut && (
          <button
            onClick={(e) => { e.stopPropagation(); (overdueRegular && onRestartOverdue) ? onRestartOverdue(task) : onAdvance(task); }}
            disabled={isAdvancing}
            title={overdueRegular ? "Overdue — reschedule to start" : "Start"}
          >
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
              <polygon points="2,1 9,5 2,9" fill="currentColor" />
            </svg>
          </button>
        )}
        {isInProgress && (
          <button
            onClick={(e) => { e.stopPropagation(); onPause(task); }}
            disabled={pausing === task.taskId}
            title="Pause"
          >
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
              <rect x="1.5" y="1" width="3" height="8" fill="currentColor" />
              <rect x="5.5" y="1" width="3" height="8" fill="currentColor" />
            </svg>
          </button>
        )}
        {isInProgress && !isGreyedOut && (
          <button
            onClick={(e) => { e.stopPropagation(); onAdvance(task); }}
            disabled={isAdvancing}
            title="Complete"
            style={{ color: "var(--color-success)" }}
          >
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
              <polyline points="1,5 4,8 9,2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        {canUndo && !isGreyedOut && (
          <button
            onClick={(e) => { e.stopPropagation(); onAdvance(task); }}
            disabled={isAdvancing}
            title="Undo"
          >
            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
              <path d="M7 2H4C2.3 2 1 3.3 1 5s1.3 3 3 3h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <polyline points="4,4.5 1.5,2 4,0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task.taskId); }}
          disabled={slashingId === task.taskId}
          title="Delete"
          style={{ color: "var(--color-danger)" }}
        >
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path d="M3.8 2V1.3h2.4V2" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
            <line x1="1.3" y1="2.5" x2="8.7" y2="2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M2.6 3L3.1 8.5h3.8L7.4 3" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="4.2" y1="4.5" x2="4.2" y2="7.5" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
            <line x1="5.8" y1="4.5" x2="5.8" y2="7.5" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <BankBurstEffect active={isFiling} />
    </div>
  );
}
