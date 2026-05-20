import type { TaskDto } from "@wahaha/shared";

// Module cache of TaskDto by id; seeds first paint of detail modal.

const tasks = new Map<string, TaskDto>();

export const taskCache = {
  // Sync read.
  read(id: string): TaskDto | null {
    return tasks.get(id) ?? null;
  },
  // Write/replace.
  set(task: TaskDto): void {
    tasks.set(task.taskId, task);
  },
  // Bulk seed from list response.
  setMany(list: TaskDto[]): void {
    for (const t of list) tasks.set(t.taskId, t);
  },
  // Remove (e.g. after delete).
  remove(id: string): void {
    tasks.delete(id);
  },
};
