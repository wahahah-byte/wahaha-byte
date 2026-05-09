"use client";

import { useCallback, useState } from "react";
import { tasksApi, TaskDto, CheckInCycleDto } from "@/lib/api/tasks";

interface Deps {
  isAuthenticated: boolean;
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>;
  setDetailTask: React.Dispatch<React.SetStateAction<TaskDto | null>>;
  setError: (msg: string) => void;
}

// Centralised counter-cycle logger shared by Today and Routines.
// - requestLog opens the prompt modal (used by TaskRow's swipe-Log action).
// - submitLog commits the prompt's value as a cycle and closes the modal.
// - quickLog skips the modal — used by the +/- buttons under the avatar.
// All paths optimistically update the task list + detail panel and fall
// back to local-only when the user isn't signed in (demo mode).
export function useLogCounter({ isAuthenticated, setTasks, setDetailTask, setError }: Deps) {
  const [logPromptTask, setLogPromptTask] = useState<TaskDto | null>(null);

  const appendCycle = useCallback((taskId: string, cycle: CheckInCycleDto) => {
    setTasks((prev) => prev.map((x) => x.taskId === taskId
      ? { ...x, recentCycles: [cycle, ...(x.recentCycles ?? [])] }
      : x));
    setDetailTask((curr) => curr && curr.taskId === taskId
      ? { ...curr, recentCycles: [cycle, ...(curr.recentCycles ?? [])] }
      : curr);
  }, [setTasks, setDetailTask]);

  const writeCycle = useCallback(async (taskId: string, value: number) => {
    if (!isAuthenticated) {
      const now = new Date();
      appendCycle(taskId, {
        cycleId: -now.getTime(),
        taskId,
        checkInDate: now.toISOString(),
        counterValue: value,
        createdAt: now.toISOString(),
      });
      return;
    }
    const { data, error } = await tasksApi.logCounter(taskId, value);
    if (error) { setError(error); return; }
    if (data) appendCycle(taskId, data);
  }, [isAuthenticated, appendCycle, setError]);

  const requestLog = useCallback((t: TaskDto) => {
    setLogPromptTask(t);
  }, []);

  const cancelLog = useCallback(() => setLogPromptTask(null), []);

  const submitLog = useCallback(async (value: number) => {
    const t = logPromptTask;
    if (!t) return;
    setLogPromptTask(null);
    await writeCycle(t.taskId, value);
  }, [logPromptTask, writeCycle]);

  const quickLog = useCallback((t: TaskDto, delta: number) => writeCycle(t.taskId, delta), [writeCycle]);

  return { logPromptTask, requestLog, cancelLog, submitLog, quickLog };
}
