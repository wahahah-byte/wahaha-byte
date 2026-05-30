import { useCallback, useEffect, useRef, useState } from "react";
import { router, useFocusEffect } from "expo-router";
import type { BottomSheetScrollView } from "@gorhom/bottom-sheet";

import {
  type CheckInCycleDto,
  getNextDueDate,
  isOverdue,
  willStreakResetOnCheckIn,
  type TaskDto,
  type UpdateTaskRequest,
} from "@wahaha/shared";
import { tasksApi } from "@/lib/api";
import { taskCache } from "@/lib/task-cache";
import { taskEvents } from "@/lib/task-events";
import { useUndo } from "@/context/undo-context";
import type { TaskFormValues } from "@/components/task-form";
import { awaitPendingLogFlushes, useQuickLog } from "@/hooks/use-quick-log";
import { useSubtaskOperations } from "@/hooks/use-subtask-operations";

// All state + data loading + mutation handlers for the task-detail screen.
// Extracted whole from the screen component so the render layer stays thin;
// behavior is identical (handlers are plain async closures as before).
export function useTaskDetail(id: string) {
  const undo = useUndo();

  // Seed from list task cache so first frame renders content without spinner.
  const [task, setTask] = useState<TaskDto | null>(() => taskCache.read(id) ?? null);
  const [loading, setLoading] = useState(() => !taskCache.read(id));
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  // Overflow menu (Archive) anchored to header.
  const [menuOpen, setMenuOpen] = useState(false);
  // Body scroll ref for scrollToEnd on subtask focus.
  const scrollRef = useRef<React.ComponentRef<typeof BottomSheetScrollView>>(null);
  // Measured header + footer heights so absolute-positioned body has bounded height.
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  // Blocks sheet dismissal while check-in POST is in flight (~200ms).
  const [checkingIn, setCheckingIn] = useState(false);
  // Custom-log modal (opened by tapping the counter widget).
  const [customLogOpen, setCustomLogOpen] = useState(false);
  // Keep slider mounted after commit so footer doesn't collapse.
  const sliderEverShownRef = useRef(false);

  const load = useCallback(async () => {
    setError(null);
    // Wait for any in-flight log flush from a prior dismiss so the GET sees the new cycle.
    await awaitPendingLogFlushes(id);
    const res = await tasksApi.getById(id);
    if (!res.data) {
      setError(res.error ?? "Task not found.");
      return;
    }
    // Merge into existing task to preserve cached fields (e.g. streak from list).
    const fresh = res.data;
    let mergedForCache: TaskDto | null = null;
    setTask((prev) => {
      if (!prev) { mergedForCache = fresh; return fresh; }
      const merged: TaskDto = { ...prev };
      for (const k of Object.keys(fresh) as (keyof TaskDto)[]) {
        const v = fresh[k];
        if (v !== undefined) (merged as unknown as Record<string, unknown>)[k as string] = v;
      }
      mergedForCache = merged;
      return merged;
    });
    // Cache merged task so all known fields accumulate.
    if (mergedForCache) taskCache.set(mergedForCache);
  }, [id]);

  useEffect(() => {
    // Spinner only on cache miss; cached snapshot fetches silently in bg.
    const hadCache = !!taskCache.read(id);
    if (!hadCache) setLoading(true);
    load().finally(() => setLoading(false));
  }, [load, id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  // Sync with underlying TaskList mutations (e.g. list-fired undo).
  useEffect(() => {
    return taskEvents.subscribeRefreshRequested(() => { load(); });
  }, [load]);

  // Append a freshly-logged counter cycle so heatmap + button overshoot math see it.
  const appendCycle = useCallback((cycle: CheckInCycleDto) => {
    setTask((prev) => prev
      ? { ...prev, recentCycles: [cycle, ...(prev.recentCycles ?? [])] }
      : prev,
    );
  }, []);

  const flushQuickLog = useCallback(
    async (taskId: string, delta: number): Promise<CheckInCycleDto | null> => {
      if (delta === 0) return null;
      // Optimistic cache stub before the network round-trip: a reopen that
      // lands during an in-flight flush (typical "close modal before debounce
      // settles, immediately reopen") would otherwise read the pre-log
      // cycleSum and snap to the real value only after the GET finishes.
      const todayIso = new Date().toISOString().split("T")[0];
      const stubCycleId = -Math.floor(Math.random() * 1_000_000_000) - 1;
      const stubCycle: CheckInCycleDto = {
        cycleId: stubCycleId,
        taskId,
        checkInDate: todayIso,
        counterValue: delta,
        createdAt: new Date().toISOString(),
        cycleType: "log",
      };
      const beforeCached = taskCache.read(taskId);
      if (beforeCached) {
        taskCache.set({
          ...beforeCached,
          recentCycles: [stubCycle, ...(beforeCached.recentCycles ?? [])],
        });
      }
      const res = await tasksApi.logCounter(taskId, delta);
      if (res.error) {
        // Roll back the stub on failure so cycleSum doesn't carry phantom logs.
        const rb = taskCache.read(taskId);
        if (rb) {
          taskCache.set({
            ...rb,
            recentCycles: (rb.recentCycles ?? []).filter((c) => c.cycleId !== stubCycleId),
          });
        }
        if (res.status === 404) return null;
        if (res.status === 400 && /already checked in/i.test(res.error)) return null;
        const signed = `${delta > 0 ? "+" : ""}${delta}`;
        setError(`Couldn't save log (${signed}): ${res.error}`);
        return null;
      }
      if (!res.data) return null;
      // Swap the stub for the authoritative cycle from the server response so
      // the next modal mount sees the real cycleId.
      const afterCached = taskCache.read(taskId);
      if (afterCached) {
        taskCache.set({
          ...afterCached,
          recentCycles: [
            res.data,
            ...(afterCached.recentCycles ?? []).filter((c) => c.cycleId !== stubCycleId),
          ],
        });
      }
      appendCycle(res.data);
      return res.data;
    },
    [appendCycle],
  );

  const quickLog = useQuickLog({
    task,
    heatmapCycles: task?.recentCycles ?? [],
    onFlushQuickLog: flushQuickLog,
  });

  const subtasks = useSubtaskOperations({ task, setTask, setError, load });

  async function handleCheckIn(counterValue?: number) {
    if (!task) return;
    // Block dismissal until POST returns (~200ms) so list sees cycleId before user.
    setCheckingIn(true);
    // Optimistic broadcast — TaskList reshuffles row to "Checked In" instantly.
    const todayIso = new Date().toISOString().split("T")[0];
    // Overdue: advance from today so daily lands tomorrow, not stale today.
    const dueBase = task.recurrenceRule && isOverdue(task.dueDate) ? todayIso : task.dueDate;
    const nextDueIso = task.recurrenceRule
      ? getNextDueDate(dueBase, task.recurrenceRule)
      : task.dueDate ?? todayIso;
    // Predict streak (matches server logic) so list badge updates same frame.
    const willResetStreak = willStreakResetOnCheckIn(task.recurrenceRule, task.lastCheckInDate, task.dueDate);
    const predictedStreak = willResetStreak ? 1 : (task.currentStreakCount ?? 0) + 1;
    const predictedLongest = Math.max(task.longestStreakCount ?? 0, predictedStreak);
    taskEvents.emitCheckedIn({
      taskId: task.taskId,
      lastCheckInDateIso: todayIso,
      nextDueDateIso: nextDueIso,
      currentStreakCount: predictedStreak,
      longestStreakCount: predictedLongest,
    });
    // Optimistic local patch so canCheckIn flips immediately. When the
    // check-in carries an absolute counterValue, also splice today's log
    // cycles out of recentCycles and insert a stub checkin cycle so the
    // displayed daily total snaps to the committed value — otherwise
    // consumePending() drops pendingLog to 0 first and the user briefly
    // sees the old preserved-from-undo value until load() returns.
    const stubCycleId = -Math.floor(Math.random() * 1_000_000_000) - 1;
    setTask((prev) => {
      if (!prev) return prev;
      const patchedCycles = counterValue !== undefined
        ? [
            {
              cycleId: stubCycleId,
              taskId: prev.taskId,
              checkInDate: todayIso,
              counterValue,
              createdAt: new Date().toISOString(),
              cycleType: "checkin" as const,
            },
            ...(prev.recentCycles ?? []).filter(
              (c) => c.checkInDate.split("T")[0] !== todayIso,
            ),
          ]
        : prev.recentCycles;
      return {
        ...prev,
        lastCheckInDate: todayIso,
        dueDate: nextDueIso ?? prev.dueDate,
        currentStreakCount: predictedStreak,
        longestStreakCount: predictedLongest,
        recentCycles: patchedCycles,
      };
    });
    try {
      const res = await tasksApi.checkIn(task.taskId, counterValue);
      if (res.error) { setError(res.error); return; }
      if (res.data) {
        // Hand authoritative cycle data to list so subsequent row tap routes to undo.
        taskEvents.emitCheckInCommitted({
          taskId: task.taskId,
          cycleId: res.data.cycleId,
          checkInDateIso: todayIso,
          nextDueDateIso: res.data.nextDueDate || nextDueIso || todayIso,
          currentStreakCount: res.data.streakCount,
          longestStreakCount: res.data.longestCount,
        });
      }
      await load();
    } finally {
      // Release dismissal lock; list is now fully consistent.
      setCheckingIn(false);
    }
  }

  // Counter-task check-in. When the user has signalled a counter intent in
  // this session (tap-buffered, slide tap-absorption, or a custom-log Set
  // that lowered pendingLog below zero), commit the absolute today-total so
  // the new cycle represents "today equals X". The server consolidates any
  // existing log cycles for the day, so the preserved value from a prior
  // undo can't double-count. With no user signal we pass undefined and the
  // server leaves existing log cycles intact (the silent "just slide to
  // confirm what's already there" path).
  async function handleCheckInWithCounter(touchValue: number) {
    if (!task) return;
    const buffered = quickLog.consumePending();
    const hasUserSignal = buffered !== 0 || touchValue !== 0;
    if (!hasUserSignal) {
      await handleCheckIn(undefined);
      return;
    }
    let absolute = Math.max(0, quickLog.cycleSumToday + buffered + touchValue);
    // Cap-at-goal: post-undo path can carry an already-at-goal cycleSumToday
    // plus the slide's absorbed +1, which would otherwise overshoot.
    if (task.capLogAtGoal && task.counterGoal != null && absolute > task.counterGoal) {
      absolute = task.counterGoal;
    }
    await handleCheckIn(absolute);
  }

  // Custom-log modal submit: edit semantics — `amount` is the new absolute total for today.
  // If the new total meets the goal, auto-checkin with it; otherwise set pending to the signed delta.
  function handleCustomLogSubmit(amount: number) {
    if (!task || amount < 0) return;
    setCustomLogOpen(false);
    // Defense-in-depth: even though the modal already clamps, hard-cap the
    // amount here when capLogAtGoal is on so no codepath can write more than
    // the goal into the cycle.
    const clamped =
      task.capLogAtGoal && task.counterGoal != null && amount > task.counterGoal
        ? task.counterGoal
        : amount;
    const wouldOvershoot =
      task.counterGoal != null && clamped >= task.counterGoal;
    if (wouldOvershoot) {
      // The entered amount IS the absolute total. Bypass the slide wrapper
      // (which would add cycleSumToday + buffered on top) and commit
      // directly so the new checkin cycle replaces today's running total.
      quickLog.consumePending();
      void handleCheckIn(clamped);
      return;
    }
    quickLog.setPending(clamped);
  }

  async function handleStart() {
    if (!task) return;
    const res = await tasksApi.start(task.taskId);
    if (res.error) { setError(res.error); return; }
    await load();
  }

  async function handleComplete() {
    if (!task) return;
    const res = await tasksApi.complete(task.taskId);
    if (res.error) { setError(res.error); return; }
    await load();
  }

  async function handlePause() {
    if (!task) return;
    const dto: UpdateTaskRequest = {
      taskId: task.taskId,
      title: task.title,
      description: task.description ?? undefined,
      category: task.category,
      priority: task.priority,
      status: "pending",
      pointValue: task.pointValue,
      dueDate: task.dueDate ?? undefined,
      isRecurring: task.isRecurring,
      recurrenceRule: task.recurrenceRule ?? undefined,
      submitted: task.submitted,
    };
    const res = await tasksApi.update(task.taskId, dto);
    if (res.error) { setError(res.error); return; }
    await load();
  }

  // Reverts completed-but-not-submitted task to in_progress.
  async function handleUndoComplete() {
    if (!task) return;
    const dto: UpdateTaskRequest = {
      taskId: task.taskId,
      title: task.title,
      description: task.description ?? undefined,
      category: task.category,
      priority: task.priority,
      status: "in_progress",
      pointValue: task.pointValue,
      dueDate: task.dueDate ?? undefined,
      completedAt: undefined,
      isRecurring: task.isRecurring,
      recurrenceRule: task.recurrenceRule ?? undefined,
      submitted: task.submitted,
    };
    const res = await tasksApi.update(task.taskId, dto);
    if (res.error) { setError(res.error); return; }
    await load();
  }

  async function handleArchive() {
    if (!task) return;
    const fn = task.isArchived ? tasksApi.unarchive : tasksApi.archive;
    const res = await fn(task.taskId);
    if (res.error) { setError(res.error); return; }
    router.back();
  }

  function handleDelete() {
    if (!task) return;
    // No confirm — overflow tap is enough intent. Defer the DELETE through the undo toast.
    const snapshot = task;
    taskCache.remove(snapshot.taskId);
    // Notify any open list to drop the row immediately.
    taskEvents.publishDeleted(snapshot.taskId);
    router.back();
    undo.arm({
      prefix: "Deleted",
      subject: snapshot.title,
      onUndo: () => {
        taskCache.set(snapshot);
        taskEvents.publishRestored(snapshot);
      },
      onCommit: async () => {
        const res = await tasksApi.delete(snapshot.taskId);
        if (res.error) {
          // Best-effort surfacing — detail screen unmounted, so republish for the list.
          taskEvents.publishRestored(snapshot);
        }
      },
    });
  }

  async function handleEditSubmit(v: TaskFormValues): Promise<string | null> {
    if (!task) return "Task not loaded.";
    const goalNum =
      v.isRecurring && v.hasCounter && v.counterGoal.trim() !== "" && Number(v.counterGoal) > 0
        ? Number(v.counterGoal)
        : null;
    const dto: UpdateTaskRequest = {
      taskId: task.taskId,
      title: v.title,
      description: v.description || undefined,
      category: v.category,
      priority: v.priority,
      status: task.status,
      pointValue: v.pointValue,
      dueDate: v.dueDate ?? undefined,
      completedAt: task.completedAt ?? undefined,
      isRecurring: v.isRecurring,
      recurrenceRule: v.isRecurring ? v.recurrenceRule : undefined,
      submitted: task.submitted,
      hasCounter: v.isRecurring ? v.hasCounter : false,
      counterUnit: v.isRecurring && v.hasCounter && v.counterUnit ? v.counterUnit : null,
      counterGoal: goalNum,
      capLogAtGoal: v.isRecurring && v.hasCounter && v.capLogAtGoal && goalNum != null,
    };
    const res = await tasksApi.update(task.taskId, dto);
    if (res.error) return res.error;
    await load();
    setIsEditing(false);
    return null;
  }

  return {
    task,
    loading,
    error,
    setError,
    ...subtasks,
    isEditing,
    setIsEditing,
    menuOpen,
    setMenuOpen,
    scrollRef,
    headerHeight,
    setHeaderHeight,
    footerHeight,
    setFooterHeight,
    checkingIn,
    customLogOpen,
    setCustomLogOpen,
    sliderEverShownRef,
    quickLog,
    load,
    handleCheckIn,
    handleCheckInWithCounter,
    handleCustomLogSubmit,
    handleStart,
    handleComplete,
    handlePause,
    handleUndoComplete,
    handleArchive,
    handleDelete,
    handleEditSubmit,
  };
}
