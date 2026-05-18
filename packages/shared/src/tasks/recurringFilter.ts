import type { TaskDto } from "../api/tasks";
import { canCheckInNow, isOverdue, parseLocalDate } from "../time/dateUtils";

/**
 * Recurring (Routines) tab filter. Mirrors web's `tabMatches` in
 * apps/web/src/app/recurring/page.tsx.
 *
 * - "all": every recurring task
 * - "today": actionable now — can check in for this cycle, not overdue
 * - "upcoming": cycle closed (checked in earlier in the cycle) or not yet open
 * - "missed": dueDate is in the past
 */
export function recurringTabMatches(task: TaskDto, tab: string): boolean {
  if (tab === "all") return true;
  if (tab === "today") {
    return canCheckInNow(task.dueDate, task.recurrenceRule, task.lastCheckInDate) && !isOverdue(task.dueDate);
  }
  if (tab === "missed") return isOverdue(task.dueDate);
  if (tab === "upcoming") {
    return !canCheckInNow(task.dueDate, task.recurrenceRule, task.lastCheckInDate) && !isOverdue(task.dueDate);
  }
  return true;
}

/**
 * True when a recurring task has been checked-in for its current cycle and is
 * now waiting for the next window to open. Mirrors web's `isCheckedInThisCycle`
 * in apps/web/src/app/recurring/page.tsx: the absence of an overdue dueDate
 * plus a present lastCheckInDate plus today < dueDate uniquely identifies the
 * "already done this cycle" state without needing period-derived prevStart
 * math (which mis-fires for daily tasks).
 */
export function isCheckedInThisCycle(task: TaskDto): boolean {
  if (!task.lastCheckInDate || !task.dueDate || !task.recurrenceRule) return false;
  if (isOverdue(task.dueDate)) return false;
  const due = parseLocalDate(task.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today < due;
}
