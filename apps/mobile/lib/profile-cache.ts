import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserProfile } from "@wahaha/shared";

import { getToken, usersApi } from "@/lib/api";

// Module cache for the signed-in user's profile. Gives the drawer (and any other
// consumer) a sync read so it paints last-known identity + caps immediately
// instead of flashing empty then popping data in. Background-revalidates on
// demand and persists to AsyncStorage so a cold app start hydrates near-instantly.

const STORAGE_KEY = "profile_cache";

let cached: UserProfile | null = null;
let inflight: Promise<UserProfile | null> | null = null;
const listeners = new Set<(me: UserProfile | null) => void>();

function notify(next: UserProfile | null) {
  for (const fn of listeners) fn(next);
}

// Hydrate from disk at import time (app boot) — well before the drawer opens.
(async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw && cached === null) {
      cached = JSON.parse(raw) as UserProfile;
      notify(cached);
    }
  } catch {
    // Corrupt/absent cache is non-fatal; revalidate will repopulate.
  }
})();

async function fetchAndUpdate(): Promise<UserProfile | null> {
  const token = await getToken();
  if (!token) {
    // Signed out — drop any stale identity so the drawer shows the Sign In CTA.
    if (cached !== null) {
      cached = null;
      AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
      notify(null);
    }
    return null;
  }
  const res = await usersApi.getMe();
  if (!res.data) return cached;
  cached = res.data;
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(res.data)).catch(() => {});
  notify(res.data);
  return res.data;
}

export const profileCache = {
  // Sync read; null on cold start before first hydrate/fetch.
  read(): UserProfile | null {
    return cached;
  },
  // Fire-and-forget revalidation, coalesces concurrent callers.
  revalidate(): Promise<UserProfile | null> {
    if (inflight) return inflight;
    inflight = fetchAndUpdate().finally(() => {
      inflight = null;
    });
    return inflight;
  },
  // Replace the cached profile directly (e.g. optimistic update after submit).
  set(next: UserProfile): void {
    cached = next;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next)).catch(() => {});
    notify(next);
  },
  // Subscribe to background updates; returns unsubscribe.
  subscribe(fn: (me: UserProfile | null) => void): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  // Wipe the cache (e.g. on sign-out so a re-login can't render the previous user).
  clear(): void {
    cached = null;
    AsyncStorage.removeItem(STORAGE_KEY).catch(() => {});
    notify(null);
  },
};
