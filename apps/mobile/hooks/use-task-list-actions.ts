import type { Dispatch, MutableRefObject, SetStateAction } from "react";
import { LayoutAnimation, Platform } from "react-native";
import * as Haptics from "expo-haptics";

import {
  dateKey,
  getNextDueDate,
  getPrevPeriodStart,
  isOverdue,
  parseLocalDate,
  todayLocalKey,
  willStreakResetOnCheckIn,
  type CheckInCycleDto,
  type TaskDto,
} from "@wahaha/shared";
import { tasksApi } from "@/lib/api";
import { taskCache } from "@/lib/task-cache";
import { SLASH_MS } from "@/components/slashing-row";
import type { useUndo } from "@/context/undo-context";

interface ActionDeps {
  tasks: TaskDto[];
  setTasks: Dispatch<SetStateAction<TaskDto[]>>;
  setError: Dispatch<SetStateAction<string | null>>;
  fetchTasks: () => Promise<void>;
  setRecentCheckinTs: Dispatch<SetStateAction<Map<string, number>>>;
  setBurstTaskId: Dispatch<SetStateAction<string | null>>;
  burstTimeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>;
  setSlashingId: Dispatch<SetStateAction<string | null>>;
  tryClaimAction: (taskId: string) => boolean;
  markPendingCheckIn: (taskId: string) => void;
  markPendingDelete: (taskId: string) => void;
  clearPendingDelete: (taskId: string) => void;
  preCheckinDueDateRef: MutableRefObject<Map<string, string | null>>;
  performUndoRef: MutableRefObject<(taskId: string, cycleId: number) => Promise<void>>;
  undo: ReturnType<typeof useUndo>;
}

