"use client";

import { useEffect, useState } from "react";
import { avatarApi, type UserInventoryDto } from "@/lib/api/avatar";
import { applyHints } from "@wahaha/shared";

// Apply RENDER_HINTS/CLASS_HINTS so modal preview matches /avatar page alignment.
function withHints(rows: UserInventoryDto[]): UserInventoryDto[] {
  return rows.map((r) => r.avatarItem
    ? { ...r, avatarItem: applyHints(r.avatarItem) }
    : r);
}

// Session-scoped cache; clear via clearEquippedAvatarCache() after equip mutations.
let cache: UserInventoryDto[] | null = null;

export function clearEquippedAvatarCache(): void {
  cache = null;
}

// Pre-populate cache from a source that already has equipped items in hand.
export function primeEquippedAvatarCache(equipped: UserInventoryDto[]): void {
  cache = withHints(equipped);
}

// Returns currently-equipped items, or null when unauthed; seeds from cache, refreshes in background.
export function useEquippedAvatar(): UserInventoryDto[] | null {
  const [equipped, setEquipped] = useState<UserInventoryDto[] | null>(cache);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("auth_token");
    if (!token) return;
    let cancelled = false;
    avatarApi.getEquipped().then(({ data }) => {
      if (cancelled || !data) return;
      const resolved = withHints(data);
      cache = resolved;
      setEquipped(resolved);
    });
    return () => { cancelled = true; };
  }, []);
  return equipped;
}
