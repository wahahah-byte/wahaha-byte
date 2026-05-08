"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { tasksApi, TaskDto, UndoCheckInResponse } from "@/lib/api/tasks";
import { usersApi } from "@/lib/api/users";
import { usePoints } from "@/context/PointsContext";
import { getNextDueDate, parseLocalDate, getPrevPeriodStart, isOverdue } from "@/lib/dateUtils";
import { RECURRING_CAP } from "@/lib/constants";
import { tierForStreak, type TierUpMessage } from "@/components/TierUpBanner";

function vibrate(pattern: number | number[]) {
  if (typeof navigator === "undefined" || !("vibrate" in navigator)) return;
  try { navigator.vibrate(pattern); } catch { /* iOS Safari throws on some PWAs */ }
}

// useEvent-style helper: returns a stable callback that always invokes the
// latest handler implementation. Lets us hand stable refs to memoized children
// without having to enumerate every closure dep.
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
}

export function useTaskActions({
  tasks, setTasks, isAuthenticated,
  stagedTaskIds, setStagedTaskIds,
  selectedIds, setSelectedIds,
  submittedTaskIds, setError, setSuccess,
}: UseTaskActionsOptions) {
  const { recurringSubmittedToday, setRecurringSubmittedToday, setDailySubmitted, setBalance, updateStaged } = usePoints();

  const [advancing, setAdvancing] = useState<string | null>(null);
  const [pausing, setPausing] = useState<string | null>(null);
  const [slashingId, setSlashingId] = useState<string | null>(null);

  // After a successful auth-mode check-in we surface a 5s window during which
  // the user can hit "Undo" in the toast. Cleared on dismiss or expiry.
  const [undoableCheckIn, setUndoableCheckIn] = useState<{ taskId: string; cycleId: number; taskTitle: string } | null>(null);
  const undoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
  const [tierUp, setTierUp] = useState<TierUpMessage | null>(null);
  const dismissTierUp = useCallback(() => setTierUp(null), []);

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
        setTasks((prev) => prev.map((t) => t.taskId === task.taskId
          ? { ...t, status: "pending", dueDate: nextDue, completedAt: null, submitted: false }
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
    const todayIso = (() => {
      const t = new Date();
      return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
    })();
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
      const tier = tierForStreak(prevCount, newCount);
      if (tier) { setTierUp(tier); vibrate([15, 30, 60]); } else { vibrate(20); }
      const nowIso = new Date().toISOString();
      const synthCycle = {
        cycleId: -Date.now(),
        taskId: task.taskId,
        checkInDate: nowIso,
        counterValue: counterValue ?? null,
        createdAt: nowIso,
        cycleType: "checkin" as const,
      };
      setTasks((prev) => prev.map((t) => t.taskId === task.taskId
        ? { ...t, dueDate: nextDue, lastCheckInDate: todayIso, currentStreakCount: newCount, longestStreakCount: Math.max(newCount, t.longestStreakCount ?? 0), recentCycles: [synthCycle, ...(t.recentCycles ?? [])] }
        : t
      ));
      setAdvancing(null);
      return;
    }
    const prevCount = task.currentStreakCount ?? 0;
    const { data, error } = await tasksApi.checkIn(task.taskId, counterValue);
    if (error) { setAdvancing(null); setError(error); return; }
    const awarded = data!.pointsAwarded;
    setRecurringSubmittedToday(data!.recurringDailyTotal);
    setDailySubmitted((prev) => prev + awarded);
    setBalance(data!.newBalance);

    if (awarded > 0) {
      setRecurringPopups((prev) => new Map(prev).set(task.taskId, awarded));
      setTimeout(() => setRecurringPopups((prev) => { const n = new Map(prev); n.delete(task.taskId); return n; }), 1900);
    }

    const tier = tierForStreak(prevCount, data!.streakCount);
    if (tier) { setTierUp(tier); vibrate([15, 30, 60]); } else { vibrate(20); }

    if (setSuccess && awarded > 0 && data!.bonusMultiplier > 1) {
      const mult = Number.isInteger(data!.bonusMultiplier) ? data!.bonusMultiplier.toFixed(0) : data!.bonusMultiplier.toFixed(1);
      setSuccess(`+${awarded} pts (${data!.basePoints} × ${mult}x streak 🔥${data!.streakCount})`);
    }

    let nextDueDate = data!.nextDueDate || task.dueDate;
    if (nextDueDate && task.recurrenceRule) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (task.recurrenceRule === "daily") {
        const nd = parseLocalDate(nextDueDate);
        if (nd <= today) {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          nextDueDate = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
        }
      } else if (task.recurrenceRule !== "weekdays") {
        const nd = parseLocalDate(nextDueDate);
        if (today > getPrevPeriodStart(nd, task.recurrenceRule)) {
          nextDueDate = getNextDueDate(nextDueDate, task.recurrenceRule);
        }
      }
    }
    setAdvancing(null);
    // Append the new cycle to recentCycles so the in-row Undo button (and
    // today-chip / heatmap) can find its cycleId without a refetch.
    const nowIso = new Date().toISOString();
    const newCycle = {
      cycleId: data!.cycleId,
      taskId: task.taskId,
      checkInDate: nowIso,
      counterValue: counterValue ?? null,
      createdAt: nowIso,
      cycleType: "checkin" as const,
    };
    setTasks((prev) => prev.map((t) => t.taskId === task.taskId
      ? { ...t, status: "pending", dueDate: nextDueDate, lastCheckInDate: todayIso, completedAt: null, submitted: false,
          currentStreakCount: data!.streakCount, longestStreakCount: data!.longestCount,
          recentCycles: [newCycle, ...(t.recentCycles ?? [])] }
      : t
    ));
    armUndoToast(task.taskId, data!.cycleId, task.title);
  });

  const handleUndoCheckIn = useEvent(async function handleUndoCheckIn(task: TaskDto, cycleId: number): Promise<UndoCheckInResponse | null> {
    // Demo / unauthenticated: best-effort local rollback. We can't perfectly
    // restore the streak's previous state without server-side history, so we
    // just decrement, roll the dueDate back one period, and clear
    // lastCheckInDate so canCheckInNow() unlocks the task.
    if (!isAuthenticated) {
      setTasks((prev) => prev.map((t) => {
        if (t.taskId !== task.taskId) return t;
        const cycles = (t.recentCycles ?? []).filter((c) => c.cycleId !== cycleId);
        const newStreak = Math.max(0, (t.currentStreakCount ?? 0) - 1);
        return {
          ...t,
          recentCycles: cycles,
          currentStreakCount: newStreak,
          dueDate: getPrevPeriodStart(parseLocalDate(t.dueDate ?? ""), t.recurrenceRule ?? "daily").toISOString().split("T")[0],
          lastCheckInDate: null,
        };
      }));
      return null;
    }
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
      // Empty string from server means "no prior check-in" — clear the local
      // lastCheckInDate so canCheckInNow() unlocks the task. Otherwise the
      // slider/check-in button stays disabled.
      const restoredLastCheckIn = data!.previousLastCheckInDate || null;
      // If the server has no PreviousDueDate snapshot (cycle created before
      // the rollback fields were added), compute it by rolling t.dueDate back
      // one period. Without this fallback the task would land in UPCOMING
      // because dueDate would still point to the post-check-in cycle.
      const restoredDueDate = data!.previousDueDate
        || (t.dueDate && t.recurrenceRule
          ? (() => {
              const prev = getPrevPeriodStart(parseLocalDate(t.dueDate), t.recurrenceRule);
              return `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, "0")}-${String(prev.getDate()).padStart(2, "0")}`;
            })()
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

  const handleDelete = useEvent(async function handleDelete(id: string) {
    const snapshot = tasks.find((t) => t.taskId === id);
    if (!isAuthenticated) {
      if (stagedTaskIds.includes(id) && snapshot?.pointValue) updateStaged(-snapshot.pointValue);
      setStagedTaskIds((prev) => prev.filter((sid) => sid !== id));
      setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
      setSlashingId(id);
      await new Promise((r) => setTimeout(r, 550));
      setSlashingId(null);
      setTasks((prev) => prev.filter((t) => t.taskId !== id));
      return;
    }
    setSlashingId(id);
    const deletePromise = tasksApi.delete(id);
    if (stagedTaskIds.includes(id) && snapshot?.pointValue) updateStaged(-snapshot.pointValue);
    setStagedTaskIds((prev) => prev.filter((sid) => sid !== id));
    setSelectedIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    await new Promise((r) => setTimeout(r, 550));
    setSlashingId(null);
    setTasks((prev) => prev.filter((t) => t.taskId !== id));
    const { error } = await deletePromise;
    if (error) {
      if (snapshot) setTasks((prev) => [snapshot, ...prev]);
      setError(error);
    }
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

  // When undo is invoked from the toast, also clear the toast itself.
  const handleUndoCheckInFromToast = useEvent(async function handleUndoCheckInFromToast(task: TaskDto, cycleId: number) {
    dismissUndoableCheckIn();
    await handleUndoCheckIn(task, cycleId);
  });

  return { advancing, pausing, slashingId, recurringPopups, tierUp, dismissTierUp, handleAdvance, handleCheckIn, handleUndoCheckIn, handleUndoCheckInFromToast, handleDeleteLogCycle, handlePause, handleDelete, handleSkip, handleArchive, undoableCheckIn, dismissUndoableCheckIn };
}
