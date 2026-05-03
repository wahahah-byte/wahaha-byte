"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { tasksApi, TaskDto, UpdateTaskRequest } from "@/lib/api/tasks";
import NewTaskModal from "@/components/NewTaskModal";
import TaskDetailModal, { EditableTaskFields } from "@/components/TaskDetailModal";
import TaskRow from "@/components/TaskRow";
import SubmitBar from "@/components/SubmitBar";
import CapWarningModal from "@/components/CapWarningModal";
import TaskListControls from "@/components/TaskListControls";
import TasksHeader from "@/components/TasksHeader";
import UnsubmittedSummary from "@/components/UnsubmittedSummary";
import { useTaskActions } from "@/hooks/useTaskActions";
import { useTaskSubmission } from "@/hooks/useTaskSubmission";
import { useTasks } from "@/hooks/useTasks";
import { canCheckInNow } from "@/lib/dateUtils";
import { FILTERS } from "@/lib/constants";
import { buildListItems, chunkListItems, GroupMode, SortMode } from "@/lib/taskList";
import { usePoints } from "@/context/PointsContext";

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab = searchParams.get("tab");
  const initialActiveFilter = initialTab && FILTERS.some((f) => f.value === initialTab) ? initialTab : "all";

  const tasksHook = useTasks({ initialFilterFromUrl: initialTab });
  const {
    tasks, setTasks, loading, setError,
    isMounted, isAuthenticated, penalizedTaskIds, submittedSeed,
  } = tasksHook;

  const [activeFilter, setActiveFilter] = useState(initialActiveFilter);
  const [showNewTask, setShowNewTask] = useState(false);
  const [detailTask, setDetailTask] = useState<TaskDto | null>(null);
  const [overdueRestartTaskId, setOverdueRestartTaskId] = useState<string | null>(null);
  const [groupMode, setGroupMode] = useState<GroupMode>("none");
  const [sortMode, setSortMode] = useState<SortMode>("due");

  const { setUnsubmittedPoints } = usePoints();
  const submission = useTaskSubmission({ tasks, isAuthenticated, setError });

  const {
    selectedIds, setSelectedIds, stagedTaskIds, setStagedTaskIds,
    submittedTaskIds, setSubmittedTaskIds, filingIds, recentlyFiledIds, errorIds,
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
      setError,
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

  function applyFilter(value: string) {
    setActiveFilter(value);
    tasksHook.setFilterStatus(value);
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

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#1e1f22" }}>
        <div className="w-5 h-5 border-2 border-[#333] border-t-[#5bb8e0] rounded-full animate-spin" />
      </div>
    );
  }

  const submitBarVisible = activeFilter === "completed" && selectedIds.size > 0;

  const listItems = buildListItems({ tasks, activeFilter, groupMode, sortMode, submittedTaskIds });

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

          <div style={{ position: "sticky", top: 51, zIndex: 20, background: "#1e1f22" }}>
            <TasksHeader isAuthenticated={isAuthenticated} onNewTask={() => setShowNewTask(true)} />

            <div className="flex items-center mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => applyFilter(f.value)}
                  className="px-2 sm:px-4 py-3 text-[11px] sm:text-xs tracking-wide sm:tracking-wider uppercase cursor-pointer transition-colors relative flex items-center gap-1.5 whitespace-nowrap"
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
              <TaskListControls
                sortMode={sortMode}
                groupMode={groupMode}
                onSortChange={setSortMode}
                onGroupChange={setGroupMode}
              />
            </div>

            <div
              className="grid text-[10px] tracking-widest uppercase px-4 py-2 select-none"
              style={{ gridTemplateColumns: "1fr 64px 80px", color: "rgba(255,255,255,0.55)", position: "relative", zIndex: 2, background: "#1e1f22" }}
            >
              <span>Name</span>
              <span className="text-center">Due</span>
              <span className="text-center">Points</span>
            </div>
          </div>

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

          {!loading && activeFilter === "pending" && listItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-sm tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>No pending tasks</p>
            </div>
          )}

          {activeFilter === "completed" && !loading && (
            <UnsubmittedSummary
              unsubmitted={unsubmitted}
              allSelected={allUnsubmittedSelected}
              onToggleSelectAll={() => {
                if (allUnsubmittedSelected) {
                  setSelectedIds((prev) => { const n = new Set(prev); unsubmitted.forEach((t) => n.delete(t.taskId)); return n; });
                } else {
                  setSelectedIds((prev) => new Set([...prev, ...unsubmitted.map((t) => t.taskId)]));
                }
              }}
            />
          )}

          {!loading && chunkListItems(listItems).map((chunk, idx) => (
            <div key={chunk.sep?.sepKey ?? `__chunk-${idx}`}>
              {chunk.sep && (
                <div className={`flex items-center gap-3 px-1 ${idx === 0 ? "mb-1" : "mt-2 mb-1"}`}>
                  <span className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>{chunk.sep.label}</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                </div>
              )}
              {chunk.tasks.length > 0 && (
                <div className="flex flex-col" style={{ background: "#1a1b1f", overflow: "hidden" }}>
                  <div className="task-row-wrapper task-row-phantom" aria-hidden="true">
                    <div className="task-row-inner" style={{ position: "absolute", inset: 0 }} />
                  </div>
                  {chunk.tasks.map((item) => (
                    <TaskRow
                      key={item.taskId}
                      task={item}
                      activeFilter={activeFilter}
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
                      onCheckIn={handleCheckIn}
                      onPause={handlePause}
                      onDelete={handleDelete}
                      onSkip={handleSkip}
                      onToggleSelect={toggleSelect}
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
          ))}

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
            onCheckIn={dt.status === "pending" && dt.isRecurring && canCheckInNow(dt.dueDate, dt.recurrenceRule, dt.lastCheckInDate) ? () => { closeDetail(); handleCheckIn(dt); } : undefined}
            checkInBlocked={dt.status === "pending" && dt.isRecurring && !canCheckInNow(dt.dueDate, dt.recurrenceRule, dt.lastCheckInDate)}
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
