import { applyHints, type UserInventoryDto } from "@wahaha/shared";

import { avatarApi } from "@/lib/api";

// Module cache for equipped-avatar payload; sync read + bg revalidate on mount.

let cached: UserInventoryDto[] | null = null;
let inflight: Promise<UserInventoryDto[] | null> | null = null;
const listeners = new Set<(equipped: UserInventoryDto[]) => void>();

function notify(next: UserInventoryDto[]) {
  for (const fn of listeners) fn(next);
}

async function fetchAndUpdate(): Promise<UserInventoryDto[] | null> {
  const res = await avatarApi.getEquipped();
  if (!res.data) return null;
  const hydrated = res.data.map((r) =>
    r.avatarItem ? { ...r, avatarItem: applyHints(r.avatarItem) } : r,
  );
  cached = hydrated;
  notify(hydrated);
  return hydrated;
}

export const equippedCache = {
  // Sync read; null on cold start.
  read(): UserInventoryDto[] | null {
    return cached;
  },
  // Fire-and-forget revalidation, coalesces callers.
  revalidate(): Promise<UserInventoryDto[] | null> {
    if (inflight) return inflight;
    inflight = fetchAndUpdate().finally(() => {
      inflight = null;
    });
    return inflight;
  },
  // Subscribe to bg updates; returns unsubscribe.
  subscribe(fn: (equipped: UserInventoryDto[]) => void): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  // Replace cache directly after equip mutation.
  set(next: UserInventoryDto[]): void {
    cached = next;
    notify(next);
  },
};
