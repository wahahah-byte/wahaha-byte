"use client";

import { TaskDto } from "@/lib/api/tasks";
import { StreakDto } from "@/lib/api/streaks";

const PRIORITY_DOT: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending:     { label: "Pending",     color: "rgba(255,255,255,0.45)" },
  in_progress: { label: "In Progress", color: "#5bb8e0" },
  completed:   { label: "Completed",   color: "#4ade80" },
};

interface Props {
  task: TaskDto;
  streak?: StreakDto;
  onClose: () => void;
  onStart?: () => void;
  onCheckIn?: () => void;
  checkInBlocked?: boolean;
  onComplete?: () => void;
  onPause?: () => void;
  onUndo?: () => void;
  onDelete?: () => void;
  isActing?: boolean;
  canUndo?: boolean;
}

function fmt(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function fmtFull(dateStr: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleString("en-US", {
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
      className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] tracking-widest uppercase font-semibold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
  task, streak, onClose,
  onStart, onCheckIn, checkInBlocked, onComplete, onPause, onUndo, onDelete,
  isActing, canUndo,
}: Props) {
  const dot = PRIORITY_DOT[task.priority.toLowerCase()] ?? "#888";
  const status = STATUS_LABEL[task.status] ?? { label: task.status, color: "#aaa" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.72)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md flex flex-col gap-0 rounded overflow-hidden"
        style={{ background: "#2a2b2f", border: "1px solid #3a3b3f", boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{ background: "#23242a", borderBottom: "1px solid #3a3b3f" }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />
            <span
              className="text-sm font-semibold tracking-wide truncate"
              style={{ color: task.status === "completed" ? "rgba(255,255,255,0.5)" : "#f0f0f0",
                textDecoration: task.status === "completed" ? "line-through" : "none" }}
            >
              {task.title}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-3 text-[#555] transition-colors text-lg leading-none cursor-pointer"
            onMouseEnter={(e) => (e.currentTarget.style.color = "#999")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4 px-5 py-4">
          {task.description && (
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
              {task.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-x-6 gap-y-3">
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
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {task.category || "—"}
              </span>
            </Row>

            <Row label="Points">
              <div className="flex items-center gap-1">
                <svg width="8" height="10" viewBox="0 0 10 12" fill="none">
                  <polygon points="5,0 10,4 5,12 0,4" fill="#5bb8e0" opacity="0.9" />
                </svg>
                <span style={{ color: "#5bb8e0", fontSize: "12px", fontWeight: 600, letterSpacing: "0.03em" }}>
                  {task.pointValue.toLocaleString()}
                </span>
              </div>
            </Row>

            <Row label="Due Date">
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px" }}>{fmt(task.dueDate)}</span>
            </Row>

            <Row label="Created">
              <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px" }}>{fmt(task.createdAt)}</span>
            </Row>

            {task.completedAt && (
              <Row label="Completed">
                <span style={{ color: "#4ade80", fontSize: "11px" }}>{fmtFull(task.completedAt)}</span>
              </Row>
            )}

            {task.isRecurring && task.recurrenceRule && (
              <Row label="Recurrence">
                <div className="flex items-center gap-1.5">
                  <span style={{ color: "#a78bfa", fontSize: "11px", lineHeight: 1 }}>↻</span>
                  <span style={{ color: "#a78bfa", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                    {task.recurrenceRule.charAt(0).toUpperCase() + task.recurrenceRule.slice(1)}
                  </span>
                </div>
              </Row>
            )}

            {streak && streak.currentCount > 0 && (
              <Row label="Streak">
                <div className="flex items-center gap-1.5">
                  <span style={{ fontSize: "12px" }}>🔥</span>
                  <span style={{ color: "#a78bfa", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
                    {streak.currentCount} &nbsp;
                    <span style={{ color: "rgba(167,139,250,0.5)", fontWeight: 400 }}>
                      / best {streak.longestCount}
                    </span>
                  </span>
                </div>
              </Row>
            )}
          </div>
        </div>

        {/* Actions */}
        <div
          className="flex items-center gap-2 flex-wrap px-5 py-3"
          style={{ borderTop: "1px solid #3a3b3f", background: "#252629" }}
        >
          {task.status === "pending" && !task.isRecurring && onStart && (
            <ActionBtn
              onClick={onStart}
              disabled={isActing}
              color="#5bb8e0"
              hoverBg="rgba(91,184,224,0.12)"
              label="Start"
              icon={
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <polygon points="2,1 9,5 2,9" fill="#5bb8e0" />
                </svg>
              }
            />
          )}

          {task.status === "pending" && task.isRecurring && onCheckIn && (
            <ActionBtn
              onClick={onCheckIn}
              disabled={isActing}
              color="#a78bfa"
              hoverBg="rgba(167,139,250,0.12)"
              label="Check In"
              icon={
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <polyline points="1,5 4,8 9,2" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                  : "—"}
              </span>
            </div>
          )}

          {task.status === "in_progress" && onPause && (
            <ActionBtn
              onClick={onPause}
              disabled={isActing}
              color="#f59e0b"
              hoverBg="rgba(245,158,11,0.12)"
              label="Pause"
              icon={
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <rect x="1.5" y="1" width="3" height="8" fill="#f59e0b" />
                  <rect x="5.5" y="1" width="3" height="8" fill="#f59e0b" />
                </svg>
              }
            />
          )}

          {task.status === "in_progress" && onComplete && (
            <ActionBtn
              onClick={onComplete}
              disabled={isActing}
              color="#4ade80"
              hoverBg="rgba(74,222,128,0.12)"
              label="Complete"
              icon={
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <polyline points="1,5 4,8 9,2" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
            />
          )}

          {canUndo && onUndo && (
            <ActionBtn
              onClick={onUndo}
              disabled={isActing}
              color="#f59e0b"
              hoverBg="rgba(245,158,11,0.12)"
              label="Undo"
              icon={
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <path d="M7 2H4C2.3 2 1 3.3 1 5s1.3 3 3 3h4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                  <polyline points="4,4.5 1.5,2 4,0" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              }
            />
          )}

          {onDelete && (
            <ActionBtn
              onClick={onDelete}
              disabled={isActing}
              color="#ef4444"
              hoverBg="rgba(239,68,68,0.12)"
              label="Delete"
              icon={
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                  <line x1="1" y1="1" x2="9" y2="9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                  <line x1="9" y1="1" x2="1" y2="9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              }
            />
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-2"
          style={{ borderTop: "1px solid #3a3b3f", background: "#23242a" }}
        >
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "9px", letterSpacing: "0.15em", fontFamily: "monospace" }}>
            {task.taskId.slice(0, 8).toUpperCase()}
          </span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "9px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {task.submitted ? "Filed" : "Unfiled"}
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
        {label}
      </span>
      <div>{children}</div>
    </div>
  );
}
