"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setIsMounted(true);
    setHasToken(!!localStorage.getItem("auth_token"));
  }, []);

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
