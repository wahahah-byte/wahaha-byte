"use client";

import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { tasksApi, TaskDto, TaskFilterParams } from "@/lib/api/tasks";
import TaskDetailModal from "@/components/TaskDetailModal";
import TaskRow from "@/components/TaskRow";
import { useTaskActions } from "@/hooks/useTaskActions";
import { useLogCounter } from "@/hooks/useLogCounter";
import { useDesktopLayout } from "@/hooks/useDesktopLayout";
import { useOverdueRestart } from "@/hooks/useOverdueRestart";
import { useSaveTask } from "@/hooks/useSaveTask";
import { NavIconList, NavIconRepeat, NavIconArchive } from "@/components/NavIcons";
import { buildSidebarFilterGroups } from "@/lib/sidebarGroups";
import { canCheckInNow, isOverdue, sumTodayCycleCounter } from "@/lib/dateUtils";
import { RECURRING_FILTERS } from "@/lib/constants";
import { useToast } from "@/context/ToastContext";
import CategoryCapsTooltip from "@/components/CategoryCapsTooltip";
import RoutineListControls, { RoutineSortMode, RoutineGroupMode } from "@/components/RoutineListControls";
import TaskPageHeader from "@/components/TaskPageHeader";
import DemoModeBanner from "@/components/DemoModeBanner";
import TaskPageOverlays from "@/components/TaskPageOverlays";
import MobileActionBarRecurring from "@/components/MobileActionBarRecurring";
import PullToRefreshIndicator from "@/components/PullToRefreshIndicator";
import DesktopShell from "@/components/DesktopShell";
import DesktopSidebar from "@/components/DesktopSidebar";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useOneHandedMode } from "@/hooks/useOneHandedMode";
import { withMockCycles } from "@/lib/mockTasks";

