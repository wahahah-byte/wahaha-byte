// Minimal pub-sub for cross-screen task mutations. The detail modal lives on
// top of the underlying task-list screen (presented as a transparentModal),
// and a check-in committed inside the modal needs to propagate to the list
// behind it so the row visibly moves to the "checked in" section while the
// slide's commit animation is still playing.
//
// Not using React context here because subscribers (TaskList) and emitters
// (task detail screen) sit on separate route stacks, and threading a
// provider through expo-router's modal presentation is invasive for one
// event type. Tab focus eventually triggers a refetch via useFocusEffect —
// this event is purely the optimistic bridge so the visible state stays in
// sync with the user's action.

export interface CheckedInPayload {
  taskId: string;
  lastCheckInDateIso: string;
  /** New dueDate after the check-in advances the cycle. Required for the
   *  underlying list to flip the row into the "Checked In" / "Upcoming"
   *  section — isCheckedInThisCycle gates on `today < dueDate`, so daily
   *  tasks (dueDate = today before check-in) won't move until we advance. */
  nextDueDateIso: string;
}

type CheckInListener = (payload: CheckedInPayload) => void;
type RefreshListener = () => void;

const checkInListeners = new Set<CheckInListener>();
const refreshListeners = new Set<RefreshListener>();

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
  // Emitted when a TaskRow detects its own state is stuck/inconsistent
  // (e.g. checkedThisCycle but no latestCheckinCycle, because the rapid-
  // tap flow left the list's recentCycles stale and the in-app
  // useFocusEffect refetch hasn't fired — task/[id] is a transparentModal
  // so the underlying list never actually blurs). TaskList subscribes
  // and runs its fetchTasks() so the next interaction sees fresh state.
  subscribeRefreshRequested(fn: RefreshListener): () => void {
    refreshListeners.add(fn);
    return () => {
      refreshListeners.delete(fn);
    };
  },
  emitRefreshRequested(): void {
    for (const fn of refreshListeners) fn();
  },
};
