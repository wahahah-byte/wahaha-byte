import { clearToken } from "@/lib/api";
import { equippedCache } from "@/lib/equipped-cache";
import { profileCache } from "@/lib/profile-cache";
import { taskCache } from "@/lib/task-cache";
import { taskEvents } from "@/lib/task-events";

// Single entry point for both sign-out and account-deletion: drops the token, wipes
// every cache that holds per-user data (tasks, equipped avatar, profile), and broadcasts
// a refresh so screens hosting live state re-fetch and discover the absent token. Use
// this instead of `clearToken()` from sign-out paths so a previous user's tasks /
// avatar can't linger after the next render.
//
// Lives here rather than in lib/api.ts so the per-user caches can import the API
// clients they revalidate against without forming a require cycle with api.ts.
export async function signOut() {
  await clearToken();
  taskCache.clear();
  equippedCache.clear();
  profileCache.clear();
  taskEvents.emitRefreshRequested();
}
