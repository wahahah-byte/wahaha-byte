"use client";

import { useCallback, useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { tasksApi, TaskDto, TaskFilterParams, UpdateTaskRequest } from "@/lib/api/tasks";
import NewTaskModal from "@/components/NewTaskModal";
import TaskDetailModal, { EditableTaskFields } from "@/components/TaskDetailModal";
import TaskRow from "@/components/TaskRow";
import { useTaskActions } from "@/hooks/useTaskActions";
import { canCheckInNow, isOverdue } from "@/lib/dateUtils";
import { RECURRING_FILTERS } from "@/lib/constants";
import { useToast } from "@/context/ToastContext";
import CategoryCapsTooltip from "@/components/CategoryCapsTooltip";
import MobileActionBarRecurring from "@/components/MobileActionBarRecurring";
import PullToRefreshIndicator from "@/components/PullToRefreshIndicator";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

const MOCK_RECURRING: TaskDto[] = [
  { taskId: "r1", userId: "demo", title: "Morning workout", description: "30 min cardio or strength training", category: "Fitness", priority: "high", status: "pending", pointValue: 3, dueDate: "2026-05-05", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 12, longestStreakCount: 15 },
  { taskId: "r2", userId: "demo", title: "Read 30 minutes", description: null, category: "Learning", priority: "medium", status: "pending", pointValue: 2, dueDate: "2026-05-05", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekdays", submitted: false, currentStreakCount: 8, longestStreakCount: 21 },
  { taskId: "r3", userId: "demo", title: "Weekly review & planning", description: "Review last week, plan the next", category: "Productivity", priority: "high", status: "pending", pointValue: 5, dueDate: "2026-05-08", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekly", submitted: false, currentStreakCount: 5, longestStreakCount: 5 },
  { taskId: "r4", userId: "demo", title: "Monthly budget review", description: null, category: "Finance", priority: "high", status: "pending", pointValue: 5, dueDate: "2026-05-15", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "monthly", submitted: false },
  // Streak tier showcase
  { taskId: "r5", userId: "demo", title: "10-minute meditation", description: "Sit, breathe, settle", category: "Wellness", priority: "medium", status: "pending", pointValue: 3, dueDate: "2026-05-05", createdAt: "2026-04-04T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 31, longestStreakCount: 31 },
  { taskId: "r6", userId: "demo", title: "Spanish — Duolingo", description: "Maintain the streak", category: "Learning", priority: "medium", status: "pending", pointValue: 2, dueDate: "2026-05-05", createdAt: "2026-04-12T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 22, longestStreakCount: 22 },
  { taskId: "r7", userId: "demo", title: "Floss", description: "One more day to 2.0x", category: "Wellness", priority: "low", status: "pending", pointValue: 1, dueDate: "2026-05-05", createdAt: "2026-04-05T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 29, longestStreakCount: 29 },
  { taskId: "r8", userId: "demo", title: "5-min stretch", description: null, category: "Fitness", priority: "low", status: "pending", pointValue: 1, dueDate: "2026-05-05", createdAt: "2026-04-29T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 6, longestStreakCount: 9 },
];

function tabMatches(task: TaskDto, tab: string): boolean {
  if (tab === "all") return true;
  if (tab === "today") return canCheckInNow(task.dueDate, task.recurrenceRule, task.lastCheckInDate);
  if (tab === "missed") return isOverdue(task.dueDate);
  if (tab === "upcoming")
    return !canCheckInNow(task.dueDate, task.recurrenceRule, task.lastCheckInDate) && !isOverdue(task.dueDate);
  return true;
}

function Recurring() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { setError, setSuccess } = useToast();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showNewTask, setShowNewTask] = useState(false);
  const [detailTask, setDetailTask] = useState<TaskDto | null>(null);
  const [overdueRestartTaskId, setOverdueRestartTaskId] = useState<string | null>(null);
  type GroupMode = "none" | "frequency" | "category";
  const [groupMode, setGroupMode] = useState<GroupMode>("none");
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  type SortMode = "due" | "streak" | "priority" | "title" | "points";
  const [sortMode, setSortMode] = useState<SortMode>("due");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // useTaskActions requires these but recurring tasks aren't selected/staged/submitted.
  const [stagedTaskIds, setStagedTaskIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submittedTaskIds] = useState<Set<string>>(new Set());

  const { advancing, pausing, slashingId, recurringPopups, handleAdvance, handleCheckIn, handlePause, handleDelete, handleSkip } =
    useTaskActions({
      tasks, setTasks, isAuthenticated, activeFilter,
      stagedTaskIds, setStagedTaskIds,
      selectedIds, setSelectedIds,
      submittedTaskIds,
      setError: (msg) => setError(msg),
      setSuccess: (msg) => setSuccess(msg),
    });

  useEffect(() => {
    setIsMounted(true);
    const tab = searchParams.get("tab");
    if (tab && RECURRING_FILTERS.some((f) => f.value === tab)) setActiveFilter(tab);
    const hasToken = !!localStorage.getItem("auth_token");
    setIsAuthenticated(hasToken);
    if (!hasToken) {
      setTasks(MOCK_RECURRING);
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    if (!isAuthenticated) {
      setTasks(MOCK_RECURRING);
      return;
    }
    setError(null);
    const filterParams: TaskFilterParams = { pageSize: 50, pageNumber: 1, isRecurring: true };
    const taskResult = await tasksApi.getAll(filterParams);
    if (taskResult.error) { setError(taskResult.error); return; }
    setTasks(taskResult.data!.data);
  }, [isAuthenticated, setError]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    refetch().finally(() => setLoading(false));
  }, [refetch, isAuthenticated]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { pullY, phase, triggerDistance } = usePullToRefresh(scrollRef, refetch);

  function applyFilter(value: string) {
    setActiveFilter(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("tab");
    else params.set("tab", value);
    const qs = params.toString();
    router.replace(qs ? `/recurring?${qs}` : "/recurring", { scroll: false });
  }

  async function handleSaveTask(fields: EditableTaskFields): Promise<string | null> {
    if (!detailTask) return null;
    const isRestart = overdueRestartTaskId === detailTask.taskId;
    if (!isAuthenticated) {
      const updated = { ...detailTask, ...fields };
      setTasks((prev) => prev.map((t) => t.taskId === detailTask.taskId ? updated : t));
      setDetailTask(updated);
      if (isRestart) { setOverdueRestartTaskId(null); setDetailTask(null); }
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
    if (isRestart) { setOverdueRestartTaskId(null); setDetailTask(null); }
    return null;
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-accent)" }} />
      </div>
    );
  }

  const filteredTasks = tasks.filter((t) => tabMatches(t, activeFilter));

  type Sep = { __sep: true; label: string; sepKey: string };
  const sep = (label: string, sepKey: string): Sep => ({ __sep: true, label, sepKey });

  const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };
  const FREQUENCY_ORDER = ["daily", "weekdays", "weekly", "biweekly", "monthly"];
  const FREQUENCY_LABEL: Record<string, string> = {
    daily: "Daily", weekdays: "Weekdays", weekly: "Weekly", biweekly: "Biweekly", monthly: "Monthly",
  };

  const byDueDate = (a: TaskDto, b: TaskDto) => {
    if (!a.dueDate && !b.dueDate) return 0;
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return a.dueDate.localeCompare(b.dueDate);
  };
  const sortRecurring = (a: TaskDto, b: TaskDto): number => {
    const aReady = canCheckInNow(a.dueDate, a.recurrenceRule, a.lastCheckInDate) ? 0 : 1;
    const bReady = canCheckInNow(b.dueDate, b.recurrenceRule, b.lastCheckInDate) ? 0 : 1;
    if (aReady !== bReady) return aReady - bReady;
    switch (sortMode) {
      case "streak":   return (b.currentStreakCount ?? 0) - (a.currentStreakCount ?? 0);
      case "priority": return (PRIORITY_ORDER[a.priority.toLowerCase()] ?? 3) - (PRIORITY_ORDER[b.priority.toLowerCase()] ?? 3);
      case "title":    return a.title.localeCompare(b.title);
      case "points":   return b.pointValue - a.pointValue;
      default:         return byDueDate(a, b);
    }
  };

  const listItems: (TaskDto | Sep)[] = (() => {
    if (groupMode === "frequency") {
      const buckets = new Map<string, TaskDto[]>();
      for (const t of filteredTasks) {
        const key = t.recurrenceRule ?? "__none";
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key)!.push(t);
      }
      const keys = [...buckets.keys()].sort((a, b) => {
        const ai = FREQUENCY_ORDER.indexOf(a);
        const bi = FREQUENCY_ORDER.indexOf(b);
        if (ai === -1 && bi === -1) return a.localeCompare(b);
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      });
      const items: (TaskDto | Sep)[] = [];
      for (const key of keys) {
        const label = FREQUENCY_LABEL[key] ?? key;
        items.push(sep(label, `__sep-freq-${key}`), ...buckets.get(key)!.sort(sortRecurring));
      }
      return items;
    }
    if (groupMode === "category") {
      const buckets = new Map<string, TaskDto[]>();
      for (const t of filteredTasks) {
        const key = t.category || "__none";
        if (!buckets.has(key)) buckets.set(key, []);
        buckets.get(key)!.push(t);
      }
      const keys = [...buckets.keys()].sort((a, b) => {
        if (a === "__none") return 1;
        if (b === "__none") return -1;
        return a.localeCompare(b);
      });
      const items: (TaskDto | Sep)[] = [];
      for (const key of keys) {
        const label = key === "__none" ? "No Category" : key;
        items.push(sep(label, `__sep-cat-${key}`), ...buckets.get(key)!.sort(sortRecurring));
      }
      return items;
    }
    return [...filteredTasks].sort(sortRecurring);
  })();

  const todayCount = tasks.filter((t) => canCheckInNow(t.dueDate, t.recurrenceRule, t.lastCheckInDate)).length;
  const missedCount = tasks.filter((t) => isOverdue(t.dueDate)).length;

  return (
    <>
      <div className="recurring-scope task-page-shell flex flex-col bg-scanlines overflow-hidden" style={{ background: "var(--color-bg)", color: "var(--color-fg)" }}>
        <div className="max-w-3xl w-full mx-auto px-4 flex flex-col flex-1 overflow-hidden">
          {!isAuthenticated && (
            <div className="flex items-center justify-between mt-3 mb-3 px-3 py-2 text-[10px] tracking-widest uppercase" style={{ background: "rgba(91,184,224,0.07)", border: "1px solid rgba(91,184,224,0.18)", borderRadius: "3px" }}>
              <span style={{ color: "rgba(91,184,224,0.75)" }}>Demo · changes are not saved</span>
              <Link href="/login" style={{ color: "var(--color-accent)", letterSpacing: "0.18em" }}>Sign in →</Link>
            </div>
          )}

          <div style={{ paddingTop: 22, background: "var(--color-bg)" }}>
          <div style={{ display: "flex", alignItems: "stretch", background: "var(--color-surface)", marginBottom: "22px", height: "38px" }}>
            <CategoryCapsTooltip variant="recurring">
              <div
                tabIndex={0}
                aria-label="Show recurring point caps"
                style={{
                  width: "38px", minWidth: "38px", height: "38px",
                  background: "var(--color-surface-2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRight: "1px solid var(--color-border-hairline)",
                  cursor: "help",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                  fill="none" style={{ stroke: "var(--color-fg)" }} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-3-6.7" />
                  <polyline points="21 4 21 10 15 10" />
                </svg>
              </div>
            </CategoryCapsTooltip>

            <div style={{ position: "relative", display: "flex", alignItems: "center", paddingLeft: "14px", overflow: "hidden" }}>
              <span style={{
                fontSize: "12px", fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "var(--color-fg)",
                whiteSpace: "nowrap", position: "relative", zIndex: 1,
              }}>Recurring</span>
              <div style={{
                position: "absolute",
                left: "108px",
                top: 0,
                width: "160px",
                height: "100%",
                background: "repeating-linear-gradient(-60deg, transparent, transparent 4px, var(--color-border-hairline) 4px, var(--color-border-hairline) 8px)",
                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)",
                maskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)",
              }} />
            </div>

            <div style={{ flex: 1 }} />

            <div className="hidden sm:flex items-center">
              <button
                onClick={() => !isAuthenticated ? undefined : setShowNewTask(true)}
                disabled={!isAuthenticated}
                title={!isAuthenticated ? "Sign in to create tasks" : undefined}
                className="pixel-btn"
                style={{
                  fontSize: "11px",
                  alignSelf: "center",
                  margin: "0 6px",
                  padding: "5px 14px",
                }}
              >
                + New
              </button>
            </div>
          </div>

          <div className="hidden sm:flex items-center mb-2" style={{ borderBottom: "1px solid var(--color-border-faint)" }}>
            <div className="flex items-center">
              {RECURRING_FILTERS.map((f) => {
                const dotCount = f.value === "today" ? todayCount : f.value === "missed" ? missedCount : 0;
                const dotColor = f.value === "today" ? "var(--color-active-highlight-alt)" : "var(--color-danger)";
                return (
                  <button
                    key={f.value}
                    onClick={() => applyFilter(f.value)}
                    className="px-4 py-3 text-xs tracking-wider uppercase cursor-pointer transition-colors relative flex items-center gap-1.5 whitespace-nowrap"
                    style={{ color: activeFilter === f.value ? "var(--color-active-highlight)" : "var(--color-fg-muted)", background: "transparent", border: "none" }}
                  >
                    {f.label}
                    {dotCount > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                    )}
                    {activeFilter === f.value && (
                      <span className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--color-active-highlight)" }} />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex-1" />
            <div className="relative mb-px mr-1">
              {showSortMenu && (
                <div className="fixed inset-0 z-[15]" onClick={() => setShowSortMenu(false)} />
              )}
              <button
                onClick={() => { setShowGroupMenu(false); setShowSortMenu((v) => !v); }}
                className="text-[9px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5"
                style={{
                  color: sortMode !== "due" ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                  background: sortMode !== "due" ? "var(--color-active-highlight-bg)" : "transparent",
                  border: `1px solid ${sortMode !== "due" ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
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
                <span className="hidden sm:inline">{sortMode === "due" ? "Sort" : sortMode === "streak" ? "Streak" : sortMode === "priority" ? "Priority" : sortMode === "title" ? "Title" : "Points"}</span>
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
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "3px",
                    boxShadow: "var(--shadow-popover)",
                    minWidth: "120px",
                    overflow: "hidden",
                  }}
                >
                  {([ ["due", "Next"], ["streak", "Streak"], ["priority", "Priority"], ["title", "Title"], ["points", "Points"] ] as [SortMode, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => { setSortMode(value); setShowSortMenu(false); }}
                      className="w-full flex items-center gap-2 cursor-pointer"
                      style={{
                        padding: "8px 12px",
                        background: "transparent",
                        border: "none",
                        color: sortMode === value ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-overlay-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: sortMode === value ? "var(--color-active-highlight)" : "var(--color-border-faint)", display: "inline-block" }} />
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
                  color: groupMode !== "none" ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                  background: groupMode !== "none" ? "var(--color-active-highlight-bg)" : "transparent",
                  border: `1px solid ${groupMode !== "none" ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
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
                <span className="hidden sm:inline">{groupMode === "frequency" ? "Frequency" : groupMode === "category" ? "Category" : "Group"}</span>
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
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "3px",
                    boxShadow: "var(--shadow-popover)",
                    minWidth: "120px",
                    overflow: "hidden",
                  }}
                >
                  {([ ["none", "None"], ["frequency", "Frequency"], ["category", "Category"] ] as [GroupMode, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => { setGroupMode(value); setShowGroupMenu(false); }}
                      className="w-full flex items-center gap-2 cursor-pointer"
                      style={{
                        padding: "8px 12px",
                        background: "transparent",
                        border: "none",
                        color: groupMode === value ? "var(--color-active-highlight)" : "var(--color-fg-muted)",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-overlay-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: groupMode === value ? "var(--color-active-highlight)" : "var(--color-border-faint)", display: "inline-block" }} />
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            className="grid text-[10px] tracking-widest uppercase px-4 py-2 select-none"
            style={{ gridTemplateColumns: "1fr 64px 80px", color: "var(--color-fg-muted)", position: "relative", zIndex: 2, background: "var(--color-bg)" }}
          >
            <span>Name</span>
            <span className="text-center">Next</span>
            <span className="text-center">Points</span>
          </div>
          </div>

          <div className="flex-1 overflow-y-auto" ref={scrollRef} style={{ overscrollBehavior: "contain" }}>
            <PullToRefreshIndicator pullY={pullY} phase={phase} triggerDistance={triggerDistance} />

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-active-highlight-alt)" }} />
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-sm tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>No recurring tasks</p>
              {isAuthenticated && (
                <button
                  onClick={() => setShowNewTask(true)}
                  className="text-[10px] tracking-widest uppercase mt-2 cursor-pointer"
                  style={{ color: "var(--color-active-highlight-alt)", background: "transparent", border: "1px solid var(--color-active-highlight-alt-border)", borderRadius: "3px", padding: "6px 14px" }}
                >
                  + Create one
                </button>
              )}
            </div>
          )}

          {!loading && tasks.length > 0 && filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-sm tracking-widest uppercase" style={{ color: "var(--color-fg-subtle)" }}>
                {activeFilter === "today" ? "Nothing due today" :
                 activeFilter === "upcoming" ? "Nothing upcoming" :
                 activeFilter === "missed" ? "Nothing missed" : "No tasks"}
              </p>
            </div>
          )}

          {(() => {
            const chunks: { sep: Sep | null; tasks: TaskDto[] }[] = [];
            let current: { sep: Sep | null; tasks: TaskDto[] } = { sep: null, tasks: [] };
            for (const item of listItems) {
              if ("__sep" in item) {
                if (current.tasks.length > 0 || current.sep !== null) chunks.push(current);
                current = { sep: item, tasks: [] };
              } else {
                current.tasks.push(item);
              }
            }
            if (current.tasks.length > 0 || current.sep !== null) chunks.push(current);
            return !loading && chunks.map((chunk, idx) => (
              <div
                key={chunk.sep?.sepKey ?? `__chunk-${idx}`}
                style={{
                  position: chunk.sep ? "relative" : undefined,
                  marginTop: chunk.sep ? (idx > 0 ? "14px" : "10px") : undefined,
                }}
              >
                {chunk.sep && (
                  <span
                    className="tracking-widest uppercase text-[9px]"
                    style={{
                      position: "absolute",
                      top: "-6px",
                      left: "10px",
                      padding: "0 6px",
                      background: "var(--color-bg)",
                      color: "var(--color-fg-subtle)",
                      lineHeight: 1,
                      zIndex: 1,
                    }}
                  >
                    {chunk.sep.label}
                  </span>
                )}
                {chunk.tasks.length > 0 && (
                  <div className="flex flex-col" style={{ background: "var(--color-surface-deep)", border: "1px solid var(--color-border-soft)", borderRadius: 6, overflow: "hidden" }}>
                    <div className="task-row-wrapper task-row-phantom" aria-hidden="true">
                      <div className="task-row-inner" style={{ position: "absolute", inset: 0 }} />
                    </div>
                    {chunk.tasks.map((item) => (
                      <TaskRow
                        key={item.taskId}
                        task={item}
                        activeFilter="all"
                        advancing={advancing}
                        pausing={pausing}
                        slashingId={slashingId}
                        filingIds={new Set()}
                        recentlyFiledIds={new Set()}
                        selectedIds={new Set()}
                        submittedTaskIds={submittedTaskIds}
                        recurringPopup={recurringPopups.get(item.taskId)}
                        penalizedTaskIds={new Set()}
                        onAdvance={handleAdvance}
                        onCheckIn={handleCheckIn}
                        onPause={handlePause}
                        onDelete={handleDelete}
                        onSkip={handleSkip}
                        onToggleSelect={() => {}}
                        onOpenDetail={setDetailTask}
                        onRestartOverdue={(t) => { setOverdueRestartTaskId(t.taskId); setDetailTask(t); }}
                      />
                    ))}
                    <div className="task-row-wrapper task-row-phantom" aria-hidden="true">
                      <div className="task-row-inner" style={{ position: "absolute", inset: 0 }} />
                    </div>
                  </div>
                )}
              </div>
            ));
          })()}
          </div>

          {!loading && tasks.length > 0 && (
            <div className="flex justify-between items-center mt-2 mb-5 sm:mb-4 px-1 shrink-0">
              <span className="text-[10px] tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>
                {todayCount} ready
              </span>
              <span className="text-[10px] tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>
                {tasks.length} total
              </span>
            </div>
          )}
        </div>
      </div>

      <MobileActionBarRecurring
        filters={RECURRING_FILTERS}
        activeFilter={activeFilter}
        onFilterChange={applyFilter}
        getCount={(v) => tasks.filter((t) => tabMatches(t, v)).length}
        badgeColor={(v) => {
          if (v === "today" && todayCount > 0) return "var(--color-active-highlight-alt)";
          if (v === "missed" && missedCount > 0) return "var(--color-danger)";
          return null;
        }}
        sortMode={sortMode}
        groupMode={groupMode}
        onSortChange={setSortMode}
        onGroupChange={setGroupMode}
        onNewTask={() => setShowNewTask(true)}
        isAuthenticated={isAuthenticated}
      />

      {detailTask && (() => {
        const dt = detailTask;
        const isRestart = overdueRestartTaskId === dt.taskId;
        const closeDetail = () => { setOverdueRestartTaskId(null); setDetailTask(null); };
        return (
          <TaskDetailModal
            task={dt}
            currentStreakCount={dt.currentStreakCount}
            longestStreakCount={dt.longestStreakCount}
            onClose={closeDetail}
            canUndo={false}
            isActing={advancing === dt.taskId || pausing === dt.taskId || slashingId === dt.taskId}
            onCheckIn={canCheckInNow(dt.dueDate, dt.recurrenceRule, dt.lastCheckInDate) ? () => { closeDetail(); handleCheckIn(dt); } : undefined}
            checkInBlocked={!canCheckInNow(dt.dueDate, dt.recurrenceRule, dt.lastCheckInDate)}
            onDelete={() => { closeDetail(); handleDelete(dt.taskId); }}
            onSave={handleSaveTask}
            initialEditMode={isRestart}
            mustReschedule={isRestart}
          />
        );
      })()}

      {showNewTask && (
        <NewTaskModal
          initialRecurring={true}
          onClose={() => setShowNewTask(false)}
          onCreated={(task) => { setTasks((prev) => [task, ...prev]); setShowNewTask(false); }}
        />
      )}
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Recurring />
    </Suspense>
  );
}
