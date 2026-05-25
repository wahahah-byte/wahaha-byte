import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// User-level preference for showing the avatar (chibi / inventory / shop) feature.
// Persisted in AsyncStorage so the choice survives app restarts; published via a
// tiny pub-sub so every consumer re-renders the moment the Settings toggle flips.
//
// Default is ON. When OFF, the app hides every avatar entry point and chibi render
// — routes themselves remain reachable so deep-links still work.

const KEY = "wahaha:avatars_enabled";
const listeners = new Set<(v: boolean) => void>();

// Sync-read cache so consumers can render the correct value on first paint after
// AsyncStorage has been read once. Null until the first read resolves.
let cached: boolean | null = null;

async function readAsync(): Promise<boolean> {
  if (cached !== null) return cached;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    cached = raw !== "false";
  } catch {
    cached = true;
  }
  return cached;
}

export async function setAvatarsEnabled(v: boolean): Promise<void> {
  cached = v;
  try { await AsyncStorage.setItem(KEY, String(v)); } catch { /* non-fatal */ }
  for (const fn of listeners) fn(v);
}

export function useAvatarsEnabled(): boolean {
  // Render with cached value if we already read once; otherwise default to ON
  // and update once the first AsyncStorage read resolves.
  const [enabled, setEnabled] = useState<boolean>(cached ?? true);
  useEffect(() => {
    let cancelled = false;
    readAsync().then((v) => { if (!cancelled) setEnabled(v); });
    listeners.add(setEnabled);
    return () => { cancelled = true; listeners.delete(setEnabled); };
  }, []);
  return enabled;
}
