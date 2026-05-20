"use client";

import { useEffect, useState } from "react";

// Soft-keyboard / visualViewport bottom occlusion in CSS px; 0 when nothing occluding.
// `env(safe-area-inset-bottom)` is unreliable on iOS keyboard dismiss; visualViewport is authoritative.
export function useKeyboardInset(): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const vv = window.visualViewport;

    function isEditableFocused(): boolean {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return false;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      return el.isContentEditable === true;
    }

    function update() {
      // Focus is source of truth — visualViewport.resize sometimes fires late on dismiss.
      if (!isEditableFocused()) {
        setInset(0);
        return;
      }
      if (!vv) {
        setInset(0);
        return;
      }
      const fromBottom = window.innerHeight - vv.height - vv.offsetTop;
      setInset(Math.max(0, Math.round(fromBottom)));
    }

    // Inset changes meaningfully on focus/blur and visualViewport resize.
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    if (vv) {
      vv.addEventListener("resize", update);
      vv.addEventListener("scroll", update);
    }
    window.addEventListener("resize", update);
    update();

    return () => {
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
      if (vv) {
        vv.removeEventListener("resize", update);
        vv.removeEventListener("scroll", update);
      }
      window.removeEventListener("resize", update);
    };
  }, []);

  return inset;
}
