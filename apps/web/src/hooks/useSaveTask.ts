"use client";

import { useCallback } from "react";
import { tasksApi, TaskDto, UpdateTaskRequest } from "@/lib/api/tasks";
import type { EditableTaskFields } from "@/components/TaskDetailModal";

interface Deps {
  detailTask: TaskDto | null;
  setDetailTask: React.Dispatch<React.SetStateAction<TaskDto | null>>;
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>;
  isAuthenticated: boolean;
  // True when current detail task is being restarted from the overdue prompt.
  isRestart: boolean;
  // Called after successful restart save; Today page advances non-recurring tasks.
  onAfterRestart?: (updated: TaskDto) => void;
  // Clears parent's overdueRestartTaskId state.
  clearRestart: () => void;
}

// "Save edited task" handler used by Today and Routines detail modals.
export function useSaveTask({
  detailTask, setDetailTask, setTasks, isAuthenticated,
  isRestart, onAfterRestart, clearRestart,
}: Deps) {
  return useCallback(async (fields: EditableTaskFields): Promise<string | null> => {
    if (!detailTask) return null;

    const finalize = (updated: TaskDto) => {
      setTasks((prev) => prev.map((t) => t.taskId === detailTask.taskId ? updated : t));
      setDetailTask(updated);
      if (isRestart) {
        clearRestart();
        setDetailTask(null);
        onAfterRestart?.(updated);
      }
    };

    if (!isAuthenticated) {
      finalize({ ...detailTask, ...fields });
      return null;
    }

    const req: UpdateTaskRequest = {
      taskId: detailTask.taskId,
      title: fields.title,
      description: fields.description ?? undefined,
      category: fields.category,
      priority: fields.priority,
      status: detailTask.status,
      pointValue: fields.pointValue ?? detailTask.pointValue,
      dueDate: fields.dueDate ?? undefined,
      completedAt: detailTask.completedAt ?? undefined,
      isRecurring: detailTask.isRecurring,
      recurrenceRule: detailTask.recurrenceRule ?? undefined,
      submitted: detailTask.submitted,
      hasCounter: fields.hasCounter ?? detailTask.hasCounter ?? false,
      counterUnit: fields.counterUnit !== undefined ? fields.counterUnit : (detailTask.counterUnit ?? null),
      counterGoal: fields.counterGoal !== undefined ? fields.counterGoal : (detailTask.counterGoal ?? null),
    };
    const { error } = await tasksApi.update(detailTask.taskId, req);
    if (error) return error;
    finalize({ ...detailTask, ...fields });
    return null;
  }, [detailTask, setDetailTask, setTasks, isAuthenticated, isRestart, onAfterRestart, clearRestart]);
}
