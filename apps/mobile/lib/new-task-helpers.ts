// Constants + label helpers for the new-task quick-add bar.
// (fmtDate is shared with the task form — see task-form-helpers.)

export type Priority = "low" | "medium" | "high";

export const PRIORITY_CYCLE: Priority[] = ["low", "medium", "high"];
export const PRIORITY_LABEL: Record<Priority, string> = { low: "Low", medium: "Med", high: "High" };
export const PRIORITY_API: Record<Priority, string> = { low: "Low", medium: "Medium", high: "High" };

export const REPEAT_OPTIONS: { value: string; label: string; rule: string | null }[] = [
  { value: "once", label: "Once", rule: null },
  { value: "daily", label: "Daily", rule: "daily" },
  { value: "weekdays", label: "Weekdays", rule: "weekdays" },
  { value: "weekly", label: "Weekly", rule: "weekly" },
  { value: "biweekly", label: "Biweekly", rule: "biweekly" },
  { value: "monthly", label: "Monthly", rule: "monthly" },
];

// How far the bar drops offscreen for mount/dismiss slide.
export const SLIDE_OFFSCREEN = 240;
export const ANIM_MS = 240;

export function dateChipLabel(d: Date | null): string {
  if (!d) return "Date";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  const diffDays = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tmrw";
  if (diffDays === -1) return "Yest";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
