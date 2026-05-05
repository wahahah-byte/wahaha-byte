"use client";

import { useState } from "react";
import { tasksApi, TaskDto } from "@/lib/api/tasks";
import { usersApi } from "@/lib/api/users";
import { usePoints } from "@/context/PointsContext";
import { getNextDueDate, parseLocalDate, getPrevPeriodStart, isOverdue } from "@/lib/dateUtils";
import { RECURRING_CAP } from "@/lib/constants";

interface UseTaskActionsOptions {
  tasks: TaskDto[];
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>;
  isAuthenticated: boolean;
  activeFilter: string;
  stagedTaskIds: string[];
  setStagedTaskIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedIds: Set<string>;
  setSelectedIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  submittedTaskIds: Set<string>;
  setError: (msg: string) => void;
  setSuccess?: (msg: string) => void;
}

export function useTaskActions({
  tasks, setTasks, isAuthenticated, activeFilter,
  stagedTaskIds, setStagedTaskIds,
  selectedIds, setSelectedIds,
  submittedTaskIds, setError, setSuccess,
}: UseTaskActionsOptions) {
  const { recurringSubmittedToday, setRecurringSubmittedToday, setDailySubmitted, setBalance, updateStaged } = usePoints();

  const [advancing, setAdvancing] = useState<string | null>(null);
  const [pausing, setPausing] = useState<string | null>(null);
  const [slashingId, setSlashingId] = useState<string | null>(null);
  const [recurringPopups, setRecurringPopups] = useState<Map<string, number>>(new Map());

  async function handleAdvance(task: TaskDto) {
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
            setTimeout(() => setRecurringPopups((prev) => { const n = new Map(prev); n.delete(task.taskId); return n; }), 1150);
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
        setTasks((prev) =>
          activeFilter === "in_progress"
            ? prev.filter((t) => t.taskId !== task.taskId)
            : prev.map((t) => t.taskId === task.taskId
              ? { ...t, status: "pending", dueDate: nextDue, completedAt: null, submitted: false }
              : t
            )
        );
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
      setTasks((prev) =>
        activeFilter === "all"
          ? prev.map((t) => t.taskId === task.taskId ? { ...t, status: "in_progress", completedAt: null } : t)
          : prev.filter((t) => t.taskId !== task.taskId)
      );
    } else {
      setAdvancing(null);
    }
  }

  async function handleCheckIn(task: TaskDto) {
    if (advancing === task.taskId) return;
    setAdvancing(task.taskId);
    const todayIso = (() => {
      const t = new Date();
      return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
    })();
    if (!isAuthenticated) {
      const nextDue = getNextDueDate(task.dueDate, task.recurrenceRule!);
      const newCount = (task.currentStreakCount ?? 0) + 1;
      setRecurringPopups((prev) => new Map(prev).set(task.taskId, task.pointValue));
      setTimeout(() => setRecurringPopups((prev) => { const n = new Map(prev); n.delete(task.taskId); return n; }), 1150);
      setTasks((prev) => prev.map((t) => t.taskId === task.taskId
        ? { ...t, dueDate: nextDue, lastCheckInDate: todayIso, currentStreakCount: newCount, longestStreakCount: Math.max(newCount, t.longestStreakCount ?? 0) }
        : t
      ));
      setAdvancing(null);
      return;
    }
    const { data, error } = await tasksApi.checkIn(task.taskId);
    if (error) { setAdvancing(null); setError(error); return; }
    const awarded = data!.pointsAwarded;
    setRecurringSubmittedToday(data!.recurringDailyTotal);
    setDailySubmitted((prev) => prev + awarded);
    setBalance(data!.newBalance);

    if (awarded > 0) {
      setRecurringPopups((prev) => new Map(prev).set(task.taskId, awarded));
      setTimeout(() => setRecurringPopups((prev) => { const n = new Map(prev); n.delete(task.taskId); return n; }), 1150);
    }

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
    setTasks((prev) => prev.map((t) => t.taskId === task.taskId
      ? { ...t, status: "pending", dueDate: nextDueDate, lastCheckInDate: todayIso, completedAt: null, submitted: false,
          currentStreakCount: data!.streakCount, longestStreakCount: data!.longestCount }
      : t
    ));
  }

  async function handlePause(task: TaskDto) {
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
    setTasks((prev) =>
      activeFilter === "in_progress"
        ? prev.filter((t) => t.taskId !== task.taskId)
        : prev.map((t) => t.taskId === task.taskId ? { ...t, status: "pending" } : t)
    );
  }

  async function handleDelete(id: string) {
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
  }

  async function handleSkip(task: TaskDto) {
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
  }

  async function handleArchive(task: TaskDto) {
    const snapshot = task;
    setTasks((prev) => prev.filter((t) => t.taskId !== task.taskId));
    if (!isAuthenticated) return;
    const { error } = await tasksApi.archive(task.taskId);
    if (error) {
      setTasks((prev) => [snapshot, ...prev]);
      setError(error);
    }
  }

  return { advancing, pausing, slashingId, recurringPopups, handleAdvance, handleCheckIn, handlePause, handleDelete, handleSkip, handleArchive };
}
