"use client";

import { useEffect, useState } from "react";
import { decodeJwtPayload, rolesFromPayload } from "@/lib/auth/roles";

export interface UserRoles {
  // True after first client render — gate admin UI here to avoid hydration mismatch.
  ready: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  // Either role grants avatar-item management access; mirrors canManageAvatarItems().
  canManageAvatarItems: boolean;
}

// Reads role claims from JWT in localStorage; same shape every render to avoid hydration mismatch.
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
