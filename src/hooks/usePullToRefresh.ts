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

  useEffect(() => {
    if (!enabled) return;
    const el = containerRef.current;
    if (!el) return;

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
        setPullY(0);
        setPhase("idle");
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
          setPullY(0);
          setPhase("idle");
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
      setPullY(clamped);
      setPhase(clamped >= TRIGGER_DISTANCE ? "ready" : "pulling");
      if (e.cancelable) e.preventDefault();
    }

    async function onTouchEnd() {
      const start = startYRef.current;
      startYRef.current = null;
      startXRef.current = null;
      if (!lockedRef.current || start == null || abortedRef.current) {
        abortedRef.current = false;
        setPullY(0);
        setPhase("idle");
        return;
      }
      lockedRef.current = false;
      abortedRef.current = false;
      if (pullY >= TRIGGER_DISTANCE) {
        setPhase("refreshing");
        setPullY(56);
        try {
          await onRefresh();
        } finally {
          setPullY(0);
          setPhase("idle");
        }
      } else {
        setPullY(0);
        setPhase("idle");
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
  }, [containerRef, onRefresh, enabled, pullY]);

  return { pullY, phase, triggerDistance: TRIGGER_DISTANCE };
}
