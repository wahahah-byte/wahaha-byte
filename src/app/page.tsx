"use client";

import { useCallback, useEffect, useMemo, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { tasksApi, TaskDto } from "@/lib/api/tasks";
import TaskDetailModal from "@/components/TaskDetailModal";
import TaskRow from "@/components/TaskRow";
import SubmitBar from "@/components/SubmitBar";
import CapWarningModal from "@/components/CapWarningModal";
import TaskListControls from "@/components/TaskListControls";
import TaskPageHeader from "@/components/TaskPageHeader";
import DemoModeBanner from "@/components/DemoModeBanner";
import TaskPageOverlays from "@/components/TaskPageOverlays";
import CategoryCapsTooltip from "@/components/CategoryCapsTooltip";
import MobileActionBar from "@/components/MobileActionBar";
import PullToRefreshIndicator from "@/components/PullToRefreshIndicator";
import DesktopShell from "@/components/DesktopShell";
import DesktopSidebar from "@/components/DesktopSidebar";
import { useTaskActions } from "@/hooks/useTaskActions";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { useTaskSubmission } from "@/hooks/useTaskSubmission";
import { useTasks } from "@/hooks/useTasks";
import { useLogCounter } from "@/hooks/useLogCounter";
import { useDesktopLayout } from "@/hooks/useDesktopLayout";
import { useOverdueRestart } from "@/hooks/useOverdueRestart";
import { useSaveTask } from "@/hooks/useSaveTask";
import { NavIconList, NavIconRepeat, NavIconArchive } from "@/components/NavIcons";
import { buildSidebarFilterGroups } from "@/lib/sidebarGroups";
import { canCheckInNow, parseLocalDate, getPrevPeriodStart } from "@/lib/dateUtils";
import { CATEGORIES, FILTERS, maxPointsFor } from "@/lib/constants";
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
  const isDesktop = useDesktopLayout();
  // Category quick-filter lives in the desktop sidebar. Null means "all".
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { beginRestart, clearRestart, isRestart } = useOverdueRestart();
  const [counterPromptTask, setCounterPromptTask] = useState<TaskDto | null>(null);
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

  const { advancing, pausing, slashingId, recurringPopups, tierUp, dismissTierUp, handleAdvance, handleCheckIn, handleUndoCheckInFromToast, handlePause, handleDelete, handleSkip, handleArchive, undoableCheckIn, dismissUndoableCheckIn } =
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
    beginRestart(t);
    setDetailTask(t);
  }, [beginRestart]);

  const requestCheckIn = useCallback((t: TaskDto) => {
    if (t.hasCounter) {
      setCounterPromptTask(t);
      return;
    }
    handleCheckIn(t);
  }, [handleCheckIn]);

  const { logPromptTask, requestLog, cancelLog, submitLog, quickLog } = useLogCounter({
    isAuthenticated, setTasks, setDetailTask, setError,
  });

  function applyFilter(value: string) {
    setActiveFilter(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("tab");
    else params.set("tab", value);
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  }

  const handleSaveTask = useSaveTask({
    detailTask, setDetailTask, setTasks, isAuthenticated,
    isRestart: isRestart(detailTask),
    clearRestart,
    onAfterRestart: (updated) => {
      if (!updated.isRecurring) handleAdvance(updated);
    },
  });

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
    const dtIsRestart = isRestart(dt);
    const closeDetail = () => { clearRestart(); setDetailTask(null); };
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
        onQuickLog={dt.isRecurring && dt.hasCounter ? (delta) => quickLog(dt, delta) : undefined}
        checkInBlocked={dt.status === "pending" && dt.isRecurring && !canCheckInNow(dt.dueDate, dt.recurrenceRule, dt.lastCheckInDate)}
        onPause={dt.status === "in_progress" ? () => { closeDetail(); handlePause(dt); } : undefined}
        onComplete={dt.status === "in_progress" ? () => { closeDetail(); handleAdvance(dt); } : undefined}
        onUndo={dtCanUndo ? () => { closeDetail(); handleAdvance(dt); } : undefined}
        onDelete={() => { closeDetail(); handleDelete(dt.taskId); }}
        onSave={handleSaveTask}
        onSubtasksChange={(subtasks) => setTasks((prev) => prev.map((t) => t.taskId === dt.taskId ? { ...t, subtasks } : t))}
        initialEditMode={dtIsRestart}
        mustReschedule={dtIsRestart}
        inline={isDesktop}
      />
    );
  })();

  // Top-level overlays/banners that render in both layouts.
  const sharedOverlays = (
    <TaskPageOverlays
      showNewTask={showNewTask}
      onCloseNewTask={() => setShowNewTask(false)}
      onTaskCreated={(task) => { setTasks((prev) => [task, ...prev]); setShowNewTask(false); }}
      counterPromptTask={counterPromptTask}
      onCloseCounterPrompt={() => setCounterPromptTask(null)}
      onSubmitCounterCheckIn={(t, value) => { setCounterPromptTask(null); handleCheckIn(t, value); }}
      logPromptTask={logPromptTask}
      onCancelLog={cancelLog}
      onSubmitLog={submitLog}
      tierUp={tierUp}
      onDismissTierUp={dismissTierUp}
      undoableCheckIn={undoableCheckIn}
      tasks={tasks}
      onUndoCheckInFromToast={handleUndoCheckInFromToast}
      onDismissUndoableCheckIn={dismissUndoableCheckIn}
    >
      {showCapWarning && (
        <CapWarningModal
          selectedPts={selectedPts}
          willAward={willAward}
          remaining={remaining}
          onClose={() => setShowCapWarning(false)}
          onConfirm={doSubmit}
        />
      )}
    </TaskPageOverlays>
  );

  // Desktop-only 3-column shell. Mobile keeps the existing layout below.
  if (isDesktop) {
    const sidebar = (
      <DesktopSidebar
        navItems={[
          { href: "/", label: "Today", icon: <NavIconList />, active: true },
          { href: "/recurring", label: "Routines", icon: <NavIconRepeat /> },
        ]}
        footerNavItems={[
          { href: "/archive", label: "Archive", icon: <NavIconArchive /> },
        ]}
        filterGroups={buildSidebarFilterGroups({
          statusTitle: "Status",
          statusFilters: FILTERS,
          activeFilter,
          filterCounts,
          onStatusSelect: applyFilter,
          categories: categoryStats,
          activeCategory,
          onCategorySelect: (v) => setActiveCategory((prev) => prev === v ? null : v),
        })}
      />
    );
    const main = (
      <div className="flex flex-col flex-1 overflow-hidden" style={{ background: "var(--color-bg)" }}>
        {!isAuthenticated && <DemoModeBanner className="mx-6 mt-4 mb-2" />}
        <TaskPageHeader
          capsVariant="regular"
          filterLabel={FILTERS.find((f) => f.value === activeFilter)?.label ?? "All"}
          activeCategory={activeCategory}
          newTaskLabel="New task"
          isAuthenticated={isAuthenticated}
          onNewTask={() => setShowNewTask(true)}
          controls={
            <TaskListControls
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
          {!isAuthenticated && <DemoModeBanner />}

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
export default function Page() {
  return (
    <Suspense>
      <Home />
    </Suspense>
  );
}
