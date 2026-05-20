"use client";

import { useCallback, useRef, useState } from "react";
import { tasksApi, TaskDto, CheckInCycleDto } from "@/lib/api/tasks";

interface Deps {
  isAuthenticated: boolean;
  setTasks: React.Dispatch<React.SetStateAction<TaskDto[]>>;
  setDetailTask: React.Dispatch<React.SetStateAction<TaskDto | null>>;
  setError: (msg: string) => void;
}

export interface FlushOptions {
  // Set on unload/visibility-change so fetch uses keepalive to survive teardown.
  keepalive?: boolean;
}

// Counter-cycle logger shared by Today and Routines; demo appends synthetic cycle, auth waits for server.
export function useLogCounter({ isAuthenticated, setTasks, setDetailTask, setError }: Deps) {
  const [logPromptTask, setLogPromptTask] = useState<TaskDto | null>(null);
  // Monotonic negative-id generator for demo-mode synthetic cycles.
  const tempIdRef = useRef(-1);

  const appendCycle = useCallback((taskId: string, cycle: CheckInCycleDto) => {
    setTasks((prev) => prev.map((x) => x.taskId === taskId
      ? { ...x, recentCycles: [cycle, ...(x.recentCycles ?? [])] }
      : x));
    setDetailTask((curr) => curr && curr.taskId === taskId
      ? { ...curr, recentCycles: [cycle, ...(curr.recentCycles ?? [])] }
      : curr);
  }, [setTasks, setDetailTask]);

  // Returns appended cycle on success, null on failure; caller aligns buffer reset with cycle add.
  const writeCycle = useCallback(async (taskId: string, value: number, opts?: FlushOptions): Promise<CheckInCycleDto | null> => {
    if (!isAuthenticated) {
      const tempId = tempIdRef.current--;
      const now = new Date();
      const local: CheckInCycleDto = {
        cycleId: tempId,
        taskId,
        checkInDate: now.toISOString(),
        counterValue: value,
        createdAt: now.toISOString(),
      };
      appendCycle(taskId, local);
      return local;
    }

    const result = await tasksApi.logCounter(taskId, value, opts?.keepalive ? { keepalive: true } : undefined);
    if (result.error) {
      // 404: task deleted mid-flight — drop silently to avoid misleading toast.
      if (result.status === 404) return null;
      // 400 "already checked in": cycle closed while buffer in-flight — drop silently.
      if (result.status === 400 && /already checked in/i.test(result.error)) return null;
      // Tag toast with rejected delta so user knows what to redo.
      const signed = `${value > 0 ? "+" : ""}${value}`;
      setError(`Couldn't save log (${signed}): ${result.error}`);
      return null;
    }
    if (!result.data) return null;
    appendCycle(taskId, result.data);
    return result.data;
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

  // Stable-identity flush keyed by explicit taskId; safe from unload handlers via keepalive.
  const flushQuickLog = useCallback((taskId: string, delta: number, opts?: FlushOptions): Promise<CheckInCycleDto | null> => {
    if (delta === 0) return Promise.resolve(null);
    return writeCycle(taskId, delta, opts);
  }, [writeCycle]);

  return { logPromptTask, requestLog, cancelLog, submitLog, flushQuickLog };
}
