"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { tasksApi, TaskDto, TaskFilterParams } from "@/lib/api/tasks";
import { usersApi } from "@/lib/api/users";
import { streaksApi, StreakDto } from "@/lib/api/streaks";
import NewTaskModal from "@/components/NewTaskModal";
import ShatterEffect from "@/components/ShatterEffect";
import TaskDetailModal from "@/components/TaskDetailModal";

const MOCK_TASKS: TaskDto[] = [
  { taskId: "d1", userId: "demo", title: "Morning workout", description: "30 min cardio or strength training", category: "Fitness", priority: "high", status: "pending", pointValue: 15, dueDate: "2026-04-26", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false },
  { taskId: "d2", userId: "demo", title: "Read 30 minutes", description: null, category: "Learning", priority: "medium", status: "pending", pointValue: 10, dueDate: "2026-04-27", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekdays", submitted: false },
  { taskId: "d3", userId: "demo", title: "Weekly review & planning", description: "Review last week, plan the next", category: "Productivity", priority: "high", status: "pending", pointValue: 20, dueDate: "2026-04-26", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekly", submitted: false },
  { taskId: "d4", userId: "demo", title: "Monthly budget review", description: null, category: "Finance", priority: "high", status: "pending", pointValue: 25, dueDate: "2026-05-01", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "monthly", submitted: false },
  { taskId: "d5", userId: "demo", title: "Fix login page redirect bug", description: null, category: "Dev", priority: "high", status: "in_progress", pointValue: 30, dueDate: "2026-04-26", createdAt: "2026-04-20T00:00:00Z", completedAt: null, isRecurring: false, recurrenceRule: null, submitted: false },
  { taskId: "d6", userId: "demo", title: "Design new dashboard mockup", description: null, category: "Design", priority: "medium", status: "pending", pointValue: 20, dueDate: "2026-05-03", createdAt: "2026-04-22T00:00:00Z", completedAt: null, isRecurring: false, recurrenceRule: null, submitted: false },
  { taskId: "d7", userId: "demo", title: "Organize project notes", description: null, category: "Productivity", priority: "low", status: "pending", pointValue: 5, dueDate: null, createdAt: "2026-04-23T00:00:00Z", completedAt: null, isRecurring: false, recurrenceRule: null, submitted: false },
  { taskId: "d8", userId: "demo", title: "Write project README", description: null, category: "Dev", priority: "medium", status: "completed", pointValue: 15, dueDate: "2026-04-25", createdAt: "2026-04-20T00:00:00Z", completedAt: "2026-04-25T14:00:00Z", isRecurring: false, recurrenceRule: null, submitted: false, pointsAwarded: false },
  { taskId: "d9", userId: "demo", title: "Update resume", description: null, category: "Career", priority: "low", status: "completed", pointValue: 10, dueDate: "2026-04-24", createdAt: "2026-04-18T00:00:00Z", completedAt: "2026-04-24T10:00:00Z", isRecurring: false, recurrenceRule: null, submitted: true, pointsAwarded: true },
];

const MOCK_STREAKS = new Map<string, StreakDto>([
  ["d1", { streakId: 1, userId: "demo", taskId: "d1", streakType: "daily_Fitness", currentCount: 12, longestCount: 15, bonusMultiplier: 1.2, lastActivityDate: "2026-04-25T00:00:00Z", isActive: true }],
  ["d2", { streakId: 2, userId: "demo", taskId: "d2", streakType: "weekdays_Learning", currentCount: 8, longestCount: 21, bonusMultiplier: 1.1, lastActivityDate: "2026-04-25T00:00:00Z", isActive: true }],
  ["d3", { streakId: 3, userId: "demo", taskId: "d3", streakType: "weekly_Productivity", currentCount: 5, longestCount: 5, bonusMultiplier: 1.05, lastActivityDate: "2026-04-19T00:00:00Z", isActive: true }],
]);

const PRIORITY_DOT: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getPrevPeriodStart(due: Date, rule: string): Date {
  const prev = new Date(due);
  if (rule === "daily" || rule === "weekdays") prev.setDate(prev.getDate() - 1);
  else if (rule === "weekly") prev.setDate(prev.getDate() - 7);
  else if (rule === "biweekly") prev.setDate(prev.getDate() - 14);
  else if (rule === "monthly") prev.setMonth(prev.getMonth() - 1);
  return prev;
}

function penalizeStreak(count: number): number {
  if (count < 10) return 0;
  if (count < 25) return Math.floor(count / 2);
  if (count < 50) return Math.floor((count * 2) / 3);
  if (count < 75) return Math.floor((count * 3) / 4);
  if (count < 100) return Math.floor((count * 4) / 5);
  return Math.floor((count * 9) / 10);
}

function canCheckInNow(dueDate: string | null, rule?: string | null): boolean {
  if (rule === "weekdays") {
    const day = new Date().getDay();
    if (day === 0 || day === 6) return false;
  }
  if (!dueDate) return true;
  const due = parseLocalDate(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (rule === "daily" || rule === "weekdays") {
    return due <= today;
  }
  if (today > due) return false;
  return today > getPrevPeriodStart(due, rule ?? "");
}

function getNextDueDate(dueDate: string | null, rule: string): string {
  const base = dueDate ? new Date(dueDate) : new Date();
  base.setHours(12, 0, 0, 0);
  if (rule === "daily") base.setDate(base.getDate() + 1);
  else if (rule === "weekdays") {
    base.setDate(base.getDate() + 1);
    while (base.getDay() === 0 || base.getDay() === 6) base.setDate(base.getDate() + 1);
  } else if (rule === "weekly") base.setDate(base.getDate() + 7);
  else if (rule === "biweekly") base.setDate(base.getDate() + 14);
  else if (rule === "monthly") base.setMonth(base.getMonth() + 1);
  return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`;
}

function getNextOccurrenceLabel(dueDate: string | null, rule: string): string {
  if (!dueDate) return rule.charAt(0).toUpperCase() + rule.slice(1);
  const d = new Date(dueDate);
  if (rule === "weekly") d.setDate(d.getDate() + 7);
  if (rule === "biweekly") d.setDate(d.getDate() + 14);
  if (rule === "monthly") d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getUnlockInfo(dueDate: string | null): { date: string; relative: string; days: number } | null {
  if (!dueDate) return null;
  const due = parseLocalDate(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return null;
  const dateStr = due.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const relative = diffDays === 1 ? "tomorrow" : `in ${diffDays}d`;
  return { date: dateStr, relative, days: diffDays };
}

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilterParams>({ pageSize: 50, pageNumber: 1 });
  const [activeFilter, setActiveFilter] = useState("all");
  const [showNewTask, setShowNewTask] = useState(false);
  const [advancing, setAdvancing] = useState<string | null>(null);
  const [pausing, setPausing] = useState<string | null>(null);
  const [slashingId, setSlashingId] = useState<string | null>(null);
  const [stagedTaskIds, setStagedTaskIds] = useState<string[]>([]);
  const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filingIds, setFilingIds] = useState<Set<string>>(new Set());
  const [recentlyFiledIds, setRecentlyFiledIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dailySubmitted, setDailySubmitted] = useState(0);
  const [recurringSubmittedToday, setRecurringSubmittedToday] = useState(0);
  const [showCapWarning, setShowCapWarning] = useState(false);
  const [recurringPopups, setRecurringPopups] = useState<Map<string, number>>(new Map());
  const [streaks, setStreaks] = useState<Map<string, StreakDto>>(new Map());
  const [detailTask, setDetailTask] = useState<TaskDto | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const tab = searchParams.get("tab");
    if (tab && FILTERS.some((f) => f.value === tab)) {
      setActiveFilter(tab);
      setFilters((f) => ({ ...f, status: tab === "all" || tab === "pending" ? undefined : tab, pageNumber: 1 }));
    }
    const hasToken = !!localStorage.getItem("auth_token");
    setIsAuthenticated(hasToken);
    if (hasToken) {
      usersApi.getMe().then(({ data }) => {
        if (data) {
          setDailySubmitted(data.pointsSubmittedToday ?? 0);
          setRecurringSubmittedToday(data.recurringPointsSubmittedToday ?? 0);
        }
      });
    } else {
      setTasks(MOCK_TASKS);
      setStreaks(new Map(MOCK_STREAKS));
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!error) return;
    const t = setTimeout(() => setError(null), 5100);
    return () => clearTimeout(t);
  }, [error]);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchTasks() {
      setLoading(true);
      setError(null);
      const [streakResult, taskResult] = await Promise.all([
        streaksApi.getActive(),
        tasksApi.getAll(filters),
      ]);
      setLoading(false);
      if (taskResult.error) { setError(taskResult.error); return; }
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const freshStreakMap = new Map<string, StreakDto>(
        (streakResult.data ?? []).map((s) => [s.taskId, s])
      );
      // Correct bad streakType values (backend writes taskId there; real value is rule + '_' + category)
      for (const [taskId, streak] of freshStreakMap) {
        if (streak.streakType.includes("_")) continue;
        const task = taskResult.data!.data.find((t) => t.taskId === taskId);
        if (!task) continue;
        const correctType = (task.recurrenceRule ?? "category") + "_" + task.category;
        streaksApi.update(streak.streakId, { ...streak, streakType: correctType });
        freshStreakMap.set(taskId, { ...streak, streakType: correctType });
      }
      const processedTasks = taskResult.data!.data.map((task) => {
        if (!task.isRecurring || !task.dueDate || !task.recurrenceRule || task.status !== "pending") return task;
        let dueDate = task.dueDate;
        let due = parseLocalDate(dueDate);
        let missedCount = 0;
        while (due < today) {
          dueDate = getNextDueDate(dueDate, task.recurrenceRule);
          due = parseLocalDate(dueDate);
          missedCount++;
        }
        if (missedCount === 0) return task;
        tasksApi.update(task.taskId, {
          taskId: task.taskId, title: task.title,
          description: task.description ?? undefined, category: task.category,
          priority: task.priority, status: task.status, pointValue: task.pointValue,
          dueDate, isRecurring: task.isRecurring, recurrenceRule: task.recurrenceRule ?? undefined,
          submitted: task.submitted,
        });
        const streak = freshStreakMap.get(task.taskId);
        if (streak && streak.currentCount > 0) {
          const correctType = (task.recurrenceRule ?? "category") + "_" + task.category;
          let penalized = streak.currentCount;
          for (let i = 0; i < missedCount; i++) penalized = penalizeStreak(penalized);
          if (penalized !== streak.currentCount || streak.streakType !== correctType) {
            streaksApi.update(streak.streakId, { ...streak, streakType: correctType, currentCount: penalized });
            freshStreakMap.set(task.taskId, { ...streak, streakType: correctType, currentCount: penalized });
          }
        }
        return { ...task, dueDate };
      });
      setTasks(processedTasks);
      setStreaks(new Map(freshStreakMap));
      const alreadySubmitted = new Set(taskResult.data!.data.filter((t) => t.pointsAwarded).map((t) => t.taskId));
      setSubmittedTaskIds(alreadySubmitted);
    }
    fetchTasks();
  }, [filters, isAuthenticated]);

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function applyFilter(value: string) {
    setActiveFilter(value);
    setFilters((f) => ({ ...f, status: value === "all" || value === "pending" ? undefined : value, pageNumber: 1 }));
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") params.delete("tab");
    else params.set("tab", value);
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  }

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
          window.dispatchEvent(new CustomEvent("staged-points-updated", { detail: { delta: task.pointValue } }));
        }
        setTasks((prev) =>
          activeFilter === "in_progress"
            ? prev.filter((t) => t.taskId !== task.taskId)
            : prev.map((t) => t.taskId === task.taskId ? { ...t, status: "completed", completedAt: new Date().toISOString() } : t)
        );
      } else if (canUndo) {
        if (stagedTaskIds.includes(task.taskId)) {
          setStagedTaskIds((prev) => prev.filter((id) => id !== task.taskId));
          window.dispatchEvent(new CustomEvent("staged-points-updated", { detail: { delta: -(task.pointValue ?? 0) } }));
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
        const RECURRING_CAP = 50;
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
          window.dispatchEvent(new CustomEvent("points-awarded", { detail: { delta: awarded, newBalance: submitData!.newBalance } }));

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
          window.dispatchEvent(new CustomEvent("staged-points-updated", { detail: { delta: task.pointValue } }));
        }
        setTasks((prev) =>
          activeFilter === "in_progress"
            ? prev.filter((t) => t.taskId !== task.taskId)
            : prev.map((t) => t.taskId === task.taskId ? { ...t, status: "completed", completedAt: new Date().toISOString() } : t)
        );
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
        window.dispatchEvent(new CustomEvent("staged-points-updated", { detail: { delta: -(task.pointValue ?? 0) } }));
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
    setAdvancing(task.taskId);
    if (!isAuthenticated) {
      const nextDue = getNextDueDate(task.dueDate, task.recurrenceRule!);
      const taskStreak = streaks.get(task.taskId);
      const newCount = (taskStreak?.currentCount ?? 0) + 1;
      const updatedStreak: StreakDto = {
        streakId: taskStreak?.streakId ?? 0,
        userId: "demo", taskId: task.taskId,
        streakType: (task.recurrenceRule ?? "category") + "_" + task.category,
        currentCount: newCount, longestCount: Math.max(newCount, taskStreak?.longestCount ?? 0),
        bonusMultiplier: taskStreak?.bonusMultiplier ?? 1,
        lastActivityDate: new Date().toISOString(), isActive: true,
      };
      setStreaks((prev) => { const n = new Map(prev); n.set(task.taskId, updatedStreak); return n; });
      setRecurringPopups((prev) => new Map(prev).set(task.taskId, task.pointValue));
      setTimeout(() => setRecurringPopups((prev) => { const n = new Map(prev); n.delete(task.taskId); return n; }), 1150);
      setTasks((prev) => prev.map((t) => t.taskId === task.taskId ? { ...t, dueDate: nextDue } : t));
      setAdvancing(null);
      return;
    }
    const { data, error } = await tasksApi.checkIn(task.taskId);
    if (error) { setAdvancing(null); setError(error); return; }
    const awarded = data!.pointsAwarded;
    setRecurringSubmittedToday(data!.recurringDailyTotal);
    setDailySubmitted((prev) => prev + awarded);
    window.dispatchEvent(new CustomEvent("points-awarded", { detail: { delta: awarded, newBalance: data!.newBalance } }));

    const existingStreak = streaks.get(task.taskId);
    const correctStreakType = (task.recurrenceRule ?? "category") + "_" + task.category;
    const updatedStreak: StreakDto = {
      streakId: existingStreak?.streakId ?? 0,
      userId: task.userId,
      taskId: task.taskId,
      streakType: correctStreakType,
      currentCount: data!.streakCount,
      longestCount: data!.longestCount,
      bonusMultiplier: data!.bonusMultiplier,
      lastActivityDate: new Date().toISOString(),
      isActive: true,
    };
    setStreaks((prev) => { const next = new Map(prev); next.set(task.taskId, updatedStreak); return next; });
    if (existingStreak?.streakId) {
      streaksApi.update(existingStreak.streakId, updatedStreak);
    } else {
      streaksApi.getActive().then(({ data: fresh }) => {
        const backendStreak = fresh?.find((s) => s.taskId === task.taskId);
        if (backendStreak?.streakId) {
          const merged = { ...updatedStreak, streakId: backendStreak.streakId };
          streaksApi.update(backendStreak.streakId, merged);
          setStreaks((prev) => {
            const cur = prev.get(task.taskId);
            if (!cur?.streakId) {
              const next = new Map(prev);
              next.set(task.taskId, merged);
              return next;
            }
            return prev;
          });
        }
      });
    }

    if (awarded > 0) {
      setRecurringPopups((prev) => new Map(prev).set(task.taskId, awarded));
      setTimeout(() => setRecurringPopups((prev) => { const n = new Map(prev); n.delete(task.taskId); return n; }), 1150);
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
      ? { ...t, status: "pending", dueDate: nextDueDate, completedAt: null, submitted: false }
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
      if (stagedTaskIds.includes(id) && snapshot?.pointValue) {
        window.dispatchEvent(new CustomEvent("staged-points-updated", { detail: { delta: -snapshot.pointValue } }));
      }
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
    if (stagedTaskIds.includes(id) && snapshot?.pointValue) {
      window.dispatchEvent(new CustomEvent("staged-points-updated", { detail: { delta: -snapshot.pointValue } }));
    }
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

  async function doSubmit() {
    if (selectedIds.size === 0) return;
    if (!isAuthenticated) {
      const ids = [...selectedIds];
      setIsSubmitting(true);
      setFilingIds(new Set(ids));
      const delay = Math.max(520, (ids.length - 1) * 35 + 520);
      setTimeout(() => {
        setSubmittedTaskIds((prev) => new Set([...prev, ...ids]));
        setRecentlyFiledIds(new Set(ids));
        setSelectedIds(new Set());
        setStagedTaskIds([]);
        setFilingIds(new Set());
        setIsSubmitting(false);
        window.dispatchEvent(new CustomEvent("staged-points-updated", { detail: { delta: 0, reset: true } }));
        setTimeout(() => setRecentlyFiledIds(new Set()), 600);
      }, delay);
      return;
    }
    const REGULAR_CAP = 150;
    const regularSubmitted = dailySubmitted - recurringSubmittedToday;
    const remaining = REGULAR_CAP - regularSubmitted;
    if (remaining <= 0) return;
    const ids = [...selectedIds];
    setIsSubmitting(true);
    const { data, error } = await usersApi.submitPoints(ids);
    setIsSubmitting(false);
    if (error) { setError(error); return; }

    setFilingIds(new Set(ids));
    const delay = Math.max(520, (ids.length - 1) * 35 + 520);
    setTimeout(() => {
      setSubmittedTaskIds((prev) => new Set([...prev, ...ids]));
      setRecentlyFiledIds(new Set(ids));
      setSelectedIds(new Set());
      setStagedTaskIds([]);
      setFilingIds(new Set());
      setDailySubmitted(data!.dailyTotal);
      window.dispatchEvent(new CustomEvent("points-awarded", { detail: { delta: data!.pointsAwarded ?? 0, newBalance: data!.newBalance } }));
      window.dispatchEvent(new CustomEvent("staged-points-updated", { detail: { delta: 0, reset: true } }));
      setTimeout(() => setRecentlyFiledIds(new Set()), 600);
    }, delay);
  }

  function handleSubmit() {
    if (_capped) { setShowCapWarning(true); return; }
    doSubmit();
  }

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#1e1f22" }}>
        <div className="w-5 h-5 border-2 border-[#333] border-t-[#5bb8e0] rounded-full animate-spin" />
      </div>
    );
  }

  const demoBanner = !isAuthenticated ? (
    <div className="flex items-center justify-between mb-3 px-3 py-2 text-[10px] tracking-widest uppercase" style={{ background: "rgba(91,184,224,0.07)", border: "1px solid rgba(91,184,224,0.18)", borderRadius: "3px" }}>
      <span style={{ color: "rgba(91,184,224,0.75)" }}>Demo · changes are not saved</span>
      <Link href="/login" style={{ color: "#5bb8e0", letterSpacing: "0.18em" }}>Sign in →</Link>
    </div>
  ) : null;

  const REGULAR_CAP = 150;
  const RECURRING_CAP = 50;
  const _regularSubmitted = dailySubmitted - recurringSubmittedToday;
  const _remaining = REGULAR_CAP - _regularSubmitted;
  const _recurringRemaining = RECURRING_CAP - recurringSubmittedToday;
  const _selectedPts = tasks.filter((t) => selectedIds.has(t.taskId)).reduce((s, t) => s + t.pointValue, 0);
  const _willAward = Math.min(_selectedPts, Math.max(0, _remaining));
  const _capped = _selectedPts > _remaining;
  const _limitReached = _remaining <= 0;
  const submitBarVisible = activeFilter === "completed" && selectedIds.size > 0;

  return (
    <>
      <div className="min-h-screen text-white flex flex-col bg-scanlines" style={{ background: "#1e1f22" }}>
        <div
          className="max-w-3xl w-full mx-auto px-4 py-8 flex flex-col flex-1"
          style={{ paddingBottom: submitBarVisible ? "96px" : undefined }}
        >

          {demoBanner}

          <div className="flex items-center justify-between mb-1">
            <h1 className="text-xl font-bold tracking-widest uppercase text-white">
              Tasks
            </h1>
            <button
              onClick={() => !isAuthenticated ? undefined : setShowNewTask(true)}
              title={!isAuthenticated ? "Sign in to create tasks" : undefined}
              className="text-xs tracking-widest uppercase px-4 py-2 font-semibold transition-colors"
              style={{ background: "#1a3a4a", color: "#5bb8e0", border: "1px solid #1e5068", cursor: !isAuthenticated ? "default" : "pointer", opacity: !isAuthenticated ? 0.4 : 1 }}
              onMouseEnter={(e) => { if (!isAuthenticated) return; e.currentTarget.style.background = "#1e4d63"; }}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#1a3a4a")}
            >
              + New
            </button>
          </div>

          <div className="flex mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}>
            {FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => applyFilter(f.value)}
                className="px-4 py-3 text-xs tracking-wider uppercase cursor-pointer transition-colors relative flex items-center gap-1.5"
                style={{
                  color: activeFilter === f.value ? "#5bb8e0" : "rgba(255,255,255,0.65)",
                  background: "transparent",
                  border: "none",
                }}
              >
                {f.label}
                {f.value === "completed" && selectedIds.size > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#f59e0b" }} />
                )}
                {activeFilter === f.value && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-px"
                    style={{ background: "#5bb8e0" }}
                  />
                )}
              </button>
            ))}
          </div>

          <div
            className="grid text-[10px] tracking-widest uppercase px-4 py-2 select-none"
            style={{
              gridTemplateColumns: "1fr 80px 64px 80px",
              color: "rgba(255,255,255,0.55)",
              position: "relative",
              zIndex: 2,
              background: "#1e1f22",
            }}
          >
            <span>Name</span>
            <span className="text-center">Category</span>
            <span className="text-center">Due</span>
            <span className="text-center">Points</span>
          </div>

          {error && (
            <div className="error-banner-anim px-4 py-3 mb-2 text-xs text-red-400" style={{ background: "#1e1e1e" }}>
              {error}
            </div>
          )}

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


          {activeFilter === "completed" && !loading && (() => {
            const unsubmitted = tasks.filter((t) =>
              t.status === "completed" && !submittedTaskIds.has(t.taskId) && !t.pointsAwarded && t.submitted === false
            );
            const hasUnsubmitted = unsubmitted.length > 0;
            const allSelected = hasUnsubmitted && unsubmitted.every((t) => selectedIds.has(t.taskId));
            return (
              <div className="flex justify-end px-1 mb-1" style={{ visibility: hasUnsubmitted ? "visible" : "hidden" }}>
                <button
                  onClick={() => {
                    if (allSelected) {
                      setSelectedIds((prev) => {
                        const n = new Set(prev);
                        unsubmitted.forEach((t) => n.delete(t.taskId));
                        return n;
                      });
                    } else {
                      setSelectedIds((prev) => new Set([...prev, ...unsubmitted.map((t) => t.taskId)]));
                    }
                  }}
                  className="text-[9px] tracking-widest uppercase cursor-pointer transition-colors"
                  style={{ color: allSelected ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.35)", background: "transparent", border: "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = allSelected ? "#f59e0b" : "rgba(255,255,255,0.6)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = allSelected ? "rgba(245,158,11,0.7)" : "rgba(255,255,255,0.35)")}
                >
                  {allSelected ? "Deselect All" : "Select All"}
                </button>
              </div>
            );
          })()}

          <div className="flex flex-col gap-1">
            {!loading && (() => {
              const completedSort = (a: TaskDto, b: TaskDto) => {
                const aUndo = a.submitted === false && !a.pointsAwarded && !submittedTaskIds.has(a.taskId);
                const bUndo = b.submitted === false && !b.pointsAwarded && !submittedTaskIds.has(b.taskId);
                return (bUndo ? 1 : 0) - (aUndo ? 1 : 0);
              };
              type Sep = { __sep: true };
              const listItems: (TaskDto | Sep)[] =
                activeFilter === "pending"
                  ? tasks.filter((t) => t.status === "pending" || t.status === "in_progress")
                  : activeFilter === "completed"
                    ? [...tasks].filter((t) => t.status === "completed").sort(completedSort)
                    : (() => {
                      const active = tasks.filter((t) => t.status !== "completed");
                      const completed = [...tasks].filter((t) => t.status === "completed").sort(completedSort);
                      return completed.length > 0
                        ? [...active, { __sep: true as const }, ...completed]
                        : active;
                    })();
              return listItems.map((item, _idx) => {
                if ("__sep" in item) {
                  return (
                    <div
                      key="__completed-sep"
                      className="flex items-center gap-3 px-1 mt-2 mb-1"
                    >
                      <span className="text-[9px] tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>
                        Completed
                      </span>
                      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
                    </div>
                  );
                }
                const task = item;
                const isInProgress = task.status === "in_progress";
                const isCompleted = task.status === "completed";
                const isGreyedOut = isInProgress && activeFilter === "pending";
                const dot = PRIORITY_DOT[task.priority.toLowerCase()] ?? "#888";
                const isAdvancing = advancing === task.taskId;
                const isFiling = filingIds.has(task.taskId);
                const canUndo = !isFiling && isCompleted && task.submitted === false && !task.pointsAwarded && !submittedTaskIds.has(task.taskId);
                const isSubmitted = isFiling || (isCompleted && (task.submitted === true || submittedTaskIds.has(task.taskId) || !!task.pointsAwarded));
                const filingIndex = isFiling ? [...filingIds].indexOf(task.taskId) : 0;
                const isSelectable = activeFilter === "completed" && isCompleted && !isSubmitted;

                return (
                  <div
                    key={task.taskId}
                    className={`task-row-wrapper${slashingId === task.taskId ? " task-row-deleting" : ""}`}
                    style={{ position: "relative", height: "60px" }}
                  >
                    <div
                      className={[
                        "task-row-inner grid items-center px-4",
                        isGreyedOut ? "greyed" : "",
                        !isInProgress && !canUndo ? "default-border" : "",
                      ].filter(Boolean).join(" ")}
                      onClick={() => setDetailTask(task)}
                      style={{
                        position: "absolute",
                        inset: 0,
                        gridTemplateColumns: "1fr 80px 64px 80px",
                        borderLeft: isInProgress
                          ? "2px solid #5bb8e0"
                          : canUndo
                            ? "2px solid rgba(245,158,11,0.7)"
                            : undefined,
                        opacity: isCompleted && !canUndo ? 0.55 : isGreyedOut ? undefined : 1,
                        transition: "opacity 0.15s ease-out",
                        cursor: "pointer",
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {isSelectable ? (
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleSelect(task.taskId); }}
                            className="w-4 h-4 flex-shrink-0 flex items-center justify-center transition-all duration-150"
                            style={{
                              border: `1px solid ${selectedIds.has(task.taskId) ? "#4ade80" : "rgba(255,255,255,0.25)"}`,
                              borderRadius: "2px",
                              background: selectedIds.has(task.taskId) ? "rgba(74,222,128,0.12)" : "transparent",
                            }}
                          >
                            {selectedIds.has(task.taskId) && (
                              <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                                <polyline points="1,3 3,5 7,1" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </button>
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dot }} />
                        )}
                        <div className="min-w-0">
                          <p
                            className="text-sm truncate"
                            style={{
                              color: isCompleted && !canUndo ? "rgba(255,255,255,0.45)" : "#ffffff",
                              textDecoration: isCompleted ? "line-through" : "none",
                            }}
                          >
                            {task.title}
                          </p>
                          {isInProgress && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <span style={{ color: "#5bb8e0", fontSize: "8px", lineHeight: 1 }}>█</span>
                              <span style={{ color: "#5bb8e0", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase" }}>Active</span>
                            </div>
                          )}
                          {canUndo && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                                <path d="M7 1.5H4C2.3 1.5 1 2.8 1 4.5s1.3 3 3 3h4" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" />
                                <polyline points="3.5,4 1,1.5 3.5,0" stroke="#f59e0b" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                              </svg>
                              <span style={{ color: "#f59e0b", fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase" }}>Undo</span>
                            </div>
                          )}
                          {task.isRecurring && task.recurrenceRule && !isInProgress && !canUndo && (() => {
                            const isLocked = !canCheckInNow(task.dueDate, task.recurrenceRule);
                            const taskStreak = streaks.get(task.taskId);
                            const unlockInfo = isLocked ? getUnlockInfo(task.dueDate) : null;
                            const ruleLabel = task.recurrenceRule === "daily" ? "Daily"
                              : task.recurrenceRule === "weekdays" ? "Weekdays"
                              : getNextOccurrenceLabel(task.dueDate, task.recurrenceRule);
                            const color = isLocked ? "rgba(245,158,11,0.65)" : "#a78bfa";
                            return (
                              <div className="flex items-center gap-1.5 mt-0.5" style={{ overflow: "hidden" }}>
                                <span style={{ color, fontSize: "9px", lineHeight: 1, flexShrink: 0 }}>↻</span>
                                <span style={{ color, fontSize: "8px", letterSpacing: "0.22em", textTransform: "uppercase", flexShrink: 0 }}>
                                  {ruleLabel}
                                </span>
                                {isLocked && unlockInfo && (
                                  <>
                                    <span style={{ color: "rgba(245,158,11,0.35)", fontSize: "8px", flexShrink: 0 }}>·</span>
                                    <svg width="7" height="8" viewBox="0 0 10 12" fill="none" style={{ flexShrink: 0 }}>
                                      <rect x="2" y="5" width="6" height="6" rx="0.8" stroke="rgba(245,158,11,0.55)" strokeWidth="1.2" fill="none"/>
                                      <path d="M3.5 5V3.5a1.5 1.5 0 0 1 3 0V5" stroke="rgba(245,158,11,0.55)" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
                                    </svg>
                                    <span style={{ color: "rgba(245,158,11,0.6)", fontSize: "8px", letterSpacing: "0.15em", textTransform: "uppercase", flexShrink: 0 }}>
                                      {(task.recurrenceRule === "biweekly" || task.recurrenceRule === "monthly")
                                        ? unlockInfo.date
                                        : unlockInfo.days === 1 ? "tomorrow" : `in ${unlockInfo.days} days`}
                                    </span>
                                  </>
                                )}
                                {taskStreak && taskStreak.currentCount > 0 && (
                                  <span style={{ color, fontSize: "8px", letterSpacing: "0.1em", opacity: 0.75, flexShrink: 0 }}>
                                    · 🔥 {taskStreak.currentCount}
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </div>
                      </div>

                      <div className="flex items-center justify-center">
                        <span className="text-[10px] tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.6)" }}>
                          {task.category || "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-center">
                        <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.6)" }}>
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                            : "—"}
                        </span>
                      </div>

                      <div className="flex items-center justify-center gap-1">
                        {isSubmitted ? (
                          <div
                            className={`flex items-center gap-1 px-1.5 py-0.5${recentlyFiledIds.has(task.taskId) ? " filed-badge-enter" : ""}`}
                            style={{
                              border: "1px solid rgba(74,222,128,0.35)",
                              borderRadius: "2px",
                              background: "rgba(74,222,128,0.06)",
                            }}
                          >
                            <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                              <polyline points="1.5,5 4,7.5 8.5,2" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span style={{ color: "rgba(74,222,128,0.75)", fontSize: "8px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 600 }}>
                              Filed
                            </span>
                          </div>
                        ) : canUndo ? (
                          <div
                            className="flex items-center gap-1 px-1.5 py-0.5"
                            style={{
                              border: "1px solid rgba(245,158,11,0.35)",
                              borderRadius: "2px",
                              background: "rgba(245,158,11,0.06)",
                            }}
                          >
                            <svg width="8" height="10" viewBox="0 0 10 12" fill="none">
                              <polygon points="5,0 10,4 5,12 0,4" fill="#f59e0b" opacity="0.85" />
                            </svg>
                            <span style={{ color: "rgba(245,158,11,0.9)", fontSize: "11px", fontWeight: 600, letterSpacing: "0.03em" }}>
                              {task.pointValue.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <>
                            <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                              <polygon points="5,0 10,4 5,12 0,4" fill="#5bb8e0" opacity="0.9" />
                            </svg>
                            <span className="text-xs font-semibold" style={{ color: "#5bb8e0" }}>
                              {task.pointValue.toLocaleString()}
                            </span>
                          </>
                        )}
                      </div>

                    </div>

                    <div
                      className="task-actions"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        right: 0,
                        flexDirection: "column",
                        width: "28px",
                        background: "#1e1f22",
                        border: "1px solid #3a3b3f",
                        overflow: "hidden",
                        zIndex: 10,
                      }}
                    >
                      {task.status === "pending" && task.isRecurring && !isGreyedOut && (() => {
                        const eligible = canCheckInNow(task.dueDate, task.recurrenceRule);
                        return (
                          <button
                            onClick={eligible ? () => handleCheckIn(task) : undefined}
                            disabled={isAdvancing || !eligible}
                            title={eligible ? "Check In" : "Already checked in"}
                            style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: eligible ? "pointer" : "not-allowed", background: "transparent", border: "none", opacity: isAdvancing || !eligible ? 0.3 : 1 }}
                            onMouseEnter={(e) => { if (eligible) e.currentTarget.style.background = "rgba(167,139,250,0.15)"; }}
                            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                          >
                            {eligible ? (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <polyline points="1,5 4,8 9,2" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            ) : (
                              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                <rect x="2.5" y="4.5" width="5" height="4" rx="0.5" stroke="#a78bfa" strokeWidth="1.2" fill="none" />
                                <path d="M3.5 4.5V3a1.5 1.5 0 0 1 3 0v1.5" stroke="#a78bfa" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                              </svg>
                            )}
                          </button>
                        );
                      })()}

                      {task.status === "pending" && !task.isRecurring && !isGreyedOut && (
                        <button
                          onClick={() => handleAdvance(task)}
                          disabled={isAdvancing}
                          title="Start"
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", border: "none", opacity: isAdvancing ? 0.4 : 1 }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(91,184,224,0.15)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <polygon points="2,1 9,5 2,9" fill="#5bb8e0" />
                          </svg>
                        </button>
                      )}

                      {isInProgress && (
                        <button
                          onClick={() => handlePause(task)}
                          disabled={pausing === task.taskId}
                          title="Pause"
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", border: "none", opacity: pausing === task.taskId ? 0.4 : 1 }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.15)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <rect x="1.5" y="1" width="3" height="8" fill="#f59e0b" />
                            <rect x="5.5" y="1" width="3" height="8" fill="#f59e0b" />
                          </svg>
                        </button>
                      )}

                      {isInProgress && !isGreyedOut && (
                        <button
                          onClick={() => handleAdvance(task)}
                          disabled={isAdvancing}
                          title="Complete"
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", border: "none", opacity: isAdvancing ? 0.4 : 1 }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(91,184,224,0.15)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <polyline points="1,5 4,8 9,2" stroke="#5bb8e0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      )}

                      {canUndo && !isGreyedOut && (
                        <button
                          onClick={() => handleAdvance(task)}
                          disabled={isAdvancing}
                          title="Undo"
                          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", border: "none", opacity: isAdvancing ? 0.4 : 1 }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(245,158,11,0.15)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                        >
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                            <path d="M7 2H4C2.3 2 1 3.3 1 5s1.3 3 3 3h4" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                            <polyline points="4,4.5 1.5,2 4,0" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          </svg>
                        </button>
                      )}

                      {!isGreyedOut && <button
                        onClick={() => handleDelete(task.taskId)}
                        disabled={slashingId === task.taskId}
                        title="Delete"
                        style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: "transparent", border: "none", opacity: slashingId === task.taskId ? 0.4 : 1 }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.15)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <line x1="1" y1="1" x2="9" y2="9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="9" y1="1" x2="1" y2="9" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>}
                    </div>
                    {slashingId === task.taskId && (
                      <div style={{ position: "absolute", inset: 0, zIndex: 25, pointerEvents: "none" }}>
                        <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", filter: "drop-shadow(0 0 6px rgba(239,68,68,1)) drop-shadow(0 0 14px rgba(239,68,68,0.6))" }}>
                          <line x1="1" y1="30" x2="99" y2="30" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" className="slash-line" />
                          <line x1="1" y1="30" x2="99" y2="30" stroke="rgba(255,180,180,0.45)" strokeWidth="5" strokeLinecap="round" className="slash-line" />
                        </svg>
                      </div>
                    )}
                    {recurringPopups.has(task.taskId) && isInProgress && (
                      <div
                        key={`popup-${task.taskId}`}
                        className="recurring-pts-popup"
                        style={{
                          position: "absolute",
                          right: "80px",
                          top: "4px",
                          zIndex: 30,
                          color: "#a78bfa",
                          fontSize: "12px",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textShadow: "0 0 8px rgba(167,139,250,0.7)",
                        }}
                      >
                        +{recurringPopups.get(task.taskId)} pts
                      </div>
                    )}
                    <ShatterEffect active={isFiling} />
                  </div>
                );
              });
            })()}
          </div>

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

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transform: submitBarVisible ? "translateY(0)" : "translateY(100%)",
          opacity: submitBarVisible ? 1 : 0,
          transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.18s ease-out",
          pointerEvents: submitBarVisible ? "auto" : "none",
          background: "#23242a",
          borderTop: "1px solid rgba(245,158,11,0.35)",
          boxShadow: "0 -6px 32px rgba(0,0,0,0.55)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between gap-6">
          <div className="flex flex-col gap-0.5">
            <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Pending Submission
            </span>
            <div className="flex items-center gap-1.5">
              <svg width="8" height="10" viewBox="0 0 10 12" fill="none">
                <polygon points="5,0 10,4 5,12 0,4" fill="#f59e0b" opacity="0.85" />
              </svg>
              <span style={{ color: "#f59e0b", fontSize: "13px", fontWeight: 600 }}>
                {selectedIds.size} task{selectedIds.size !== 1 ? "s" : ""} · {_selectedPts.toLocaleString()} pts selected
              </span>
            </div>
            {_limitReached ? (
              <span style={{ color: "#ef4444", fontSize: "10px", letterSpacing: "0.05em" }}>
                Regular limit reached (150 pts/day)
              </span>
            ) : _capped ? (
              <span style={{ color: "rgba(239,68,68,0.8)", fontSize: "10px", letterSpacing: "0.05em" }}>
                {(_selectedPts - _willAward).toLocaleString()} pts will be lost · only {_remaining} regular remaining today
              </span>
            ) : (
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px", letterSpacing: "0.05em" }}>
                Regular: {_remaining} pts left · Recurring: {_recurringRemaining} pts left
              </span>
            )}
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || _limitReached}
            className="flex-shrink-0 text-[10px] tracking-widest uppercase px-4 py-2.5 cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed submit-btn"
            style={{ color: "#f59e0b", border: "1px solid rgba(245,158,11,0.5)", background: "rgba(245,158,11,0.08)" }}
            onMouseEnter={(e) => { if (!isSubmitting && !_limitReached) e.currentTarget.style.background = "rgba(245,158,11,0.18)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(245,158,11,0.08)"; }}
          >
            {isSubmitting ? "Submitting…" : _limitReached ? "Limit Reached" : `File ${selectedIds.size} task${selectedIds.size !== 1 ? "s" : ""} ▶`}
          </button>
        </div>
      </div>

      {detailTask && (() => {
        const dt = detailTask;
        const dtCanUndo = dt.status === "completed" && dt.submitted === false && !dt.pointsAwarded && !submittedTaskIds.has(dt.taskId);
        const closeDetail = () => setDetailTask(null);
        return (
          <TaskDetailModal
            task={dt}
            streak={streaks.get(dt.taskId)}
            onClose={closeDetail}
            canUndo={dtCanUndo}
            isActing={advancing === dt.taskId || pausing === dt.taskId || slashingId === dt.taskId}
            onStart={dt.status === "pending" && !dt.isRecurring ? () => { closeDetail(); handleAdvance(dt); } : undefined}
            onCheckIn={dt.status === "pending" && dt.isRecurring && canCheckInNow(dt.dueDate, dt.recurrenceRule) ? () => { closeDetail(); handleCheckIn(dt); } : undefined}
            checkInBlocked={dt.status === "pending" && dt.isRecurring && !canCheckInNow(dt.dueDate, dt.recurrenceRule)}
            onPause={dt.status === "in_progress" ? () => { closeDetail(); handlePause(dt); } : undefined}
            onComplete={dt.status === "in_progress" ? () => { closeDetail(); handleAdvance(dt); } : undefined}
            onUndo={dtCanUndo ? () => { closeDetail(); handleAdvance(dt); } : undefined}
            onDelete={() => { closeDetail(); handleDelete(dt.taskId); }}
          />
        );
      })()}

      {showNewTask && (
        <NewTaskModal
          onClose={() => setShowNewTask(false)}
          onCreated={(task) => {
            setTasks((prev) => [task, ...prev]);
            setShowNewTask(false);
          }}
        />
      )}

      {showCapWarning && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.65)" }}
          onClick={() => setShowCapWarning(false)}
        >
          <div
            className="w-full max-w-sm p-6 flex flex-col gap-4"
            style={{ background: "#1e1f22", border: "1px solid rgba(239,68,68,0.45)", borderRadius: "4px", boxShadow: "0 16px 48px rgba(0,0,0,0.7)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="flex-shrink-0 mt-0.5">
                <path d="M10 2L18 17H2L10 2Z" stroke="#ef4444" strokeWidth="1.5" strokeLinejoin="round" />
                <line x1="10" y1="8" x2="10" y2="12" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="10" cy="14.5" r="0.75" fill="#ef4444" />
              </svg>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold tracking-wide" style={{ color: "#ef4444" }}>Daily Cap Exceeded</p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                  You&apos;re submitting <span style={{ color: "#fff", fontWeight: 600 }}>{_selectedPts.toLocaleString()} pts</span> but only{" "}
                  <span style={{ color: "#fff", fontWeight: 600 }}>{_remaining} pts</span> of your 150 pt regular daily limit remain.
                </p>
                <p className="text-xs font-semibold" style={{ color: "#ef4444" }}>
                  {(_selectedPts - _willAward).toLocaleString()} pts will be lost.
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowCapWarning(false)}
                className="px-4 py-2 text-xs tracking-widest uppercase cursor-pointer transition-colors"
                style={{ color: "rgba(255,255,255,0.5)", background: "transparent", border: "1px solid #3a3b3f", borderRadius: "3px" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#555"; e.currentTarget.style.color = "rgba(255,255,255,0.75)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#3a3b3f"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setShowCapWarning(false); doSubmit(); }}
                className="px-4 py-2 text-xs tracking-widest uppercase cursor-pointer transition-colors"
                style={{ color: "#ef4444", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.45)", borderRadius: "3px" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
              >
                Submit anyway ({_willAward} pts)
              </button>
            </div>
          </div>
        </div>
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
