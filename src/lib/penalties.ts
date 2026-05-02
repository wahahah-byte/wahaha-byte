import { TaskDto } from "@/lib/api/tasks";
import { getCyclesOverdue } from "@/lib/dateUtils";

export function processPenalties(raw: TaskDto[]): {
  processed: TaskDto[];
  penalizedIds: Set<string>;
} {
  const penalizedIds = new Set<string>();
  const processed = raw.map((t) => {
    if (t.status === "in_progress" && !t.isRecurring && t.dueDate && getCyclesOverdue(t.dueDate, null) >= 3) {
      penalizedIds.add(t.taskId);
      return { ...t, status: "pending" as const };
    }
    return t;
  });
  return { processed, penalizedIds };
}
