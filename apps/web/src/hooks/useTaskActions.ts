"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { tasksApi, TaskDto, UndoCheckInResponse } from "@/lib/api/tasks";
import { usersApi } from "@/lib/api/users";
import { usePoints } from "@/context/PointsContext";
import { dateKey, getNextDueDate, parseLocalDate, getPrevPeriodStart, isOverdue, willStreakResetOnCheckIn } from "@/lib/dateUtils";
import { RECURRING_CAP } from "@/lib/constants";

// True when streak increment crosses a bonus boundary (3, 7, 14, 30); used for haptic pattern.
function crossesTierBoundary(prev: number, next: number): boolean {
  for (const at of [3, 7, 14, 30]) {
    if (prev < at && next >= at) return true;
  }
  return false;
}

function vibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try { navigator.vibrate(pattern); } catch { /* iOS Safari throws on some PWAs */ }
}

// useEvent-style helper: stable callback that always invokes the latest handler.
function useEvent<A extends unknown[], R>(handler: (...args: A) => R): (...args: A) => R {
  const ref = useRef(handler);
  useLayoutEffect(() => {
    ref.current = handler;
  });
  return useCallback((...args: A) => ref.current(...args), []);
}

interface UseTaskActionsOptions {
  tasks: TaskDto[];
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>;
  isAuthenticated: boolean;
  stagedTaskIds: string[];
  setStagedTaskIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  submittedTaskIds: Set<string>;
  setError: (msg: string) => void;
  setSuccess?: (msg: string) => void;
  // Optional: dismiss the detail panel when a task is deleted to avoid stale modal.
  setDetailTask?: React.Dispatch<React.SetStateAction<TaskDto | null>>;
}

