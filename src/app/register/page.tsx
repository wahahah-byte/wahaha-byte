"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authApi } from "@/lib/api/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { data, error } = await authApi.register({ username, email, password });
    setLoading(false);

    if (error) {
      setError(error);
      return;
    }

    localStorage.setItem("auth_token", data!.token);
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#1e1f22" }}>
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-widest uppercase text-white mb-1">
            Create Account
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", letterSpacing: "0.08em" }}>
            Start tracking tasks and earning points.
          </p>
        </div>

        <div
          className="flex flex-col gap-4 p-7"
          style={{ background: "#2a2b2f", border: "1px solid #3a3b3f", borderRadius: "4px" }}
        >
          {error && (
            <div
              className="px-3 py-2.5 text-xs leading-relaxed"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: "3px", color: "#ef4444" }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                Username <span style={{ color: "#ef4444" }}>*</span>
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
                  background: "#1e1f22",
                  border: "1px solid #3a3b3f",
                  borderRadius: "3px",
                  color: "#e0e0e0",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#5bb8e0")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#3a3b3f")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                Email <span style={{ color: "#ef4444" }}>*</span>
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
                  background: "#1e1f22",
                  border: "1px solid #3a3b3f",
                  borderRadius: "3px",
                  color: "#e0e0e0",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#5bb8e0")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#3a3b3f")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                Password <span style={{ color: "#ef4444" }}>*</span>
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
                  background: "#1e1f22",
                  border: "1px solid #3a3b3f",
                  borderRadius: "3px",
                  color: "#e0e0e0",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#5bb8e0")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#3a3b3f")}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>
                Confirm Password <span style={{ color: "#ef4444" }}>*</span>
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
                  background: "#1e1f22",
                  border: `1px solid ${confirm && confirm !== password ? "rgba(239,68,68,0.6)" : "#3a3b3f"}`,
                  borderRadius: "3px",
                  color: "#e0e0e0",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = confirm !== password ? "rgba(239,68,68,0.6)" : "#5bb8e0")}
                onBlur={(e) => (e.currentTarget.style.borderColor = confirm && confirm !== password ? "rgba(239,68,68,0.6)" : "#3a3b3f")}
              />
              {confirm && confirm !== password && (
                <span style={{ color: "rgba(239,68,68,0.75)", fontSize: "10px", letterSpacing: "0.04em" }}>
                  Passwords do not match
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-xs font-semibold tracking-widest uppercase cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed mt-1"
              style={{ background: "#1a3a4a", color: "#5bb8e0", border: "1px solid #1e5068", borderRadius: "3px" }}
              onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "#1e4d63"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#1a3a4a"; }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          Already have an account?{" "}
          <Link href="/login" className="transition-colors" style={{ color: "#5bb8e0" }}
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
