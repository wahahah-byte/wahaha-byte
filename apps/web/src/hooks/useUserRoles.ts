"use client";

import { useEffect, useState } from "react";
import { decodeJwtPayload, rolesFromPayload } from "@/lib/auth/roles";

export interface UserRoles {
  // True after the first client-side render — components that conditionally
  // mount admin UI should gate on this so the server-rendered HTML and the
  // first client paint match (otherwise React reports a hydration mismatch).
  ready: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  // Convenience: either role grants access to the avatar-item management
  // endpoints (POST/PUT/PATCH). Mirrors canManageAvatarItems() in lib/auth.
  canManageAvatarItems: boolean;
}

// Reads role claims out of the JWT in localStorage and exposes them as a
// React-friendly hook. Returns the same flag-shape every render (no
// hydration mismatch); the `ready` flag flips true after mount once we've
// actually read storage.
export function useUserRoles(): UserRoles {
  const [roles, setRoles] = useState<UserRoles>({
    ready: false,
    isAdmin: false,
    isModerator: false,
    canManageAvatarItems: false,
  });

  useEffect(() => {
    const token = window.localStorage.getItem("auth_token");
    const set = rolesFromPayload(decodeJwtPayload(token));
    const a = set.has("Admin");
    const m = set.has("Moderator");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRoles({
      ready: true,
      isAdmin: a,
      isModerator: m,
      canManageAvatarItems: a || m,
    });
  }, []);

  return roles;
}
