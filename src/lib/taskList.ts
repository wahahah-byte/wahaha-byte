import { TaskDto } from "@/lib/api/tasks";
import { canCheckInNow, parseLocalDate } from "@/lib/dateUtils";

export type GroupMode = "none" | "due" | "category";
export type SortMode = "due" | "priority" | "title" | "points";

export type Sep = { __sep: true; label: string; sepKey: string };
export const sep = (label: string, sepKey: string): Sep => ({ __sep: true, label, sepKey });

export const completedSort =
  (submittedTaskIds: Set<string>) =>
  (a: TaskDto, b: TaskDto) => {
    const aUndo = a.submitted === false && !a.pointsAwarded && !submittedTaskIds.has(a.taskId);
    const bUndo = b.submitted === false && !b.pointsAwarded && !submittedTaskIds.has(b.taskId);
    return (bUndo ? 1 : 0) - (aUndo ? 1 : 0);
  };

const byDueDate = (a: TaskDto, b: TaskDto) => {
  if (!a.dueDate && !b.dueDate) return 0;
  if (!a.dueDate) return 1;
  if (!b.dueDate) return -1;
  return a.dueDate.localeCompare(b.dueDate);
};

const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

const getTaskTier = (t: TaskDto): 0 | 1 => {
  if (t.isRecurring) return canCheckInNow(t.dueDate, t.recurrenceRule, t.lastCheckInDate) ? 0 : 1;
  return t.status === "in_progress" ? 1 : 0;
};

export const makeSortTasks = (sortMode: SortMode) => (a: TaskDto, b: TaskDto): number => {
  const tierDiff = getTaskTier(a) - getTaskTier(b);
  if (tierDiff !== 0) return tierDiff;
  switch (sortMode) {
    case "priority": return (PRIORITY_ORDER[a.priority.toLowerCase()] ?? 3) - (PRIORITY_ORDER[b.priority.toLowerCase()] ?? 3);
    case "title": return a.title.localeCompare(b.title);
    case "points": return b.pointValue - a.pointValue;
    default: return byDueDate(a, b);
  }
};

export function buildListItems(args: {
  tasks: TaskDto[];
  activeFilter: string;
  groupMode: GroupMode;
  sortMode: SortMode;
  submittedTaskIds: Set<string>;
}): (TaskDto | Sep)[] {
  const { tasks, activeFilter, groupMode, sortMode, submittedTaskIds } = args;
  const cmpCompleted = completedSort(submittedTaskIds);
  const sortTasks = makeSortTasks(sortMode);

  if (activeFilter === "completed") {
    return [...tasks].filter((t) => t.status === "completed").sort(cmpCompleted);
  }
  const activeTasks =
    activeFilter === "pending"
      ? tasks.filter((t) => t.status === "pending" || t.status === "in_progress")
      : activeFilter === "in_progress"
        ? tasks.filter((t) => t.status === "in_progress")
        : tasks.filter((t) => t.status !== "completed");
  const completedTasks = activeFilter === "all"
    ? [...tasks].filter((t) => t.status === "completed").sort(cmpCompleted)
    : [];
  const items: (TaskDto | Sep)[] = [];
  if (groupMode === "due") {
    const buckets = new Map<string, TaskDto[]>();
    for (const t of activeTasks) {
      const key = t.dueDate ?? "__none";
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(t);
    }
    const keys = [...buckets.keys()].sort((a, b) => {
      if (a === "__none") return 1;
      if (b === "__none") return -1;
      return a.localeCompare(b);
    });
    for (const key of keys) {
      const label = key === "__none"
        ? "No Due Date"
        : parseLocalDate(key).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      items.push(sep(label, `__sep-due-${key}`), ...buckets.get(key)!.sort(sortTasks));
    }
  } else if (groupMode === "category") {
    const buckets = new Map<string, TaskDto[]>();
    for (const t of activeTasks) {
      const key = t.category || "__none";
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key)!.push(t);
    }
    const keys = [...buckets.keys()].sort((a, b) => {
      if (a === "__none") return 1;
      if (b === "__none") return -1;
      return a.localeCompare(b);
    });
    for (const key of keys) {
      const label = key === "__none" ? "No Category" : key;
      items.push(sep(label, `__sep-cat-${key}`), ...buckets.get(key)!.sort(sortTasks));
    }
  } else {
    items.push(...[...activeTasks].sort(sortTasks));
  }
  if (completedTasks.length > 0) items.push(sep("Completed", "__sep-completed"), ...completedTasks);
  return items;
}
