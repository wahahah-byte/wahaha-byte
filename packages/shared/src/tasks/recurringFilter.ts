import type { TaskDto } from "../api/tasks";
import { canCheckInNow, isCycleClosed, isOverdue, todayLocalKey } from "../time/dateUtils";

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
 * now waiting for the next due date to come around.
 *
 * After a check-in the server advances dueDate to the next occurrence, so a
 * future dueDate (today < due) means the current cycle is already satisfied.
 * We classify on that, NOT on `!canCheckInNow`: for non-daily rules the
 * check-in window opens a full period before the due date (e.g. a weekly task
 * can be logged any day of its week). The check-in lands exactly on the new
 * cycle's prevStart, so the day after, canCheckInNow re-opens and the row
 * bounced back to Active even though the next due date was days away. Anchoring
 * on `today < dueDate` keeps weekly/biweekly/monthly routines parked in
 * "Checked In" until they're actually due again, matching daily behaviour.
 *
 * The trailing lastCheckInDate-is-today check covers the optimistic check-in on
 * an overdue task: getNextDueDate(yesterday, "daily") = today, so today === due
 * (not <). It was still checked in this cycle, today, so it stays in Checked In
 * for the rest of the day.
 */
export function isCheckedInThisCycle(task: TaskDto): boolean {
  if (!task.lastCheckInDate || !task.dueDate || !task.recurrenceRule) return false;
  if (isOverdue(task.dueDate)) return false;
  if (isCycleClosed(task.dueDate, task.lastCheckInDate)) return true;
  return task.lastCheckInDate.split("T")[0] === todayLocalKey();
}
