import { TaskDto, CheckInCycleDto } from "@/lib/api/tasks";
import { dateKey } from "@/lib/dateUtils";

// Walk back from today and generate plausible cycle history so demo tasks
// have a populated heatmap + counter history without a backend call.
// Honours the recurrence rule (skips Sat/Sun for "weekdays") and caps at 14
// cycles since the embedded slice is bounded that way in production.
function generateMockCycles(t: TaskDto): CheckInCycleDto[] {
  if (!t.isRecurring) return [];
  if (t.recurrenceRule !== "daily" && t.recurrenceRule !== "weekdays") return [];
  const streak = t.currentStreakCount ?? 0;
  if (streak <= 0) return [];

  const target = Math.min(streak, 14);
  const cycles: CheckInCycleDto[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cursor = new Date(today);

  while (cycles.length < target) {
    const dow = cursor.getDay();
    const skip = t.recurrenceRule === "weekdays" && (dow === 0 || dow === 6);
    if (!skip) {
      const key = dateKey(cursor);
      // Deterministic-ish pseudo-counter so the demo heatmap shading varies
      // realistically. Matches the unit (e.g. "words" → 22-44 per day).
      const counterValue = t.hasCounter ? 22 + ((cycles.length * 11) % 23) : null;
      cycles.push({
        cycleId: cycles.length + 1,
        taskId: t.taskId,
        checkInDate: `${key}T12:00:00.000Z`,
        counterValue,
        createdAt: `${dateKey}T12:00:00.000Z`,
      });
    }
    cursor.setDate(cursor.getDate() - 1);
  }
  return cycles;
}

export function withMockCycles(t: TaskDto): TaskDto {
  const cycles = generateMockCycles(t);
  return cycles.length ? { ...t, recentCycles: cycles } : t;
}

const RAW_MOCK_TASKS: TaskDto[] = [
  { taskId: "d1", userId: "demo", title: "Morning workout", description: "30 min cardio or strength training", category: "Fitness", priority: "high", status: "pending", pointValue: 15, dueDate: "2026-05-05", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 12, longestStreakCount: 15 },
  { taskId: "d2", userId: "demo", title: "Read 30 minutes", description: null, category: "Learning", priority: "medium", status: "pending", pointValue: 10, dueDate: "2026-05-05", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekdays", submitted: false, currentStreakCount: 8, longestStreakCount: 21 },
  { taskId: "d3", userId: "demo", title: "Weekly review & planning", description: "Review last week, plan the next", category: "Productivity", priority: "high", status: "pending", pointValue: 20, dueDate: "2026-05-08", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "weekly", submitted: false, currentStreakCount: 5, longestStreakCount: 5 },
  { taskId: "d4", userId: "demo", title: "Monthly budget review", description: null, category: "Finance", priority: "high", status: "pending", pointValue: 25, dueDate: "2026-05-15", createdAt: "2026-01-01T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "monthly", submitted: false },
  { taskId: "d13", userId: "demo", title: "10-minute meditation", description: "Sit, breathe, settle", category: "Health", priority: "medium", status: "pending", pointValue: 15, dueDate: "2026-05-05", createdAt: "2026-04-04T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 31, longestStreakCount: 31 },
  { taskId: "d14", userId: "demo", title: "Spanish — Duolingo", description: "Maintain the streak", category: "Learning", priority: "medium", status: "pending", pointValue: 10, dueDate: "2026-05-05", createdAt: "2026-04-12T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 22, longestStreakCount: 22, hasCounter: true, counterUnit: "words", counterGoal: 40 },
  { taskId: "d15", userId: "demo", title: "Floss", description: "One more day to 2.0x", category: "Health", priority: "low", status: "pending", pointValue: 5, dueDate: "2026-05-05", createdAt: "2026-04-05T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 29, longestStreakCount: 29 },
  { taskId: "d16", userId: "demo", title: "5-min stretch", description: null, category: "Fitness", priority: "low", status: "pending", pointValue: 5, dueDate: "2026-05-05", createdAt: "2026-04-29T00:00:00Z", completedAt: null, isRecurring: true, recurrenceRule: "daily", submitted: false, currentStreakCount: 6, longestStreakCount: 9 },
  { taskId: "d5", userId: "demo", title: "Fix login page redirect bug", description: null, category: "Dev", priority: "high", status: "in_progress", pointValue: 30, dueDate: "2026-04-26", createdAt: "2026-04-20T00:00:00Z", completedAt: null, isRecurring: false, recurrenceRule: null, submitted: false, subtasks: [
    { subtaskId: 201, taskId: "d5", title: "Reproduce locally",                completed: true,  sortOrder: 0, createdAt: "2026-04-20T00:00:00Z" },
    { subtaskId: 202, taskId: "d5", title: "Trace auth callback flow",         completed: false, sortOrder: 1, createdAt: "2026-04-20T00:00:00Z" },
    { subtaskId: 203, taskId: "d5", title: "Patch + add regression test",      completed: false, sortOrder: 2, createdAt: "2026-04-20T00:00:00Z" },
  ] },
  { taskId: "d6", userId: "demo", title: "Design new dashboard mockup", description: null, category: "Design", priority: "medium", status: "pending", pointValue: 20, dueDate: "2026-05-03", createdAt: "2026-04-22T00:00:00Z", completedAt: null, isRecurring: false, recurrenceRule: null, submitted: false, subtasks: [
    { subtaskId: 101, taskId: "d6", title: "Sketch low-fi wireframe", completed: true,  sortOrder: 0, createdAt: "2026-04-22T00:00:00Z" },
    { subtaskId: 102, taskId: "d6", title: "Pick color palette",     completed: true,  sortOrder: 1, createdAt: "2026-04-22T00:00:00Z" },
    { subtaskId: 103, taskId: "d6", title: "Build hi-fi in Figma",   completed: false, sortOrder: 2, createdAt: "2026-04-22T00:00:00Z" },
    { subtaskId: 104, taskId: "d6", title: "Share for review",       completed: false, sortOrder: 3, createdAt: "2026-04-22T00:00:00Z" },
  ] },
  { taskId: "d7", userId: "demo", title: "Organize project notes", description: null, category: "Productivity", priority: "low", status: "pending", pointValue: 5, dueDate: null, createdAt: "2026-04-23T00:00:00Z", completedAt: null, isRecurring: false, recurrenceRule: null, submitted: false },
  { taskId: "d8", userId: "demo", title: "Write project README", description: null, category: "Dev", priority: "medium", status: "completed", pointValue: 15, dueDate: "2026-04-25", createdAt: "2026-04-20T00:00:00Z", completedAt: "2026-04-25T14:00:00Z", isRecurring: false, recurrenceRule: null, submitted: false, pointsAwarded: false },
  { taskId: "d9", userId: "demo", title: "Update resume", description: null, category: "Career", priority: "low", status: "completed", pointValue: 10, dueDate: "2026-04-24", createdAt: "2026-04-18T00:00:00Z", completedAt: "2026-04-24T10:00:00Z", isRecurring: false, recurrenceRule: null, submitted: true, pointsAwarded: true },
  { taskId: "d10", userId: "demo", title: "File Q1 expenses", description: null, category: "Finance", priority: "medium", status: "completed", pointValue: 20, dueDate: "2026-02-15", createdAt: "2026-02-10T00:00:00Z", completedAt: "2026-02-14T18:00:00Z", isRecurring: false, recurrenceRule: null, submitted: true, pointsAwarded: true, isArchived: true },
  { taskId: "d11", userId: "demo", title: "Renew domain registration", description: null, category: "Admin", priority: "low", status: "completed", pointValue: 5, dueDate: "2026-01-20", createdAt: "2026-01-15T00:00:00Z", completedAt: "2026-01-19T09:00:00Z", isRecurring: false, recurrenceRule: null, submitted: true, pointsAwarded: true, isArchived: true },
  { taskId: "d12", userId: "demo", title: "New Year retro", description: "Reflect on last year and set goals", category: "Productivity", priority: "high", status: "completed", pointValue: 25, dueDate: "2026-01-05", createdAt: "2026-01-01T00:00:00Z", completedAt: "2026-01-04T20:00:00Z", isRecurring: false, recurrenceRule: null, submitted: true, pointsAwarded: true, isArchived: true },
];

export const MOCK_TASKS: TaskDto[] = RAW_MOCK_TASKS.map(withMockCycles);
