import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, type AppStateStatus } from "react-native";

import { type CheckInCycleDto, dateKey, isCycleClosed, type TaskDto } from "@wahaha/shared";

const QUICK_LOG_DEBOUNCE_MS = 1500;

interface Args {
  task: TaskDto;
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
  const cycleClosed = isCycleClosed(task.dueDate, task.lastCheckInDate);
  useEffect(() => {
    if (!cycleClosed) return;
    if (pendingLogRef.current === 0 && inFlightSentRef.current === 0) return;
    pendingLogRef.current = 0;
    inFlightSentRef.current = 0;
    setPendingLog(0);
  }, [cycleClosed]);

  // Flush buffered delta on unmount/task change; skip when cycle closed.
  useEffect(() => {
    const tid = task.taskId;
    return () => {
      if (cycleClosed) {
        pendingLogRef.current = 0;
        inFlightSentRef.current = 0;
        return;
      }
      const remainder = pendingLogRef.current - inFlightSentRef.current;
      if (remainder !== 0) flushRef.current?.(tid, remainder);
      pendingLogRef.current = 0;
      inFlightSentRef.current = 0;
    };
  }, [task.taskId, cycleClosed]);

  // Debounced auto-flush; cycleClosed gate blocks post-commit firings.
  useEffect(() => {
    if (!flushRef.current) return;
    if (cycleClosed) return;
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
  }, [pendingLog, task.taskId, cycleClosed]);

  // AppState bg flush so killed app doesn't lose buffered taps.
  useEffect(() => {
    const tid = task.taskId;
    const onChange = (state: AppStateStatus) => {
      if (state !== "background" && state !== "inactive") return;
      if (cycleClosed) return;
      const remainder = pendingLogRef.current - inFlightSentRef.current;
      if (remainder === 0) return;
      inFlightSentRef.current += remainder;
      // Fire-and-forget; resume re-fetches task state via useFocusEffect.
      flushRef.current?.(tid, remainder);
    };
    const sub = AppState.addEventListener("change", onChange);
    return () => sub.remove();
  }, [task.taskId, cycleClosed]);

  return {
    pendingLog,
    cycleSumToday,
    handleStepperIncrement,
    handleStepperDecrement,
    handleDeleteClick,
  };
}
