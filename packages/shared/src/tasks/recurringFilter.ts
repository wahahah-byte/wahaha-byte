import type { TaskDto } from "../api/tasks";
import { canCheckInNow, isOverdue } from "../time/dateUtils";

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
 * now waiting for the next window to open. Uses canCheckInNow as the canonical
 * "cycle is currently open" predicate — the inverse, with an !isOverdue guard,
 * uniquely identifies "done this cycle, waiting for next window."
 *
 * Previously this used `today < dueDate` as a proxy, which mis-classified
 * optimistic check-ins on overdue daily tasks: getNextDueDate(yesterday,
 * "daily") = today, and today < today is false → the row stayed in Active.
 */
export function isCheckedInThisCycle(task: TaskDto): boolean {
  if (!task.lastCheckInDate || !task.dueDate || !task.recurrenceRule) return false;
  if (isOverdue(task.dueDate)) return false;
  return !canCheckInNow(task.dueDate, task.recurrenceRule, task.lastCheckInDate);
}
