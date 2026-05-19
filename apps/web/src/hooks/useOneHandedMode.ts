"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Samsung-style one-handed shrink. Pull DOWN on a designated handle (typically
// the page header — separate from the scroll container so pull-to-refresh
// doesn't fight) to translate the page content downward into the bottom thumb
// zone. Past TRIGGER the gesture commits and the content stays shrunk until
// the user taps the empty top area or pulls back up.
//
// Lives outside the scroll surface on purpose: PtR owns "drag down inside the
// list", this owns "drag down on the header / chrome above the list". No axis
// negotiation needed.

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
    // From shrunk: any tap on the handle restores immediately. Lets the user
    // exit the mode without having to remember a specific gesture.
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
      // Need a few pixels of motion before we commit to an axis. Once we
      // commit to vertical-down, we own the rest of the touch. Horizontal
      // or upward motion releases ownership so other handlers can take over.
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
    // The committed translateY at release. If past trigger, snap to shrunk
    // and persist. Otherwise spring back to zero. The CSS transition on the
    // container handles the actual animation; we just set the target.
    if (translateY >= TRIGGER) {
      setPhase("shrunk");
      setTranslateY(shrunkOffset());
    } else {
      setPhase("idle");
      setTranslateY(0);
    }
  }, [phase, translateY, shrunkOffset]);

  // Snap back if the viewport resizes while shrunk (orientation change,
  // browser chrome reveal). Keeps the offset proportional rather than
  // leaving a stale absolute pixel value.
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
