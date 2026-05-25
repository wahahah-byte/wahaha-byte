"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";

// Mirrors server-side MinimumAgeYears in RegisterUserHandler.
const MIN_AGE_YEARS = 13;

// Years-old between DOB and today, accounting for whether the birthday has passed this year.
function ageInYears(dobIso: string): number | null {
  if (!dobIso) return null;
  const dob = new Date(`${dobIso}T00:00:00`);
  if (Number.isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const beforeBirthday =
    today.getMonth() < dob.getMonth()
    || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());
  if (beforeBirthday) age--;
  return age;
}

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!dateOfBirth) {
      setError("Please enter your date of birth.");
      return;
    }
    const age = ageInYears(dateOfBirth);
    if (age == null) {
      setError("Invalid date of birth.");
      return;
    }
    if (age < MIN_AGE_YEARS) {
      setError(`You must be at least ${MIN_AGE_YEARS} years old to register.`);
      return;
    }

    setLoading(true);
    const { data, error } = await authApi.register({ username, email, password, dateOfBirth });
    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    localStorage.setItem("auth_token", data!.token);
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-widest uppercase mb-1" style={{ color: "var(--color-fg)" }}>
            Create Account
          </h1>
          <p style={{ color: "var(--color-fg-muted)", fontSize: "12px", letterSpacing: "0.08em" }}>
            Start tracking tasks and earning points.
          </p>
        </div>

        <div
          className="flex flex-col gap-4 p-7"
          style={{ background: "var(--color-panel)", border: "1px solid var(--color-border)", borderRadius: "4px" }}
        >
          {error && (
            <div
              className="px-3 py-2.5 text-xs leading-relaxed"
              style={{ background: "var(--color-danger-bg)", border: "1px solid var(--color-danger-border)", borderRadius: "3px", color: "var(--color-danger)" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>
                Username <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                autoFocus
                placeholder="your_handle"
                className="w-full px-3 py-2.5 text-sm transition-colors focus:outline-none"
                style={{
                  background: "var(--color-input)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "3px",
                  color: "var(--color-input-fg)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-active-highlight)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>
                Email <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 text-sm transition-colors focus:outline-none"
                style={{
                  background: "var(--color-input)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "3px",
                  color: "var(--color-input-fg)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-active-highlight)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>
                Date of Birth <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                max={new Date().toISOString().slice(0, 10)}
                className="w-full px-3 py-2.5 text-sm transition-colors focus:outline-none"
                style={{
                  background: "var(--color-input)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "3px",
                  color: "var(--color-input-fg)",
                  colorScheme: "dark",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-active-highlight)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              />
              <span style={{ color: "var(--color-fg-subtle)", fontSize: "10px", letterSpacing: "0.04em" }}>
                You must be at least {MIN_AGE_YEARS} years old to use this service.
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>
                Password <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Min. 8 characters"
                className="w-full px-3 py-2.5 text-sm transition-colors focus:outline-none"
                style={{
                  background: "var(--color-input)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "3px",
                  color: "var(--color-input-fg)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--color-active-highlight)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--color-border)")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "var(--color-fg-muted)" }}>
                Confirm Password <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="Repeat your password"
                className="w-full px-3 py-2.5 text-sm transition-colors focus:outline-none"
                style={{
                  background: "var(--color-input)",
                  border: `1px solid ${confirm && confirm !== password ? "var(--color-danger)" : "var(--color-border)"}`,
                  borderRadius: "3px",
                  color: "var(--color-input-fg)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = confirm !== password ? "var(--color-danger)" : "var(--color-active-highlight)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = confirm && confirm !== password ? "var(--color-danger)" : "var(--color-border)")}
              />
              {confirm && confirm !== password && (
                <span style={{ color: "var(--color-danger)", opacity: 0.85, fontSize: "10px", letterSpacing: "0.04em" }}>
                  Passwords do not match
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-xs font-semibold tracking-widest uppercase cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1"
              style={{ background: "var(--color-active-highlight-bg)", color: "var(--color-active-highlight)", border: "1px solid var(--color-active-highlight-border)", borderRadius: "3px" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "color-mix(in srgb, var(--color-active-highlight) 18%, transparent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--color-active-highlight-bg)"; }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs" style={{ color: "var(--color-fg-subtle)" }}>
          Already have an account?{" "}
          <Link href="/login" className="transition-colors" style={{ color: "var(--color-active-highlight)" }}
            onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
