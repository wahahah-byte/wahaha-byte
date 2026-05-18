import type { TaskDto } from "@wahaha/shared";

// Module-level cache of TaskDto by id. The TaskList writes the freshly
// fetched rows here, so when the user opens the detail modal for a row
// they were just looking at, the modal can render its full content
// synchronously on mount — no spinner flash while the round-trip lands.
//
// A background fetch in the modal still resolves to canonical state
// (subtasks, recentCycles, etc. that aren't included in the list rows).
// The cache only seeds the FIRST paint.

const tasks = new Map<string, TaskDto>();

export const taskCache = {
  /** Synchronous read of a previously seen task. */
  read(id: string): TaskDto | null {
    return tasks.get(id) ?? null;
  },
  /** Write/replace an entry. */
  set(task: TaskDto): void {
    tasks.set(task.taskId, task);
  },
  /** Bulk seed from a list response. */
  setMany(list: TaskDto[]): void {
    for (const t of list) tasks.set(t.taskId, t);
  },
  /** Remove an entry (e.g. after delete). */
  remove(id: string): void {
    tasks.delete(id);
  },
};
