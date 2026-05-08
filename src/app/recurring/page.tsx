"use client";

import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { tasksApi, TaskDto, TaskFilterParams, UpdateTaskRequest, CheckInCycleDto } from "@/lib/api/tasks";
import NewTaskModal from "@/components/NewTaskModal";
import TaskDetailModal, { EditableTaskFields } from "@/components/TaskDetailModal";
import TaskRow from "@/components/TaskRow";
import CounterPromptModal from "@/components/CounterPromptModal";
import { useTaskActions } from "@/hooks/useTaskActions";
import { canCheckInNow, isOverdue, parseLocalDate, getPrevPeriodStart } from "@/lib/dateUtils";
import { RECURRING_FILTERS } from "@/lib/constants";
import { useToast } from "@/context/ToastContext";
import CategoryCapsTooltip from "@/components/CategoryCapsTooltip";
import MobileActionBarRecurring from "@/components/MobileActionBarRecurring";
import PullToRefreshIndicator from "@/components/PullToRefreshIndicator";
import TierUpBanner from "@/components/TierUpBanner";
import CheckInUndoToast from "@/components/CheckInUndoToast";
import DesktopShell from "@/components/DesktopShell";
import DesktopSidebar from "@/components/DesktopSidebar";
import { CATEGORY_COLOR } from "@/lib/constants";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { withMockCycles } from "@/lib/mockTasks";

