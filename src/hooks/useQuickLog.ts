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

// Manages the buffered +/- counter for routine quick-log. State lives at the
// modal level (rather than inside QuickLogStepper) so the avatar pager and
// the heatmap on the sibling pager card can both read pendingLog and stay in
// sync during the in-flight debounce window.
//
// Display value math is set up so no intermediate render ever shows the wrong
// sum: the avatar/heatmap show `cycleSumToday + pendingLog`. During an
// in-flight flush we keep pendingLog at its full value; when the parent's
// appendCycle lands and bumps cycleSumToday, we decrement pendingLog by the
// same delta inside one flushSync — both moves cancel out.
export function useQuickLog({ task, heatmapCycles, onFlushQuickLog, onDelete }: Args): Result {
  const [pendingLog, setPendingLog] = useState(0);
  const pendingLogRef = useRef(0);
  useEffect(() => { pendingLogRef.current = pendingLog; }, [pendingLog]);

  // How much of pendingLog is already mid-flight (sent to the server but not
  // yet reflected via parent appendCycle + our local decrement). Used to
  // compute the un-flushed remainder so concurrent taps during an in-flight
  // flush don't double-send or under-send.
  const inFlightSentRef = useRef(0);

  // Mirror onFlushQuickLog in a ref so long-lived effect cleanups don't capture
  // a stale prop reference.
  const flushRef = useRef(onFlushQuickLog);
  useEffect(() => { flushRef.current = onFlushQuickLog; });

  // Today's committed counter sum (used to compute the displayed total and
  // for the - button's clamp). Reads from heatmapCycles so it stays in sync
  // with what the heatmap renders.
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

  // Discard any buffered +/- log before delegating to the parent's delete
  // handler. Without this, the modal's unmount cleanup would flush the
  // remainder against a task that's about to be (or already has been) deleted,
  // surfacing a misleading "Couldn't save log" toast.
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
    // Clamp against cycleSumToday so rapid taps can't drive the displayed
    // total below 0. The disabled prop on the - button reflects the
    // last-rendered state, which can lag on fast tap bursts.
    setPendingLog((p) => (cycleSumToday + p - 1 < 0 ? p : p - 1));
  }, [cycleSumToday]);

  // Flush any un-sent buffered delta on unmount or task change so a buffered
  // correction isn't lost. Subtract whatever's already mid-flight — that
  // portion has its own in-flight handler and shouldn't be sent twice.
  useEffect(() => {
    const tid = task.taskId;
    return () => {
      const remainder = pendingLogRef.current - inFlightSentRef.current;
      if (remainder !== 0) flushRef.current?.(tid, remainder);
      pendingLogRef.current = 0;
      inFlightSentRef.current = 0;
    };
  }, [task.taskId]);

  // Debounced auto-flush. Keep pendingLog at its full value for the duration
  // of the API roundtrip; the displayed sum is cycleSumToday + pendingLog,
  // and during the in-flight period cycleSumToday hasn't moved yet so the
  // display stays stable. When the response lands, the parent's appendCycle
  // adds the cycle (cycleSumToday += delta) and we immediately subtract
  // delta from pendingLog inside the same render (flushSync) — both moves
  // cancel out, so the displayed total is unchanged. No flicker.
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
          // Failure: pendingLog stays so the user can retry. Drop the
          // in-flight reservation so future debounce cycles can re-send.
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

  // Tab/page-close safety net via keepalive fetch. State updates here are
  // best-effort — on actual unload they're discarded harmlessly.
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
