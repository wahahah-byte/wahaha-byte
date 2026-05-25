"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usersApi, type UserProfile } from "@/lib/api/users";
import { useToast } from "@/context/ToastContext";
import { usePoints } from "@/context/PointsContext";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";
import { NavIconShop, NavIconSettings } from "@/components/NavIcons";
import { useAvatarsEnabled } from "@/hooks/useAvatarsEnabled";

// Discord-style profile extras stored locally until a backend lands.
// Keyed per-user so multiple accounts on one device stay separate.
interface ProfileExtras {
  bannerUrl: string | null;
  displayName: string;
  bio: string;
  accentColor: string;
}

const ACCENT_COLORS = [
  "#7c5cf0", // violet
  "#5b8be0", // blue
  "#3e9b87", // teal
  "#d97757", // coral
  "#c97a07", // amber
  "#d83232", // red
  "#a04ec9", // magenta
  "#6b7280", // slate
] as const;

const DEFAULT_EXTRAS: ProfileExtras = {
  bannerUrl: null,
  displayName: "",
  bio: "",
  accentColor: ACCENT_COLORS[0],
};

const MAX_BANNER_BYTES = 1.5 * 1024 * 1024; // 1.5MB pre-base64 cap (LS budget)

function storageKey(userId: string) {
  return `wb-profile-extras:${userId}`;
}

function loadExtras(userId: string): ProfileExtras {
  if (typeof window === "undefined") return DEFAULT_EXTRAS;
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return DEFAULT_EXTRAS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_EXTRAS, ...parsed };
  } catch {
    return DEFAULT_EXTRAS;
  }
}

