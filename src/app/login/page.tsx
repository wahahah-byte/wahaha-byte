"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error } = await authApi.login({ email, password });

    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    localStorage.setItem("auth_token", data!.token);
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-md rounded-lg overflow-hidden" style={{ background: "var(--color-panel)", boxShadow: "var(--shadow-popover)" }}>
        <div className="px-8 py-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold" style={{ color: "var(--color-fg)" }}>Welcome back!</h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-fg-muted)" }}>
              We&apos;re so excited to see you again!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded text-sm px-3 py-2" style={{ background: "var(--color-danger-bg)", border: "1px solid var(--color-danger-border)", color: "var(--color-danger)" }}>
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold tracking-wide uppercase mb-2" style={{ color: "var(--color-fg-muted)" }}>
                Email <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded px-3 py-2.5 text-sm border focus:outline-none transition-colors"
                style={{ background: "var(--color-input)", color: "var(--color-input-fg)", borderColor: "var(--color-border)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-active-highlight)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold tracking-wide uppercase" style={{ color: "var(--color-fg-muted)" }}>
                  Password <span style={{ color: "var(--color-danger)" }}>*</span>
                </label>
                <a href="#" className="text-xs hover:underline" style={{ color: "var(--color-active-highlight)" }}>
                  Forgot your password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full rounded px-3 py-2.5 text-sm border focus:outline-none transition-colors"
                style={{ background: "var(--color-input)", color: "var(--color-input-fg)", borderColor: "var(--color-border)" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-active-highlight)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full disabled:opacity-50 font-medium rounded py-2.5 text-sm transition-colors cursor-pointer mt-2"
              style={{ background: "var(--color-active-highlight-bg)", color: "var(--color-active-highlight)", border: "1px solid var(--color-active-highlight-border)" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "color-mix(in srgb, var(--color-active-highlight) 18%, transparent)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-active-highlight-bg)")}
            >
              {loading ? "Signing in…" : "Log In"}
            </button>
          </form>

          <p className="text-sm mt-4" style={{ color: "var(--color-fg-muted)" }}>
            Need an account?{" "}
            <a href="/register" className="hover:underline" style={{ color: "var(--color-active-highlight)" }}>
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
