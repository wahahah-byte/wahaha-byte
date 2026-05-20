"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { CheckInCycleDto, TaskDto } from "@/lib/api/tasks";
import { dateKey } from "@/lib/dateUtils";

// Idle window before a buffered +/- delta auto-flushes to the API.
const QUICK_LOG_DEBOUNCE_MS = 1500;

interface Args {
  task: TaskDto;
  heatmapCycles: CheckInCycleDto[];
  onFlushQuickLog?: (taskId: string, delta: number, opts?: { keepalive?: boolean }) => Promise<CheckInCycleDto | null>;
  onDelete?: () => void;
}

interface Result {
  pendingLog: number;
  cycleSumToday: number;
  handleStepperIncrement: () => void;
  handleStepperDecrement: () => void;
  handleDeleteClick: () => void;
}

// Buffered +/- routine quick-log; state at modal level so avatar + heatmap stay in sync.
export function useQuickLog({ task, heatmapCycles, onFlushQuickLog, onDelete }: Args): Result {
  const [pendingLog, setPendingLog] = useState(0);
  const pendingLogRef = useRef(0);
  useEffect(() => { pendingLogRef.current = pendingLog; }, [pendingLog]);

  // Portion of pendingLog already in-flight; used to compute un-flushed remainder.
  const inFlightSentRef = useRef(0);

  // Mirror onFlushQuickLog in ref so cleanups don't capture stale prop.
  const flushRef = useRef(onFlushQuickLog);
  useEffect(() => { flushRef.current = onFlushQuickLog; });

  // Today's committed counter sum; reads from heatmapCycles for sync with heatmap.
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

  // Drop buffered +/- before delegating to delete; avoids misleading "Couldn't save log" toast.
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
    // Clamp against cycleSumToday so display can't drop below 0.
    setPendingLog((p) => (cycleSumToday + p - 1 < 0 ? p : p - 1));
  }, [cycleSumToday]);

  // Flush un-sent buffered delta on unmount/task change; skip portion already in-flight.
  useEffect(() => {
    const tid = task.taskId;
    return () => {
      const remainder = pendingLogRef.current - inFlightSentRef.current;
      if (remainder !== 0) flushRef.current?.(tid, remainder);
      pendingLogRef.current = 0;
      inFlightSentRef.current = 0;
    };
  }, [task.taskId]);

  // Debounced auto-flush; flushSync pairs cycle-add with pendingLog decrement so display stays stable.
  useEffect(() => {
    if (!flushRef.current) return;
    const remainder = pendingLog - inFlightSentRef.current;
    if (remainder === 0) return;
    const tid = task.taskId;
    const timer = setTimeout(async () => {
      const delta = pendingLogRef.current - inFlightSentRef.current;
      if (delta === 0) return;
      inFlightSentRef.current += delta;
      try {
        const result = await flushRef.current?.(tid, delta);
        if (!result) {
          // Failure: keep pendingLog for retry; release in-flight reservation.
          inFlightSentRef.current -= delta;
          return;
        }
        flushSync(() => {
          setPendingLog((p) => p - delta);
        });
        inFlightSentRef.current -= delta;
      } catch {
        inFlightSentRef.current -= delta;
      }
    }, QUICK_LOG_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [pendingLog, task.taskId]);

  // Tab/page-close safety net via keepalive fetch; state updates best-effort.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const tid = task.taskId;
    const flush = () => {
      const remainder = pendingLogRef.current - inFlightSentRef.current;
      if (remainder === 0) return;
      inFlightSentRef.current += remainder;
      flushRef.current?.(tid, remainder, { keepalive: true });
    };
    const onVisibility = () => { if (document.visibilityState === "hidden") flush(); };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [task.taskId]);

  return {
    pendingLog,
    cycleSumToday,
    handleStepperIncrement,
    handleStepperDecrement,
    handleDeleteClick,
  };
}