const MOCK_RECURRING: TaskDto[] = ([
  { taskId: "r1", userId: "demo", title: "Morning workout", description: "30 min cardio or strength training", category: "Fitness", priority: "high", status: "pending", pointValue: 3, dueDate: "2026-05-05", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 12, longestStreakCount: 15 },
  { taskId: "r2", userId: "demo", title: "Read 30 minutes", description: null, category: "Learning", priority: "medium", status: "pending", pointValue: 2, dueDate: "2026-05-05", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekdays", submitted: false, currentStreakCount: 8, longestStreakCount: 21 },
  { taskId: "r3", userId: "demo", title: "Weekly review & planning", description: "Review last week, plan the next", category: "Productivity", priority: "high", status: "pending", pointValue: 5, dueDate: "2026-05-08", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekly", submitted: false, currentStreakCount: 5, longestStreakCount: 5 },
  { taskId: "r4", userId: "demo", title: "Monthly budget review", description: null, category: "Finance", priority: "high", status: "pending", pointValue: 5, dueDate: "2026-05-15", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "monthly", submitted: false },
  // Streak tier showcase
  { taskId: "r5", userId: "demo", title: "10-minute meditation", description: "Sit, breathe, settle", category: "Health", priority: "medium", status: "pending", pointValue: 3, dueDate: "2026-05-05", createdAt: "2026-04-04T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 31, longestStreakCount: 31 },
  { taskId: "r6", userId: "demo", title: "Spanish — Duolingo", description: "Maintain the streak", category: "Learning", priority: "medium", status: "pending", pointValue: 2, dueDate: "2026-05-05", createdAt: "2026-04-12T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 22, longestStreakCount: 22, hasCounter: true, counterUnit: "words", counterGoal: 40 },
  { taskId: "r7", userId: "demo", title: "Floss", description: "One more day to 2.0x", category: "Health", priority: "low", status: "pending", pointValue: 1, dueDate: "2026-05-05", createdAt: "2026-04-05T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 29, longestStreakCount: 29 },
  { taskId: "r8", userId: "demo", title: "5-min stretch", description: null, category: "Fitness", priority: "low", status: "pending", pointValue: 1, dueDate: "2026-05-05", createdAt: "2026-04-29T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 6, longestStreakCount: 9 },
] as TaskDto[]).map(withMockCycles);

const EMPTY_SET = new Set<string>();

function tabMatches(task: TaskDto, tab: string): boolean {
  if (tab === "all") return true;
  // Today = actionable now (not yet checked in this cycle).
  // Upcoming = not actionable (checked-in-today OR not yet due); undo lives on those rows.
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
  const { beginRestart, clearRestart, isRestart } = useOverdueRestart();
  const [counterPromptTask, setCounterPromptTask] = useState<TaskDto | null>(null);
  const [groupMode, setGroupMode] = useState<RoutineGroupMode>("none");
  const [sortMode, setSortMode] = useState<RoutineSortMode>("due");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const isDesktop = useDesktopLayout();

  // Categories present among recurring tasks (for the icon filter strip).
  const availableCategories = useMemo(() => {
    const seen = new Set<string>();
    for (const t of tasks) if (t.category) seen.add(t.category);
    return [...seen].sort();
  }, [tasks]);

  // Drop active category if user deletes the last task in it.
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

  const { advancing, pausing, slashingId, recurringPopups, handleAdvance, handleCheckIn, handleUndoCheckIn, handleUndoCheckInFromToast, handlePause, handleDelete, handleSkip, undoableCheckIn, dismissUndoableCheckIn, undoableDelete, handleUndoDelete, dismissUndoableDelete } =
    useTaskActions({
      tasks, setTasks, isAuthenticated,
      stagedTaskIds, setStagedTaskIds,
      selectedIds, setSelectedIds,
      submittedTaskIds,
      setError: (msg) => setError(msg),
      setSuccess: (msg) => setSuccess(msg),
      setDetailTask,
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
    // searchParams read once on mount; URL changes via applyFilter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const oneHanded = useOneHandedMode();

  function applyFilter(value: string) {
    setActiveFilter(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("tab");
    else params.set("tab", value);
    const qs = params.toString();
    router.replace(qs ? `/recurring?${qs}` : "/recurring", { scroll: false });
  }

  // Stable callbacks so TaskRow's React.memo can skip re-renders on filter-strip swipe.
  const handleSubtasksChange = useCallback((taskId: string, subtasks: import("@/lib/api/tasks").Subtask[]) => {
    setTasks((prev) => prev.map((tt) => tt.taskId === taskId ? { ...tt, subtasks } : tt));
  }, []);

  const handleRestartOverdue = useCallback((t: TaskDto) => {
    beginRestart(t);
    setDetailTask(t);
  }, [beginRestart]);

  // Session-only timestamps of recent check-ins; lets the Checked In section
  // pin the most-recently-checked-in task to the top BEFORE the server
  // response lands (when the row is still missing the new cycle in
  // recentCycles, so latestCheckinTs would otherwise read 0/old).
  const [recentCheckinTs, setRecentCheckinTs] = useState<Map<string, number>>(new Map());
  const stampCheckin = useCallback((taskId: string) => {
    setRecentCheckinTs((prev) => {
      const next = new Map(prev);
      next.set(taskId, Date.now());
      return next;
    });
  }, []);

  const requestCheckIn = useCallback((t: TaskDto) => {
    if (t.hasCounter) {
      // Skip prompt when goal already met via prior +/- logs.
      const goal = t.counterGoal ?? 0;
      if (goal > 0 && sumTodayCycleCounter(t.recentCycles) >= goal) {
        stampCheckin(t.taskId);
        handleCheckIn(t);
        return;
      }
      setCounterPromptTask(t);
      return;
    }
    stampCheckin(t.taskId);
    handleCheckIn(t);
  }, [handleCheckIn, stampCheckin]);

  const { logPromptTask, requestLog, cancelLog, submitLog, flushQuickLog } = useLogCounter({
    isAuthenticated, setTasks, setDetailTask, setError,
  });

  const noopToggle = useCallback(() => {}, []);

  const handleSaveTask = useSaveTask({
    detailTask, setDetailTask, setTasks, isAuthenticated,
    isRestart: isRestart(detailTask),
    clearRestart,
  });

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

  // True when user has done current period and next window hasn't opened.
  // !canCheckInNow + !isOverdue guard handles optimistic edge where next dueDate lands on today.
  function isCheckedInThisCycle(t: TaskDto): boolean {
    if (!t.lastCheckInDate || !t.dueDate || !t.recurrenceRule) return false;
    if (isOverdue(t.dueDate)) return false;
    return !canCheckInNow(t.dueDate, t.recurrenceRule, t.lastCheckInDate);
  }

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
    const sorted = [...filtered].sort(sortRecurring);
    if (filterValue === "all") {
      const active: TaskDto[] = [];
      const checkedIn: TaskDto[] = [];
      for (const t of sorted) {
        if (isCheckedInThisCycle(t)) checkedIn.push(t);
        else active.push(t);
      }
      // Most-recently-checked-in tasks pinned to the top of the Checked In
      // section — the optimistic check-in patch stamps the synthetic cycle
      // with `createdAt: now`, so freshly-checked tasks bubble up instantly.
      checkedIn.sort((a, b) => latestCheckinTs(b) - latestCheckinTs(a));
      if (active.length > 0 && checkedIn.length > 0) {
        return [...active, sep("Checked In", "__sep-checked-in"), ...checkedIn];
      }
    }
    return sorted;
  }

  function latestCheckinTs(t: TaskDto): number {
    // Session timestamp wins so the row pins to the top instantly, before
    // the optimistic patch is replaced by the server-returned cycle.
    const session = recentCheckinTs.get(t.taskId);
    if (session !== undefined) return session;
    const latest = t.recentCycles?.find((c) => c.cycleType === "checkin");
    return latest ? new Date(latest.createdAt).getTime() : 0;
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
    // Drop empty group chunks and suppress labels whose tasks are all checked-in this cycle.
    // The "Checked In" separator is preserved (its tasks define it).
    const visibleChunks = chunks.filter((c) => c.tasks.length > 0);
    return (
      <div>
        {visibleChunks.map((chunk, idx) => {
          const isCheckedInSep = chunk.sep?.sepKey === "__sep-checked-in";
          const hideLabel = !isCheckedInSep && chunk.tasks.every((t) => isCheckedInThisCycle(t));
          const showLabel = !!chunk.sep && !hideLabel;
          return (
          <div
            key={chunk.sep?.sepKey ?? `__chunk-${idx}`}
            style={{
              position: showLabel ? "relative" : undefined,
              marginTop: chunk.sep ? (idx > 0 ? "14px" : "10px") : undefined,
            }}
          >
            {showLabel && (
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
                {chunk.sep!.label}
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
                    isOpenInDetail={isDesktop && detailTask?.taskId === item.taskId}
                    useCheckinCheckbox
                  />
                ))}
                <div className="task-row-wrapper task-row-phantom" aria-hidden="true">
                  <div className="task-row-inner" style={{ position: "absolute", inset: 0 }} />
                </div>
              </div>
            )}
          </div>
          );
        })}
      </div>
    );
  }

  const todayCount = tasks.filter((t) => canCheckInNow(t.dueDate, t.recurrenceRule, t.lastCheckInDate) && !isOverdue(t.dueDate)).length;
  const missedCount = tasks.filter((t) => isOverdue(t.dueDate)).length;

  // Per-status counts for desktop sidebar (respects active category).
  const filterCounts = RECURRING_FILTERS.reduce((acc, f) => {
    acc[f.value] = tasks.filter((t) => tabMatches(t, f.value) && passesCategory(t)).length;
    return acc;
  }, {} as Record<string, number>);

  // Detail panel — inline on desktop, modal on mobile.
  const taskDetailNode = (() => {
    if (!detailTask) return null;
    const dt = detailTask;
    const dtIsRestart = isRestart(dt);
    const closeDetail = () => { clearRestart(); setDetailTask(null); };
    return (
      <TaskDetailModal
        key={dt.taskId}
        task={dt}
        currentStreakCount={dt.currentStreakCount}
        longestStreakCount={dt.longestStreakCount}
        onClose={closeDetail}
        canUndo={false}
        isActing={advancing === dt.taskId || pausing === dt.taskId || slashingId === dt.taskId}
        onCheckIn={canCheckInNow(dt.dueDate, dt.recurrenceRule, dt.lastCheckInDate) ? () => { closeDetail(); requestCheckIn(dt); } : undefined}
        checkInBlocked={!canCheckInNow(dt.dueDate, dt.recurrenceRule, dt.lastCheckInDate)}
        onFlushQuickLog={dt.hasCounter ? flushQuickLog : undefined}
        onDelete={() => { closeDetail(); handleDelete(dt.taskId); }}
        onSave={handleSaveTask}
        onSubtasksChange={(subtasks) => setTasks((prev) => prev.map((t) => t.taskId === dt.taskId ? { ...t, subtasks } : t))}
        initialEditMode={dtIsRestart}
        mustReschedule={dtIsRestart}
        inline={isDesktop}
      />
    );
  })();

  // Top-level overlays/banners shared by both layouts.
  const sharedOverlays = (
    <TaskPageOverlays
      showNewTask={showNewTask}
      onCloseNewTask={() => setShowNewTask(false)}
      onTaskCreated={(task) => { setTasks((prev) => [task, ...prev]); setShowNewTask(false); }}
      newTaskInitialRecurring
      counterPromptTask={counterPromptTask}
      onCloseCounterPrompt={() => setCounterPromptTask(null)}
      onSubmitCounterCheckIn={(t, value) => { setCounterPromptTask(null); stampCheckin(t.taskId); handleCheckIn(t, value); }}
      logPromptTask={logPromptTask}
      onCancelLog={cancelLog}
      onSubmitLog={submitLog}
      undoableCheckIn={undoableCheckIn}
      tasks={tasks}
      onUndoCheckInFromToast={handleUndoCheckInFromToast}
      onDismissUndoableCheckIn={dismissUndoableCheckIn}
      undoableDelete={undoableDelete}
      onUndoDelete={handleUndoDelete}
      onDismissUndoableDelete={dismissUndoableDelete}
    />
  );

  if (isDesktop) {
    const sidebar = (
      <DesktopSidebar
        navItems={[
          { href: "/", label: "To Do", icon: <NavIconList /> },
          { href: "/recurring", label: "Routines", icon: <NavIconRepeat />, active: true },
        ]}
        footerNavItems={[
          { href: "/archive", label: "Archive", icon: <NavIconArchive /> },
        ]}
        filterGroups={buildSidebarFilterGroups({
          statusTitle: "View",
          statusFilters: RECURRING_FILTERS,
          activeFilter,
          filterCounts,
          statusDotColor: (value) =>
            value === "today" && todayCount > 0 ? "var(--color-active-highlight-alt)"
            : value === "missed" && missedCount > 0 ? "var(--color-danger)"
            : null,
          onStatusSelect: applyFilter,
          categories: availableCategories.map((cat) => [cat, tasks.filter((t) => t.category === cat).length] as [string, number]),
          activeCategory,
          onCategorySelect: (v) => setActiveCategory((prev) => prev === v ? null : v),
        })}
      />
    );
    const main = (
      <div className="flex flex-col flex-1 overflow-hidden recurring-scope" style={{ background: "var(--color-bg)" }}>
        {!isAuthenticated && <DemoModeBanner className="mx-6 mt-4 mb-2" />}
        <TaskPageHeader
          capsVariant="recurring"
          filterLabel={RECURRING_FILTERS.find((f) => f.value === activeFilter)?.label ?? "All"}
          activeCategory={activeCategory}
          newTaskLabel="New routine"
          isAuthenticated={isAuthenticated}
          onNewTask={() => setShowNewTask(true)}
          controls={
            <RoutineListControls
              sortMode={sortMode}
              groupMode={groupMode}
              onSortChange={setSortMode}
              onGroupChange={setGroupMode}
            />
          }
        />
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
        <div
          className="w-full mx-auto px-3 sm:px-4 flex flex-col flex-1 overflow-hidden has-mobile-bottom-pad"
          style={{
            maxWidth: 420,
            transform: `translateY(${oneHanded.translateY}px)`,
            transition: oneHanded.isTracking ? "none" : "transform 0.28s cubic-bezier(0.2, 0, 0, 1)",
          }}
        >
          {!isAuthenticated && <DemoModeBanner />}

          <div
            style={{ paddingTop: 32, background: "var(--color-bg)", touchAction: "pan-x" }}
            onTouchStart={oneHanded.handleTouchStart}
            onTouchMove={oneHanded.handleTouchMove}
            onTouchEnd={oneHanded.handleTouchEnd}
            onTouchCancel={oneHanded.handleTouchEnd}
          >
            {(() => {
              const label = RECURRING_FILTERS.find((f) => f.value === activeFilter)?.label ?? "Routines";
              return (
                <div className="mb-3 sm:mb-4 pl-[14px] sm:pl-[20px] flex items-center justify-between">
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
                  {oneHanded.isShrunk && (
                    <span
                      className="text-[9px] tracking-widest uppercase pr-3"
                      style={{ color: "var(--color-fg-subtle)" }}
                    >
                      tap to expand
                    </span>
                  )}
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
                aria-label="Show routine point caps"
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
            <RoutineListControls
              sortMode={sortMode}
              groupMode={groupMode}
              onSortChange={setSortMode}
              onGroupChange={setGroupMode}
              compactLabel
            />
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
            style={{ gridTemplateColumns: "1fr 60px 64px", maxWidth: 420, color: "var(--color-fg-muted)", position: "relative", zIndex: 2, background: "var(--color-bg)" }}
          >
            <span className="-ml-0.5 sm:-ml-1.5">Name</span>
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
                <p className="text-sm tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>No routines</p>
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

export default function Page() {
  return (
    <Suspense>
      <Recurring />
    </Suspense>
  );
}
