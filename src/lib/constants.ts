export const CATEGORIES = ["Career", "Design", "Dev", "Finance", "Fitness", "Habits", "Health", "Learning", "Other", "Personal", "Productivity", "Study", "Work"];

export const CATEGORY_COLOR: Record<string, string> = {
  Career:       "#e0cc84",  // baby gold
  Design:       "#eeaacf",  // baby pink
  Dev:          "#94d9d6",  // baby teal
  Finance:      "#9ed4a6",  // baby sage
  Fitness:      "#f2b88c",  // baby peach
  Habits:       "#ccaae8",  // baby lavender
  Health:       "#8ed9be",  // baby mint
  Learning:     "#94bce8",  // baby blue
  Other:        "#b8b8c2",  // baby grey
  Personal:     "#f0a8bb",  // baby rose
  Productivity: "#cce870",  // baby chartreuse
  Study:        "#aeaee0",  // baby periwinkle
  Work:         "#b4c4d8",  // baby steel
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
];

export const RECURRING_FILTERS = [
  { label: "All", shortLabel: "All", value: "all" },
  { label: "Today", shortLabel: "Today", value: "today" },
  { label: "Upcoming", shortLabel: "Upcoming", value: "upcoming" },
  { label: "Missed", shortLabel: "Missed", value: "missed" },
];

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
  "reps", "sets", "pushups", "situps",
  "km", "miles", "steps",
  "glasses", "calories",
  "items", "tasks",
] as const;

export type CounterUnit = typeof COUNTER_UNITS[number];
