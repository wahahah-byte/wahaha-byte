"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { TierUpMessage } from "@wahaha/shared";

// Re-export so existing `from "@/components/TierUpBanner"` imports keep working.
export { currentStreakTier, tierForStreak } from "@wahaha/shared";
export type { TierUpMessage } from "@wahaha/shared";

interface Props {
  // Setting `key` of this prop to a unique value each time triggers a re-mount.
  // Pass null to render nothing.
  message: TierUpMessage | null;
  onDone?: () => void;
}

const VISIBLE_MS = 2200;

export default function TierUpBanner({ message, onDone }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => onDone?.(), VISIBLE_MS);
    return () => clearTimeout(t);
  }, [message, onDone]);

  if (!mounted || !message) return null;

  return createPortal(
    <div
      key={message.id}
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: "calc(env(safe-area-inset-top, 0px) + 18px)",
        left: "50%",
        zIndex: 9000,
        pointerEvents: "none",
        animation: "tier-banner-in 2.2s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        background: "var(--color-active-highlight-alt-bg, rgba(91,184,224,0.12))",
        border: "1px solid var(--color-active-highlight-alt)",
        borderRadius: 999,
        padding: "8px 16px",
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
        backdropFilter: "blur(6px)",
      }}
    >
      <span aria-hidden style={{ fontSize: 16, lineHeight: 1 }}>🔥</span>
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 700,
          color: "var(--color-active-highlight-alt)",
          whiteSpace: "nowrap",
        }}
      >
        {message.tierLabel} · {message.multiplier} unlocked
      </span>
    </div>,
    document.body,
  );
}

