"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usersApi, type UserProfile } from "@/lib/api/users";
import { useToast } from "@/context/ToastContext";
import { usePoints } from "@/context/PointsContext";
import ProfilePictureUpload from "@/components/ProfilePictureUpload";

export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { setError } = useToast();
  const { setProfilePictureUrl } = usePoints();

  useEffect(() => {
    setIsMounted(true);
    const token = !!localStorage.getItem("auth_token");
    setHasToken(token);
    if (!token) { setLoading(false); return; }
    usersApi.getMe().then(({ data, error }) => {
      setLoading(false);
      if (error) { setError(error); return; }
      if (data) setUser(data);
    });
  }, [setError]);

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

        {loading ? (
          <p style={{ color: "var(--color-fg-subtle)", fontSize: 11 }}>Loading…</p>
        ) : user ? (
          <>
            <Section title="Profile picture">
              <ProfilePictureUpload
                profilePictureUrl={user.profilePictureUrl}
                onChange={(url) => {
                  setUser((u) => u ? { ...u, profilePictureUrl: url } : u);
                  // Also push to PointsContext so AuthHeader's avatar updates
                  // immediately without a /me round-trip.
                  setProfilePictureUrl(url);
                }}
                size={96}
              />
            </Section>

            <Section title="Account">
              <Field label="Username" value={user.username} />
              <Field label="Email" value={user.email} />
            </Section>
          </>
        ) : (
          <p style={{ color: "var(--color-danger)", fontSize: 11 }}>Couldn&apos;t load your profile.</p>
        )}
      </div>
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
