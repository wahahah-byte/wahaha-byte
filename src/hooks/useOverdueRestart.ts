"use client";

import { useCallback, useState } from "react";
import type { TaskDto } from "@/lib/api/tasks";

// Tracks the task being "restarted" from the overdue prompt — i.e. the user
// hit Restart on an overdue row and the detail modal opened in edit mode.
// On save, the page checks `isRestart(detailTask)` and calls `clearRestart()`
// to dismiss the prompt state.
export function useOverdueRestart() {
  const [overdueRestartTaskId, setOverdueRestartTaskId] = useState<string | null>(null);

  const beginRestart = useCallback((t: TaskDto) => {
    setOverdueRestartTaskId(t.taskId);
  }, []);

  const clearRestart = useCallback(() => {
    setOverdueRestartTaskId(null);
  }, []);

  const isRestart = useCallback(
    (t: TaskDto | null) => !!t && overdueRestartTaskId === t.taskId,
    [overdueRestartTaskId],
  );

  return { overdueRestartTaskId, beginRestart, clearRestart, isRestart };
}