function saveExtras(userId: string, extras: ProfileExtras) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(extras));
  } catch {
    // Quota exceeded — banner image probably too large after base64 inflation.
  }
}

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const avatarsEnabled = useAvatarsEnabled();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [extras, setExtras] = useState<ProfileExtras>(DEFAULT_EXTRAS);
  // Toggled by the Edit Profile button; controls whether name/bio render as
  // editable inputs and whether the accent color picker is shown.
  const [isEditing, setIsEditing] = useState(false);
  const { setError } = useToast();
  const { setProfilePictureUrl } = usePoints();
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const token = !!localStorage.getItem("auth_token");
    setHasToken(token);
    if (!token) { setLoading(false); return; }
    usersApi.getMe().then(({ data, error }) => {
      setLoading(false);
      if (error) { setError(error); return; }
      if (data) {
        setUser(data);
        setExtras(loadExtras(data.userId));
      }
    });
  }, [setError]);

  const patchExtras = useCallback((patch: Partial<ProfileExtras>) => {
    setExtras((prev) => {
      const next = { ...prev, ...patch };
      if (user) saveExtras(user.userId, next);
      return next;
    });
  }, [user]);

  const onBannerSelected = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Banner must be an image."); return; }
    if (file.size > MAX_BANNER_BYTES) {
      setError("Banner is too large (max ~1.5MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      patchExtras({ bannerUrl: dataUrl });
    };
    reader.onerror = () => setError("Couldn't read banner image.");
    reader.readAsDataURL(file);
  }, [patchExtras, setError]);

  if (!isMounted) return null;

  if (!hasToken) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <p style={{ color: "var(--color-fg-muted)", fontSize: 12 }}>Sign in to view your profile.</p>
          <Link
            href="/login"
            className="text-[10px] tracking-widest uppercase font-semibold"
            style={{
              color: "var(--color-fg)",
              border: "1px solid var(--color-border-hairline)",
              borderRadius: 999,
              padding: "6px 14px",
              textDecoration: "none",
            }}
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--color-bg)", paddingBottom: 64 }}>
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="text-[10px] tracking-widest uppercase font-semibold"
            style={{ color: "var(--color-fg-subtle)", textDecoration: "none" }}
          >
            ← Back
          </Link>
          <h1
            className="text-xs font-semibold"
            style={{ color: "var(--color-fg)", letterSpacing: "0.18em", textTransform: "uppercase" }}
          >
            Profile
          </h1>
          <span style={{ width: 40 }} aria-hidden />
        </header>

        {loading || !user ? (
          <p style={{ color: "var(--color-fg-subtle)", fontSize: 11 }}>Loading…</p>
        ) : (
          <>
            {/* Banner — avatar is a sibling below with negative margin so the
                Remove button stacks naturally without overlap math. */}
            <div
              style={{
                position: "relative",
                borderRadius: 8,
                border: "1px solid var(--color-border-hairline)",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => bannerInputRef.current?.click()}
                aria-label="Change banner"
                style={{
                  width: "100%",
                  aspectRatio: "16 / 5",
                  borderTopLeftRadius: 8,
                  borderTopRightRadius: 8,
                  border: "none",
                  display: "block",
                  cursor: "pointer",
                  position: "relative",
                  background: extras.bannerUrl
                    ? `url(${extras.bannerUrl}) center/cover no-repeat`
                    : `linear-gradient(135deg, ${extras.accentColor}, color-mix(in srgb, ${extras.accentColor} 55%, #000))`,
                  padding: 0,
                  overflow: "hidden",
                }}
              >
                {!extras.bannerUrl && (
                  <span
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.7)",
                      fontSize: 10,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      pointerEvents: "none",
                    }}
                  >
                    Tap to add banner
                  </span>
                )}
              </button>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onBannerSelected(file);
                  e.target.value = ""; // allow re-selecting same file
                }}
              />
              {extras.bannerUrl && (
                <button
                  type="button"
                  onClick={() => patchExtras({ bannerUrl: null })}
                  aria-label="Remove banner"
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    background: "rgba(0,0,0,0.5)",
                    color: "rgba(255,255,255,0.85)",
                    border: "none",
                    borderRadius: 999,
                    width: 24,
                    height: 24,
                    fontSize: 13,
                    lineHeight: 1,
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              )}

            </div>

            {/* Avatar — half-overlaps the banner via negative top margin so the
                Remove button can sit below the image without breaking layout.
                marginTop must cancel the parent flex `gap` plus the desired
                overlap (~42px on an 84px avatar = ~50% overlap).
                position+zIndex puts the avatar in the same stacking layer as
                the (positioned) banner; without this the banner paints over
                the avatar where they overlap. */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                marginTop: -66,
                marginLeft: 12,
                alignSelf: "flex-start",
                marginBottom: -12,
              }}
            >
              <ProfilePictureUpload
                profilePictureUrl={user.profilePictureUrl}
                onChange={(url) => {
                  setUser((u) => u ? { ...u, profilePictureUrl: url } : u);
                  setProfilePictureUrl(url);
                }}
                size={84}
              />
            </div>

            {/* Name + bio card — read-only by default, editable in edit mode. */}
            <section
              style={{
                marginTop: 4,
                background: "var(--color-surface)",
                border: "1px solid var(--color-border-hairline)",
                borderRadius: 6,
                padding: 16,
                paddingTop: 12,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={extras.displayName}
                    onChange={(e) => patchExtras({ displayName: e.target.value })}
                    placeholder="Display name"
                    maxLength={32}
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "var(--color-fg)",
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "0.01em",
                      padding: 0,
                    }}
                  />
                  <span style={{ color: "var(--color-fg-muted)", fontSize: 11, marginTop: -8 }}>
                    @{user.username}
                  </span>
                  <div style={{ height: 1, background: "var(--color-border-hairline)", margin: "4px 0" }} />
                  <textarea
                    value={extras.bio}
                    onChange={(e) => patchExtras({ bio: e.target.value })}
                    placeholder="Tell people about yourself…"
                    rows={3}
                    maxLength={190}
                    style={{
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "var(--color-fg)",
                      fontSize: 12,
                      lineHeight: 1.5,
                      resize: "vertical",
                      padding: 0,
                      fontFamily: "inherit",
                    }}
                  />
                  <span style={{ color: "var(--color-fg-subtle)", fontSize: 9, alignSelf: "flex-end" }}>
                    {extras.bio.length} / 190
                  </span>
                </>
              ) : (
                <>
                  <span
                    style={{
                      color: extras.displayName ? "var(--color-fg)" : "var(--color-fg-subtle)",
                      fontSize: 18,
                      fontWeight: 600,
                      letterSpacing: "0.01em",
                    }}
                  >
                    {extras.displayName || "Display name"}
                  </span>
                  <span style={{ color: "var(--color-fg-muted)", fontSize: 11, marginTop: -8 }}>
                    @{user.username}
                  </span>
                  <div style={{ height: 1, background: "var(--color-border-hairline)", margin: "4px 0" }} />
                  <p
                    style={{
                      color: extras.bio ? "var(--color-fg)" : "var(--color-fg-subtle)",
                      fontSize: 12,
                      lineHeight: 1.5,
                      margin: 0,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {extras.bio || "Tell people about yourself…"}
                  </p>
                </>
              )}
            </section>

            {/* Edit profile / Done — horizontal pill button. */}
            <button
              type="button"
              onClick={() => setIsEditing((v) => !v)}
              style={{
                padding: "12px 16px",
                borderRadius: 6,
                border: `1px solid ${isEditing ? "var(--color-active-highlight)" : "var(--color-border-hairline)"}`,
                background: isEditing ? "var(--color-active-highlight-bg)" : "transparent",
                color: isEditing ? "var(--color-active-highlight)" : "var(--color-fg)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                cursor: "pointer",
                width: "100%",
                transition: "background 0.12s, color 0.12s, border-color 0.12s",
              }}
            >
              {isEditing ? "Done" : "Edit Profile"}
            </button>

            {/* Accent color swatches — visible only while editing. */}
            {isEditing ? (
              <Section title="Accent color">
                <div className="flex items-center gap-3 flex-wrap">
                  {ACCENT_COLORS.map((c) => {
                    const active = extras.accentColor === c;
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => patchExtras({ accentColor: c })}
                        aria-label={`Set accent color ${c}`}
                        aria-pressed={active}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          background: c,
                          border: active
                            ? "2px solid var(--color-fg)"
                            : "2px solid transparent",
                          boxShadow: active ? "0 0 0 2px var(--color-bg) inset" : undefined,
                          cursor: "pointer",
                          padding: 0,
                        }}
                      />
                    );
                  })}
                </div>
                <p style={{ color: "var(--color-fg-subtle)", fontSize: 10, marginTop: 6 }}>
                  Used as the banner background when no image is set.
                </p>
              </Section>
            ) : null}

            {/* Stats card. */}
            <Section title="Stats">
              <div className="grid grid-cols-3 gap-4">
                <Stat label="Balance" value={user.currentBalance.toLocaleString()} />
                <Stat label="Level" value={String(user.level)} />
                <Stat label="Earned" value={user.totalPointsEarned.toLocaleString()} />
              </div>
            </Section>

            {/* Account info. */}
            <Section title="Account">
              <Field label="Username" value={user.username} />
              <Field label="Email" value={user.email} />
            </Section>
          </>
        )}
      </div>

      {/* Footer nav — pinned to bottom of viewport, two tabs (Shop, Settings). */}
      <nav
        aria-label="Profile navigation"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: 60,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          display: "flex",
          background: "var(--color-header)",
          borderTop: "1px solid var(--color-border-soft)",
          boxShadow: "0 -2px 12px rgba(0, 0, 0, 0.18)",
          zIndex: 30,
        }}
      >
        {avatarsEnabled && <FooterTab href="/shop" label="Shop" icon={<NavIconShop />} />}
        <FooterTab href="/settings" label="Settings" icon={<NavIconSettings />} />
      </nav>
    </main>
  );
}

function FooterTab({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-label={label}
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        paddingTop: 8,
        color: "var(--color-fg-muted)",
        textDecoration: "none",
        transition: "color 0.12s, background 0.12s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "var(--color-fg)";
        e.currentTarget.style.background = "var(--color-overlay-hover, rgba(255, 255, 255, 0.05))";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "var(--color-fg-muted)";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {icon}
      <span
        style={{
          fontSize: 9,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </Link>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2
        style={{
          color: "var(--color-fg-subtle)",
          fontSize: 9,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {title}
      </h2>
      <div
        className="flex flex-col gap-3"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-hairline)",
          borderRadius: 6,
          padding: 16,
        }}
      >
        {children}
      </div>
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        style={{
          color: "var(--color-fg-subtle)",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span style={{ color: "var(--color-fg)", fontSize: 12 }}>{value}</span>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        style={{
          color: "var(--color-fg-subtle)",
          fontSize: 9,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span style={{ color: "var(--color-fg)", fontSize: 16, fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
        {value}
      </span>
    </div>
  );
}
