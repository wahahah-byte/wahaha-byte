"use client";

import { useCallback, useState } from "react";
import type { TaskDto } from "@/lib/api/tasks";

// Tracks task being restarted from overdue prompt; detail modal opens in edit mode.
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
