"use client";

import { TaskDto } from "@/lib/api/tasks";
import { canCheckInNow, getNextOccurrenceLabel, getUnlockInfo, parseLocalDate, isOverdue } from "@/lib/dateUtils";
import { PRIORITY_DOT, CATEGORY_COLOR } from "@/lib/constants";
import ShatterEffect from "@/components/ShatterEffect";

interface TaskRowProps {
  task: TaskDto;
  activeFilter: string;
  advancing: string | null;
  pausing: string | null;
  slashingId: string | null;
  filingIds: Set<string>;
  recentlyFiledIds: Set<string>;
  selectedIds: Set<string>;
  submittedTaskIds: Set<string>;
  recurringPopup: number | undefined;
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
  filingIds, recentlyFiledIds, selectedIds, submittedTaskIds,
  recurringPopup, onAdvance, onCheckIn, onPause, onDelete,
  onSkip, onToggleSelect, onOpenDetail,
}: TaskRowProps) {
  const isInProgress = task.status === "in_progress";
  const isCompleted = task.status === "completed";
  const isGreyedOut = activeFilter === "pending" &&
    task.isRecurring && !canCheckInNow(task.dueDate, task.recurrenceRule);
  const dot = PRIORITY_DOT[task.priority.toLowerCase()] ?? "#888";
  const isAdvancing = advancing === task.taskId;
  const isFiling = filingIds.has(task.taskId);
  const canUndo = !isFiling && isCompleted && task.submitted === false && !task.pointsAwarded && !submittedTaskIds.has(task.taskId);
  const isSubmitted = isFiling || (isCompleted && (task.submitted === true || submittedTaskIds.has(task.taskId) || !!task.pointsAwarded));
  const isSelectable = activeFilter === "completed" && isCompleted && !isSubmitted;
  const overdueRecurring = task.isRecurring && !isInProgress && !isCompleted && isOverdue(task.dueDate);

  return (
    <div
      className={`task-row-wrapper${slashingId === task.taskId ? " task-row-deleting" : ""}`}
      style={{ position: "relative", height: "60px" }}
    >
      <div
        className={[
          "task-row-inner grid items-center px-4",
          isGreyedOut ? "greyed" : "",
          !isInProgress && !canUndo ? "default-border" : "",
        ].filter(Boolean).join(" ")}
        onClick={() => onOpenDetail(task)}
        style={{
          position: "absolute",
          inset: 0,
          gridTemplateColumns: "1fr 64px 80px",
          borderLeft: isInProgress
            ? "2px solid #5bb8e0"
            : canUndo
              ? "2px solid rgba(245,158,11,0.7)"
              : overdueRecurring
                ? "2px solid rgba(239,68,68,0.55)"
                : undefined,
          opacity: isCompleted && !canUndo ? 0.55 : isGreyedOut ? undefined : 1,
          transition: "opacity 0.15s ease-out",
          cursor: "pointer",
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          {isSelectable ? (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleSelect(task.taskId); }}
              className="w-4 h-4 flex-shrink-0 flex items-center justify-center transition-all duration-150"
              style={{
                border: `1px solid ${selectedIds.has(task.taskId) ? "#4ade80" : "rgba(255,255,255,0.25)"}`,
                borderRadius: "2px",
                background: selectedIds.has(task.taskId) ? "rgba(74,222,128,0.12)" : "transparent",
              }}
            >
              {selectedIds.has(task.taskId) && (
                <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                  <polyline points="1,3 3,5 7,1" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                color: isCompleted && !canUndo ? "rgba(255,255,255,0.45)" : "#ffffff",
                textDecoration: isCompleted ? "line-through" : "none",
              }}
            >
              {task.title}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5" style={{ overflow: "hidden" }}>
              {task.category && (() => {
                const cc = CATEGORY_COLOR[task.category] ?? "rgba(255,255,255,0.45)";
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
                  <span style={{ color: "#5bb8e0", fontSize: "8px", lineHeight: 1, flexShrink: 0 }}>█</span>
                  <span style={{ color: "#5bb8e0", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", flexShrink: 0 }}>Active</span>
                </>
              )}
              {canUndo && (
                <>
                  <svg width="8" height="8" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M7 1.5H4C2.3 1.5 1 2.8 1 4.5s1.3 3 3 3h4" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />
                    <polyline points="3.5,4 1,1.5 3.5,0" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </svg>
                  <span style={{ color: "#f59e0b", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", flexShrink: 0 }}>Undo</span>
                </>
              )}
              {task.isRecurring && task.recurrenceRule && !isInProgress && !canUndo && (() => {
                const isLocked = !canCheckInNow(task.dueDate, task.recurrenceRule);
                const overdue = isLocked && isOverdue(task.dueDate);
                const unlockInfo = isLocked && !overdue ? getUnlockInfo(task.dueDate) : null;
                const ruleLabel = task.recurrenceRule === "daily" ? "Daily"
                  : task.recurrenceRule === "weekdays" ? "Weekdays"
                  : getNextOccurrenceLabel(task.dueDate, task.recurrenceRule);
                const baseColor = overdue ? "rgba(239,68,68,0.85)" : isLocked ? "rgba(245,158,11,0.65)" : "#a78bfa";
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
          <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>
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
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                <polyline points="1.5,5 4,7.5 8.5,2" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ color: "rgba(74,222,128,0.75)", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>
                Filed
              </span>
            </div>
          ) : canUndo ? (
            <div
              className="flex items-center gap-1 px-1.5 py-0.5"
              style={{ border: "1px solid rgba(245,158,11,0.35)", borderRadius: "2px", background: "rgba(245,158,11,0.06)" }}
            >
              <svg width="8" height="10" viewBox="0 0 10 12" fill="none">
                <polygon points="5,0 10,4 5,12 0,4" fill="#f59e0b" opacity="0.85" />
              </svg>
              <span style={{ color: "rgba(245,158,11,0.9)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.03em" }}>
                {task.pointValue.toLocaleString()}
              </span>
            </div>
          ) : (
            <>
              <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                <polygon points="5,0 10,4 5,12 0,4" fill="#5bb8e0" opacity="0.9" />
              </svg>
              <span className="text-xs font-semibold" style={{ color: "#5bb8e0" }}>
                {task.pointValue.toLocaleString()}
              </span>
            </>
          )}
        </div>
      </div>

      <div
        className="task-actions"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "absolute", top: 0, bottom: 0, right: 0,
          flexDirection: "column", width: "28px",
          background: "#1e1f22", border: "1px solid #3a3b3f",
          overflow: "hidden", zIndex: 10,
        }}
      >
        {task.status === "pending" && task.isRecurring && !isInProgress && (() => {
          if (overdueRecurring) {
            return (
              <button
                onClick={() => onSkip(task)}
                title="Skip missed cycle"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", border: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.12)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <line x1="1" y1="5" x2="8" y2="5" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5" strokeLinecap="round" />
                  <polyline points="5,2 8,5 5,8" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            );
          }
          const eligible = canCheckInNow(task.dueDate, task.recurrenceRule);
          return (
            <button
              onClick={eligible ? () => onCheckIn(task) : undefined}
              disabled={isAdvancing || !eligible}
              title={eligible ? "Check In" : "Not yet available"}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: eligible ? "pointer" : "not-allowed", background: "transparent", border: "none", opacity: isAdvancing || !eligible ? 0.3 : 1 }}
              onMouseEnter={(e) => { if (eligible) e.currentTarget.style.background = "rgba(167,139,250,0.15)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {eligible ? (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <polyline points="1,5 4,8 9,2" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect x="2.5" y="4.5" width="5" height="4" rx="0.5" stroke="#a78bfa" strokeWidth="1.2" fill="none" />
                  <path d="M3.5 4.5V3a1.5 1.5 0 0 1 3 0v1.5" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                </svg>
              )}
            </button>
          );
        })()}

        {task.status === "pending" && !task.isRecurring && !isGreyedOut && (
          <button
            onClick={() => onAdvance(task)}
            disabled={isAdvancing}
            title="Start"
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", border: "none", opacity: isAdvancing ? 0.4 : 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(91,184,224,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <polygon points="2,1 9,5 2,9" fill="#5bb8e0" />
            </svg>
          </button>
        )}

        {isInProgress && (
          <button
            onClick={() => onPause(task)}
            disabled={pausing === task.taskId}
            title="Pause"
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", border: "none", opacity: pausing === task.taskId ? 0.4 : 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="1.5" y="1" width="3" height="8" fill="#f59e0b" />
              <rect x="5.5" y="1" width="3" height="8" fill="#f59e0b" />
            </svg>
          </button>
        )}

        {isInProgress && !isGreyedOut && (
          <button
            onClick={() => onAdvance(task)}
            disabled={isAdvancing}
            title="Complete"
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", border: "none", opacity: isAdvancing ? 0.4 : 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(91,184,224,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <polyline points="1,5 4,8 9,2" stroke="#5bb8e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}

        {canUndo && !isGreyedOut && (
          <button
            onClick={() => onAdvance(task)}
            disabled={isAdvancing}
            title="Undo"
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", border: "none", opacity: isAdvancing ? 0.4 : 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M7 2H4C2.3 2 1 3.3 1 5s1.3 3 3 3h4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
              <polyline points="4,4.5 1.5,2 4,0" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </button>
        )}

        {!isInProgress && (
          <button
            onClick={() => onDelete(task.taskId)}
            disabled={slashingId === task.taskId}
            title="Delete"
            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", border: "none", opacity: slashingId === task.taskId ? 0.4 : 1 }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <line x1="1" y1="1" x2="9" y2="9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="9" y1="1" x2="1" y2="9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </div>

      {slashingId === task.taskId && (
        <div style={{ position: "absolute", inset: 0, zIndex: 25, pointerEvents: "none" }}>
          <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "drop-shadow(0 0 6px rgba(239,68,68,1)) drop-shadow(0 0 14px rgba(239,68,68,0.6))" }}>
            <line x1="1" y1="30" x2="99" y2="30" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" className="slash-line" />
            <line x1="1" y1="30" x2="99" y2="30" stroke="rgba(255,180,180,0.45)" strokeWidth="5" strokeLinecap="round" className="slash-line" />
          </svg>
        </div>
      )}

      {recurringPopup !== undefined && isInProgress && (
        <div
          className="recurring-pts-popup"
          style={{
            position: "absolute", right: "80px", top: "4px", zIndex: 30,
            color: "#a78bfa", fontSize: "12px", fontWeight: 700,
            letterSpacing: "0.06em", textShadow: "0 0 8px rgba(167,139,250,0.7)",
          }}
        >
          +{recurringPopup} pts
        </div>
      )}

      <ShatterEffect active={isFiling} />
    </div>
  );
}
