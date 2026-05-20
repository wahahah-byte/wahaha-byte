"use client";

import { useEffect, useState } from "react";

// Desktop breakpoint subscription (>=880px); false on SSR/first paint.
export function useDesktopLayout(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 880px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}
