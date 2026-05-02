"use client";

import { useEffect, useState, Suspense } from "react";
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

const MOCK_RECURRING: TaskDto[] = [
  { taskId: "r1", userId: "demo", title: "Morning workout", description: "30 min cardio or strength training", category: "Fitness", priority: "high", status: "pending", pointValue: 3, dueDate: "2026-04-29", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 12, longestStreakCount: 15 },
  { taskId: "r2", userId: "demo", title: "Read 30 minutes", description: null, category: "Learning", priority: "medium", status: "pending", pointValue: 2, dueDate: "2026-04-30", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekdays", submitted: false, currentStreakCount: 8, longestStreakCount: 21 },
  { taskId: "r3", userId: "demo", title: "Weekly review & planning", description: "Review last week, plan the next", category: "Productivity", priority: "high", status: "pending", pointValue: 5, dueDate: "2026-04-26", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekly", submitted: false, currentStreakCount: 5, longestStreakCount: 5 },
  { taskId: "r4", userId: "demo", title: "Monthly budget review", description: null, category: "Finance", priority: "high", status: "pending", pointValue: 5, dueDate: "2026-05-15", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "monthly", submitted: false },
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
  const { setError } = useToast();
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

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchTasks() {
      setLoading(true);
      setError(null);
      const filterParams: TaskFilterParams = { pageSize: 50, pageNumber: 1, isRecurring: true };
      const taskResult = await tasksApi.getAll(filterParams);
      setLoading(false);
      if (taskResult.error) { setError(taskResult.error); return; }
      setTasks(taskResult.data!.data);
    }
    fetchTasks();
  }, [isAuthenticated]);

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#1e1f22" }}>
        <div className="w-5 h-5 border-2 border-[#333] border-t-[#5bb8e0] rounded-full animate-spin" />
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
      <div className="min-h-screen text-white flex flex-col bg-scanlines" style={{ background: "#1e1f22" }}>
        <div className="max-w-3xl w-full mx-auto px-4 py-8 flex flex-col flex-1">
          {!isAuthenticated && (
            <div className="flex items-center justify-between mb-3 px-3 py-2 text-[10px] tracking-widest uppercase" style={{ background: "rgba(91,184,224,0.07)", border: "1px solid rgba(91,184,224,0.18)", borderRadius: "3px" }}>
              <span style={{ color: "rgba(91,184,224,0.75)" }}>Demo · changes are not saved</span>
              <Link href="/login" style={{ color: "#5bb8e0", letterSpacing: "0.18em" }}>Sign in →</Link>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "stretch", background: "#1e2025", marginBottom: "6px", height: "38px" }}>
            <CategoryCapsTooltip variant="recurring">
              <div
                tabIndex={0}
                aria-label="Show recurring point caps"
                style={{
                  width: "38px", minWidth: "38px", height: "38px",
                  background: "#2a2d33",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  borderRight: "1px solid rgba(255,255,255,0.08)",
                  cursor: "help",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
                  fill="none" stroke="rgba(167,139,250,0.85)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-3-6.7" />
                  <polyline points="21 4 21 10 15 10" />
                </svg>
              </div>
            </CategoryCapsTooltip>

            <div style={{ position: "relative", display: "flex", alignItems: "center", paddingLeft: "14px", overflow: "hidden" }}>
              <span style={{
                fontSize: "12px", fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.9)",
                whiteSpace: "nowrap", position: "relative", zIndex: 1,
              }}>Recurring</span>
              <div style={{
                position: "absolute",
                left: "108px",
                top: 0,
                width: "160px",
                height: "100%",
                background: "repeating-linear-gradient(-60deg, transparent, transparent 4px, rgba(167,139,250,0.07) 4px, rgba(167,139,250,0.07) 8px)",
                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)",
                maskImage: "linear-gradient(to right, rgba(0,0,0,0.9) 0%, transparent 100%)",
              }} />
            </div>

            <div style={{ flex: 1 }} />

            <button
              onClick={() => !isAuthenticated ? undefined : setShowNewTask(true)}
              title={!isAuthenticated ? "Sign in to create tasks" : undefined}
              style={{
                background: "transparent",
                color: !isAuthenticated ? "rgba(167,139,250,0.35)" : "#a78bfa",
                fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase",
                fontWeight: 600, padding: "0 20px",
                cursor: !isAuthenticated ? "default" : "pointer",
                borderLeft: "1px solid rgba(255,255,255,0.08)",
                transition: "color 0.15s",
              }}
              onMouseEnter={(e) => { if (!isAuthenticated) return; e.currentTarget.style.color = "#bfa8ff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#a78bfa"; }}
            >
              + New
            </button>
          </div>

          <div className="flex items-center mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
            {RECURRING_FILTERS.map((f) => {
              const dotCount = f.value === "today" ? todayCount : f.value === "missed" ? missedCount : 0;
              const dotColor = f.value === "today" ? "#a78bfa" : "#ef4444";
              return (
                <button
                  key={f.value}
                  onClick={() => applyFilter(f.value)}
                  className="px-2 sm:px-4 py-3 text-[11px] sm:text-xs tracking-wide sm:tracking-wider uppercase cursor-pointer transition-colors relative flex items-center gap-1.5 whitespace-nowrap"
                  style={{ color: activeFilter === f.value ? "#a78bfa" : "rgba(255,255,255,0.65)", background: "transparent", border: "none" }}
                >
                  {f.label}
                  {dotCount > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                  )}
                  {activeFilter === f.value && (
                    <span className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "#a78bfa" }} />
                  )}
                </button>
              );
            })}
            <div className="flex-1" />
            <div className="relative mb-px mr-1">
              {showSortMenu && (
                <div className="fixed inset-0 z-[15]" onClick={() => setShowSortMenu(false)} />
              )}
              <button
                onClick={() => { setShowGroupMenu(false); setShowSortMenu((v) => !v); }}
                className="text-[9px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5"
                style={{
                  color: sortMode !== "due" ? "#a78bfa" : "rgba(255,255,255,0.35)",
                  background: sortMode !== "due" ? "rgba(167,139,250,0.08)" : "transparent",
                  border: `1px solid ${sortMode !== "due" ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.1)"}`,
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
                    background: "#23242a",
                    border: "1px solid #3a3b3f",
                    borderRadius: "3px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
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
                        color: sortMode === value ? "#a78bfa" : "rgba(255,255,255,0.6)",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: sortMode === value ? "#a78bfa" : "rgba(255,255,255,0.18)", display: "inline-block" }} />
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
                  color: groupMode !== "none" ? "#a78bfa" : "rgba(255,255,255,0.35)",
                  background: groupMode !== "none" ? "rgba(167,139,250,0.08)" : "transparent",
                  border: `1px solid ${groupMode !== "none" ? "rgba(167,139,250,0.3)" : "rgba(255,255,255,0.1)"}`,
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
                    background: "#23242a",
                    border: "1px solid #3a3b3f",
                    borderRadius: "3px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.55)",
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
                        color: groupMode === value ? "#a78bfa" : "rgba(255,255,255,0.6)",
                        fontSize: "9px",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        textAlign: "left",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: groupMode === value ? "#a78bfa" : "rgba(255,255,255,0.18)", display: "inline-block" }} />
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
            <span className="text-center">Next</span>
            <span className="text-center">Points</span>
          </div>

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="w-5 h-5 border-2 border-[#333] border-t-[#a78bfa] rounded-full animate-spin" />
            </div>
          )}

          {!loading && tasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-sm tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>No recurring tasks</p>
              {isAuthenticated && (
                <button
                  onClick={() => setShowNewTask(true)}
                  className="text-[10px] tracking-widest uppercase mt-2 cursor-pointer"
                  style={{ color: "#a78bfa", background: "transparent", border: "1px solid rgba(167,139,250,0.4)", borderRadius: "3px", padding: "6px 14px" }}
                >
                  + Create one
                </button>
              )}
            </div>
          )}

          {!loading && tasks.length > 0 && filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-sm tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                {activeFilter === "today" ? "Nothing due today" :
                 activeFilter === "upcoming" ? "Nothing upcoming" :
                 activeFilter === "missed" ? "Nothing missed" : "No tasks"}
              </p>
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
              );
            })}
          </div>

          {!loading && tasks.length > 0 && (
            <div className="flex justify-between items-center mt-2 px-1">
              <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>
                {todayCount} ready
              </span>
              <span className="text-[10px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.55)" }}>
                {tasks.length} total
              </span>
            </div>
          )}
        </div>
      </div>

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
