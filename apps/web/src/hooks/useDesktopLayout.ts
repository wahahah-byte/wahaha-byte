"use client";

import { useEffect, useState } from "react";

// Desktop breakpoint subscription (>=880px). Reads matchMedia synchronously on
// the first client render so the desktop layout commits without a mobile→desktop
// flash. SSR still returns false (no window); hydration replaces it in one pass.
export function useDesktopLayout(): boolean {
  const [isDesktop, setIsDesktop] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(min-width: 880px)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 880px)");
    const update = () => setIsDesktop(mq.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}
