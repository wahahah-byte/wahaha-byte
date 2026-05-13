"use client";

import { useEffect, useState } from "react";
import { avatarApi, type UserInventoryDto } from "@/lib/api/avatar";

// Session-scoped cache so multiple TaskDetailModal opens during the same
// page life don't each pay a network round-trip for the user's equipped
// items. Cleared automatically on full reload; callers that mutate equip
// state (e.g. the /avatar page's onCardClick) can call
// `clearEquippedAvatarCache()` so the next modal open re-fetches.
let cache: UserInventoryDto[] | null = null;

export function clearEquippedAvatarCache(): void {
  cache = null;
}

// Pre-populate the cache from a source that already has equipped items
// in hand — e.g. the /avatar page derives `equipped` from its full
// inventory state without calling getEquipped() directly. Calling this
// after such a derive means the next TaskDetailModal open reads the
// cached value immediately, no fetch flicker, no flash of the base
// chibi while it loads. Cheap to call repeatedly; just overwrites the
// cache reference.
export function primeEquippedAvatarCache(equipped: UserInventoryDto[]): void {
  cache = equipped;
}

// Returns the user's currently-equipped avatar items, or null when the
// session has no auth token (static-demo / unauthed mode). On first call
// the hook seeds from the cache (often null on a fresh page load),
// kicks off a background fetch, and updates state when the fetch lands.
// Subsequent calls during the same page life see the cached value
// immediately and refresh in the background.
//
// Consumers should fall back to a mock equipped set when this returns
// null — keeps TaskDetailModal usable in demo mode where there's no
// authed user.
export function useEquippedAvatar(): UserInventoryDto[] | null {
  const [equipped, setEquipped] = useState<UserInventoryDto[] | null>(cache);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    let cancelled = false;
    avatarApi.getEquipped().then(({ data }) => {
      if (cancelled || !data) return;
      cache = data;
      setEquipped(data);
    });
    return () => { cancelled = true; };
  }, []);
  return equipped;
}
