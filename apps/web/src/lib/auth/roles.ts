// Role detection from JWT in localStorage; backend re-validates every protected request.

const ROLE_CLAIM = "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

export interface JwtPayload {
  [key: string]: unknown;
  exp?: number;
  username?: string;
  appUserId?: string;
}

// Decode JWT payload to a plain object; returns null on any failure.
export function decodeJwtPayload(token: string | null | undefined): JwtPayload | null {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    // Convert base64url → base64 with padding (atob wants standard base64).
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "===".slice((b64.length + 3) % 4);
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
}

// Pulls role claim(s) out of payload; normalised to a Set for membership checks.
export function rolesFromPayload(payload: JwtPayload | null): Set<string> {
  if (!payload) return new Set();
  const raw = payload[ROLE_CLAIM];
  if (raw == null) return new Set();
  if (Array.isArray(raw)) return new Set(raw.map(String));
  return new Set([String(raw)]);
}

// Snapshot of current user's roles from localStorage token; SSR-safe.
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

// True when user can manage avatar items; mirrors API [Authorize(Roles="Admin,Moderator")].
export function canManageAvatarItems(): boolean {
  const roles = getCurrentRoles();
  return roles.has("Admin") || roles.has("Moderator");
}
