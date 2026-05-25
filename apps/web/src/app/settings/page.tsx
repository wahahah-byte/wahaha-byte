"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { usePoints } from "@/context/PointsContext";
import { usersApi } from "@/lib/api/users";
import { useToast } from "@/context/ToastContext";
import DeleteAccountModal from "@/components/DeleteAccountModal";
import { setAvatarsEnabled, useAvatarsEnabled } from "@/hooks/useAvatarsEnabled";

export default function SettingsPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { setError } = useToast();
  const { resetUserState } = usePoints();
  const avatarsEnabled = useAvatarsEnabled();

  useEffect(() => {
    setIsMounted(true);
    setHasToken(!!localStorage.getItem("auth_token"));
  }, []);

  async function handleDeleteAccount() {
    if (deleting) return;
    setDeleting(true);
    const { error } = await usersApi.deleteAccount();
    setDeleting(false);
    if (error) {
      setError(error);
      return;
    }
    // Account gone — drop the token and bounce home. router.replace prepends Next's basePath
    // (matches the Sign Out flow in AuthHeader / MobileEdgeDrawer).
    localStorage.removeItem("auth_token");
    resetUserState();
    setDeleteOpen(false);
    router.replace("/");
  }

  if (!isMounted) return null;

  if (!hasToken) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <p style={{ color: "var(--color-fg-muted)", fontSize: 12 }}>Sign in to manage your settings.</p>
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
    <main className="min-h-screen" style={{ background: "var(--color-bg)" }}>
      <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6">
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
            Settings
          </h1>
          <span style={{ width: 40 }} aria-hidden />
        </header>

        <Section title="Appearance">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex items-center justify-between w-full"
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "var(--color-fg)",
              fontSize: 12,
            }}
          >
            <span>Theme</span>
            <span style={{ color: "var(--color-active-highlight)", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {theme === "dark" ? "Dark" : "Light"}
            </span>
          </button>
        </Section>

        <Section title="Features">
          <button
            type="button"
            onClick={() => setAvatarsEnabled(!avatarsEnabled)}
            className="flex items-center justify-between w-full"
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "var(--color-fg)",
              fontSize: 12,
            }}
            aria-pressed={avatarsEnabled}
          >
            <span>Avatars</span>
            <span style={{ color: "var(--color-active-highlight)", fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase" }}>
              {avatarsEnabled ? "On" : "Off"}
            </span>
          </button>
          <p style={{ color: "var(--color-fg-subtle)", fontSize: 10, lineHeight: 1.5 }}>
            Hides the chibi avatar, inventory, and shop. Your unlocked items are preserved
            and will reappear if you turn this back on.
          </p>
        </Section>

        <Section title="Legal">
          <Link
            href="/privacy"
            className="flex items-center justify-between w-full"
            style={{
              color: "var(--color-fg)",
              fontSize: 12,
              textDecoration: "none",
            }}
          >
            <span>Privacy Policy</span>
            <span style={{ color: "var(--color-fg-subtle)", fontSize: 11 }}>→</span>
          </Link>
        </Section>

        <p style={{ color: "var(--color-fg-subtle)", fontSize: 10, textAlign: "center" }}>
          Looking for profile customization? Head to{" "}
          <Link
            href="/profile"
            style={{ color: "var(--color-active-highlight)", textDecoration: "underline" }}
          >
            your profile
          </Link>
          .
        </p>

        <section className="flex flex-col gap-3">
          <h2
            style={{
              color: "var(--color-danger)",
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Danger Zone
          </h2>
          <div
            className="flex flex-col gap-3"
            style={{
              background: "var(--color-surface)",
              border: "1px solid rgba(239,68,68,0.35)",
              borderRadius: 6,
              padding: 16,
            }}
          >
            <div className="flex flex-col gap-1">
              <p style={{ color: "var(--color-fg)", fontSize: 12, fontWeight: 600 }}>Delete account</p>
              <p style={{ color: "var(--color-fg-muted)", fontSize: 11, lineHeight: 1.5 }}>
                Permanently removes your account, all tasks, streaks, inventory, points history,
                and profile picture. This cannot be undone.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              className="self-start px-4 py-2 text-xs tracking-widest uppercase cursor-pointer transition-colors"
              style={{
                color: "var(--color-danger)",
                background: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.45)",
                borderRadius: 3,
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.18)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
            >
              Delete my account
            </button>
          </div>
        </section>
      </div>

      <DeleteAccountModal
        open={deleteOpen}
        busy={deleting}
        requiredText="delete my account"
        onConfirm={handleDeleteAccount}
        onCancel={() => { if (!deleting) setDeleteOpen(false); }}
      />
    </main>
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
