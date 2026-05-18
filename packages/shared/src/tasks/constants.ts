export const CATEGORIES: string[] = [
  "Career", "Design", "Dev", "Finance", "Fitness", "Habits",
  "Health", "Learning", "Other", "Personal", "Productivity", "Study", "Work",
];

export const CATEGORY_COLOR: Record<string, string> = {
  Career:       "#e0cc84",
  Design:       "#eeaacf",
  Dev:          "#94d9d6",
  Finance:      "#9ed4a6",
  Fitness:      "#f2b88c",
  Habits:       "#ccaae8",
  Health:       "#8ed9be",
  Learning:     "#94bce8",
  Other:        "#b8b8c2",
  Personal:     "#f0a8bb",
  Productivity: "#cce870",
  Study:        "#aeaee0",
  Work:         "#b4c4d8",
};

export const PRIORITY_DOT: Record<string, string> = {
  high: "#ef4444",
  medium: "#f59e0b",
  low: "#22c55e",
};

export const FILTERS = [
  { label: "All", shortLabel: "All", value: "all" },
  { label: "Pending", shortLabel: "Pending", value: "pending" },
  { label: "In Progress", shortLabel: "Active", value: "in_progress" },
  { label: "Completed", shortLabel: "Done", value: "completed" },
] as const;

export const RECURRING_FILTERS = [
  { label: "All", shortLabel: "All", value: "all" },
  { label: "Today", shortLabel: "Today", value: "today" },
  { label: "Upcoming", shortLabel: "Upcoming", value: "upcoming" },
  { label: "Missed", shortLabel: "Missed", value: "missed" },
] as const;

export const REGULAR_CAP = 200;
export const RECURRING_CAP = 200;
export const PER_CATEGORY_REGULAR_DAILY_CAP = 50;
export const PER_CATEGORY_RECURRING_DAILY_CAP = 50;

export const PER_TASK_VALUE_CAP: Record<string, number> = {
  Career:       25,
  Dev:          25,
  Design:       25,
  Learning:     25,
  Study:        25,
  Work:         25,
  Finance:      20,
  Health:       20,
  Productivity: 20,
  Fitness:      15,
  Personal:     15,
  Other:        15,
  Habits:       10,
};

export function maxPointsFor(category: string): number {
  return PER_TASK_VALUE_CAP[category] ?? 25;
}

export const COUNTER_UNITS = [
  "words", "pages", "chapters",
  "minutes", "hours",
  "workouts",
  "km", "miles", "steps",
  "glasses", "calories",
  "items", "tasks",
] as const;

export type CounterUnit = typeof COUNTER_UNITS[number];
