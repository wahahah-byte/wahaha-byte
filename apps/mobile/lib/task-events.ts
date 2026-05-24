// Pub-sub for cross-screen task mutations (detail modal ↔ underlying list).

import type { TaskDto } from "@wahaha/shared";

export interface CheckedInPayload {
  taskId: string;
  lastCheckInDateIso: string;
  // New dueDate after check-in advances cycle.
  nextDueDateIso: string;
  // Predicted streak counts from optimistic patch.
  currentStreakCount: number;
  longestStreakCount: number;
}

// Fired after check-in POST returns authoritative cycleId + streak/due values.
export interface CheckInCommittedPayload {
  taskId: string;
  cycleId: number;
  checkInDateIso: string;
  nextDueDateIso: string;
  currentStreakCount: number;
  longestStreakCount: number;
}

type CheckInListener = (payload: CheckedInPayload) => void;
type CheckInCommittedListener = (payload: CheckInCommittedPayload) => void;
type RefreshListener = () => void;
type DeletedListener = (taskId: string) => void;
type RestoredListener = (task: TaskDto) => void;

const checkInListeners = new Set<CheckInListener>();
const checkInCommittedListeners = new Set<CheckInCommittedListener>();
const refreshListeners = new Set<RefreshListener>();
const deletedListeners = new Set<DeletedListener>();
const restoredListeners = new Set<RestoredListener>();

export const taskEvents = {
  subscribeCheckedIn(fn: CheckInListener): () => void {
    checkInListeners.add(fn);
    return () => {
      checkInListeners.delete(fn);
    };
  },
  emitCheckedIn(payload: CheckedInPayload): void {
    for (const fn of checkInListeners) fn(payload);
  },
  subscribeCheckInCommitted(fn: CheckInCommittedListener): () => void {
    checkInCommittedListeners.add(fn);
    return () => {
      checkInCommittedListeners.delete(fn);
    };
  },
  emitCheckInCommitted(payload: CheckInCommittedPayload): void {
    for (const fn of checkInCommittedListeners) fn(payload);
  },
  // Emitted when a row detects stuck/inconsistent state; triggers list refetch.
  subscribeRefreshRequested(fn: RefreshListener): () => void {
    refreshListeners.add(fn);
    return () => {
      refreshListeners.delete(fn);
    };
  },
  emitRefreshRequested(): void {
    for (const fn of refreshListeners) fn();
  },
  // Optimistic-delete pub-sub used by the cross-screen undo toast.
  subscribeDeleted(fn: DeletedListener): () => void {
    deletedListeners.add(fn);
    return () => { deletedListeners.delete(fn); };
  },
  publishDeleted(taskId: string): void {
    for (const fn of deletedListeners) fn(taskId);
  },
  subscribeRestored(fn: RestoredListener): () => void {
    restoredListeners.add(fn);
    return () => { restoredListeners.delete(fn); };
  },
  publishRestored(task: TaskDto): void {
    for (const fn of restoredListeners) fn(task);
  },
};
