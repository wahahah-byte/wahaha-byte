"use client";

import { useEffect, useState } from "react";

// Returns the height of the soft keyboard (or any visual-viewport
// occlusion at the bottom) in CSS pixels. Zero when nothing is occluding.
//
// Why: `position: fixed; bottom: env(safe-area-inset-bottom)` is unreliable
// when a soft keyboard appears/dismisses — iOS Safari in particular leaves
// the fixed bar floating above its intended bottom edge after dismissal,
// producing a visible gap underneath. visualViewport reports the *actual*
// visible area, so we can pin to the real visible bottom regardless.
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
      // Decouple the bar's resting position from any stale visualViewport
      // value: if nothing editable is focused, there's no keyboard, full stop.
      // visualViewport.resize sometimes doesn't fire (or fires late) when the
      // soft keyboard dismisses, leaving the bar floating above a phantom
      // inset. Treating focus as the source of truth avoids that whole class
      // of bug — keyboards only appear when an editable element is focused.
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

    // Inset only changes meaningfully on focus/blur and visualViewport
    // resize (keyboard show/hide while focused).
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
