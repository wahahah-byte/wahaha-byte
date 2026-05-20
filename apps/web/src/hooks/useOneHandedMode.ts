"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Samsung-style one-handed shrink; pull DOWN on header handle to push content into thumb zone.
// Lives outside the scroll surface — PtR owns "drag inside list", this owns "drag on header chrome".

const TRIGGER = 110;          // pixels of pull required to commit
const MAX_PULL = 280;         // absolute cap while finger is down
const SHRUNK_RATIO = 0.42;    // fraction of viewport height to push content by

type Phase = "idle" | "tracking" | "shrunk";

export interface OneHandedMode {
  translateY: number;
  isShrunk: boolean;
  isTracking: boolean;
  dismiss: () => void;
  handleTouchStart: (e: React.TouchEvent) => void;
  handleTouchMove: (e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
}

export function useOneHandedMode(): OneHandedMode {
  const [phase, setPhase] = useState<Phase>("idle");
  const [translateY, setTranslateY] = useState(0);
  const dragRef = useRef<{ startY: number; startX: number; axis: "none" | "vertical" | "horizontal" } | null>(null);

  const shrunkOffset = useCallback(() => {
    if (typeof window === "undefined") return 0;
    return Math.round(window.innerHeight * SHRUNK_RATIO);
  }, []);

  const dismiss = useCallback(() => {
    setPhase("idle");
    setTranslateY(0);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    // From shrunk: tap on handle restores immediately.
    if (phase === "shrunk") {
      dismiss();
      return;
    }
    const t = e.touches[0];
    dragRef.current = { startY: t.clientY, startX: t.clientX, axis: "none" };
  }, [phase, dismiss]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const drag = dragRef.current;
    if (!drag || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dy = t.clientY - drag.startY;
    const dx = t.clientX - drag.startX;
    if (drag.axis === "none") {
      // Need a few px of motion to commit axis; horizontal/upward releases ownership.
      if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return;
      if (Math.abs(dx) > Math.abs(dy) || dy <= 0) {
        dragRef.current = null;
        return;
      }
      drag.axis = "vertical";
      setPhase("tracking");
    }
    if (drag.axis !== "vertical") return;
    const damped = dy <= TRIGGER ? dy : TRIGGER + (dy - TRIGGER) * 0.5;
    setTranslateY(Math.min(damped, MAX_PULL));
  }, []);

  const handleTouchEnd = useCallback(() => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || drag.axis !== "vertical") {
      if (phase === "tracking") {
        setPhase("idle");
        setTranslateY(0);
      }
      return;
    }
    // Past trigger snaps to shrunk; otherwise springs back. CSS handles animation.
    if (translateY >= TRIGGER) {
      setPhase("shrunk");
      setTranslateY(shrunkOffset());
    } else {
      setPhase("idle");
      setTranslateY(0);
    }
  }, [phase, translateY, shrunkOffset]);

  // Re-snap offset on resize while shrunk (keeps it proportional).
  useEffect(() => {
    if (phase !== "shrunk") return;
    function onResize() { setTranslateY(shrunkOffset()); }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase, shrunkOffset]);

  return {
    translateY,
    isShrunk: phase === "shrunk",
    isTracking: phase === "tracking",
    dismiss,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
