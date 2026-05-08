"use client";

import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { tasksApi, TaskDto, UpdateTaskRequest, CheckInCycleDto } from "@/lib/api/tasks";
import NewTaskModal from "@/components/NewTaskModal";
import TaskDetailModal, { EditableTaskFields } from "@/components/TaskDetailModal";
import TaskRow from "@/components/TaskRow";
import CounterPromptModal from "@/components/CounterPromptModal";
import SubmitBar from "@/components/SubmitBar";
import CapWarningModal from "@/components/CapWarningModal";
import TaskListControls from "@/components/TaskListControls";
import CategoryCapsTooltip from "@/components/CategoryCapsTooltip";
import MobileActionBar from "@/components/MobileActionBar";
import PullToRefreshIndicator from "@/components/PullToRefreshIndicator";
import TierUpBanner from "@/components/TierUpBanner";
import CheckInUndoToast from "@/components/CheckInUndoToast";
import DesktopShell from "@/components/DesktopShell";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useTaskActions } from "@/hooks/useTaskActions";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useTaskSubmission } from "@/hooks/useTaskSubmission";
import { useTasks } from "@/hooks/useTasks";
import { canCheckInNow, parseLocalDate, getPrevPeriodStart } from "@/lib/dateUtils";
import { CATEGORIES, CATEGORY_COLOR, FILTERS, maxPointsFor } from "@/lib/constants";
import { buildListItems, chunkListItems, GroupMode, SortMode } from "@/lib/taskList";
import { usePoints } from "@/context/PointsContext";
import { useToast } from "@/context/ToastContext";

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab = searchParams.get("tab");
  const initialActiveFilter = initialTab && FILTERS.some((f) => f.value === initialTab) ? initialTab : "all";

  const tasksHook = useTasks({ initialFilterFromUrl: initialTab });
  const {
    tasks, setTasks, loading, setError,
    isMounted, isAuthenticated, penalizedTaskIds, submittedSeed, refetch,
  } = tasksHook;

  // Per-page scroll: each filter view has its own overflow-y-auto container so
  // a short list doesn't inherit scroll-height from a longer sibling page. The
  // active page's element is captured via a callback ref into state, then wrapped
  // as a synthetic RefObject for usePullToRefresh.
  const [activeScrollEl, setActiveScrollEl] = useState<HTMLDivElement | null>(null);
  const scrollRefForPtr = useMemo(() => ({ current: activeScrollEl }), [activeScrollEl]);
  const pagerRef = useRef<HTMLDivElement>(null);
  const { pullY, phase, triggerDistance } = usePullToRefresh(scrollRefForPtr, refetch);

  const [activeFilter, setActiveFilter] = useState(initialActiveFilter);
  const [showNewTask, setShowNewTask] = useState(false);
  const [detailTask, setDetailTask] = useState<TaskDto | null>(null);
  // Desktop layout (>=1024px) replaces the swipe pager + edge drawer with a
  // 3-column shell. Tracked via matchMedia so we can render the right layout
  // synchronously after hydration.
  const [isDesktop, setIsDesktop] = useState(false);
  // Category quick-filter lives in the desktop sidebar. Null means "all".
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 1024px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const [overdueRestartTaskId, setOverdueRestartTaskId] = useState<string | null>(null);
  const [counterPromptTask, setCounterPromptTask] = useState<TaskDto | null>(null);
  const [logPromptTask, setLogPromptTask] = useState<TaskDto | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [groupMode, setGroupMode] = useState<GroupMode>("none");
  const [sortMode, setSortMode] = useState<SortMode>("due");
  const [uncompletedCollapsed, setUncompletedCollapsed] = useState(false);

  const { setUnsubmittedPoints } = usePoints();
  const { setSuccess } = useToast();
  const submission = useTaskSubmission({ tasks, isAuthenticated, setError });

  const {
    selectedIds, setSelectedIds, stagedTaskIds, setStagedTaskIds,
    submittedTaskIds, setSubmittedTaskIds, filingIds, recentlyFiledIds, errorIds,
    isSubmitting, showCapWarning, setShowCapWarning,
    toggleSelect, doSubmit, handleSubmit,
    remaining, recurringRemaining, selectedPts, willAward, capped, limitReached,
  } = submission;

  const { advancing, pausing, slashingId, recurringPopups, tierUp, dismissTierUp, handleAdvance, handleCheckIn, handleUndoCheckIn, handleUndoCheckInFromToast, handleDeleteLogCycle, handlePause, handleDelete, handleSkip, handleArchive, undoableCheckIn, dismissUndoableCheckIn } =
    useTaskActions({
      tasks, setTasks, isAuthenticated,
      stagedTaskIds, setStagedTaskIds,
      selectedIds, setSelectedIds,
      submittedTaskIds,
      setError,
      setSuccess,
    });

  useEffect(() => {
    if (submittedSeed) setSubmittedTaskIds(submittedSeed);
  }, [submittedSeed, setSubmittedTaskIds]);

  useEffect(() => {
    const total = tasks.reduce((s, t) =>
      t.status === "completed" && !submittedTaskIds.has(t.taskId) && !t.pointsAwarded && t.submitted === false
        ? s + t.pointValue : s,
      0
    );
    setUnsubmittedPoints(total);
  }, [tasks, submittedTaskIds, setUnsubmittedPoints]);

  // Stable callbacks so TaskRow's React.memo can skip re-renders when only
  // activeFilter changes (e.g. swiping the filter strip).
  const handleSubtasksChange = useCallback((taskId: string, subtasks: import("@/lib/api/tasks").Subtask[]) => {
    setTasks((prev) => prev.map((tt) => tt.taskId === taskId ? { ...tt, subtasks } : tt));
  }, [setTasks]);

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
  }, [logPromptTask, isAuthenticated, setError, setTasks]);

  function applyFilter(value: string) {
    setActiveFilter(value);
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
        if (!updated.isRecurring) handleAdvance(updated);
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
      hasCounter: fields.hasCounter ?? detailTask.hasCounter ?? false,
      counterUnit: fields.counterUnit !== undefined ? fields.counterUnit : (detailTask.counterUnit ?? null),
    };
    const { error } = await tasksApi.update(detailTask.taskId, req);
    if (error) return error;
    const updated = { ...detailTask, ...fields };
    setTasks((prev) => prev.map((t) => t.taskId === detailTask.taskId ? updated : t));
    setDetailTask(updated);
    if (isRestart) {
      setOverdueRestartTaskId(null);
      setDetailTask(null);
      if (!updated.isRecurring) handleAdvance(updated);
    }
    return null;
  }

  // Tasks visible after applying the desktop sidebar's category filter.
  // On mobile activeCategory stays null so this is a no-op. Declared above the
  // !isMounted early-return so the hook order stays stable across renders.
  const visibleTasks = useMemo(
    () => activeCategory ? tasks.filter((t) => t.category === activeCategory) : tasks,
    [tasks, activeCategory],
  );

  const filterCounts = useMemo(() => {
    const c = { all: 0, pending: 0, in_progress: 0, completed: 0 } as Record<string, number>;
    for (const t of visibleTasks) {
      c.all++;
      if (t.status === "pending" || t.status === "in_progress") c.pending++;
      if (t.status === "in_progress") c.in_progress++;
      if (t.status === "completed") c.completed++;
    }
    return c;
  }, [visibleTasks]);

  const categoryStats = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of tasks) {
      if (!t.category) continue;
      counts[t.category] = (counts[t.category] ?? 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [tasks]);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-accent)" }} />
      </div>
    );
  }

  const unsubmitted = tasks.filter((t) =>
    t.status === "completed" && !submittedTaskIds.has(t.taskId) && !t.pointsAwarded && t.submitted === false
  );
  const allUnsubmittedSelected = unsubmitted.length > 0 && unsubmitted.every((t) => selectedIds.has(t.taskId));

  const submitBarVisible = activeFilter === "completed" && selectedIds.size > 0;

  // Renders one filter "page" inside the horizontal pager. Each page computes
  // its own listItems / chunks for its own filter so all four views are
  // pre-rendered and the swipe between filters has no "load" between pages.
  function renderFilterPage(filterValue: string) {
    const items = buildListItems({ tasks: visibleTasks, activeFilter: filterValue, groupMode, sortMode, submittedTaskIds });
    const chunks = chunkListItems(items);
    const compIdx = chunks.findIndex((c) => c.sep?.sepKey === "__sep-completed");
    const hasComp = compIdx >= 0;
    const showCollapse = filterValue === "all" && hasComp;
    const uncompChunks = hasComp ? chunks.slice(0, compIdx) : chunks;
    const uncompCount = uncompChunks.reduce((s, c) => s + c.tasks.length, 0);
    const visible = showCollapse && uncompletedCollapsed ? chunks.slice(compIdx) : chunks;

    if (tasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <p className="text-sm tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>No items</p>
        </div>
      );
    }

    if (filterValue === "in_progress" && items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <p className="text-sm tracking-widest uppercase" style={{ color: "var(--color-fg-subtle)" }}>No tasks in progress</p>
        </div>
      );
    }

    if (filterValue === "pending" && items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-2">
          <p className="text-sm tracking-widest uppercase" style={{ color: "var(--color-fg-subtle)" }}>No pending tasks</p>
        </div>
      );
    }

    return (
      <div>
        {showCollapse && (
          <button
            type="button"
            onClick={() => setUncompletedCollapsed((v) => !v)}
            className="flex items-center gap-3 pl-1 mt-2 mb-5 w-full cursor-pointer"
            style={{ background: "transparent", border: "none" }}
            aria-expanded={!uncompletedCollapsed}
          >
            <span className="text-[11px] font-semibold tracking-widest uppercase flex items-center gap-1.5" style={{ color: "var(--color-fg-muted)" }}>
              Active ({uncompCount})
              <span style={{ display: "inline-block", transform: uncompletedCollapsed ? "rotate(-90deg)" : "rotate(0deg)", transition: "transform 0.15s" }}>▾</span>
            </span>
            <div className="flex-1 h-px" style={{ background: "var(--color-border-soft)" }} />
          </button>
        )}

        {visible.map((chunk, idx) => {
          const isSection = chunk.sep?.sepKey === "__sep-completed";
          const hasGroupLabel = !!chunk.sep && !isSection;
          return (
            <div
              key={chunk.sep?.sepKey ?? `__chunk-${idx}`}
              style={{
                position: hasGroupLabel ? "relative" : undefined,
                marginTop: hasGroupLabel ? (idx > 0 ? "14px" : "10px") : undefined,
              }}
            >
              {chunk.sep && isSection && (
                <div className={`flex items-center gap-3 pl-1 ${idx === 0 ? "mb-1" : "mt-4 mb-1"}`}>
                  <span className="tracking-widest uppercase text-[11px] font-semibold" style={{ color: "var(--color-fg-muted)" }}>
                    {chunk.sep.label}
                  </span>
                  <div className="flex-1 h-px" style={{ background: "var(--color-border-soft)" }} />
                </div>
              )}
              {hasGroupLabel && (
                <span
                  className="tracking-widest uppercase text-[9px]"
                  style={{
                    position: "absolute", top: "-6px", left: "4px",
                    padding: "0 6px", background: "var(--color-bg)",
                    color: "var(--color-fg-subtle)", lineHeight: 1, zIndex: 1,
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
                      activeFilter={filterValue}
                      advancing={advancing}
                      pausing={pausing}
                      slashingId={slashingId}
                      filingIds={filingIds}
                      recentlyFiledIds={recentlyFiledIds}
                      errorIds={errorIds}
                      selectedIds={selectedIds}
                      submittedTaskIds={submittedTaskIds}
                      recurringPopup={recurringPopups.get(item.taskId)}
                      penalizedTaskIds={penalizedTaskIds}
                      onAdvance={handleAdvance}
                      onCheckIn={requestCheckIn}
                      onPause={handlePause}
                      onDelete={handleDelete}
                      onSkip={handleSkip}
                      onToggleSelect={toggleSelect}
                      onOpenDetail={setDetailTask}
                      onRestartOverdue={handleRestartOverdue}
                      onArchive={handleArchive}
                      onSubtasksChange={handleSubtasksChange}
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

  // Detail panel — rendered inline on desktop (inside DesktopShell.detail) and
  // as a modal overlay on mobile. The `inline={isDesktop}` flag toggles which.
  const taskDetailNode = (() => {
    if (!detailTask) return null;
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
        onCheckIn={dt.status === "pending" && dt.isRecurring && canCheckInNow(dt.dueDate, dt.recurrenceRule, dt.lastCheckInDate) ? () => { closeDetail(); requestCheckIn(dt); } : undefined}
        onLog={dt.isRecurring && dt.hasCounter ? () => requestLog(dt) : undefined}
        historyRefreshKey={historyRefreshKey}
        checkInBlocked={dt.status === "pending" && dt.isRecurring && !canCheckInNow(dt.dueDate, dt.recurrenceRule, dt.lastCheckInDate)}
        onPause={dt.status === "in_progress" ? () => { closeDetail(); handlePause(dt); } : undefined}
        onComplete={dt.status === "in_progress" ? () => { closeDetail(); handleAdvance(dt); } : undefined}
        onUndo={dtCanUndo ? () => { closeDetail(); handleAdvance(dt); } : undefined}
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

  // Top-level overlays/banners that render in both layouts.
  const sharedOverlays = (
    <>
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

  // Desktop-only 3-column shell. Mobile keeps the existing layout below.
  if (isDesktop) {
    const label = FILTERS.find((f) => f.value === activeFilter)?.label ?? "Tasks";
    const sidebar = (
      <DesktopSidebar
        navItems={[
          { href: "/", label: "Today", icon: <NavIconList />, active: true },
          { href: "/recurring", label: "Recurring", icon: <NavIconRepeat /> },
          { href: "/archive", label: "Archive", icon: <NavIconArchive /> },
        ]}
        filterGroups={[
          {
            title: "Status",
            groupKey: "status",
            onSelect: applyFilter,
            items: FILTERS.map((f) => ({
              value: f.value,
              label: f.label,
              count: filterCounts[f.value] ?? 0,
              active: f.value === activeFilter,
            })),
          },
          ...(categoryStats.length ? [{
            title: "Categories",
            groupKey: "categories",
            onSelect: (v: string) => setActiveCategory((prev) => prev === v ? null : v),
            items: categoryStats.map(([cat, count]) => ({
              value: cat,
              label: cat,
              count,
              dotColor: CATEGORY_COLOR[cat] ?? "var(--color-fg-muted)",
              active: activeCategory === cat,
            })),
          }] : []),
        ]}
      />
    );
    const main = (
      <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "var(--color-bg)" }}>
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
            <CategoryCapsTooltip variant="regular">
              <div tabIndex={0} aria-label="Show task point caps" className="flex items-center justify-center" style={{ width: 26, height: 26, color: "var(--color-fg-muted)", cursor: "help" }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /><path d="M9 16l2 2 4-4" />
                </svg>
              </div>
            </CategoryCapsTooltip>
            <TaskListControls
              sortMode={sortMode}
              groupMode={groupMode}
              onSortChange={setSortMode}
              onGroupChange={setGroupMode}
            />
            <button
              onClick={() => isAuthenticated && setShowNewTask(true)}
              disabled={!isAuthenticated}
              title={!isAuthenticated ? "Sign in to create tasks" : "New task"}
              aria-label="New task"
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
        {sharedOverlays}
      </>
    );
  }

  return (
    <>
      <div className="task-page-shell flex flex-col bg-scanlines overflow-hidden" style={{ background: "var(--color-bg)", color: "var(--color-fg)" }}>
        <div
          className="w-full mx-auto px-3 sm:px-4 flex flex-col flex-1 overflow-hidden"
          style={{ maxWidth: 420 }}
        >
          {!isAuthenticated && (
            <div className="flex items-center justify-between mt-3 mb-3 px-3 py-2 text-[10px] tracking-widest uppercase" style={{ background: "var(--color-active-highlight-bg)", border: "1px solid var(--color-active-highlight-border)", borderRadius: "3px" }}>
              <span style={{ color: "var(--color-active-highlight)", opacity: 0.85 }}>Demo · changes are not saved</span>
              <Link href="/login" style={{ color: "var(--color-active-highlight)", letterSpacing: "0.18em", fontWeight: 600 }}>Sign in →</Link>
            </div>
          )}

          <div style={{ paddingTop: 32, background: "var(--color-bg)" }}>
            {(() => {
              const label = FILTERS.find((f) => f.value === activeFilter)?.label ?? "Tasks";
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
                {FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => applyFilter(f.value)}
                    className="px-4 py-3 text-xs tracking-wider uppercase cursor-pointer transition-colors relative flex items-center gap-1.5 whitespace-nowrap"
                    style={{ color: activeFilter === f.value ? "var(--color-active-highlight)" : "var(--color-fg-muted)", background: "transparent", border: "none" }}
                  >
                    {f.label}
                    {f.value === "completed" && unsubmitted.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--color-warning)" }} />
                    )}
                    {activeFilter === f.value && (
                      <span className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "var(--color-active-highlight)" }} />
                    )}
                  </button>
                ))}
              </div>
              <div className="flex-1" />
              <CategoryCapsTooltip variant="regular">
                <div
                  tabIndex={0}
                  aria-label="Show task point caps"
                  className="flex items-center justify-center mr-1"
                  style={{ width: 26, height: 26, color: "var(--color-fg-muted)", cursor: "help" }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
                    <path d="M9 16l2 2 4-4" />
                  </svg>
                </div>
              </CategoryCapsTooltip>
              <TaskListControls
                sortMode={sortMode}
                groupMode={groupMode}
                onSortChange={setSortMode}
                onGroupChange={setGroupMode}
              />
              <button
                onClick={() => !isAuthenticated ? undefined : setShowNewTask(true)}
                disabled={!isAuthenticated}
                title={!isAuthenticated ? "Sign in to create tasks" : "New task"}
                aria-label="New task"
                className="flex items-center justify-center ml-1"
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
                onMouseEnter={(e) => { if (isAuthenticated) e.currentTarget.style.color = "var(--color-active-highlight)"; }}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--color-fg)")}
              >
                +
              </button>
            </div>

            <div
              className="grid text-[9px] tracking-widest uppercase mx-1 sm:mx-2.5 pl-3 sm:pl-4 pr-0 py-2 select-none"
              style={{ gridTemplateColumns: "1fr 64px 60px", maxWidth: 420, color: "var(--color-fg-subtle)", position: "relative", zIndex: 2, background: "var(--color-bg)" }}
            >
              <span className="-ml-0.5 sm:-ml-1.5">Name</span>
              <span />
              <span />
              {activeFilter === "completed" && unsubmitted.length > 0 ? (
                <button
                  onClick={() => {
                    if (allUnsubmittedSelected) {
                      setSelectedIds((prev) => { const n = new Set(prev); unsubmitted.forEach((t) => n.delete(t.taskId)); return n; });
                    } else {
                      setSelectedIds((prev) => new Set([...prev, ...unsubmitted.map((t) => t.taskId)]));
                    }
                  }}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-[9px] tracking-widest uppercase cursor-pointer transition-colors"
                  style={{
                    color: allUnsubmittedSelected ? "rgba(245,158,11,0.85)" : "var(--color-fg-subtle)",
                    background: "transparent",
                    border: "none",
                    padding: 0,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = allUnsubmittedSelected ? "var(--color-warning)" : "var(--color-fg-muted)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = allUnsubmittedSelected ? "rgba(245,158,11,0.85)" : "var(--color-fg-subtle)")}
                >
                  {allUnsubmittedSelected ? "Deselect All" : "Select All"}
                </button>
              ) : !loading && tasks.length > 0 ? (
                <span
                  className="hidden sm:flex absolute top-1/2 -translate-y-1/2 right-4 items-center gap-2"
                  style={{ color: "var(--color-fg-muted)" }}
                >
                  <span>{tasks.filter((t) => t.status !== "completed").length} active</span>
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span>{tasks.length} total</span>
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex-1 overflow-hidden">
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: "var(--color-border)", borderTopColor: "var(--color-accent)" }} />
              </div>
            )}

            {!loading && (
              <div style={{ overflow: "hidden", width: "100%", height: "100%" }}>
                <div
                  ref={pagerRef}
                  style={{
                    display: "flex",
                    width: `${FILTERS.length * 100}%`,
                    height: "100%",
                    transform: `translateX(${-FILTERS.findIndex((f) => f.value === activeFilter) * (100 / FILTERS.length)}%)`,
                    transition: "transform 0.22s cubic-bezier(0.2, 0, 0, 1)",
                    willChange: "transform",
                  }}
                >
                  {FILTERS.map((f) => {
                    const isActivePage = f.value === activeFilter;
                    return (
                      <div
                        key={f.value}
                        ref={isActivePage ? setActiveScrollEl : null}
                        className={`has-mobile-bottom-pad px-1 sm:px-2.5${submitBarVisible ? " sm:pb-24" : ""}`}
                        style={{
                          flex: `0 0 ${100 / FILTERS.length}%`,
                          minWidth: 0,
                          // Inset each page so adjacent pages have visible breathing
                          // room when swiping between filters (iOS-homescreen feel).
                          // Horizontal padding handled via Tailwind so it shrinks
                          // on mobile (px-1 = 4px) and keeps the desktop feel (px-2.5 = 10px).
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

      <MobileActionBar
        filters={FILTERS}
        activeFilter={activeFilter}
        onFilterChange={applyFilter}
        getCount={(v) => v === "all" ? tasks.length : tasks.filter((t) => t.status === v).length}
        badgeColor={(v) => (v === "completed" && unsubmitted.length > 0) ? "var(--color-warning)" : null}
        sortMode={sortMode}
        groupMode={groupMode}
        onSortChange={setSortMode}
        onGroupChange={setGroupMode}
        onNewTask={() => setShowNewTask(true)}
        onQuickCreate={async ({ title, dueDate, priority, category }) => {
          const today = new Date();
          const dd = dueDate ?? new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const cat = category ?? CATEGORIES[0];
          const dueIso = `${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, "0")}-${String(dd.getDate()).padStart(2, "0")}`;
          const points = Math.min(25, maxPointsFor(cat));
          if (!isAuthenticated) {
            const local: TaskDto = {
              taskId: `local-${Date.now()}`,
              title,
              description: null,
              category: cat,
              priority,
              pointValue: points,
              status: "pending",
              dueDate: dueIso,
              createdAt: new Date().toISOString(),
              completedAt: null,
              isRecurring: false,
              recurrenceRule: null,
              lastCheckInDate: null,
              currentStreakCount: 0,
              longestStreakCount: 0,
              submitted: false,
              pointsAwarded: false,
              isArchived: false,
              subtasks: [],
            } as unknown as TaskDto;
            setTasks((prev) => [local, ...prev]);
            setSuccess(`Added "${title}"`);
            return;
          }
          const { data, error } = await tasksApi.create({
            title,
            category: cat,
            priority,
            pointValue: points,
            dueDate: dueIso,
            isRecurring: false,
          });
          if (error || !data) { setError(error ?? "Failed to create task"); return; }
          setTasks((prev) => [data, ...prev]);
          setSuccess(`Added "${title}"`);
        }}
        isAuthenticated={isAuthenticated}
        pagerRef={pagerRef}
        submitMode={submitBarVisible}
      />

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

      {taskDetailNode}
      {sharedOverlays}
    </>
  );
}

// Sidebar nav icons — small mono SVGs that mirror the existing
// MobileEdgeDrawer icon set so the desktop and mobile nav match visually.
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
      <Home />
    </Suspense>
  );
}
