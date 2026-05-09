"use client";

import { useEffect, useState } from "react";

// Subscribes to the desktop breakpoint (>=880px) so pages can swap their
// 3-column shell in for the mobile layout. Returns false on the server and
// during the initial client render, then snaps to the real value after mount.
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
