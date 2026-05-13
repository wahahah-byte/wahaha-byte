// Role detection from the JWT in localStorage. The backend (TokenService.cs)
// encodes roles as repeated `ClaimTypes.Role` claims — that's the long-form
// namespace below — and the JWT payload is base64url-encoded JSON between the
// two dots in the token.
//
// We decode on the client purely for UX (showing/hiding admin UI). The backend
// re-validates every protected request via `[Authorize(Roles = "...")]`, so a
// tampered token won't actually let you call admin endpoints — the worst case
// is the user sees the admin panel and every action 403s.

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export interface JwtPayload {
  [key: string]: unknown;
  exp?: number;
  username?: string;
  appUserId?: string;
}

// Decode the JWT payload section into a plain object. Returns null on any
// failure — malformed token, expired, missing localStorage, etc. Callers
// treat "no payload" as "no roles."
export function decodeJwtPayload(token: string | null | undefined): JwtPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    // Convert base64url → base64. The JWT spec uses URL-safe base64 (no
    // padding, "-" and "_" instead of "+" and "/"); atob wants standard
    // base64 with padding.
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "===".slice((b64.length + 3) % 4);
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

// Pulls the role claim(s) out of a payload. The ClaimTypes.Role claim is
// emitted once per role, so JSON.parse may return either a string (single
// role) or an array (multiple). Normalised to a Set for membership checks.
export function rolesFromPayload(payload: JwtPayload | null): Set<string> {
  if (!payload) return new Set();
  const raw = payload[ROLE_CLAIM];
  if (raw == null) return new Set();
  if (Array.isArray(raw)) return new Set(raw.map(String));
  return new Set([String(raw)]);
}

// Snapshot of the current user's roles from the token in localStorage. SSR-safe
// (returns empty set on the server) so this can be called unconditionally.
export function getCurrentRoles(): Set<string> {
  if (typeof window === "undefined") return new Set();
  const token = window.localStorage.getItem("auth_token");
  return rolesFromPayload(decodeJwtPayload(token));
}

export function hasRole(role: string): boolean {
  return getCurrentRoles().has(role);
}

export function isAdmin(): boolean { return hasRole("Admin"); }
export function isModerator(): boolean { return hasRole("Moderator"); }

// True when the user can manage avatar items (create/update/toggle/register).
// Mirrors the [Authorize(Roles = "Admin,Moderator")] gates on the API side —
// keep this in sync if the controller's allowed roles change.
export function canManageAvatarItems(): boolean {
  const roles = getCurrentRoles();
  return roles.has("Admin") || roles.has("Moderator");
}