const MOCK_RECURRING: TaskDto[] = ([
  { taskId: "r1", userId: "demo", title: "Morning workout", description: "30 min cardio or strength training", category: "Fitness", priority: "high", status: "pending", pointValue: 3, dueDate: "2026-05-05", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 12, longestStreakCount: 15 },
  { taskId: "r2", userId: "demo", title: "Read 30 minutes", description: null, category: "Learning", priority: "medium", status: "pending", pointValue: 2, dueDate: "2026-05-05", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekdays", submitted: false, currentStreakCount: 8, longestStreakCount: 21 },
  { taskId: "r3", userId: "demo", title: "Weekly review & planning", description: "Review last week, plan the next", category: "Productivity", priority: "high", status: "pending", pointValue: 5, dueDate: "2026-05-08", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekly", submitted: false, currentStreakCount: 5, longestStreakCount: 5 },
  { taskId: "r4", userId: "demo", title: "Monthly budget review", description: null, category: "Finance", priority: "high", status: "pending", pointValue: 5, dueDate: "2026-05-15", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "monthly", submitted: false },
  // Streak tier showcase
  { taskId: "r5", userId: "demo", title: "10-minute meditation", description: "Sit, breathe, settle", category: "Wellness", priority: "medium", status: "pending", pointValue: 3, dueDate: "2026-05-05", createdAt: "2026-04-04T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 31, longestStreakCount: 31 },
  { taskId: "r6", userId: "demo", title: "Spanish — Duolingo", description: "Maintain the streak", category: "Learning", priority: "medium", status: "pending", pointValue: 2, dueDate: "2026-05-05", createdAt: "2026-04-12T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 22, longestStreakCount: 22, hasCounter: true, counterUnit: "words" },
  { taskId: "r7", userId: "demo", title: "Floss", description: "One more day to 2.0x", category: "Wellness", priority: "low", status: "pending", pointValue: 1, dueDate: "2026-05-05", createdAt: "2026-04-05T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 29, longestStreakCount: 29 },
  { taskId: "r8", userId: "demo", title: "5-min stretch", description: null, category: "Fitness", priority: "low", status: "pending", pointValue: 1, dueDate: "2026-05-05", createdAt: "2026-04-29T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 6, longestStreakCount: 9 },
] as TaskDto[]).map(withMockCycles);

const EMPTY_SET = new Set<string>();

function tabMatches(task: TaskDto, tab: string): boolean {
  if (tab === "all") return true;
  // Today  = actionable right now (not yet checked in for this cycle).
  // Upcoming = not yet actionable — includes both "already checked in today"
  //            and "not due yet". The undo affordance lives on those rows so
  //            a fresh check-in is reversible from the same place it landed.
  if (tab === "today")
    return canCheckInNow(task.dueDate, task.recurrenceRule, task.lastCheckInDate) && !isOverdue(task.dueDate);
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
  const [counterPromptTask, setCounterPromptTask] = useState<TaskDto | null>(null);
  const [logPromptTask, setLogPromptTask] = useState<TaskDto | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  type GroupMode = "none" | "frequency" | "category";
  const [groupMode, setGroupMode] = useState<GroupMode>("none");
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  type SortMode = "due" | "streak" | "priority" | "title" | "points";
  const [sortMode, setSortMode] = useState<SortMode>("due");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  // Desktop layout (>=1024px) replaces the swipe pager + edge drawer with a
  // 3-column shell. Tracked via matchMedia so we can render the right layout
  // synchronously after hydration.
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Categories present among recurring tasks (for the icon filter strip).
  const availableCategories = useMemo(() => {
    const seen = new Set<string>();
    for (const t of tasks) if (t.category) seen.add(t.category);
    return [...seen].sort();
  }, [tasks]);

  // Drop the active category if the user deletes the last task in it.
  useEffect(() => {
    if (activeCategory && !availableCategories.includes(activeCategory)) {
      setActiveCategory(null);
    }
  }, [activeCategory, availableCategories]);

  function passesCategory(t: TaskDto): boolean {
    return !activeCategory || t.category === activeCategory;
  }

  // useTaskActions requires these but recurring tasks aren't selected/staged/submitted.
  const [stagedTaskIds, setStagedTaskIds] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submittedTaskIds] = useState<Set<string>>(new Set());

  const { advancing, pausing, slashingId, recurringPopups, tierUp, dismissTierUp, handleAdvance, handleCheckIn, handleUndoCheckIn, handleUndoCheckInFromToast, handleDeleteLogCycle, handlePause, handleDelete, handleSkip, undoableCheckIn, dismissUndoableCheckIn } =
    useTaskActions({
      tasks, setTasks, isAuthenticated,
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

  const [activeScrollEl, setActiveScrollEl] = useState<HTMLDivElement | null>(null);
  const scrollRefForPtr = useMemo(() => ({ current: activeScrollEl }), [activeScrollEl]);
  const pagerRef = useRef<HTMLDivElement>(null);
  const { pullY, phase, triggerDistance } = usePullToRefresh(scrollRefForPtr, refetch);

  function applyFilter(value: string) {
    setActiveFilter(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("tab");
    else params.set("tab", value);
    const qs = params.toString();
    router.replace(qs ? `/recurring?${qs}` : "/recurring", { scroll: false });
  }

  // Stable callbacks so TaskRow's React.memo can skip re-renders when only
  // activeFilter changes (e.g. swiping the filter strip).
  const handleSubtasksChange = useCallback((taskId: string, subtasks: import("@/lib/api/tasks").Subtask[]) => {
    setTasks((prev) => prev.map((tt) => tt.taskId === taskId ? { ...tt, subtasks } : tt));
  }, []);

  const handleRestartOverdue = useCallback((t: TaskDto) => {
    setOverdueRestartTaskId(t.taskId);
    setDetailTask(t);
  }, []);

  const requestCheckIn = useCallback((t: TaskDto) => {
    if (t.hasCounter) {
      setCounterPromptTask(t);
      return;
    }
    handleCheckIn(t);
  }, [handleCheckIn]);

  const requestLog = useCallback((t: TaskDto) => {
    setLogPromptTask(t);
  }, []);

  const submitLog = useCallback(async (value: number) => {
    const t = logPromptTask;
    if (!t) return;
    setLogPromptTask(null);
    const appendCycle = (cycle: CheckInCycleDto) => {
      setTasks((prev) => prev.map((x) => x.taskId === t.taskId
        ? { ...x, recentCycles: [cycle, ...(x.recentCycles ?? [])] }
        : x));
      setDetailTask((curr) => curr && curr.taskId === t.taskId
        ? { ...curr, recentCycles: [cycle, ...(curr.recentCycles ?? [])] }
        : curr);
    };
    if (!isAuthenticated) {
      const now = new Date();
      appendCycle({
        cycleId: -now.getTime(),
        taskId: t.taskId,
        checkInDate: now.toISOString(),
        counterValue: value,
        createdAt: now.toISOString(),
      });
      setHistoryRefreshKey((k) => k + 1);
      return;
    }
    const { data, error } = await tasksApi.logCounter(t.taskId, value);
    if (error) { setError(error); return; }
    if (data) appendCycle(data);
    setHistoryRefreshKey((k) => k + 1);
  }, [logPromptTask, isAuthenticated, setError]);

  const noopToggle = useCallback(() => {}, []);

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
      hasCounter: fields.hasCounter ?? detailTask.hasCounter ?? false,
      counterUnit: fields.counterUnit !== undefined ? fields.counterUnit : (detailTask.counterUnit ?? null),
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

  function buildListItemsForFilter(filterValue: string): (TaskDto | Sep)[] {
    const filtered = tasks.filter((t) => tabMatches(t, filterValue) && passesCategory(t));
    if (groupMode === "frequency") {
      const buckets = new Map<string, TaskDto[]>();
      for (const t of filtered) {
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
      for (const t of filtered) {
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
    return [...filtered].sort(sortRecurring);
  }

  function renderFilterPage(filterValue: string) {
    const filtered = tasks.filter((t) => tabMatches(t, filterValue) && passesCategory(t));
    if (tasks.length > 0 && filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <p className="text-sm tracking-widest uppercase" style={{ color: "var(--color-fg-subtle)" }}>
            {filterValue === "today" ? "Nothing due today" :
             filterValue === "upcoming" ? "Nothing upcoming" :
             filterValue === "missed" ? "Nothing missed" : "No tasks"}
          </p>
        </div>
      );
    }
    const pageItems = buildListItemsForFilter(filterValue);
    const chunks: { sep: Sep | null; tasks: TaskDto[] }[] = [];
    let current: { sep: Sep | null; tasks: TaskDto[] } = { sep: null, tasks: [] };
    for (const item of pageItems) {
      if ("__sep" in item) {
        if (current.tasks.length > 0 || current.sep !== null) chunks.push(current);
        current = { sep: item, tasks: [] };
      } else {
        current.tasks.push(item);
      }
    }
    if (current.tasks.length > 0 || current.sep !== null) chunks.push(current);
    return (
      <div>
        {chunks.map((chunk, idx) => (
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
                  left: "4px",
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
              <div className="task-list-panel flex flex-col" style={{ background: "var(--color-surface-deep)", borderRadius: 6, overflow: "hidden" }}>
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
                    filingIds={EMPTY_SET}
                    recentlyFiledIds={EMPTY_SET}
                    selectedIds={EMPTY_SET}
                    submittedTaskIds={submittedTaskIds}
                    recurringPopup={recurringPopups.get(item.taskId)}
                    penalizedTaskIds={EMPTY_SET}
                    onAdvance={handleAdvance}
                    onCheckIn={requestCheckIn}
                    onPause={handlePause}
                    onDelete={handleDelete}
                    onSkip={handleSkip}
                    onToggleSelect={noopToggle}
                    onOpenDetail={setDetailTask}
                    onRestartOverdue={handleRestartOverdue}
                    onSubtasksChange={handleSubtasksChange}
                    onUndoCheckIn={handleUndoCheckIn}
                    onLog={requestLog}
                  />
                ))}
                <div className="task-row-wrapper task-row-phantom" aria-hidden="true">
                  <div className="task-row-inner" style={{ position: "absolute", inset: 0 }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  const todayCount = tasks.filter((t) => canCheckInNow(t.dueDate, t.recurrenceRule, t.lastCheckInDate) && !isOverdue(t.dueDate)).length;
  const missedCount = tasks.filter((t) => isOverdue(t.dueDate)).length;

  // Per-status counts for the desktop sidebar (respects the active category).
  const filterCounts = RECURRING_FILTERS.reduce((acc, f) => {
    acc[f.value] = tasks.filter((t) => tabMatches(t, f.value) && passesCategory(t)).length;
    return acc;
  }, {} as Record<string, number>);

  // Detail panel — rendered inline on desktop, as a modal on mobile.
  const taskDetailNode = (() => {
    if (!detailTask) return null;
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
        onCheckIn={canCheckInNow(dt.dueDate, dt.recurrenceRule, dt.lastCheckInDate) ? () => { closeDetail(); requestCheckIn(dt); } : undefined}
        checkInBlocked={!canCheckInNow(dt.dueDate, dt.recurrenceRule, dt.lastCheckInDate)}
        onLog={dt.hasCounter ? () => requestLog(dt) : undefined}
        historyRefreshKey={historyRefreshKey}
        onDelete={() => { closeDetail(); handleDelete(dt.taskId); }}
        onSave={handleSaveTask}
        onSubtasksChange={(subtasks) => setTasks((prev) => prev.map((t) => t.taskId === dt.taskId ? { ...t, subtasks } : t))}
        onUndoCheckIn={async (cycleId) => {
          const data = await handleUndoCheckIn(dt, cycleId);
          setDetailTask((curr) => {
            if (!curr || curr.taskId !== dt.taskId) return curr;
            const cycles = (curr.recentCycles ?? []).filter((c) => c.cycleId !== cycleId);
            if (!data) return { ...curr, recentCycles: cycles, lastCheckInDate: null };
            const restoredDueDate = data.previousDueDate
              || (curr.dueDate && curr.recurrenceRule
                ? (() => {
                    const prev = getPrevPeriodStart(parseLocalDate(curr.dueDate), curr.recurrenceRule);
                    return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}-${String(prev.getDate()).padStart(2, "0")}`;
                  })()
                : curr.dueDate);
            return {
              ...curr, recentCycles: cycles,
              currentStreakCount: data.streakCount, longestStreakCount: data.longestCount,
              dueDate: restoredDueDate, lastCheckInDate: data.previousLastCheckInDate || null,
            };
          });
          setHistoryRefreshKey((k) => k + 1);
        }}
        onDeleteLogCycle={async (cycleId) => {
          await handleDeleteLogCycle(dt, cycleId);
          setDetailTask((curr) => curr && curr.taskId === dt.taskId
            ? { ...curr, recentCycles: (curr.recentCycles ?? []).filter((c) => c.cycleId !== cycleId) }
            : curr);
          setHistoryRefreshKey((k) => k + 1);
        }}
        initialEditMode={isRestart}
        mustReschedule={isRestart}
        inline={isDesktop}
      />
    );
  })();

  // Top-level overlays/banners shared by both layouts.
  const sharedOverlays = (
    <>
      {showNewTask && (
        <NewTaskModal
          initialRecurring={true}
          onClose={() => setShowNewTask(false)}
          onCreated={(task) => { setTasks((prev) => [task, ...prev]); setShowNewTask(false); }}
        />
      )}
      {counterPromptTask && (
        <CounterPromptModal
          taskTitle={counterPromptTask.title}
          unit={counterPromptTask.counterUnit}
          recentValues={(counterPromptTask.recentCycles ?? []).map((c) => c.counterValue).filter((v): v is number => typeof v === "number")}
          onClose={() => setCounterPromptTask(null)}
          onSubmit={(value) => {
            const t = counterPromptTask;
            setCounterPromptTask(null);
            handleCheckIn(t, value);
          }}
        />
      )}
      {logPromptTask && (
        <CounterPromptModal
          taskTitle={logPromptTask.title}
          unit={logPromptTask.counterUnit}
          mode="log"
          recentValues={(logPromptTask.recentCycles ?? []).map((c) => c.counterValue).filter((v): v is number => typeof v === "number")}
          onClose={() => setLogPromptTask(null)}
          onSubmit={(value) => { if (value !== undefined) submitLog(value); }}
        />
      )}
      <TierUpBanner message={tierUp} onDone={dismissTierUp} />
      {undoableCheckIn && (() => {
        const t = tasks.find((x) => x.taskId === undoableCheckIn.taskId);
        if (!t) return null;
        return (
          <CheckInUndoToast
            taskTitle={undoableCheckIn.taskTitle}
            onUndo={() => handleUndoCheckInFromToast(t, undoableCheckIn.cycleId)}
            onDismiss={dismissUndoableCheckIn}
          />
        );
      })()}
    </>
  );

  if (isDesktop) {
    const label = RECURRING_FILTERS.find((f) => f.value === activeFilter)?.label ?? "Recurring";
    const sidebar = (
      <DesktopSidebar
        navItems={[
          { href: "/", label: "Today", icon: <NavIconList /> },
          { href: "/recurring", label: "Recurring", icon: <NavIconRepeat />, active: true },
          { href: "/archive", label: "Archive", icon: <NavIconArchive /> },
        ]}
        filterGroups={[
          {
            title: "View",
            groupKey: "status",
            onSelect: applyFilter,
            items: RECURRING_FILTERS.map((f) => ({
              value: f.value,
              label: f.label,
              count: filterCounts[f.value] ?? 0,
              active: f.value === activeFilter,
              dotColor: f.value === "today" && todayCount > 0 ? "var(--color-active-highlight-alt)" : f.value === "missed" && missedCount > 0 ? "var(--color-danger)" : null,
            })),
          },
          ...(availableCategories.length ? [{
            title: "Categories",
            groupKey: "categories",
            onSelect: (v: string) => setActiveCategory((prev) => prev === v ? null : v),
            items: availableCategories.map((cat) => ({
              value: cat,
              label: cat,
              count: tasks.filter((t) => t.category === cat).length,
              dotColor: CATEGORY_COLOR[cat] ?? "var(--color-fg-muted)",
              active: activeCategory === cat,
            })),
          }] : []),
        ]}
      />
    );
    const main = (
      <div className="flex flex-col flex-1 overflow-hidden recurring-scope" style={{ background: "var(--color-bg)" }}>
        {!isAuthenticated && (
          <div className="flex items-center justify-between mx-6 mt-4 mb-2 px-3 py-2 text-[10px] tracking-widest uppercase" style={{ background: "var(--color-active-highlight-bg)", border: "1px solid var(--color-active-highlight-border)", borderRadius: 3 }}>
            <span style={{ color: "var(--color-active-highlight)", opacity: 0.85 }}>Demo · changes are not saved</span>
            <Link href="/login" style={{ color: "var(--color-active-highlight)", letterSpacing: "0.18em", fontWeight: 600 }}>Sign in →</Link>
          </div>
        )}
        <div className="flex items-center justify-between px-6 pt-5 pb-3" style={{ borderBottom: "1px solid var(--color-border-soft)" }}>
          <h1 style={{ fontSize: 16, fontWeight: 700, letterSpacing: "0.04em", color: "var(--color-fg)", margin: 0 }}>
            {label}
            {activeCategory && <span style={{ marginLeft: 10, fontSize: 11, color: "var(--color-fg-muted)", letterSpacing: "0.16em", textTransform: "uppercase" }}>· {activeCategory}</span>}
          </h1>
          <div className="flex items-center gap-1.5">
            <div className="relative mr-1">
              {showSortMenu && (
                <div className="fixed inset-0 z-[15]" onClick={() => setShowSortMenu(false)} />
              )}
              <button
                onClick={() => { setShowGroupMenu(false); setShowSortMenu((v) => !v); }}
                title="Sort"
                aria-label="Sort"
                className="text-[9px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5"
                style={{
                  color: sortMode !== "due" ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                  background: sortMode !== "due" ? "var(--color-active-highlight-bg)" : "transparent",
                  border: `1px solid ${sortMode !== "due" ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                  borderRadius: 2,
                  position: "relative",
                  zIndex: 16,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <line x1="1" y1="2" x2="9" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="1" y1="5" x2="7" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="1" y1="8" x2="5" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span>{sortMode === "due" ? "Sort" : sortMode === "streak" ? "Streak" : sortMode === "priority" ? "Priority" : sortMode === "title" ? "Title" : "Points"}</span>
                <svg width="7" height="5" viewBox="0 0 7 5" fill="none" style={{ opacity: 0.6 }}>
                  <polyline points="0.5,1 3.5,4 6.5,1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {showSortMenu && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 20, background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 3, boxShadow: "var(--shadow-popover)", minWidth: 120, overflow: "hidden" }}>
                  {([ ["due", "Next"], ["streak", "Streak"], ["priority", "Priority"], ["title", "Title"], ["points", "Points"] ] as [SortMode, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => { setSortMode(value); setShowSortMenu(false); }}
                      className="w-full flex items-center gap-2 cursor-pointer"
                      style={{ padding: "8px 12px", background: "transparent", border: "none", color: sortMode === value ? "var(--color-active-highlight)" : "var(--color-fg-muted)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "left" }}
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
            <div className="relative mr-1">
              {showGroupMenu && (
                <div className="fixed inset-0 z-[15]" onClick={() => setShowGroupMenu(false)} />
              )}
              <button
                onClick={() => { setShowSortMenu(false); setShowGroupMenu((v) => !v); }}
                title="Group"
                aria-label="Group"
                className="text-[9px] tracking-widest uppercase cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5"
                style={{
                  color: groupMode !== "none" ? "var(--color-active-highlight)" : "var(--color-fg-subtle)",
                  background: groupMode !== "none" ? "var(--color-active-highlight-bg)" : "transparent",
                  border: `1px solid ${groupMode !== "none" ? "var(--color-active-highlight-border)" : "var(--color-border-hairline)"}`,
                  borderRadius: 2,
                  position: "relative",
                  zIndex: 16,
                }}
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <line x1="1" y1="2" x2="9" y2="2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="1" y1="5" x2="6" y2="5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <line x1="1" y1="8" x2="7.5" y2="8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span>{groupMode === "frequency" ? "Frequency" : groupMode === "category" ? "Category" : "Group"}</span>
                <svg width="7" height="5" viewBox="0 0 7 5" fill="none" style={{ opacity: 0.6 }}>
                  <polyline points="0.5,1 3.5,4 6.5,1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {showGroupMenu && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 20, background: "var(--color-surface)", border: "1px solid var(--color-border)", borderRadius: 3, boxShadow: "var(--shadow-popover)", minWidth: 120, overflow: "hidden" }}>
                  {([ ["none", "None"], ["frequency", "Frequency"], ["category", "Category"] ] as [GroupMode, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => { setGroupMode(value); setShowGroupMenu(false); }}
                      className="w-full flex items-center gap-2 cursor-pointer"
                      style={{ padding: "8px 12px", background: "transparent", border: "none", color: groupMode === value ? "var(--color-active-highlight)" : "var(--color-fg-muted)", fontSize: 9, letterSpacing: "0.15em", textTransform: "uppercase", textAlign: "left" }}
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
            <CategoryCapsTooltip variant="recurring">
              <div tabIndex={0} aria-label="Show task point caps" className="flex items-center justify-center" style={{ width: 26, height: 26, color: "var(--color-fg-muted)", cursor: "help" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M9 16l2 2 4-4" />
                </svg>
              </div>
            </CategoryCapsTooltip>
            <button
              onClick={() => isAuthenticated && setShowNewTask(true)}
              disabled={!isAuthenticated}
              title={!isAuthenticated ? "Sign in to create tasks" : "New recurring task"}
              aria-label="New recurring task"
              className="flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ml-1"
              style={{ width: 28, height: 28, fontSize: 18, lineHeight: 1, background: "transparent", border: "none", color: "var(--color-fg)" }}
            >
              +
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-6 py-4">
          {!loading && renderFilterPage(activeFilter)}
        </div>
      </div>
    );
    return (
      <>
        <DesktopShell
          sidebar={sidebar}
          main={main}
          detail={taskDetailNode}
        />
        {sharedOverlays}
      </>
    );
  }

  return (
    <>
      <div className="recurring-scope task-page-shell flex flex-col bg-scanlines overflow-hidden" style={{ background: "var(--color-bg)", color: "var(--color-fg)" }}>
        <div className="w-full mx-auto px-3 sm:px-4 flex flex-col flex-1 overflow-hidden has-mobile-bottom-pad" style={{ maxWidth: 420 }}>
          {!isAuthenticated && (
            <div className="flex items-center justify-between mt-3 mb-3 px-3 py-2 text-[10px] tracking-widest uppercase" style={{ background: "var(--color-active-highlight-bg)", border: "1px solid var(--color-active-highlight-border)", borderRadius: "3px" }}>
              <span style={{ color: "var(--color-active-highlight)", opacity: 0.85 }}>Demo · changes are not saved</span>
              <Link href="/login" style={{ color: "var(--color-active-highlight)", letterSpacing: "0.18em", fontWeight: 600 }}>Sign in →</Link>
            </div>
          )}

          <div style={{ paddingTop: 32, background: "var(--color-bg)" }}>
            {(() => {
              const label = RECURRING_FILTERS.find((f) => f.value === activeFilter)?.label ?? "Recurring";
              return (
                <div className="mb-3 sm:mb-4 pl-[14px] sm:pl-[20px]">
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: "var(--color-fg)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              );
            })()}
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
            <CategoryCapsTooltip variant="recurring">
              <div
                tabIndex={0}
                aria-label="Show recurring point caps"
                className="flex items-center justify-center mr-1"
                style={{ width: 26, height: 26, color: "var(--color-fg-muted)", cursor: "help" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-3-6.7" />
                  <polyline points="21 4 21 10 15 10" />
                </svg>
              </div>
            </CategoryCapsTooltip>
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
            <button
              onClick={() => !isAuthenticated ? undefined : setShowNewTask(true)}
              disabled={!isAuthenticated}
              title={!isAuthenticated ? "Sign in to create tasks" : "New task"}
              aria-label="New task"
              className="flex items-center justify-center ml-1 mb-px"
              style={{
                width: 26, height: 26,
                fontSize: "18px",
                lineHeight: 1,
                background: "transparent",
                border: "none",
                color: "var(--color-fg)",
                cursor: !isAuthenticated ? "not-allowed" : "pointer",
                opacity: !isAuthenticated ? 0.3 : 1,
                padding: 0,
              }}
              onMouseEnter={(e) => { if (isAuthenticated) e.currentTarget.style.color = "var(--color-active-highlight-alt)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg)")}
            >
              +
            </button>
          </div>

          <div
            className="grid text-[10px] tracking-widest uppercase mx-1 sm:mx-2.5 pl-3 sm:pl-4 pr-0 py-2 select-none"
            style={{ gridTemplateColumns: "1fr 64px 60px", maxWidth: 420, color: "var(--color-fg-muted)", position: "relative", zIndex: 2, background: "var(--color-bg)" }}
          >
            <span className="-ml-0.5 sm:-ml-1.5">Name</span>
            <span className="text-center">Next</span>
            <span className="text-center">Points</span>
          </div>
          </div>

          <div className="flex-1 overflow-hidden">
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

            {!loading && tasks.length > 0 && (
              <div style={{ overflow: "hidden", width: "100%", height: "100%" }}>
                <div
                  ref={pagerRef}
                  style={{
                    display: "flex",
                    width: `${RECURRING_FILTERS.length * 100}%`,
                    height: "100%",
                    transform: `translateX(${-RECURRING_FILTERS.findIndex((f) => f.value === activeFilter) * (100 / RECURRING_FILTERS.length)}%)`,
                    transition: "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
                    willChange: "transform",
                  }}
                >
                  {RECURRING_FILTERS.map((f) => {
                    const isActivePage = f.value === activeFilter;
                    return (
                      <div
                        key={f.value}
                        ref={isActivePage ? setActiveScrollEl : null}
                        className="has-mobile-bottom-pad px-1 sm:px-2.5"
                        style={{
                          flex: `0 0 ${100 / RECURRING_FILTERS.length}%`,
                          minWidth: 0,
                          boxSizing: "border-box",
                          height: "100%",
                          overflowY: "auto",
                          overscrollBehavior: "contain",
                        }}
                      >
                        {isActivePage && <PullToRefreshIndicator pullY={pullY} phase={phase} triggerDistance={triggerDistance} />}
                        {renderFilterPage(f.value)}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileActionBarRecurring
        filters={RECURRING_FILTERS}
        activeFilter={activeFilter}
        onFilterChange={applyFilter}
        getCount={(v) => tasks.filter((t) => tabMatches(t, v) && passesCategory(t)).length}
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
        pagerRef={pagerRef}
        availableCategories={availableCategories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {taskDetailNode}
      {sharedOverlays}
    </>
  );
}

function NavIconList() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <line x1="9" y1="6" x2="20" y2="6" /><line x1="9" y1="12" x2="20" y2="12" /><line x1="9" y1="18" x2="20" y2="18" />
      <polyline points="3,6 4,7 6,5" /><polyline points="3,12 4,13 6,11" /><polyline points="3,18 4,19 6,17" />
    </svg>
  );
}
function NavIconRepeat() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-3-6.7" /><polyline points="21 4 21 10 15 10" />
    </svg>
  );
}
function NavIconArchive() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="4" rx="1" /><path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" /><line x1="10" y1="12" x2="14" y2="12" />
    </svg>
  );
}

export default function Page() {
  return (
    <Suspense>
      <Recurring />
    </Suspense>
  );
}
