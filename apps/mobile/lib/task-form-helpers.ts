// Shared constants + date helpers for the task creation/edit forms
// (task-form.tsx and the new-task quick-add screen).

export const REPEAT_OPTIONS: { label: string; value: string; rule: string | null }[] = [
  { label: "Once", value: "once", rule: null },
  { label: "Daily", value: "daily", rule: "daily" },
  { label: "Wkdys", value: "weekdays", rule: "weekdays" },
  { label: "Weekly", value: "weekly", rule: "weekly" },
  { label: "Biweek", value: "biweekly", rule: "biweekly" },
  { label: "Monthly", value: "monthly", rule: "monthly" },
];

export type PriorityKey = "low" | "medium" | "high";

export function fmtDate(d: Date | null): string | null {
  if (!d) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function parseDate(s: string | null): Date | null {
  if (!s) return null;
  const [y, m, d] = s.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
}
