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
    <div className="min-h-screen flex items-center justify-center bg-[#313338]">
      <div className="w-full max-w-md bg-[#2B2D31] rounded-lg shadow-2xl overflow-hidden">
        <div className="px-8 py-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">Welcome back!</h1>
            <p className="text-[#B5BAC1] text-sm mt-1">
              We&apos;re so excited to see you again!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-[#F23F43]/10 border border-[#F23F43]/30 rounded text-[#F23F43] text-sm px-3 py-2">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold tracking-wide text-[#B5BAC1] uppercase mb-2">
                Email <span className="text-[#F23F43]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full bg-[#1E1F22] text-[#DBdEE1] rounded px-3 py-2.5 text-sm border border-transparent focus:outline-none focus:border-[#5865F2] placeholder-[#4E5058] transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold tracking-wide text-[#B5BAC1] uppercase">
                  Password <span className="text-[#F23F43]">*</span>
                </label>
                <a href="#" className="text-xs text-[#00A8FC] hover:underline">
                  Forgot your password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full bg-[#1E1F22] text-[#DBdEE1] rounded px-3 py-2.5 text-sm border border-transparent focus:outline-none focus:border-[#5865F2] placeholder-[#4E5058] transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 text-white font-medium rounded py-2.5 text-sm transition-colors cursor-pointer mt-2"
            >
              {loading ? "Signing in…" : "Log In"}
            </button>
          </form>

          <p className="text-[#949BA4] text-sm mt-4">
            Need an account?{" "}
            <a href="/register" className="text-[#00A8FC] hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
