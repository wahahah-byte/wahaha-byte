import { TaskDto } from "@/lib/api/tasks";
import { getCyclesOverdue } from "@/lib/dateUtils";

/**
 * Demo-only
 */
export function processPenalties(raw: TaskDto[]): TaskDto[] {
  return raw.map((t) => {
    if (t.status === "in_progress" && !t.isRecurring && t.dueDate && getCyclesOverdue(t.dueDate, null) >= 3) {
      return { ...t, status: "pending" as const, wasPenalized: true };
    }
    return t;
  });
}
