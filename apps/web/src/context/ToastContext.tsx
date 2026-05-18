"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type ToastKind = "error" | "success";

interface ToastContextValue {
  message: string | null;
  kind: ToastKind;
  animKey: number;
  setError: (msg: string | null) => void;
  setSuccess: (msg: string | null) => void;
  // Backwards-compat alias surfaced as `error` so existing readers keep working
  error: string | null;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 5100;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessageState] = useState<string | null>(null);
  const [kind, setKind] = useState<ToastKind>("error");
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setMessage = useCallback((msg: string | null, k: ToastKind) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setMessageState(msg);
    setKind(k);
    if (msg) {
      setAnimKey((kk) => kk + 1);
      timerRef.current = setTimeout(() => {
        setMessageState(null);
        timerRef.current = null;
      }, AUTO_DISMISS_MS);
    }
  }, []);

  const setError = useCallback((msg: string | null) => setMessage(msg, "error"), [setMessage]);
  const setSuccess = useCallback((msg: string | null) => setMessage(msg, "success"), [setMessage]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <ToastContext.Provider value={{
      message,
      kind,
      animKey,
      setError,
      setSuccess,
      error: kind === "error" ? message : null,
    }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastBanner() {
  const { message, kind, animKey } = useToast();
  const isError = kind === "error";
  return (
    <div
      aria-live="polite"
      style={{
        position: "relative",
        height: 0,
        zIndex: 95,
        pointerEvents: "none",
      }}
    >
      {message && (
        <div
          key={animKey}
          className="toast-banner-anim text-xs"
          style={{
            position: "absolute",
            top: 12,
            left: 0,
            right: 0,
            margin: "0 auto",
            maxWidth: 480,
            width: "calc(100% - 32px)",
            background: "var(--color-surface)",
            color: isError ? "var(--color-danger)" : "var(--color-active-highlight-alt)",
            border: `1px solid ${isError ? "rgba(239,68,68,0.35)" : "var(--color-active-highlight-alt-border)"}`,
            borderRadius: 6,
            padding: "10px 14px",
            boxShadow: "var(--shadow-popover)",
            pointerEvents: "auto",
          }}
        >
          {message}
        </div>
      )}
    </div>
  );
}
