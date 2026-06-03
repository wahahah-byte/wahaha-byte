import type { TaskDto } from "../api/tasks";
import { getCyclesOverdue } from "../time/dateUtils";

// Days overdue at/after which a regular task is penalized. Mirrors the server's
// TaskPenaltyService.OverdueThresholdDays (wahaha.API) — keep the two in sync.
export const OVERDUE_PENALTY_THRESHOLD_DAYS = 3;

/** Demo-only */
export function processPenalties(raw: TaskDto[]): TaskDto[] {
  return raw.map((t) => {
    if (t.status === "in_progress" && !t.isRecurring && t.dueDate && getCyclesOverdue(t.dueDate, null) >= OVERDUE_PENALTY_THRESHOLD_DAYS) {
      return { ...t, status: "pending" as const, wasPenalized: true };
    }
    return t;
  });
}

/**
 * True when the server would refuse to start this task because it's overdue
 * beyond the penalty threshold (StartTaskHandler → ShouldPenalize). The user
 * must reschedule (pick a new due date) before it can move to in-progress.
 * Only regular (non-recurring) pending tasks are gated this way.
 */
export function isStartBlockedByOverdue(task: TaskDto): boolean {
  return (
    !task.isRecurring &&
    task.status === "pending" &&
    !!task.dueDate &&
    getCyclesOverdue(task.dueDate, null) >= OVERDUE_PENALTY_THRESHOLD_DAYS
  );
}
