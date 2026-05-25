"use client";

import { useEffect, useState } from "react";

// User-level preference for showing the avatar (chibi / inventory / shop) feature.
// Persisted in localStorage so the choice survives reloads; published via a tiny
// pub-sub so every consumer re-renders the moment the Settings toggle flips.
//
// Default is ON. When OFF, the app hides every avatar entry point and chibi render
// — pages themselves remain reachable by URL so direct links / bookmarks still work.

const KEY = "wahaha:avatars_enabled";
const listeners = new Set<(v: boolean) => void>();

function read(): boolean {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(KEY) !== "false";
}

export function setAvatarsEnabled(v: boolean): void {
  try { localStorage.setItem(KEY, String(v)); } catch { /* private mode / quota — non-fatal */ }
  for (const fn of listeners) fn(v);
}

export function useAvatarsEnabled(): boolean {
  // SSR-safe default — first paint matches the unstyled-on assumption so toggling at
  // mount doesn't flash. localStorage read happens client-side in the effect below.
  const [enabled, setEnabled] = useState<boolean>(true);
  useEffect(() => {
    setEnabled(read());
    listeners.add(setEnabled);
    return () => { listeners.delete(setEnabled); };
  }, []);
  return enabled;
}
