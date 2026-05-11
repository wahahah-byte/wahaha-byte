export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("T")[0].split("-").map(Number);
  return new Date(y, m - 1, d);
}

// Format a Date as a local-tz YYYY-MM-DD string. Use this (not toISOString)
// when comparing against a checkInDate's date-only portion: ISO strings are
// UTC, which can put a midnight check-in on the "wrong" day for users east
// or west of UTC.
export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// "Today" in local time as a YYYY-MM-DD string. Matches dateKey(new Date()).
export function todayLocalKey(): string {
  return dateKey(new Date());
}

// Sum `counterValue`s across cycles that landed today (local time). Used by
// goal-met checks and the avatar's today-total. Robust to a missing list.
export function sumTodayCycleCounter(
  cycles: { checkInDate: string; counterValue?: number | null }[] | undefined | null
): number {
  if (!cycles || cycles.length === 0) return 0;
  const today = todayLocalKey();
  let sum = 0;
  for (const c of cycles) {
    if (typeof c.counterValue === "number" && c.checkInDate.split("T")[0] === today) {
      sum += c.counterValue;
    }
  }
  return sum;
}

function normalizeRule(rule: string | null | undefined): string {
  return (rule ?? "").toLowerCase();
}

export function getPrevPeriodStart(due: Date, rule: string): Date {
  const r = normalizeRule(rule);
  const prev = new Date(due);
  if (r === "daily" || r === "weekdays") prev.setDate(prev.getDate() - 1);
  else if (r === "weekly") prev.setDate(prev.getDate() - 7);
  else if (r === "biweekly") prev.setDate(prev.getDate() - 14);
  else if (r === "monthly") prev.setMonth(prev.getMonth() - 1);
  return prev;
}

export function canCheckInNow(
  dueDate: string | null,
  rule?: string | null,
  lastCheckInDate?: string | null,
): boolean {
  const r = normalizeRule(rule);
  if (r === "weekdays") {
    const day = new Date().getDay();
    if (day === 0 || day === 6) return false;
  }
  if (!dueDate) return true;
  const due = parseLocalDate(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const prevStart = getPrevPeriodStart(due, r);
  if (today <= prevStart) return false;
  if (lastCheckInDate) {
    const last = parseLocalDate(lastCheckInDate);
    if (last > prevStart) return false;
  }
  return true;
}

export function getNextDueDate(dueDate: string | null, rule: string): string {
  const r = normalizeRule(rule);
  const base = dueDate ? parseLocalDate(dueDate) : new Date();
  base.setHours(12, 0, 0, 0);
  if (r === "daily") base.setDate(base.getDate() + 1);
  else if (r === "weekdays") {
    base.setDate(base.getDate() + 1);
    while (base.getDay() === 0 || base.getDay() === 6) base.setDate(base.getDate() + 1);
  } else if (r === "weekly") base.setDate(base.getDate() + 7);
  else if (r === "biweekly") base.setDate(base.getDate() + 14);
  else if (r === "monthly") base.setMonth(base.getMonth() + 1);
  return `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`;
}

export function getNextOccurrenceLabel(dueDate: string | null, rule: string): string {
  const r = normalizeRule(rule);
  if (!dueDate) return r.charAt(0).toUpperCase() + r.slice(1);
  const d = parseLocalDate(dueDate);
  if (r === "weekly") d.setDate(d.getDate() + 7);
  if (r === "biweekly") d.setDate(d.getDate() + 14);
  if (r === "monthly") d.setMonth(d.getMonth() + 1);
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

// True when the current recurrence cycle has already been completed and the
// next window hasn't opened yet. After a check-in the server advances
// dueDate strictly past today and stamps lastCheckInDate; that pair is the
// unambiguous signal that the cycle is finalised. Daily tasks checked in
// today, weekly tasks checked in earlier this week, monthly tasks checked
// in earlier this month — all match. Overdue tasks are excluded so they
// stay in active workflows.
export function isCycleClosed(
  dueDate: string | null | undefined,
  lastCheckInDate: string | null | undefined,
): boolean {
  if (!lastCheckInDate || !dueDate) return false;
  if (isOverdue(dueDate)) return false;
  const due = parseLocalDate(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today < due;
}

export function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  const due = parseLocalDate(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today > due;
}

export function getCyclesOverdue(dueDate: string | null, rule: string | null): number {
  if (!dueDate) return 0;
  const r = normalizeRule(rule);
  const due = parseLocalDate(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (today <= due) return 0;
  const daysDiff = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  if (!r || r === "daily") return daysDiff;
  if (r === "weekly") return Math.floor(daysDiff / 7);
  if (r === "biweekly") return Math.floor(daysDiff / 14);
  if (r === "monthly") {
    return (today.getFullYear() - due.getFullYear()) * 12 + (today.getMonth() - due.getMonth());
  }
  if (r === "weekdays") {
    let count = 0;
    const d = new Date(due);
    while (d < today) {
      const dow = d.getDay();
      if (dow !== 0 && dow !== 6) count++;
      d.setDate(d.getDate() + 1);
    }
    return count;
  }
  return daysDiff;
}
