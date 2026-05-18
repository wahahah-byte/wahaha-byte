"use client";

import { RefObject, useEffect, useRef, useState } from "react";

const TRIGGER_DISTANCE = 70;
const MAX_PULL = 110;

type Phase = "idle" | "pulling" | "ready" | "refreshing";

export function usePullToRefresh<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  onRefresh: () => Promise<void> | void,
  enabled: boolean = true,
) {
  const [pullY, setPullY] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const startYRef = useRef<number | null>(null);
  const startXRef = useRef<number | null>(null);
  const lockedRef = useRef(false);
  const abortedRef = useRef(false);
  // Mirror of pullY for synchronous reads inside onTouchEnd; the React state
  // copy lags because state updates are batched and the effect doesn't re-bind
  // on every change (it would race with rapid touch events).
  const pullYRef = useRef(0);

  // Snapshot the element each render so the effect re-runs when it goes from
  // null → element (e.g. when a parent gates rendering on a "mounted" flag).
  const el = containerRef.current;

  useEffect(() => {
    if (!enabled || !el) return;

    const setPull = (y: number, p: Phase) => {
      pullYRef.current = y;
      setPullY(y);
      setPhase(p);
    };

    function onTouchStart(e: TouchEvent) {
      if (!el || el.scrollTop > 0) {
        startYRef.current = null;
        startXRef.current = null;
        return;
      }
      startYRef.current = e.touches[0].clientY;
      startXRef.current = e.touches[0].clientX;
      lockedRef.current = false;
      abortedRef.current = false;
    }

    function onTouchMove(e: TouchEvent) {
      const start = startYRef.current;
      const startX = startXRef.current;
      if (start == null || startX == null || abortedRef.current) return;
      if (!el || el.scrollTop > 0) {
        startYRef.current = null;
        startXRef.current = null;
        setPull(0, "idle");
        return;
      }
      const dy = e.touches[0].clientY - start;
      const dx = e.touches[0].clientX - startX;
      // Axis lock: if the user has moved more horizontally than vertically
      // by the time they cross the deadzone, treat this as a horizontal
      // gesture (e.g. swipe-to-delete on a row) and abort pull-to-refresh
      // for the rest of the touch.
      if (!lockedRef.current && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
        abortedRef.current = true;
        return;
      }
      if (dy <= 0) {
        if (lockedRef.current) {
          setPull(0, "idle");
        }
        return;
      }
      // Lock the gesture as a pull once the user has moved past a small deadzone
      if (!lockedRef.current && dy > 6) lockedRef.current = true;
      if (!lockedRef.current) return;
      // Damped pull: linear up to TRIGGER, then resistance.
      const damped =
        dy <= TRIGGER_DISTANCE
          ? dy
          : TRIGGER_DISTANCE + (dy - TRIGGER_DISTANCE) * 0.35;
      const clamped = Math.min(damped, MAX_PULL);
      setPull(clamped, clamped >= TRIGGER_DISTANCE ? "ready" : "pulling");
      if (e.cancelable) e.preventDefault();
    }

    async function onTouchEnd() {
      const start = startYRef.current;
      const wasLocked = lockedRef.current;
      const wasAborted = abortedRef.current;
      startYRef.current = null;
      startXRef.current = null;
      lockedRef.current = false;
      abortedRef.current = false;
      if (!wasLocked || start == null || wasAborted) {
        setPull(0, "idle");
        return;
      }
      if (pullYRef.current >= TRIGGER_DISTANCE) {
        setPull(56, "refreshing");
        try {
          await onRefresh();
        } finally {
          setPull(0, "idle");
        }
      } else {
        setPull(0, "idle");
      }
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    el.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [el, onRefresh, enabled]);

  return { pullY, phase, triggerDistance: TRIGGER_DISTANCE };
}