// All optimistic task mutations for TaskList. Defined as plain functions (re-created
// each render, matching the original component) and threaded the state/refs they touch.
export function useTaskListActions({
  tasks,
  setTasks,
  setError,
  fetchTasks,
  setRecentCheckinTs,
  setBurstTaskId,
  burstTimeoutRef,
  setSlashingId,
  tryClaimAction,
  markPendingCheckIn,
  markPendingDelete,
  clearPendingDelete,
  preCheckinDueDateRef,
  performUndoRef,
  undo,
}: ActionDeps) {
  async function handleCheckIn(task: TaskDto) {
    if (!tryClaimAction(task.taskId)) return;
    // Guard fetchTasks during in-flight commit.
    markPendingCheckIn(task.taskId);

    // Fire check-in burst.
    if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
    setBurstTaskId(task.taskId);
    burstTimeoutRef.current = setTimeout(() => {
      setBurstTaskId(null);
      burstTimeoutRef.current = null;
    }, 900);

    // Haptic — heavy pulse on tier crossing.
    if (Platform.OS !== "web") {
      const prevStreak = task.currentStreakCount ?? 0;
      const nextStreak = prevStreak + 1;
      const crosses = [3, 7, 14, 30].some((at) => prevStreak < at && nextStreak >= at);
      Haptics.impactAsync(
        crosses ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light,
      ).catch(() => {});
    }

    // Optimistic patch — no refetch on success.
    const todayIso = todayLocalKey();
    // Remember original dueDate for instant undo restore.
    preCheckinDueDateRef.current.set(task.taskId, task.dueDate);
    // Advance dueDate optimistically; overdue rebases on today.
    const dueBase = task.isRecurring && isOverdue(task.dueDate) ? todayIso : task.dueDate;
    const optimisticDue = task.isRecurring
      ? getNextDueDate(dueBase, task.recurrenceRule ?? "daily")
      : task.dueDate;
    // Pin row to top of Checked In.
    setRecentCheckinTs((prev) => {
      const next = new Map(prev);
      next.set(task.taskId, Date.now());
      return next;
    });
    // Smooth SectionList cross-section re-layout.
    LayoutAnimation.configureNext({
      duration: 220,
      create: { type: "easeInEaseOut", property: "opacity" },
      update: { type: "easeInEaseOut" },
      delete: { type: "easeInEaseOut", property: "opacity" },
    });
    // Optimistic streak increment (mirrors server reset rule).
    const willResetStreak = willStreakResetOnCheckIn(task.recurrenceRule, task.lastCheckInDate, task.dueDate);
    const predictedStreak = willResetStreak ? 1 : (task.currentStreakCount ?? 0) + 1;
    setTasks((prev) => prev.map((t) => {
      if (t.taskId !== task.taskId) return t;
      const prevLongest = t.longestStreakCount ?? 0;
      return {
        ...t,
        lastCheckInDate: todayIso,
        dueDate: optimisticDue,
        currentStreakCount: predictedStreak,
        longestStreakCount: Math.max(prevLongest, predictedStreak),
      };
    }));

    const res = await tasksApi.checkIn(task.taskId);
    if (res.error) {
      // "Already checked in" — race false positive, ignore.
      if (/already\s+checked\s*in/i.test(res.error)) return;
      // Other errors — refetch to reconcile.
      setError(res.error);
      fetchTasks();
      return;
    }
    if (res.data) {
      const data = res.data;
      // Apply authoritative server response.
      const newCycle: CheckInCycleDto = {
        cycleId: data.cycleId,
        taskId: task.taskId,
        checkInDate: todayIso,
        counterValue: null,
        createdAt: new Date().toISOString(),
        cycleType: "checkin",
      };
      setTasks((prev) => prev.map((t) => {
        if (t.taskId !== task.taskId) return t;
        // Race-aware: skip state restore if user has since undone.
        if (t.lastCheckInDate == null || t.lastCheckInDate === "") {
          return { ...t, recentCycles: [newCycle, ...(t.recentCycles ?? [])] };
        }
        return {
          ...t,
          dueDate: data.nextDueDate ?? t.dueDate,
          currentStreakCount: data.streakCount,
          longestStreakCount: data.longestCount,
          recentCycles: [newCycle, ...(t.recentCycles ?? [])],
        };
      }));
    }
  }

  // Shared optimistic undo — patch row in-place from server response.
  async function performUndoCheckIn(taskId: string, cycleId: number) {
    // Optimistic-first patch.
    let snapshot: TaskDto | null = null;
    // Prefer remembered pre-checkin dueDate for exact restore.
    const rememberedDue = preCheckinDueDateRef.current.get(taskId);
    // Fallback: cycle's previousDueDate snapshot.
    const cycleSnapshot = (() => {
      const t = tasks.find((x) => x.taskId === taskId);
      return t?.recentCycles?.find((c) => c.cycleId === cycleId) ?? null;
    })();
    const cyclePreviousDue = cycleSnapshot?.previousDueDate ?? undefined;
    // Smooth cross-section move back to Active.
    LayoutAnimation.configureNext({
      duration: 220,
      create: { type: "easeInEaseOut", property: "opacity" },
      update: { type: "easeInEaseOut" },
      delete: { type: "easeInEaseOut", property: "opacity" },
    });
    setTasks((prev) => prev.map((t) => {
      if (t.taskId !== taskId) return t;
      snapshot = t;
      const cycles = (t.recentCycles ?? []).filter((c) => c.cycleId !== cycleId);
      // Three-tier dueDate restore: remembered → cycle snapshot → period rollback.
      const optimisticDue = rememberedDue !== undefined
        ? rememberedDue
        : cyclePreviousDue !== undefined && cyclePreviousDue !== null && cyclePreviousDue !== ""
          ? cyclePreviousDue.split("T")[0]
          : (t.dueDate && t.recurrenceRule
            ? dateKey(getPrevPeriodStart(parseLocalDate(t.dueDate), t.recurrenceRule))
            : t.dueDate);
      // Optimistic streak decrement (longest left alone — server preserves peak).
      const prevCount = t.currentStreakCount ?? 0;
      return {
        ...t,
        recentCycles: cycles,
        dueDate: optimisticDue,
        lastCheckInDate: null,
        currentStreakCount: Math.max(0, prevCount - 1),
      };
    }));
    // Clear remembered value to avoid mis-fire on later undo.
    preCheckinDueDateRef.current.delete(taskId);

    const res = await tasksApi.undoCheckIn(taskId, cycleId);
    if (res.error || !res.data) {
      // 404 = already deleted server-side; keep optimistic state.
      const cycleAlreadyGone = !!res.error && /not\s*found/i.test(res.error);
      if (!cycleAlreadyGone && snapshot) {
        const captured = snapshot;
        setTasks((prev) => prev.map((t) => t.taskId === taskId ? captured : t));
      }
      if (res.error && !cycleAlreadyGone) {
        setError(res.error);
      }
      return;
    }
    const data = res.data;
    setTasks((prev) => prev.map((t) => {
      if (t.taskId !== taskId) return t;
      const cycles = (t.recentCycles ?? []).filter((c) => c.cycleId !== cycleId);
      // Guard against out-of-order responses corrupting row state.
      const hasNewerCheckin = cycles.some(
        (c) => c.cycleType === "checkin" && c.cycleId > cycleId,
      ) || (t.lastCheckInDate != null && t.lastCheckInDate !== "");
      // Empty string from server = "no prior check-in" — null it.
      const restoredLastCheckIn = hasNewerCheckin
        ? t.lastCheckInDate
        : (data.previousLastCheckInDate || null);
      // Keep optimistic dueDate when server snapshot is empty.
      const restoredDueDate = hasNewerCheckin
        ? t.dueDate
        : (data.previousDueDate || t.dueDate);
      return {
        ...t,
        recentCycles: cycles,
        currentStreakCount: data.streakCount,
        longestStreakCount: data.longestCount,
        dueDate: restoredDueDate,
        lastCheckInDate: restoredLastCheckIn,
      };
    }));
    // NOTE: do NOT fire emitRefreshRequested here — races the response patch.
  }

  // Within-day inline undo from leading checkbox.
  async function handleUndoCheckIn(task: TaskDto, cycleId: number) {
    if (!tryClaimAction(task.taskId)) return;
    await performUndoCheckIn(task.taskId, cycleId);
  }
  // Mirror latest closure into ref.
  performUndoRef.current = performUndoCheckIn;

  async function handleComplete(task: TaskDto) {
    // Optimistic only; refetch on error.
    setTasks((prev) =>
      prev.map((t) => (t.taskId === task.taskId ? { ...t, status: "completed" } : t))
    );
    const res = await tasksApi.complete(task.taskId);
    if (res.error) {
      setError(res.error);
      await fetchTasks();
    }
  }

  // pending → in_progress.
  async function handleStart(task: TaskDto) {
    setTasks((prev) =>
      prev.map((t) => (t.taskId === task.taskId ? { ...t, status: "in_progress" } : t))
    );
    const res = await tasksApi.start(task.taskId);
    if (res.error) {
      setError(res.error);
      await fetchTasks();
    }
  }

  // in_progress → pending (no dedicated endpoint — full update).
  async function handlePause(task: TaskDto) {
    setTasks((prev) =>
      prev.map((t) => (t.taskId === task.taskId ? { ...t, status: "pending" } : t))
    );
    const res = await tasksApi.update(task.taskId, {
      taskId: task.taskId,
      title: task.title,
      description: task.description ?? undefined,
      category: task.category,
      priority: task.priority,
      status: "pending",
      pointValue: task.pointValue,
      dueDate: task.dueDate ?? undefined,
      completedAt: undefined,
      isRecurring: task.isRecurring,
      recurrenceRule: task.recurrenceRule ?? undefined,
      submitted: task.submitted,
    });
    if (res.error) {
      setError(res.error);
      await fetchTasks();
    }
  }

  async function handleArchive(task: TaskDto) {
    setTasks((prev) => prev.filter((t) => t.taskId !== task.taskId));
    const fn = task.isArchived ? tasksApi.unarchive : tasksApi.archive;
    const res = await fn(task.taskId);
    if (res.error) {
      setError(res.error);
      await fetchTasks();
    }
  }

  // completed (not submitted/awarded) → in_progress. Mirrors task detail screen.
  async function handleUndoComplete(task: TaskDto) {
    setTasks((prev) =>
      prev.map((t) =>
        t.taskId === task.taskId
          ? { ...t, status: "in_progress", completedAt: null }
          : t
      )
    );
    const res = await tasksApi.update(task.taskId, {
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
    });
    if (res.error) {
      setError(res.error);
      await fetchTasks();
    }
  }

  async function handleDelete(task: TaskDto) {
    // No confirm — swipe commitment is enough intent. Snapshot first so undo can restore.
    const snapshot = task;
    setSlashingId(task.taskId);
    await new Promise((r) => setTimeout(r, SLASH_MS));
    setSlashingId(null);
    setTasks((prev) => prev.filter((t) => t.taskId !== task.taskId));
    taskCache.remove(task.taskId);
    // Mark so concurrent focus-refetches don't resurrect the row during the undo window.
    markPendingDelete(snapshot.taskId);
    undo.arm({
      prefix: "Deleted",
      subject: snapshot.title,
      onUndo: () => {
        clearPendingDelete(snapshot.taskId);
        setTasks((prev) => prev.some((t) => t.taskId === snapshot.taskId) ? prev : [snapshot, ...prev]);
        taskCache.set(snapshot);
      },
      onCommit: async () => {
        const res = await tasksApi.delete(snapshot.taskId);
        clearPendingDelete(snapshot.taskId);
        if (res.error) {
          setError(res.error);
          await fetchTasks();
        }
      },
    });
  }

  return {
    handleCheckIn,
    performUndoCheckIn,
    handleUndoCheckIn,
    handleComplete,
    handleStart,
    handlePause,
    handleArchive,
    handleUndoComplete,
    handleDelete,
  };
}
