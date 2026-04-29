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
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
];

export const REGULAR_CAP = 150;
export const RECURRING_CAP = 50;
