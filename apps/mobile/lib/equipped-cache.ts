import { applyHints, type UserInventoryDto } from "@wahaha/shared";

import { avatarApi } from "@/lib/api";

// Module-level cache for the user's equipped-avatar payload. Without this,
// every detail-modal open re-fetched /api/avatar/equipped and waited for
// the network before the chibi could render — visibly the largest source
// of the "modal opens slow" feel. With it, second-and-later opens read the
// last-known equipped set synchronously and the chibi is on screen in the
// same frame the modal mounts. A background revalidate fires on every
// mount to pick up changes from the avatar screen.
//
// Single equipped set per user, so a single global cache is correct — no
// need to key by user id.

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
  /** Synchronous read of the cached equipped set. null on cold start. */
  read(): UserInventoryDto[] | null {
    return cached;
  },
  /** Fire-and-forget revalidation. Coalesces concurrent callers. */
  revalidate(): Promise<UserInventoryDto[] | null> {
    if (inflight) return inflight;
    inflight = fetchAndUpdate().finally(() => {
      inflight = null;
    });
    return inflight;
  },
  /** Subscribe to background updates. Returns an unsubscribe fn. */
  subscribe(fn: (equipped: UserInventoryDto[]) => void): () => void {
    listeners.add(fn);
    return () => {
      listeners.delete(fn);
    };
  },
  /** Replace the cache directly — call after a successful equip mutation
   *  so the next modal open already sees the new state. */
  set(next: UserInventoryDto[]): void {
    cached = next;
    notify(next);
  },
};
