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
  // Set true when calling during page unload / visibility change. The fetch is
  // sent with `keepalive: true` so the request survives the page being torn
  // down. Don't use for normal flushes — keepalive has a small per-page byte
  // budget and is meant for last-gasp delivery.
  keepalive?: boolean;
}

// Centralised counter-cycle logger shared by Today and Routines.
// - requestLog opens the prompt modal (used by TaskRow's swipe-Log action).
// - submitLog commits the prompt's value as a cycle and closes the modal.
// - flushQuickLog commits a buffered +/- delta as a single cycle. Caller is
//   responsible for the buffering (see QuickLogStepper); this hook just turns
//   a delta into one API call and one local-state append.
// Demo mode appends a synthetic cycle immediately. Auth mode waits for the
// server response, then appends. Returning the cycle (rather than appending
// optimistically up front) lets the caller align the cycle's addition with
// its own buffer reset — the displayed sum can stay constant across the
// flush instead of dipping or doubling for a frame.
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

  // Returns the appended cycle on success, null on failure. Demo mode
  // appends a synthetic cycle locally; auth mode waits for the server's
  // response and only then appends. The caller (typically QuickLogStepper)
  // is responsible for adjusting any local "buffered" delta atomically with
  // the cycle's addition — that's what keeps the displayed sum stable.
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
      // 404 means the task is gone — typically because the user deleted it
      // while a flush was in-flight (the modal's unmount cleanup zeros the
      // buffered case, but already-sent requests still land). Silently drop
      // those; toasting "Couldn't save log" against a task that no longer
      // exists is misleading.
      if (result.status === 404) return null;
      // 400 with the "already checked in" message means the user checked in
      // while a +/- buffer was still mid-flight. The cycle is now closed
      // and the buffered delta refers to a finalised cycle, so drop it
      // silently — the toast would surprise a user who just successfully
      // completed their check-in.
      if (result.status === 400 && /already checked in/i.test(result.error)) return null;
      // Tag the toast with the rejected delta so the user knows what to redo.
      // Without this they only see the raw server message ("Bad Request"),
      // which gives no clue that their last +/- run wasn't saved.
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

  // Stable-identity flush: takes taskId explicitly so the detail modal can
  // safely call it from a useEffect cleanup or unload handler without
  // closure-capturing a stale task. Pass `{ keepalive: true }` from
  // pagehide/visibilitychange handlers so the request survives unload.
  // Resolves to the appended cycle on success, null on failure. Returns
  // a resolved-null promise for delta=0 so the caller can always `await`.
  const flushQuickLog = useCallback((taskId: string, delta: number, opts?: FlushOptions): Promise<CheckInCycleDto | null> => {
    if (delta === 0) return Promise.resolve(null);
    return writeCycle(taskId, delta, opts);
  }, [writeCycle]);

  return { logPromptTask, requestLog, cancelLog, submitLog, flushQuickLog };
}
