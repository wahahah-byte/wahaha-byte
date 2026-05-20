"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  active: boolean;
  // Points awarded; drives the "+N" popup. Omit/0 to skip the popup.
  amount?: number;
}

// Total play duration outlasting all CSS animations with a small safety pad.
const PLAY_DURATION_MS = 1900;

// Ledger-stamp variant of the submit animation; quiet 1px underline + "+N" popup.
export default function BankBurstEffect({ active, amount = 0 }: Props) {
  const [playing, setPlaying] = useState(false);
  const [balanceCenter, setBalanceCenter] = useState<{ x: number; y: number } | null>(null);
  // Captured amount so mid-play parent state changes don't show "+0".
  const [snapshotAmount, setSnapshotAmount] = useState(0);
  // Refs for cleanup so a re-trigger can cancel + replay cleanly.
  const stopTimerRef = useRef<number | null>(null);
  const glowTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Cancel any in-flight cleanup so re-trigger doesn't strip glow class.
    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
      glowTargetRef.current?.classList.remove("bank-stamp-glow");
    }

    // Balance chip absent for unauth (demo); still play underline solo.
    const target = document.querySelector('[data-coin-target="balance"]') as HTMLElement | null;
    if (target) {
      const rect = target.getBoundingClientRect();
      setBalanceCenter({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      target.classList.add("bank-stamp-glow");
      glowTargetRef.current = target;
    } else {
      setBalanceCenter(null);
      glowTargetRef.current = null;
    }

    setSnapshotAmount(amount);
    setPlaying(true);

    stopTimerRef.current = window.setTimeout(() => {
      setPlaying(false);
      setBalanceCenter(null);
      glowTargetRef.current?.classList.remove("bank-stamp-glow");
      stopTimerRef.current = null;
      glowTargetRef.current = null;
    }, PLAY_DURATION_MS);
  }, [active, amount]);

  // Final unmount cleanup for pending timer + lingering glow.
  useEffect(() => () => {
    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
    }
    glowTargetRef.current?.classList.remove("bank-stamp-glow");
  }, []);

  if (!playing) return null;

  return (
    <>
      {/* Row underline L→R then drifts up and fades */}
      <div
        aria-hidden
        className="bank-stamp-underline"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 1,
          // Full success colour; keyframes drive opacity.
          background: "var(--color-success)",
          boxShadow: "0 0 3px rgba(74, 222, 128, 0.22)",
          pointerEvents: "none",
          zIndex: 28,
        }}
      />

      {/* +N popup portaled to body; skipped when snapshot is 0 */}
      {balanceCenter && snapshotAmount > 0 && typeof document !== "undefined" &&
        createPortal(
          <div
            aria-hidden
            className="bank-stamp-popup"
            style={{
              position: "fixed",
              left: balanceCenter.x,
              top: balanceCenter.y,
              pointerEvents: "none",
              zIndex: 9999,
              // Brand green; keyframes peak at 0.7 for a soft drift.
              color: "var(--color-success)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.05em",
              whiteSpace: "nowrap",
              textShadow: "0 0 4px rgba(74, 222, 128, 0.22)",
            }}
          >
            +{snapshotAmount.toLocaleString()}
          </div>,
          document.body
        )}
    </>
  );
}
