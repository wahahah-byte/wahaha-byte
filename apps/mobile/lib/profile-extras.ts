// Discord-style profile extras persisted locally per-user until a backend lands.

export interface ProfileExtras {
  bannerUri: string | null;
  displayName: string;
  bio: string;
  accentColor: string;
}

export const ACCENT_COLORS = [
  "#7c5cf0", "#5b8be0", "#3e9b87", "#d97757",
  "#c97a07", "#d83232", "#a04ec9", "#6b7280",
] as const;

export const DEFAULT_EXTRAS: ProfileExtras = {
  bannerUri: null,
  displayName: "",
  bio: "",
  accentColor: ACCENT_COLORS[0],
};

export const storageKey = (userId: string) => `wb-profile-extras:${userId}`;
