"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { tasksApi, TaskDto, TaskFilterParams, UpdateTaskRequest } from "@/lib/api/tasks";
import NewTaskModal from "@/components/NewTaskModal";
import TaskDetailModal, { EditableTaskFields } from "@/components/TaskDetailModal";
import TaskRow from "@/components/TaskRow";
import SubmitBar from "@/components/SubmitBar";
import CapWarningModal from "@/components/CapWarningModal";
import { useTaskActions } from "@/hooks/useTaskActions";
import { useTaskSubmission } from "@/hooks/useTaskSubmission";
import { canCheckInNow, parseLocalDate, getCyclesOverdue } from "@/lib/dateUtils";
import { FILTERS } from "@/lib/constants";
import { usePoints } from "@/context/PointsContext";

const MOCK_TASKS: TaskDto[] = [
  { taskId: "d1", userId: "demo", title: "Morning workout", description: "30 min cardio or strength training", category: "Fitness", priority: "high", status: "pending", pointValue: 15, dueDate: "2026-04-26", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 12, longestStreakCount: 15 },
  { taskId: "d2", userId: "demo", title: "Read 30 minutes", description: null, category: "Learning", priority: "medium", status: "pending", pointValue: 10, dueDate: "2026-04-27", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekdays", submitted: false, currentStreakCount: 8, longestStreakCount: 21 },
  { taskId: "d3", userId: "demo", title: "Weekly review & planning", description: "Review last week, plan the next", category: "Productivity", priority: "high", status: "pending", pointValue: 20, dueDate: "2026-04-26", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekly", submitted: false, currentStreakCount: 5, longestStreakCount: 5 },
  { taskId: "d4", userId: "demo", title: "Monthly budget review", description: null, category: "Finance", priority: "high", status: "pending", pointValue: 25, dueDate: "2026-05-01", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "monthly", submitted: false },
  { taskId: "d5", userId: "demo", title: "Fix login page redirect bug", description: null, category: "Dev", priority: "high", status: "in_progress", pointValue: 30, dueDate: "2026-04-26", createdAt: "2026-04-20T00:00:00Z", completedAt: null, isRecurring: false, recurrenceRule: null, submitted: false },
  { taskId: "d6", userId: "demo", title: "Design new dashboard mockup", description: null, category: "Design", priority: "medium", status: "pending", pointValue: 20, dueDate: "2026-05-03", createdAt: "2026-04-22T00:00:00Z", completedAt: null, isRecurring: false, recurrenceRule: null, submitted: false },
  { taskId: "d7", userId: "demo", title: "Organize project notes", description: null, category: "Productivity", priority: "low", status: "pending", pointValue: 5, dueDate: null, createdAt: "2026-04-23T00:00:00Z", completedAt: null, isRecurring: false, recurrenceRule: null, submitted: false },
  { taskId: "d8", userId: "demo", title: "Write project README", description: null, category: "Dev", priority: "medium", status: "completed", pointValue: 15, dueDate: "2026-04-25", createdAt: "2026-04-20T00:00:00Z", completedAt: "2026-04-25T14:00:00Z", isRecurring: false, recurrenceRule: null, submitted: false, pointsAwarded: false },
  { taskId: "d9", userId: "demo", title: "Update resume", description: null, category: "Career", priority: "low", status: "completed", pointValue: 10, dueDate: "2026-04-24", createdAt: "2026-04-18T00:00:00Z", completedAt: "2026-04-24T10:00:00Z", isRecurring: false, recurrenceRule: null, submitted: true, pointsAwarded: true },
];

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilterParams>({ pageSize: 50, pageNumber: 1 });
  const [activeFilter, setActiveFilter] = useState("all");
  const [showNewTask, setShowNewTask] = useState(false);
  const [detailTask, setDetailTask] = useState<TaskDto | null>(null);
  const [overdueRestartTaskId, setOverdueRestartTaskId] = useState<string | null>(null);
  const [penalizedTaskIds, setPenalizedTaskIds] = useState<Set<string>>(new Set());
  type GroupMode = "none" | "type" | "due" | "category";
  const [groupMode, setGroupMode] = useState<GroupMode>("none");
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  type SortMode = "due" | "priority" | "title" | "points";
  const [sortMode, setSortMode] = useState<SortMode>("due");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const { setUnsubmittedPoints } = usePoints();
  const submission = useTaskSubmission({ tasks, isAuthenticated, setError: (msg) => setError(msg) });

  const {
    selectedIds, setSelectedIds, stagedTaskIds, setStagedTaskIds,
    submittedTaskIds, setSubmittedTaskIds, filingIds, recentlyFiledIds,
    isSubmitting, showCapWarning, setShowCapWarning,
    toggleSelect, doSubmit, handleSubmit,
    remaining, recurringRemaining, selectedPts, willAward, capped, limitReached,
  } = submission;

  const { advancing, pausing, slashingId, recurringPopups, handleAdvance, handleCheckIn, handlePause, handleDelete, handleSkip } =
    useTaskActions({
      tasks, setTasks, isAuthenticated, activeFilter,
      stagedTaskIds, setStagedTaskIds,
      selectedIds, setSelectedIds,
      submittedTaskIds,
      setError: (msg) => setError(msg),
    });

  useEffect(() => {
    setIsMounted(true);
    const tab = searchParams.get("tab");
    if (tab && FILTERS.some((f) => f.value === tab)) {
      setActiveFilter(tab);
      setFilters((f) => ({ ...f, status: tab === "all" || tab === "pending" || tab === "in_progress" ? undefined : tab, pageNumber: 1 }));
    }
    const hasToken = !!localStorage.getItem("auth_token");
    setIsAuthenticated(hasToken);
    if (!hasToken) {
      const penalizedIds = new Set<string>();
      const processed = MOCK_TASKS.map((t) => {
        if (t.status === "in_progress" && !t.isRecurring && t.dueDate && getCyclesOverdue(t.dueDate, null) >= 3) {
          penalizedIds.add(t.taskId);
          return { ...t, status: "pending" as const };
        }
        return t;
      });
      if (penalizedIds.size > 0) setPenalizedTaskIds(penalizedIds);
      setTasks(processed);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 5100);
    return () => clearTimeout(t);
  }, [error]);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchTasks() {
      setLoading(true);
      setError(null);
      const taskResult = await tasksApi.getAll(filters);
      setLoading(false);
      if (taskResult.error) { setError(taskResult.error); return; }
      const raw = taskResult.data!.data;
      const penalizedIds = new Set<string>();
      const processed = raw.map((t) => {
        if (t.status === "in_progress" && !t.isRecurring && t.dueDate && getCyclesOverdue(t.dueDate, null) >= 3) {
          penalizedIds.add(t.taskId);
          return { ...t, status: "pending" as const };
        }
        return t;
      });
      if (penalizedIds.size > 0) {
        setPenalizedTaskIds(penalizedIds);
        for (const t of raw.filter((t) => penalizedIds.has(t.taskId))) {
          tasksApi.update(t.taskId, {
            taskId: t.taskId, title: t.title,
            description: t.description ?? undefined, category: t.category,
            priority: t.priority, status: "pending", pointValue: t.pointValue,
            dueDate: t.dueDate ?? undefined, completedAt: undefined,
            isRecurring: t.isRecurring, recurrenceRule: t.recurrenceRule ?? undefined,
            submitted: t.submitted,
          });
        }
      }
      setTasks(processed);
      const alreadySubmitted = new Set(raw.filter((t) => t.pointsAwarded).map((t) => t.taskId));
      setSubmittedTaskIds(alreadySubmitted);
    }
    fetchTasks();
  }, [filters, isAuthenticated]);

  useEffect(() => {
    const total = tasks.reduce((s, t) =>
      t.status === "completed" && !submittedTaskIds.has(t.taskId) && !t.pointsAwarded && t.submitted === false
        ? s + t.pointValue : s,
      0
    );
    setUnsubmittedPoints(total);
  }, [tasks, submittedTaskIds, setUnsubmittedPoints]);

  function applyFilter(value: string) {
    setActiveFilter(value);
    setFilters((f) => ({ ...f, status: value === "all" || value === "pending" || value === "in_progress" ? undefined : value, pageNumber: 1 }));
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("tab");
    else params.set("tab", value);
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  }

  async function handleSaveTask(fields: EditableTaskFields): Promise<string | null> {
    if (!detailTask) return null;
    const isRestart = overdueRestartTaskId === detailTask.taskId;
    if (!isAuthenticated) {
      const updated = { ...detailTask, ...fields };
      setTasks((prev) => prev.map((t) => t.taskId === detailTask.taskId ? updated : t));
      setDetailTask(updated);
      if (isRestart) {
        setOverdueRestartTaskId(null);
        setDetailTask(null);
        handleAdvance(updated);
      }
      return null;
    }
    const req: UpdateTaskRequest = {
      taskId: detailTask.taskId,
      title: fields.title,
      description: fields.description ?? undefined,
      category: fields.category,
      priority: fields.priority,
      status: detailTask.status,
      pointValue: detailTask.pointValue,
      dueDate: fields.dueDate ?? undefined,
      completedAt: detailTask.completedAt ?? undefined,
      isRecurring: detailTask.isRecurring,
      recurrenceRule: detailTask.recurrenceRule ?? undefined,
      submitted: detailTask.submitted,
    };
    const { error } = await tasksApi.update(detailTask.taskId, req);
    if (error) return error;
    const updated = { ...detailTask, ...fields };
    setTasks((prev) => prev.map((t) => t.taskId === detailTask.taskId ? updated : t));
    setDetailTask(updated);
    if (isRestart) {
      setOverdueRestartTaskId(null);
      setDetailTask(null);
      handleAdvance(updated);
    }
    return null;
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#1e1f22" }}>
        <div className="w-5 h-5 border-2 border-[#333] border-t-[#5bb8e0] rounded-full animate-spin" />
      </div>
    );
  }

  const submitBarVisible = activeFilter === "completed" && selectedIds.size > 0;

  type Sep = { __sep: true; label: string; sepKey: string };
  const sep = (label: string, sepKey: string): Sep => ({ __sep: true, label, sepKey });

  const completedSort = (a: TaskDto, b: TaskDto) => {
    const aUndo = a.submitted === false && !a.pointsAwarded && !submittedTaskIds.has(a.taskId);
    const bUndo = b.submitted === false && !b.pointsAwarded && !submittedTaskIds.has(b.taskId);
    return (bUndo ? 1 : 0) - (aUndo ? 1 : 0);
  };
  const byDueDate = (a: TaskDto, b: TaskDto) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  };

  const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const getTaskTier = (t: TaskDto): 0 | 1 => {
    if (t.isRecurring) return canCheckInNow(t.dueDate, t.recurrenceRule) ? 0 : 1;
    return t.status === "in_progress" ? 1 : 0;
  };
  const sortTasks = (a: TaskDto, b: TaskDto): number => {
    const tierDiff = getTaskTier(a) - getTaskTier(b);
    if (tierDiff !== 0) return tierDiff;
    switch (sortMode) {
      case "priority": return (PRIORITY_ORDER[a.priority.toLowerCase()] ?? 3) - (PRIORITY_ORDER[b.priority.toLowerCase()] ?? 3);
      case "title": return a.title.localeCompare(b.title);
      case "points": return b.pointValue - a.pointValue;
      default: return byDueDate(a, b);
    }
  };

  const listItems: (TaskDto | Sep)[] = (() => {
    if (activeFilter === "completed") {
      return [...tasks].filter((t) => t.status === "completed").sort(completedSort);
    }
    const activeTasks =
      activeFilter === "pending"
        ? tasks.filter((t) => t.status === "pending")
        : activeFilter === "in_progress"
          ? tasks.filter((t) => t.status === "in_progress")
          : tasks.filter((t) => t.status !== "completed");
    const completedTasks = activeFilter === "all"
      ? [...tasks].filter((t) => t.status === "completed").sort(completedSort)
      : [];
    const items: (TaskDto | Sep)[] = [];
    if (groupMode === "type") {
      const recurring = activeTasks.filter((t) => t.isRecurring).sort(sortTasks);
      const regular = activeTasks.filter((t) => !t.isRecurring).sort(sortTasks);
      if (recurring.length > 0) items.push(sep("Recurring", "__sep-recurring"), ...recurring);
      if (regular.length > 0) items.push(sep("Regular", "__sep-regular"), ...regular);
    } else if (groupMode === "due") {
      const buckets = new Map<string, TaskDto[]>();
      for (const t of activeTasks) {
        const key = t.dueDate ?? "__none";
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key)!.push(t);
      }
      const keys = [...buckets.keys()].sort((a, b) => {
        if (a === "__none") return 1;
        if (b === "__none") return -1;
        return a.localeCompare(b);
      });
      for (const key of keys) {
        const label = key === "__none"
          ? "No Due Date"
          : parseLocalDate(key).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        items.push(sep(label, `__sep-due-${key}`), ...buckets.get(key)!.sort(sortTasks));
      }
    } else if (groupMode === "category") {
      const buckets = new Map<string, TaskDto[]>();
      for (const t of activeTasks) {
        const key = t.category || "__none";
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key)!.push(t);
      }
      const keys = [...buckets.keys()].sort((a, b) => {
        if (a === "__none") return 1;
        if (b === "__none") return -1;
        return a.localeCompare(b);
      });
      for (const key of keys) {
        const label = key === "__none" ? "No Category" : key;
        items.push(sep(label, `__sep-cat-${key}`), ...buckets.get(key)!.sort(sortTasks));
      }
    } else {
      items.push(...[...activeTasks].sort(sortTasks));
    }
    if (completedTasks.length > 0) items.push(sep("Completed", "__sep-completed"), ...completedTasks);
    return items;
  })();

  const unsubmitted = tasks.filter((t) =>
    t.status === "completed" && !submittedTaskIds.has(t.taskId) && !t.pointsAwarded && t.submitted === false
  );
  const allUnsubmittedSelected = unsubmitted.length > 0 && unsubmitted.every((t) => selectedIds.has(t.taskId));

  return (
    <>
      <div className="min-h-screen text-white flex flex-col bg-scanlines" style={{ background: "#1e1f22" }}>
        <div
          className="max-w-3xl w-full mx-auto px-4 py-8 flex flex-col flex-1"
          style={{ paddingBottom: submitBarVisible ? "96px" : undefined }}
        >
          {!isAuthenticated && (
            <div className="flex items-center justify-between mb-3 px-3 py-2 text-[10px] tracking-widest uppercase" style={{ background: "rgba(91,184,224,0.07)", border: "1px solid rgba(91,184,224,0.18)", borderRadius: "3px" }}>
              <span style={{ color: "rgba(91,184,224,0.75)" }}>Demo · changes are not saved</span>
              <Link href="/login" style={{ color: "#5bb8e0", letterSpacing: "0.18em" }}>Sign in →</Link>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "stretch", background: "#1e2025", marginBottom: "6px", height: "38px" }}>
            {/* Icon box */}
            <div style={{
              width: "38px", minWidth: "38px",
              background: "#2a2d33",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRight: "1px solid rgba(255,255,255,0.08)",
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                <path d="M9 16l2 2 4-4" />
              </svg>
            </div>

            {/* TASKS text + diagonal stripe fade */}
            <div style={{ position: "relative", display: "flex", alignItems: "center", paddingLeft: "14px", overflow: "hidden" }}>
              <span style={{
                fontSize: "12px", fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.9)",
                whiteSpace: "nowrap", position: "relative", zIndex: 1,
              }}>Tasks</span>
              <div style={{
                position: "absolute",
                left: "74px",
                top: 0,
                width: "160px",
                height: "100%",
                background: "repeating-linear-gradient(-60deg, transparent, transparent 4px, rgba(255,255,255,0.07) 4px, rgba(255,255,255,0.07) 8px)",
                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)",
                maskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)",
              }} />
            </div>

            <div style={{ flex: 1 }} />

            {/* + New button */}
            <button
              onClick={() => !isAuthenticated ? undefined : setShowNewTask(true)}
              title={!isAuthenticated ? "Sign in to create tasks" : undefined}
              style={{
                background: "transparent",
                color: !isAuthenticated ? "rgba(91,184,224,0.35)" : "#5bb8e0",
                fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase",
                fontWeight: 600, padding: "0 20px",
                cursor: !isAuthenticated ? "default" : "pointer",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => { if (!isAuthenticated) return; e.currentTarget.style.color = "#8dd0ea"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#5bb8e0"; }}
            >
              + New
            </button>
          </div>

          <div className="flex items-center mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => applyFilter(f.value)}
                className="px-4 py-3 text-xs tracking-wider uppercase cursor-pointer transition-colors relative flex items-center gap-1.5"
                style={{ color: activeFilter === f.value ? "#5bb8e0" : "rgba(255,255,255,0.65)", background: "transparent", border: "none" }}
              >
                {f.label}
                {f.value === "completed" && unsubmitted.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#f59e0b" }} />
                )}
                {activeFilter === f.value && (
                  <span className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "#5bb8e0" }} />
                )}
              </button>
            ))}
            <div className="flex-1" />
            <div className="relative mb-px mr-1">
              {showSortMenu && (
                <div className="fixed inset-0 z-[15]" onClick={() => setShowSortMenu(false)} />
              )}
              <button
                onClick={() => { setShowGroupMenu(false); setShowSortMenu((v) => !v); }}
                className="text-[9px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5"
                style={{
                  color: sortMode !== "due" ? "#5bb8e0" : "rgba(255,255,255,0.35)",
                  background: sortMode !== "due" ? "rgba(91,184,224,0.08)" : "transparent",
                  border: `1px solid ${sortMode !== "due" ? "rgba(91,184,224,0.3)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "2px",
                  position: "relative",
                  zIndex: 16,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <line x1="1" y1="2" x2="9" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="1" y1="5" x2="7" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="1" y1="8" x2="5" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                {sortMode === "due" ? "Sort" : sortMode === "priority" ? "Priority" : sortMode === "title" ? "Title" : "Points"}
                <svg width="7" height="5" viewBox="0 0 7 5" fill="none" style={{ opacity: 0.6 }}>
                  <polyline points="0.5,1 3.5,4 6.5,1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {showSortMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    zIndex: 20,
                    background: "#23242a",
                    border: "1px solid #3a3b3f",
                    borderRadius: "3px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
                    minWidth: "120px",
                    overflow: "hidden",
                  }}
                >
                  {([ ["due", "Due Date"], ["priority", "Priority"], ["title", "Title"], ["points", "Points"] ] as [SortMode, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => { setSortMode(value); setShowSortMenu(false); }}
                      className="w-full flex items-center gap-2 cursor-pointer"
                      style={{
                        padding: "8px 12px",
                        background: "transparent",
                        border: "none",
                        color: sortMode === value ? "#5bb8e0" : "rgba(255,255,255,0.6)",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: sortMode === value ? "#5bb8e0" : "rgba(255,255,255,0.18)", display: "inline-block" }} />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative mb-px mr-0.5">
              {showGroupMenu && (
                <div className="fixed inset-0 z-[15]" onClick={() => setShowGroupMenu(false)} />
              )}
              <button
                onClick={() => { setShowSortMenu(false); setShowGroupMenu((v) => !v); }}
                className="text-[9px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5"
                style={{
                  color: groupMode !== "none" ? "#5bb8e0" : "rgba(255,255,255,0.35)",
                  background: groupMode !== "none" ? "rgba(91,184,224,0.08)" : "transparent",
                  border: `1px solid ${groupMode !== "none" ? "rgba(91,184,224,0.3)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "2px",
                  position: "relative",
                  zIndex: 16,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <line x1="1" y1="2" x2="9" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="1" y1="5" x2="6" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="1" y1="8" x2="7.5" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                {groupMode === "type" ? "Type" : groupMode === "due" ? "Due Date" : groupMode === "category" ? "Category" : "Group"}
                <svg width="7" height="5" viewBox="0 0 7 5" fill="none" style={{ opacity: 0.6 }}>
                  <polyline points="0.5,1 3.5,4 6.5,1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {showGroupMenu && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    zIndex: 20,
                    background: "#23242a",
                    border: "1px solid #3a3b3f",
                    borderRadius: "3px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
                    minWidth: "120px",
                    overflow: "hidden",
                  }}
                >
                  {([ ["none", "None"], ["type", "Type"], ["due", "Due Date"], ["category", "Category"] ] as [GroupMode, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => { setGroupMode(value); setShowGroupMenu(false); }}
                      className="w-full flex items-center gap-2 cursor-pointer"
                      style={{
                        padding: "8px 12px",
                        background: "transparent",
                        border: "none",
                        color: groupMode === value ? "#5bb8e0" : "rgba(255,255,255,0.6)",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: groupMode === value ? "#5bb8e0" : "rgba(255,255,255,0.18)", display: "inline-block" }} />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            className="grid text-[10px] tracking-widest uppercase px-4 py-2 select-none"
            style={{ gridTemplateColumns: "1fr 64px 80px", color: "rgba(255,255,255,0.55)", position: "relative", zIndex: 2, background: "#1e1f22" }}
          >
            <span>Name</span>
            <span className="text-center">Due</span>
            <span className="text-center">Points</span>
          </div>

          {error && (
            <div className="error-banner-anim px-4 py-3 mb-2 text-xs text-red-400" style={{ background: "#1e1e1e" }}>
              {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-5 h-5 border-2 border-[#333] border-t-[#5bb8e0] rounded-full animate-spin" />
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-sm tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>No items</p>
            </div>
          )}

          {!loading && activeFilter === "in_progress" && listItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-sm tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>No tasks in progress</p>
            </div>
          )}

          {activeFilter === "completed" && !loading && (
            <div className="flex justify-between items-center px-1 mb-1" style={{ visibility: unsubmitted.length > 0 ? "visible" : "hidden" }}>
              <div className="flex items-center gap-1.5" title={`${unsubmitted.length} task${unsubmitted.length === 1 ? "" : "s"} pending submission`}>
                <svg width="9" height="11" viewBox="0 0 10 12" fill="none">
                  <polygon points="5,0 10,4 5,12 0,4" fill="#f59e0b" opacity="0.85" />
                </svg>
                <span style={{ color: "rgba(245,158,11,0.9)", fontSize: "10px", fontWeight: 600, letterSpacing: "0.05em" }}>
                  {unsubmitted.reduce((s, t) => s + t.pointValue, 0).toLocaleString()}
                </span>
                <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
                  Unsubmitted
                </span>
              </div>
              <button
                onClick={() => {
                  if (allUnsubmittedSelected) {
                    setSelectedIds((prev) => { const n = new Set(prev); unsubmitted.forEach((t) => n.delete(t.taskId)); return n; });
                  } else {
                    setSelectedIds((prev) => new Set([...prev, ...unsubmitted.map((t) => t.taskId)]));
                  }
                }}
                className="text-[9px] tracking-widest uppercase cursor-pointer transition-colors"
                style={{ color: allUnsubmittedSelected ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.35)", background: "transparent", border: "none" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = allUnsubmittedSelected ? "#f59e0b" : "rgba(255,255,255,0.6)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = allUnsubmittedSelected ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.35)")}
              >
                {allUnsubmittedSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
          )}

          <div className="flex flex-col gap-1">
            {!loading && listItems.map((item) => {
              if ("__sep" in item) {
                const s = item as Sep;
                return (
                  <div key={s.sepKey} className="flex items-center gap-3 px-1 mt-2 mb-1">
                    <span className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</span>
                    <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                  </div>
                );
              }
              return (
                <TaskRow
                  key={item.taskId}
                  task={item}
                  activeFilter={activeFilter}
                  advancing={advancing}
                  pausing={pausing}
                  slashingId={slashingId}
                  filingIds={filingIds}
                  recentlyFiledIds={recentlyFiledIds}
                  selectedIds={selectedIds}
                  submittedTaskIds={submittedTaskIds}
                  recurringPopup={recurringPopups.get(item.taskId)}
                  penalizedTaskIds={penalizedTaskIds}
                  onAdvance={handleAdvance}
                  onCheckIn={handleCheckIn}
                  onPause={handlePause}
                  onDelete={handleDelete}
                  onSkip={handleSkip}
                  onToggleSelect={toggleSelect}
                  onOpenDetail={setDetailTask}
                  onRestartOverdue={(t) => { setOverdueRestartTaskId(t.taskId); setDetailTask(t); }}
                />
              );
            })}
          </div>

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

      <SubmitBar
        visible={submitBarVisible}
        selectedCount={selectedIds.size}
        selectedPts={selectedPts}
        willAward={willAward}
        remaining={remaining}
        recurringRemaining={recurringRemaining}
        isSubmitting={isSubmitting}
        limitReached={limitReached}
        capped={capped}
        onSubmit={handleSubmit}
      />

      {detailTask && (() => {
        const dt = detailTask;
        const dtCanUndo = dt.status === "completed" && dt.submitted === false && !dt.pointsAwarded && !submittedTaskIds.has(dt.taskId);
        const isRestart = overdueRestartTaskId === dt.taskId;
        const closeDetail = () => { setOverdueRestartTaskId(null); setDetailTask(null); };
        return (
          <TaskDetailModal
            task={dt}
            currentStreakCount={dt.currentStreakCount}
            longestStreakCount={dt.longestStreakCount}
            onClose={closeDetail}
            canUndo={dtCanUndo}
            isActing={advancing === dt.taskId || pausing === dt.taskId || slashingId === dt.taskId}
            onStart={dt.status === "pending" && !dt.isRecurring ? () => { closeDetail(); handleAdvance(dt); } : undefined}
            onCheckIn={dt.status === "pending" && dt.isRecurring && canCheckInNow(dt.dueDate, dt.recurrenceRule) ? () => { closeDetail(); handleCheckIn(dt); } : undefined}
            checkInBlocked={dt.status === "pending" && dt.isRecurring && !canCheckInNow(dt.dueDate, dt.recurrenceRule)}
            onPause={dt.status === "in_progress" ? () => { closeDetail(); handlePause(dt); } : undefined}
            onComplete={dt.status === "in_progress" ? () => { closeDetail(); handleAdvance(dt); } : undefined}
            onUndo={dtCanUndo ? () => { closeDetail(); handleAdvance(dt); } : undefined}
            onDelete={() => { closeDetail(); handleDelete(dt.taskId); }}
            onSave={handleSaveTask}
            initialEditMode={isRestart}
            mustReschedule={isRestart}
          />
        );
      })()}

      {showNewTask && (
        <NewTaskModal
          onClose={() => setShowNewTask(false)}
          onCreated={(task) => { setTasks((prev) => [task, ...prev]); setShowNewTask(false); }}
        />
      )}

      {showCapWarning && (
        <CapWarningModal
          selectedPts={selectedPts}
          willAward={willAward}
          remaining={remaining}
          onClose={() => setShowCapWarning(false)}
          onConfirm={doSubmit}
        />
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
