"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface ToastContextValue {
  error: string | null;
  animKey: number;
  setError: (msg: string | null) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 5100;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [error, setErrorState] = useState<string | null>(null);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setError = useCallback((msg: string | null) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setErrorState(msg);
    if (msg) {
      setAnimKey((k) => k + 1);
      timerRef.current = setTimeout(() => {
        setErrorState(null);
        timerRef.current = null;
      }, AUTO_DISMISS_MS);
    }
  }, []);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <ToastContext.Provider value={{ error, animKey, setError }}>
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
  const { error, animKey } = useToast();
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
      {error && (
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
            color: "var(--color-danger)",
            border: "1px solid rgba(239,68,68,0.35)",
            borderRadius: 6,
            padding: "10px 14px",
            boxShadow: "var(--shadow-popover)",
            pointerEvents: "auto",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}
