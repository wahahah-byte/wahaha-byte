export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function getPrevPeriodStart(due: Date, rule: string): Date {
  const prev = new Date(due);
  if (rule === "daily" || rule === "weekdays") prev.setDate(prev.getDate() - 1);
  else if (rule === "weekly") prev.setDate(prev.getDate() - 7);
  else if (rule === "biweekly") prev.setDate(prev.getDate() - 14);
  else if (rule === "monthly") prev.setMonth(prev.getMonth() - 1);
  return prev;
}

export function canCheckInNow(dueDate: string | null, rule?: string | null): boolean {
  if (rule === "weekdays") {
    const day = new Date().getDay();
    if (day === 0 || day === 6) return false;
  }
  if (!dueDate) return true;
  const due = parseLocalDate(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (today > due) return false;
  return today > getPrevPeriodStart(due, rule ?? "");
}

export function getNextDueDate(dueDate: string | null, rule: string): string {
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

export function getNextOccurrenceLabel(dueDate: string | null, rule: string): string {
  if (!dueDate) return rule.charAt(0).toUpperCase() + rule.slice(1);
  const d = parseLocalDate(dueDate);
  if (rule === "weekly") d.setDate(d.getDate() + 7);
  if (rule === "biweekly") d.setDate(d.getDate() + 14);
  if (rule === "monthly") d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function getUnlockInfo(dueDate: string | null): { date: string; relative: string; days: number } | null {
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

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  const due = parseLocalDate(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today > due;
}
