import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";

import { type CheckInCycleDto, dateKey, isCycleClosed, type TaskDto } from "@wahaha/shared";

const QUICK_LOG_DEBOUNCE_MS = 1500;

// Module-level: tracks in-flight log POSTs per taskId so reopen-after-dismiss can wait on them
// (otherwise the GET races ahead of the fire-and-forget unmount flush and misses the new cycle).
const pendingFlushes = new Map<string, Set<Promise<unknown>>>();

function trackFlush<T>(taskId: string, promise: Promise<T>): Promise<T> {
  let set = pendingFlushes.get(taskId);
  if (!set) {
    set = new Set();
    pendingFlushes.set(taskId, set);
  }
  set.add(promise);
  promise.finally(() => {
    set!.delete(promise);
    if (set!.size === 0) pendingFlushes.delete(taskId);
  });
  return promise;
}

export async function awaitPendingLogFlushes(taskId: string): Promise<void> {
  const set = pendingFlushes.get(taskId);
  if (!set || set.size === 0) return;
  await Promise.allSettled(Array.from(set));
}

interface Args {
  task: TaskDto | null;
  heatmapCycles: CheckInCycleDto[];
  onFlushQuickLog?: (taskId: string, delta: number) => Promise<CheckInCycleDto | null>;
  onDelete?: () => void;
}

interface Result {
  pendingLog: number;
  cycleSumToday: number;
  handleStepperIncrement: () => void;
  handleStepperDecrement: () => void;
  handleDeleteClick: () => void;
  // Add an arbitrary positive amount to the pending log buffer (custom-log modal).
  addPending: (amount: number) => void;
  // Drain buffered logs into a single value (for auto-checkin); cancels the pending debounce.
  consumePending: () => number;
  // Set displayed total (cycleSumToday + pendingLog) to an absolute value; clamps so it can't go below 0.
  setPending: (targetTotal: number) => void;
}

// Mobile useQuickLog — buffered +/- with debounced flush + AppState bg-flush.
export function useQuickLog({ task, heatmapCycles, onFlushQuickLog, onDelete }: Args): Result {
  const [pendingLog, setPendingLog] = useState(0);
  const pendingLogRef = useRef(0);
  useEffect(() => { pendingLogRef.current = pendingLog; }, [pendingLog]);

  const inFlightSentRef = useRef(0);

  const flushRef = useRef(onFlushQuickLog);
  useEffect(() => { flushRef.current = onFlushQuickLog; });

  const todayKey = useMemo(() => {
    const d = new Date(); d.setHours(0, 0, 0, 0);
    return dateKey(d);
  }, []);

  const cycleSumToday = useMemo(() => {
    let sum = 0;
    for (const c of heatmapCycles) {
      if (c.checkInDate.split("T")[0] === todayKey && typeof c.counterValue === "number") {
        sum += c.counterValue;
      }
    }
    return sum;
  }, [heatmapCycles, todayKey]);

  const handleDeleteClick = useCallback(() => {
    pendingLogRef.current = 0;
    inFlightSentRef.current = 0;
    setPendingLog(0);
    onDelete?.();
  }, [onDelete]);

  const handleStepperIncrement = useCallback(() => {
    setPendingLog((p) => p + 1);
  }, []);

  const handleStepperDecrement = useCallback(() => {
    setPendingLog((p) => (cycleSumToday + p - 1 < 0 ? p : p - 1));
  }, [cycleSumToday]);

  // After cycle close, discard buffer so debounced tap can't slip through.
  const cycleClosed = task ? isCycleClosed(task.dueDate, task.lastCheckInDate) : false;
  useEffect(() => {
    if (!cycleClosed) return;
    if (pendingLogRef.current === 0 && inFlightSentRef.current === 0) return;
    pendingLogRef.current = 0;
    inFlightSentRef.current = 0;
    setPendingLog(0);
  }, [cycleClosed]);

  // Flush buffered delta on unmount/task change; skip when cycle closed or task null.
  const taskId = task?.taskId;
  useEffect(() => {
    if (!taskId) return;
    const tid = taskId;
    return () => {
      if (cycleClosed) {
        pendingLogRef.current = 0;
        inFlightSentRef.current = 0;
        return;
      }
      const remainder = pendingLogRef.current - inFlightSentRef.current;
      if (remainder !== 0 && flushRef.current) {
        trackFlush(tid, flushRef.current(tid, remainder));
      }
      pendingLogRef.current = 0;
      inFlightSentRef.current = 0;
    };
  }, [taskId, cycleClosed]);

  // Debounced auto-flush; cycleClosed gate blocks post-commit firings.
  useEffect(() => {
    if (!taskId) return;
    if (!flushRef.current) return;
    if (cycleClosed) return;
    const remainder = pendingLog - inFlightSentRef.current;
    if (remainder === 0) return;
    const tid = taskId;
    const timer = setTimeout(async () => {
      const delta = pendingLogRef.current - inFlightSentRef.current;
      if (delta === 0) return;
      inFlightSentRef.current += delta;
      try {
        const promise = flushRef.current?.(tid, delta) ?? Promise.resolve(null);
        const result = await trackFlush(tid, promise);
        if (!result) {
          inFlightSentRef.current -= delta;
          return;
        }
        setPendingLog((p) => p - delta);
        inFlightSentRef.current -= delta;
      } catch {
        inFlightSentRef.current -= delta;
      }
    }, QUICK_LOG_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [pendingLog, taskId, cycleClosed]);

  // AppState bg flush so killed app doesn't lose buffered taps.
  useEffect(() => {
    if (!taskId) return;
    const tid = taskId;
    const onChange = (state: AppStateStatus) => {
      if (state !== "background" && state !== "inactive") return;
      if (cycleClosed) return;
      const remainder = pendingLogRef.current - inFlightSentRef.current;
      if (remainder === 0) return;
      inFlightSentRef.current += remainder;
      // Fire-and-forget; resume re-fetches task state via useFocusEffect.
      const promise = flushRef.current?.(tid, remainder);
      if (promise) trackFlush(tid, promise);
    };
    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, [taskId, cycleClosed]);

  const addPending = useCallback((amount: number) => {
    if (amount <= 0) return;
    setPendingLog((p) => p + amount);
  }, []);

  // Signed: after setPending lowers pendingLog below zero (revoking an
  // undo-preserved log cycle), the negative remainder must reach the caller
  // so an immediate check-in can fold it into the absolute target rather
  // than silently dropping it and double-counting the preserved value.
  const consumePending = useCallback(() => {
    const remainder = pendingLogRef.current - inFlightSentRef.current;
    pendingLogRef.current = 0;
    inFlightSentRef.current = 0;
    setPendingLog(0);
    return remainder;
  }, []);

  // Edit-style: caller passes desired displayed total; we derive the signed delta from cycleSumToday.
  // pendingLog can go negative — debounced flush POSTs negative deltas to revoke already-persisted logs.
  const setPending = useCallback((targetTotal: number) => {
    const safe = Math.max(0, Math.floor(targetTotal));
    setPendingLog(safe - cycleSumToday);
  }, [cycleSumToday]);

  return {
    pendingLog,
    cycleSumToday,
    handleStepperIncrement,
    handleStepperDecrement,
    handleDeleteClick,
    addPending,
    consumePending,
    setPending,
  };
}