export function useTaskActions({
  tasks, setTasks, isAuthenticated,
  stagedTaskIds, setStagedTaskIds,
  selectedIds, setSelectedIds,
  submittedTaskIds, setError, setSuccess,
  setDetailTask,
}: UseTaskActionsOptions) {
  const { recurringSubmittedToday, setRecurringSubmittedToday, setDailySubmitted, setBalance, updateStaged } = usePoints();

  const [advancing, setAdvancing] = useState<string | null>(null);
  const [pausing, setPausing] = useState<string | null>(null);
  const [slashingId, setSlashingId] = useState<string | null>(null);

  // 5s undo window after auth-mode check-in; cleared on dismiss/expiry.
  const [undoableCheckIn, setUndoableCheckIn] = useState<{ taskId: string; cycleId: number; taskTitle: string } | null>(null);
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 5s undo window after a delete; actual DELETE call is deferred until expiry or explicit dismiss.
  const [undoableDelete, setUndoableDelete] = useState<{ taskId: string; taskTitle: string } | null>(null);
  const pendingDeleteRef = useRef<{ snapshot: TaskDto; wasStaged: boolean } | null>(null);
  const pendingDeleteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissUndoableCheckIn = useCallback(() => {
    if (undoTimeoutRef.current) { clearTimeout(undoTimeoutRef.current); undoTimeoutRef.current = null; }
    setUndoableCheckIn(null);
  }, []);

  const armUndoToast = useCallback((taskId: string, cycleId: number, taskTitle: string) => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    setUndoableCheckIn({ taskId, cycleId, taskTitle });
    undoTimeoutRef.current = setTimeout(() => {
      setUndoableCheckIn(null);
      undoTimeoutRef.current = null;
    }, 5000);
  }, []);
  const [recurringPopups, setRecurringPopups] = useState<Map<string, number>>(new Map());
  // Tier-up banner removed; streak milestones convey via in-row pop + StreakDisplay multiplier.

  const handleAdvance = useEvent(async function handleAdvance(task: TaskDto) {
    if (advancing === task.taskId) return;
    const canUndo = task.status === "completed" && !submittedTaskIds.has(task.taskId) && !task.pointsAwarded;
    setAdvancing(task.taskId);

    if (!isAuthenticated) {
      if (task.status === "pending" && !task.isRecurring) {
        setTasks((prev) => prev.map((t) => t.taskId === task.taskId ? { ...t, status: "in_progress" } : t));
      } else if (task.status === "in_progress") {
        if (task.pointValue) {
          setStagedTaskIds((prev) => [...prev, task.taskId]);
          setSelectedIds((prev) => new Set([...prev, task.taskId]));
          updateStaged(task.pointValue);
        }
        setTasks((prev) => prev.map((t) => t.taskId === task.taskId
          ? { ...t, status: "completed", completedAt: new Date().toISOString(), submitted: false }
          : t
        ));
      } else if (canUndo) {
        if (stagedTaskIds.includes(task.taskId)) {
          setStagedTaskIds((prev) => prev.filter((id) => id !== task.taskId));
          updateStaged(-(task.pointValue ?? 0));
        }
        setSelectedIds((prev) => { const n = new Set(prev); n.delete(task.taskId); return n; });
        setTasks((prev) => prev.map((t) => t.taskId === task.taskId ? { ...t, status: "in_progress", completedAt: null } : t));
      }
      setAdvancing(null);
      return;
    }

    if (task.status === "pending") {
      const { error } = await tasksApi.start(task.taskId);
      setAdvancing(null);
      if (error) { setError(error); return; }
      setTasks((prev) => prev.map((t) => t.taskId === task.taskId ? { ...t, status: "in_progress" } : t));

    } else if (task.status === "in_progress") {
      const { error } = await tasksApi.complete(task.taskId);
      if (error) { setAdvancing(null); setError(error); return; }

      if (task.isRecurring && task.recurrenceRule) {
        const recurringRemaining = RECURRING_CAP - recurringSubmittedToday;
        const nextDue = getNextDueDate(task.dueDate, task.recurrenceRule);

        if (recurringRemaining > 0) {
          const { data: submitData, error: submitError } = await usersApi.submitPoints([task.taskId]);
          if (submitError) {
            setAdvancing(null);
            setError(submitError);
            setTasks((prev) => prev.map((t) => t.taskId === task.taskId ? { ...t, status: "completed", completedAt: new Date().toISOString() } : t));
            return;
          }
          const awarded = submitData!.pointsAwarded ?? 0;
          setRecurringSubmittedToday(submitData!.recurringDailyTotal);
          setDailySubmitted(submitData!.dailyTotal);
          setBalance(submitData!.newBalance);

          if (awarded > 0) {
            setRecurringPopups((prev) => new Map(prev).set(task.taskId, awarded));
            setTimeout(() => setRecurringPopups((prev) => { const n = new Map(prev); n.delete(task.taskId); return n; }), 1900);
            await new Promise((r) => setTimeout(r, 420));
          }
        }

        await tasksApi.update(task.taskId, {
          taskId: task.taskId, title: task.title,
          description: task.description ?? undefined, category: task.category,
          priority: task.priority, status: "pending", pointValue: task.pointValue,
          dueDate: nextDue, completedAt: undefined,
          isRecurring: task.isRecurring, recurrenceRule: task.recurrenceRule,
          submitted: false,
        });
        setAdvancing(null);
        // Completing recurring task records an implicit check-in; mirror handleCheckIn's local patch.
        // checkInDate uses local-midnight-as-fake-UTC so heatmap/undo/wasCheckedInToday agree.
        const todayIso = dateKey(new Date());
        const synthCycle = {
          cycleId: -Date.now(),
          taskId: task.taskId,
          checkInDate: `${todayIso}T00:00:00Z`,
          counterValue: null,
          createdAt: new Date().toISOString(),
          cycleType: "checkin" as const,
        };
        setTasks((prev) => prev.map((t) => t.taskId === task.taskId
          ? { ...t, status: "pending", dueDate: nextDue, completedAt: null, submitted: false,
              lastCheckInDate: todayIso,
              recentCycles: [synthCycle, ...(t.recentCycles ?? [])],
              subtasks: t.subtasks?.map((s) => ({ ...s, completed: false, setsCompleted: null })) }
          : t
        ));
      } else {
        setAdvancing(null);
        if (task.pointValue) {
          setStagedTaskIds((prev) => [...prev, task.taskId]);
          setSelectedIds((prev) => new Set([...prev, task.taskId]));
          updateStaged(task.pointValue);
        }
        setTasks((prev) => prev.map((t) => t.taskId === task.taskId
          ? { ...t, status: "completed", completedAt: new Date().toISOString(), submitted: false }
          : t
        ));
      }

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
        updateStaged(-(task.pointValue ?? 0));
      }
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(task.taskId); return n; });
      setTasks((prev) => prev.map((t) => t.taskId === task.taskId ? { ...t, status: "in_progress", completedAt: null } : t));
    } else {
      setAdvancing(null);
    }
  });

  const handleCheckIn = useEvent(async function handleCheckIn(task: TaskDto, counterValue?: number) {
    if (advancing === task.taskId) return;
    setAdvancing(task.taskId);
    const todayIso = dateKey(new Date());
    if (!isAuthenticated) {
      let nextDue = getNextDueDate(task.dueDate, task.recurrenceRule!);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      while (parseLocalDate(nextDue).getTime() <= todayDate.getTime()) {
        nextDue = getNextDueDate(nextDue, task.recurrenceRule!);
      }
      const prevCount = task.currentStreakCount ?? 0;
      const newCount = prevCount + 1;
      setRecurringPopups((prev) => new Map(prev).set(task.taskId, task.pointValue));
      setTimeout(() => setRecurringPopups((prev) => { const n = new Map(prev); n.delete(task.taskId); return n; }), 1900);
      // Tier transitions used to fire banner; now only haptic pattern differentiates.
      const isTierTransition = crossesTierBoundary(prevCount, newCount);
      vibrate(isTierTransition ? [15, 30, 60] : 20);
      // checkInDate must match server's local-midnight-as-fake-UTC convention.
      const checkInDateLocalAsFakeUtc = `${todayIso}T00:00:00Z`;
      const synthCycle = {
        cycleId: -Date.now(),
        taskId: task.taskId,
        checkInDate: checkInDateLocalAsFakeUtc,
        counterValue: counterValue ?? null,
        createdAt: new Date().toISOString(),
        cycleType: "checkin" as const,
      };
      setTasks((prev) => prev.map((t) => t.taskId === task.taskId
        ? { ...t, dueDate: nextDue, lastCheckInDate: todayIso, currentStreakCount: newCount, longestStreakCount: Math.max(newCount, t.longestStreakCount ?? 0), recentCycles: [synthCycle, ...(t.recentCycles ?? [])],
            subtasks: t.subtasks?.map((s) => ({ ...s, completed: false, setsCompleted: null })) }
        : t
      ));
      setAdvancing(null);
      return;
    }
    const prevCount = task.currentStreakCount ?? 0;
    const prevDueDate = task.dueDate;
    const prevLastCheckIn = task.lastCheckInDate;
    // Optimistic patch so row reflects new cycle state immediately; server reconciles below.
    // Streak mirrors server reset rule; dueDate forward by one period (catch-up if overdue).
    const willResetStreak = willStreakResetOnCheckIn(task.recurrenceRule, task.lastCheckInDate, task.dueDate);
    const predictedStreak = willResetStreak ? 1 : prevCount + 1;
    const dueBase = task.isRecurring && willResetStreak ? todayIso : task.dueDate;
    const predictedDueDate = task.isRecurring && task.recurrenceRule
      ? getNextDueDate(dueBase, task.recurrenceRule)
      : task.dueDate;
    setTasks((prev) => prev.map((t) => t.taskId === task.taskId
      ? { ...t, currentStreakCount: predictedStreak, longestStreakCount: Math.max(t.longestStreakCount ?? 0, predictedStreak), dueDate: predictedDueDate, lastCheckInDate: todayIso }
      : t
    ));
    const { data, error } = await tasksApi.checkIn(task.taskId, counterValue);
    if (error) {
      // Roll back the optimistic patch on error.
      setTasks((prev) => prev.map((t) => t.taskId === task.taskId
        ? { ...t, currentStreakCount: prevCount, dueDate: prevDueDate, lastCheckInDate: prevLastCheckIn }
        : t
      ));
      setAdvancing(null); setError(error); return;
    }
    const awarded = data!.pointsAwarded;
    setRecurringSubmittedToday(data!.recurringDailyTotal);
    setDailySubmitted((prev) => prev + awarded);
    setBalance(data!.newBalance);

    if (awarded > 0) {
      setRecurringPopups((prev) => new Map(prev).set(task.taskId, awarded));
      setTimeout(() => setRecurringPopups((prev) => { const n = new Map(prev); n.delete(task.taskId); return n; }), 1900);
    }

    const isTierTransition = crossesTierBoundary(prevCount, data!.streakCount);
    vibrate(isTierTransition ? [15, 30, 60] : 20);
    // Streak-bonus toast removed; conveyed by in-row pop + StreakDisplay multiplier.

    let nextDueDate = data!.nextDueDate || task.dueDate;
    if (nextDueDate && task.recurrenceRule) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (task.recurrenceRule === "daily") {
        const nd = parseLocalDate(nextDueDate);
        if (nd <= today) {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          nextDueDate = dateKey(tomorrow);
        }
      } else if (task.recurrenceRule !== "weekdays") {
        const nd = parseLocalDate(nextDueDate);
        if (today > getPrevPeriodStart(nd, task.recurrenceRule)) {
          nextDueDate = getNextDueDate(nextDueDate, task.recurrenceRule);
        }
      }
    }
    setAdvancing(null);
    // Append new cycle so in-row Undo + today-chip + heatmap find cycleId without refetch.
    const checkInDateLocalAsFakeUtc = `${todayIso}T00:00:00Z`;
    const newCycle = {
      cycleId: data!.cycleId,
      taskId: task.taskId,
      checkInDate: checkInDateLocalAsFakeUtc,
      counterValue: counterValue ?? null,
      createdAt: new Date().toISOString(),
      cycleType: "checkin" as const,
    };
    setTasks((prev) => prev.map((t) => t.taskId === task.taskId
      ? { ...t, status: "pending", dueDate: nextDueDate, lastCheckInDate: todayIso, completedAt: null, submitted: false,
          currentStreakCount: data!.streakCount, longestStreakCount: data!.longestCount,
          recentCycles: [newCycle, ...(t.recentCycles ?? [])],
          subtasks: t.subtasks?.map((s) => ({ ...s, completed: false, setsCompleted: null })) }
      : t
    ));
    armUndoToast(task.taskId, data!.cycleId, task.title);
  });

  const handleUndoCheckIn = useEvent(async function handleUndoCheckIn(task: TaskDto, cycleId: number): Promise<UndoCheckInResponse | null> {
    // Demo / unauthenticated: best-effort local rollback without server history.
    if (!isAuthenticated) {
      setTasks((prev) => prev.map((t) => {
        if (t.taskId !== task.taskId) return t;
        const cycles = (t.recentCycles ?? []).filter((c) => c.cycleId !== cycleId);
        const newStreak = Math.max(0, (t.currentStreakCount ?? 0) - 1);
        return {
          ...t,
          recentCycles: cycles,
          currentStreakCount: newStreak,
          dueDate: dateKey(getPrevPeriodStart(parseLocalDate(t.dueDate ?? ""), t.recurrenceRule ?? "daily")),
          lastCheckInDate: null,
        };
      }));
      return null;
    }
    // Optimistic streak decrement; server reconciles below.
    setTasks((prev) => prev.map((t) => t.taskId === task.taskId
      ? { ...t, currentStreakCount: Math.max(0, (t.currentStreakCount ?? 0) - 1) }
      : t));
    const { data, error } = await tasksApi.undoCheckIn(task.taskId, cycleId);
    if (error) { setError(error); return null; }
    setBalance(data!.newBalance);
    setRecurringSubmittedToday(data!.recurringDailyTotal);
    if (data!.pointsRefunded > 0) {
      setDailySubmitted((prev) => Math.max(0, prev - data!.pointsRefunded));
    }
    setTasks((prev) => prev.map((t) => {
      if (t.taskId !== task.taskId) return t;
      const cycles = (t.recentCycles ?? []).filter((c) => c.cycleId !== cycleId);
      // Empty string from server = "no prior check-in"; clear local lastCheckInDate.
      const restoredLastCheckIn = data!.previousLastCheckInDate || null;
      // No PreviousDueDate snapshot? Roll t.dueDate back one period as fallback.
      const restoredDueDate = data!.previousDueDate
        || (t.dueDate && t.recurrenceRule
          ? dateKey(getPrevPeriodStart(parseLocalDate(t.dueDate), t.recurrenceRule))
          : t.dueDate);
      return {
        ...t,
        recentCycles: cycles,
        currentStreakCount: data!.streakCount,
        longestStreakCount: data!.longestCount,
        dueDate: restoredDueDate,
        lastCheckInDate: restoredLastCheckIn,
      };
    }));
    return data!;
  });

  const handleDeleteLogCycle = useEvent(async function handleDeleteLogCycle(task: TaskDto, cycleId: number) {
    setTasks((prev) => prev.map((t) => t.taskId === task.taskId
      ? { ...t, recentCycles: (t.recentCycles ?? []).filter((c) => c.cycleId !== cycleId) }
      : t
    ));
    if (!isAuthenticated) return;
    const { error } = await tasksApi.deleteLogCycle(task.taskId, cycleId);
    if (error) { setError(error); return; }
  });

  const handlePause = useEvent(async function handlePause(task: TaskDto) {
    setPausing(task.taskId);
    if (!isAuthenticated) {
      setTasks((prev) => prev.map((t) => t.taskId === task.taskId ? { ...t, status: "pending" } : t));
      setPausing(null);
      return;
    }
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
    setTasks((prev) => prev.map((t) => t.taskId === task.taskId ? { ...t, status: "pending" } : t));
  });

  // Commits any pending delete by firing the actual DELETE; on server error, restores the snapshot.
  const commitPendingDelete = useCallback(async () => {
    if (pendingDeleteTimerRef.current) { clearTimeout(pendingDeleteTimerRef.current); pendingDeleteTimerRef.current = null; }
    const pending = pendingDeleteRef.current;
    pendingDeleteRef.current = null;
    setUndoableDelete(null);
    if (!pending) return;
    const { error } = await tasksApi.delete(pending.snapshot.taskId);
    if (error) {
      // Server rejected the delete — restore the task and surface the error.
      setTasks((prev) => prev.some((t) => t.taskId === pending.snapshot.taskId) ? prev : [pending.snapshot, ...prev]);
      setError(error);
    }
  }, [setError, setTasks]);

  const dismissUndoableDelete = useCallback(() => { void commitPendingDelete(); }, [commitPendingDelete]);

  const handleUndoDelete = useCallback(() => {
    if (pendingDeleteTimerRef.current) { clearTimeout(pendingDeleteTimerRef.current); pendingDeleteTimerRef.current = null; }
    const pending = pendingDeleteRef.current;
    pendingDeleteRef.current = null;
    setUndoableDelete(null);
    if (!pending) return;
    const { snapshot, wasStaged } = pending;
    setTasks((prev) => prev.some((t) => t.taskId === snapshot.taskId) ? prev : [snapshot, ...prev]);
    if (wasStaged && snapshot.pointValue) {
      updateStaged(snapshot.pointValue);
      setStagedTaskIds((prev) => prev.includes(snapshot.taskId) ? prev : [...prev, snapshot.taskId]);
    }
  }, [setTasks, setStagedTaskIds, updateStaged]);

  const handleDelete = useEvent(async function handleDelete(id: string) {
    const snapshot = tasks.find((t) => t.taskId === id);
    // Dismiss detail panel upfront so user doesn't see stale data during slash animation.
    setDetailTask?.((curr) => curr?.taskId === id ? null : curr);
    // Any prior pending delete must commit before a new one is armed (only one undoable at a time).
    if (pendingDeleteRef.current && pendingDeleteRef.current.snapshot.taskId !== id) {
      await commitPendingDelete();
    }
    const wasStaged = stagedTaskIds.includes(id);
    if (wasStaged && snapshot?.pointValue) updateStaged(-snapshot.pointValue);
    setStagedTaskIds((prev) => prev.filter((sid) => sid !== id));
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    setSlashingId(id);
    // Outlast row-delete animation (1.6s) so glide + fade + collapse finish before yank.
    await new Promise((r) => setTimeout(r, 1600));
    setSlashingId(null);
    setTasks((prev) => prev.filter((t) => t.taskId !== id));
    if (!isAuthenticated || !snapshot) return;
    // Arm 5s undo window; timer expiry fires the DELETE, user undo cancels + restores.
    pendingDeleteRef.current = { snapshot, wasStaged };
    setUndoableDelete({ taskId: id, taskTitle: snapshot.title });
    pendingDeleteTimerRef.current = setTimeout(() => { void commitPendingDelete(); }, 5000);
  });

  const handleSkip = useEvent(async function handleSkip(task: TaskDto) {
    if (!isAuthenticated) {
      let nextDue = getNextDueDate(task.dueDate, task.recurrenceRule!);
      while (isOverdue(nextDue)) nextDue = getNextDueDate(nextDue, task.recurrenceRule!);
      setTasks((prev) => prev.map((t) => t.taskId === task.taskId
        ? { ...t, dueDate: nextDue, currentStreakCount: 0 }
        : t
      ));
      return;
    }
    setAdvancing(task.taskId);
    const { data, error } = await tasksApi.skipCycle(task.taskId);
    if (error) { setAdvancing(null); setError(error); return; }
    let nextDue = data!.nextDueDate;
    while (isOverdue(nextDue)) nextDue = getNextDueDate(nextDue, task.recurrenceRule!);
    if (nextDue !== data!.nextDueDate) {
      await tasksApi.update(task.taskId, {
        taskId: task.taskId, title: task.title,
        description: task.description ?? undefined, category: task.category,
        priority: task.priority, status: task.status, pointValue: task.pointValue,
        dueDate: nextDue, isRecurring: task.isRecurring,
        recurrenceRule: task.recurrenceRule ?? undefined, submitted: task.submitted,
      });
    }
    setAdvancing(null);
    setTasks((prev) => prev.map((t) => t.taskId === task.taskId
      ? { ...t, dueDate: nextDue, currentStreakCount: data!.streakCount }
      : t
    ));
  });

  const handleArchive = useEvent(async function handleArchive(task: TaskDto) {
    const snapshot = task;
    setTasks((prev) => prev.filter((t) => t.taskId !== task.taskId));
    if (!isAuthenticated) return;
    const { error } = await tasksApi.archive(task.taskId);
    if (error) {
      setTasks((prev) => [snapshot, ...prev]);
      setError(error);
    }
  });

  // Undo from toast: clear toast then run undo.
  const handleUndoCheckInFromToast = useEvent(async function handleUndoCheckInFromToast(task: TaskDto, cycleId: number) {
    dismissUndoableCheckIn();
    await handleUndoCheckIn(task, cycleId);
  });

  return { advancing, pausing, slashingId, recurringPopups, handleAdvance, handleCheckIn, handleUndoCheckIn, handleUndoCheckInFromToast, handleDeleteLogCycle, handlePause, handleDelete, handleSkip, handleArchive, undoableCheckIn, dismissUndoableCheckIn, undoableDelete, handleUndoDelete, dismissUndoableDelete };
}
