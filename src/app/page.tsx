"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { tasksApi, TaskDto, TaskFilterParams } from "@/lib/api/tasks";
import { usersApi } from "@/lib/api/users";
import NewTaskModal from "@/components/NewTaskModal";

const PRIORITY_DOT: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilterParams>({ pageSize: 50, pageNumber: 1 });
  const [activeFilter, setActiveFilter] = useState("all");
  const [showNewTask, setShowNewTask] = useState(false);
  const [advancing, setAdvancing] = useState<string | null>(null);
  const [pausing, setPausing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [stagedTaskIds, setStagedTaskIds] = useState<string[]>([]);
  const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dailySubmitted, setDailySubmitted] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    const hasToken = !!localStorage.getItem("auth_token");
    setIsAuthenticated(hasToken);
    if (hasToken) {
      usersApi.getMe().then(({ data }) => {
        if (data) setDailySubmitted(data.pointsSubmittedToday ?? 0);
      });
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchTasks() {
      setLoading(true);
      setError(null);
      const { data, error } = await tasksApi.getAll(filters);
      setLoading(false);
      if (error) { setError(error); return; }
      setTasks(data!.data);
      const alreadySubmitted = new Set(data!.data.filter((t) => t.pointsAwarded).map((t) => t.taskId));
      setSubmittedTaskIds(alreadySubmitted);
    }
    fetchTasks();
  }, [filters, isAuthenticated]);

  function applyFilter(value: string) {
    setActiveFilter(value);
    setFilters((f) => ({ ...f, status: value === "all" || value === "pending" ? undefined : value, pageNumber: 1 }));
  }

  async function handleAdvance(task: TaskDto) {
    if (advancing === task.taskId) return;
    const canUndo = task.status === "completed" && !submittedTaskIds.has(task.taskId) && !task.pointsAwarded;
    setAdvancing(task.taskId);

    if (task.status === "pending") {
      const { error } = await tasksApi.start(task.taskId);
      setAdvancing(null);
      if (error) { setError(error); return; }
      setTasks((prev) => prev.map((t) => t.taskId === task.taskId ? { ...t, status: "in_progress" } : t));

    } else if (task.status === "in_progress") {
      const { error } = await tasksApi.complete(task.taskId);
      setAdvancing(null);
      if (error) { setError(error); return; }
      if (task.pointValue) {
        setStagedTaskIds((prev) => [...prev, task.taskId]);
        window.dispatchEvent(new CustomEvent("staged-points-updated", { detail: { delta: task.pointValue } }));
      }
      setTasks((prev) =>
        activeFilter === "in_progress"
          ? prev.filter((t) => t.taskId !== task.taskId)
          : prev.map((t) => t.taskId === task.taskId ? { ...t, status: "completed", completedAt: new Date().toISOString() } : t)
      );

    } else if (canUndo) {
      const { error } = await tasksApi.update(task.taskId, {
        taskId: task.taskId, title: task.title,
        description: task.description ?? undefined, category: task.category,
        priority: task.priority, status: "in_progress", pointValue: task.pointValue,
        dueDate: task.dueDate ?? undefined, completedAt: undefined,
        isRecurring: task.isRecurring, recurrenceRule: task.recurrenceRule ?? undefined,
        submitted: task.submitted,
      });
      setAdvancing(null);
      if (error) { setError(error); return; }
      if (stagedTaskIds.includes(task.taskId)) {
        setStagedTaskIds((prev) => prev.filter((id) => id !== task.taskId));
        window.dispatchEvent(new CustomEvent("staged-points-updated", { detail: { delta: -(task.pointValue ?? 0) } }));
      }
      setTasks((prev) =>
        activeFilter === "all"
          ? prev.map((t) => t.taskId === task.taskId ? { ...t, status: "in_progress", completedAt: null } : t)
          : prev.filter((t) => t.taskId !== task.taskId)
      );
    } else {
      setAdvancing(null);
    }
  }

  async function handlePause(task: TaskDto) {
    setPausing(task.taskId);
    const { error } = await tasksApi.update(task.taskId, {
      taskId: task.taskId, title: task.title,
      description: task.description ?? undefined, category: task.category,
      priority: task.priority, status: "pending", pointValue: task.pointValue,
      dueDate: task.dueDate ?? undefined, completedAt: undefined,
      isRecurring: task.isRecurring, recurrenceRule: task.recurrenceRule ?? undefined,
      submitted: task.submitted,
    });
    setPausing(null);
    if (error) { setError(error); return; }
    setTasks((prev) =>
      activeFilter === "in_progress"
        ? prev.filter((t) => t.taskId !== task.taskId)
        : prev.map((t) => t.taskId === task.taskId ? { ...t, status: "pending" } : t)
    );
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    const { error } = await tasksApi.delete(id);
    setDeleting(null);
    if (error) { setError(error); return; }
    setTasks((prev) => prev.filter((t) => t.taskId !== id));
    setStagedTaskIds((prev) => prev.filter((sid) => sid !== id));
  }

  async function handleSubmit() {
    if (stagedTaskIds.length === 0) return;
    const DAILY_CAP = 200;
    const remaining = DAILY_CAP - dailySubmitted;
    if (remaining <= 0) return;
    setIsSubmitting(true);
    const { data, error } = await usersApi.submitPoints(stagedTaskIds);
    setIsSubmitting(false);
    if (error) { setError(error); return; }
    setSubmittedTaskIds((prev) => new Set([...prev, ...stagedTaskIds]));
    setStagedTaskIds([]);
    setDailySubmitted(data!.dailyTotal);
    window.dispatchEvent(new CustomEvent("points-awarded", { detail: { delta: data!.pointsAwarded ?? 0, newBalance: data!.newBalance } }));
    window.dispatchEvent(new CustomEvent("staged-points-updated", { detail: { delta: 0, reset: true } }));
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#1e1f22" }}>
        <div className="w-5 h-5 border-2 border-[#333] border-t-[#5bb8e0] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-8 px-4" style={{ background: "#1e1f22" }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-widest uppercase text-white mb-2">
            Wahaha Byte
          </h1>
          <p className="text-sm tracking-wide text-white/70">
            Track tasks, earn points, stay on streak.
          </p>
        </div>

        <div
          className="w-full max-w-sm flex flex-col gap-3 p-8 rounded"
          style={{ background: "#3e3f42", border: "1px solid #2a2a2a" }}
        >
          <Link
            href="/login"
            className="w-full py-2.5 text-sm font-semibold tracking-wider uppercase rounded text-center transition-colors"
            style={{ background: "#1a3a4a", color: "#5bb8e0", border: "1px solid #1e5068" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#1e4d63")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a3a4a")}
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="w-full py-2.5 text-sm font-medium tracking-wide text-center rounded transition-colors"
            style={{ background: "transparent", color: "#aaa", border: "1px solid #333" }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#555")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#333")}
          >
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen text-white flex flex-col bg-scanlines" style={{ background: "#1e1f22" }}>
        <div className="max-w-3xl w-full mx-auto px-4 py-8 flex flex-col flex-1">

          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold tracking-widest uppercase text-white">
              Tasks
            </h1>
            <button
              onClick={() => setShowNewTask(true)}
              className="text-xs tracking-widest uppercase px-4 py-2 font-semibold cursor-pointer transition-colors"
              style={{ background: "#1a3a4a", color: "#5bb8e0", border: "1px solid #1e5068" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#1e4d63")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1a3a4a")}
            >
              + New
            </button>
          </div>

          {/* Filter tabs */}
          <div className="flex mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => applyFilter(f.value)}
                className="px-4 py-3 text-xs tracking-wider uppercase cursor-pointer transition-colors relative flex items-center gap-1.5"
                style={{
                  color: activeFilter === f.value ? "#5bb8e0" : "rgba(255,255,255,0.65)",
                  background: "transparent",
                  border: "none",
                }}
              >
                {f.label}
                {f.value === "completed" && stagedTaskIds.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#f59e0b" }} />
                )}
                {activeFilter === f.value && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: "#5bb8e0" }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Column headers */}
          <div
            className="grid text-[10px] tracking-widest uppercase px-4 py-2 select-none"
            style={{
              gridTemplateColumns: "1fr 80px 64px 80px",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            <span>Name</span>
            <span className="text-center">Category</span>
            <span className="text-center">Due</span>
            <span className="text-center">Points</span>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 mb-2 text-xs text-red-400" style={{ background: "#1e1e1e" }}>
              {error}
            </div>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-5 h-5 border-2 border-[#333] border-t-[#5bb8e0] rounded-full animate-spin" />
            </div>
          )}

          {/* Empty */}
          {!loading && tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-sm tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>No items</p>
            </div>
          )}

          {/* Submission panel — Completed tab only, when staged tasks exist */}
          {activeFilter === "completed" && stagedTaskIds.length > 0 && (() => {
            const DAILY_CAP = 200;
            const remaining = DAILY_CAP - dailySubmitted;
            const stagedPts = tasks
              .filter((t) => stagedTaskIds.includes(t.taskId))
              .reduce((sum, t) => sum + t.pointValue, 0);
            const willAward = Math.min(stagedPts, Math.max(0, remaining));
            const capped = stagedPts > remaining;
            const limitReached = remaining <= 0;
            return (
              <div
                className="mb-3 px-4 py-3"
                style={{
                  background: "#2a2b2f",
                  border: "1px solid rgba(245,158,11,0.3)",
                  borderLeft: "2px solid #f59e0b",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                      Pending Submission
                    </span>
                    <div className="flex items-center gap-1.5">
                      <svg width="8" height="10" viewBox="0 0 10 12" fill="none">
                        <polygon points="5,0 10,4 5,12 0,4" fill="#f59e0b" opacity="0.85" />
                      </svg>
                      <span style={{ color: "#f59e0b", fontSize: "12px", fontWeight: 600 }}>
                        {stagedTaskIds.length} task{stagedTaskIds.length !== 1 ? "s" : ""} · {stagedPts.toLocaleString()} pts staged
                      </span>
                    </div>
                    {limitReached ? (
                      <span style={{ color: "#ef4444", fontSize: "10px", letterSpacing: "0.05em" }}>
                        Daily limit reached (200 pts/day)
                      </span>
                    ) : capped ? (
                      <span style={{ color: "rgba(245,158,11,0.7)", fontSize: "10px", letterSpacing: "0.05em" }}>
                        Capped — will award {willAward} of {stagedPts} pts ({remaining} remaining today)
                      </span>
                    ) : (
                      <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px", letterSpacing: "0.05em" }}>
                        {remaining} pts remaining today · will award {willAward} pts
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || limitReached}
                    className="flex-shrink-0 text-[10px] tracking-widest uppercase px-3 py-2 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ color: "#f59e0b", border: "1px solid rgba(245,158,11,0.5)", background: "rgba(245,158,11,0.08)" }}
                    onMouseEnter={(e) => { if (!isSubmitting && !limitReached) e.currentTarget.style.background = "rgba(245,158,11,0.18)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(245,158,11,0.08)"; }}
                  >
                    {isSubmitting ? "Submitting…" : limitReached ? "Limit Reached" : `Submit ${willAward} pts ▶`}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* Rows */}
          <div className="flex flex-col gap-1">
            {!loading && (activeFilter === "pending"
              ? tasks.filter((t) => t.status === "pending" || t.status === "in_progress")
              : activeFilter === "completed"
              ? [...tasks].sort((a, b) => {
                  const aUndo = a.status === "completed" && a.submitted === false && !a.pointsAwarded && !submittedTaskIds.has(a.taskId);
                  const bUndo = b.status === "completed" && b.submitted === false && !b.pointsAwarded && !submittedTaskIds.has(b.taskId);
                  return (bUndo ? 1 : 0) - (aUndo ? 1 : 0);
                })
              : tasks
            ).map((task) => {
              const isInProgress = task.status === "in_progress";
              const isCompleted = task.status === "completed";
              const isGreyedOut = isInProgress && activeFilter === "pending";
              const dot = PRIORITY_DOT[task.priority.toLowerCase()] ?? "#888";
              const isAdvancing = advancing === task.taskId;
              const canUndo = isCompleted && task.submitted === false && !task.pointsAwarded && !submittedTaskIds.has(task.taskId);
              const isSubmitted = isCompleted && (task.submitted === true || submittedTaskIds.has(task.taskId) || !!task.pointsAwarded);

              return (
                <div
                  key={task.taskId}
                  className="task-row-wrapper"
                  style={{ position: "relative", height: "60px" }}
                >
                <div
                  className={[
                    "task-row-inner grid items-center px-4",
                    isGreyedOut ? "greyed" : "",
                    !isInProgress && !canUndo ? "default-border" : "",
                  ].filter(Boolean).join(" ")}
                  style={{
                    position: "absolute",
                    inset: 0,
                    gridTemplateColumns: "1fr 80px 64px 80px",
                    borderLeft: isInProgress
                      ? "2px solid #5bb8e0"
                      : canUndo
                      ? "2px solid rgba(245,158,11,0.7)"
                      : undefined,
                    opacity: isCompleted && !canUndo ? 0.55 : isGreyedOut ? undefined : 1,
                    cursor: isGreyedOut ? "default" : "auto",
                  }}
                >
                  {/* Name + priority dot */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: dot }}
                    />
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
                      {isInProgress && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <span style={{ color: "#5bb8e0", fontSize: "8px", lineHeight: 1 }}>█</span>
                          <span style={{ color: "#5bb8e0", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase" }}>Active</span>
                        </div>
                      )}
                      {canUndo && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                            <path d="M7 1.5H4C2.3 1.5 1 2.8 1 4.5s1.3 3 3 3h4" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />
                            <polyline points="3.5,4 1,1.5 3.5,0" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          </svg>
                          <span style={{ color: "#f59e0b", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase" }}>Undo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category */}
                  <div className="flex items-center justify-center">
                    <span className="text-[10px] tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {task.category || "—"}
                    </span>
                  </div>

                  {/* Due date */}
                  <div className="flex items-center justify-center">
                    <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "—"}
                    </span>
                  </div>

                  {/* Points / Filed indicator */}
                  <div className="flex items-center justify-center gap-1">
                    {isSubmitted ? (
                      <div
                        className="flex items-center gap-1 px-1.5 py-0.5"
                        style={{
                          border: "1px solid rgba(74,222,128,0.35)",
                          borderRadius: "2px",
                          background: "rgba(74,222,128,0.06)",
                        }}
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
                        style={{
                          border: "1px solid rgba(245,158,11,0.35)",
                          borderRadius: "2px",
                          background: "rgba(245,158,11,0.06)",
                        }}
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

                  {/* Vertical icon button stack — shown/hidden via CSS :hover on .task-row-wrapper */}
                  <div
                    className="task-actions"
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      right: 0,
                      flexDirection: "column",
                      width: "28px",
                      background: "#1e1f22",
                      border: "1px solid #3a3b3f",
                      overflow: "hidden",
                      zIndex: 10,
                    }}
                  >
                      {/* Start (pending) */}
                      {task.status === "pending" && !isGreyedOut && (
                        <button
                          onClick={() => handleAdvance(task)}
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

                      {/* Pause (in_progress) */}
                      {isInProgress && (
                        <button
                          onClick={() => handlePause(task)}
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

                      {/* Complete (in_progress) */}
                      {isInProgress && !isGreyedOut && (
                        <button
                          onClick={() => handleAdvance(task)}
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

                      {/* Undo (completed, not yet awarded) */}
                      {canUndo && !isGreyedOut && (
                        <button
                          onClick={() => handleAdvance(task)}
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

                      {/* Delete (non-greyed only) */}
                      {!isGreyedOut && <button
                        onClick={() => handleDelete(task.taskId)}
                        disabled={deleting === task.taskId}
                        title="Delete"
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", border: "none", opacity: deleting === task.taskId ? 0.4 : 1 }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <line x1="1" y1="1" x2="9" y2="9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="9" y1="1" x2="1" y2="9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>}
                    </div>
                </div>
              );
            })}
          </div>{/* end rows */}

          {/* Footer count */}
          {!loading && tasks.length > 0 && (
            <div className="flex justify-between items-center mt-2 px-1">
              <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>
                {tasks.filter((t) => t.status !== "completed").length} remaining
              </span>
              <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>
                {tasks.length} total
              </span>
            </div>
          )}
        </div>
      </div>

      {showNewTask && (
        <NewTaskModal
          onClose={() => setShowNewTask(false)}
          onCreated={(task) => {
            setTasks((prev) => [task, ...prev]);
            setShowNewTask(false);
          }}
        />
      )}
    </>
  );
}
