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

// Mobile port of useQuickLog. Mirrors the web hook's buffered-delta semantics:
//
//  - pendingLog buffers +/- taps; debounced auto-flush after 1500ms idle.
//  - cycleSumToday is derived from heatmapCycles so the heatmap and stepper
//    share one source of truth.
//  - Display value = cycleSumToday + pendingLog. During an in-flight flush,
//    pendingLog stays at full value until the parent's appendCycle bumps
//    cycleSumToday; then we subtract the flushed delta from pendingLog in
//    the same render. Both moves cancel out — no flicker.
//
// Differences from the web hook:
//  - Uses RN AppState ('background') in place of pagehide / visibilitychange
//    for last-chance flushes. There's no `keepalive` equivalent on RN; the
//    flush is fire-and-forget when going to background.
//  - No flushSync. RN batches setState within events; the stepper + heatmap
//    are siblings in the same screen, so a single setState pair on flush
//    success renders atomically.
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

  // Once the cycle is closed (a check-in has landed for this period) we
  // discard any un-flushed buffer so a debounced tap can't slip a log
  // through after the check-in. Matches the server's LogCounter gate so
  // a buffered tap doesn't fire a doomed request right after commit.
  const cycleClosed = isCycleClosed(task.dueDate, task.lastCheckInDate);
  useEffect(() => {
    if (!cycleClosed) return;
    if (pendingLogRef.current === 0 && inFlightSentRef.current === 0) return;
    pendingLogRef.current = 0;
    inFlightSentRef.current = 0;
    setPendingLog(0);
  }, [cycleClosed]);

  // Flush any un-sent buffered delta on unmount or task change. Skipped
  // when the cycle is closed — the user already checked in, so a trailing
  // log would land after the check-in and the server would reject it (or
  // create the cycle-411-then-412 mess that breaks undo).
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

  // Debounced auto-flush. The cycleClosed gate stops a buffered tap from
  // firing after the user has checked in (e.g. they hit + then immediately
  // slid to commit — without this the 1.5 s timer would fire post-commit
  // and try to land a log on a closed cycle).
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

  // AppState safety net: when the app goes to background, flush whatever's
  // un-sent so a backgrounded -> killed app doesn't lose taps. Same
  // cycle-closed gate so we don't background-flush a doomed log.
  useEffect(() => {
    const tid = task.taskId;
    const onChange = (state: AppStateStatus) => {
      if (state !== "background" && state !== "inactive") return;
      if (cycleClosed) return;
      const remainder = pendingLogRef.current - inFlightSentRef.current;
      if (remainder === 0) return;
      inFlightSentRef.current += remainder;
      // Fire-and-forget. If the app actually dies, the result is lost; on
      // resume we re-fetch task state via useFocusEffect and the cycle either
      // landed on the server (good) or didn't (user redoes it).
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
