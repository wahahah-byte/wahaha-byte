"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  active: boolean;
  // Points awarded for this submission. Drives the "+N" popup that floats out
  // of the balance chip. Omit (or pass 0) to skip the popup.
  amount?: number;
}

// How long the effect should keep rendering after being triggered. Must
// outlast the longest CSS animation defined in globals.css:
//   underline-fade: 1.8s (no delay)
//   popup-fade:     0.3s delay + 1.45s = 1.75s
// 1900ms gives a ~100ms safety pad so the final opacity-0 keyframe is held
// briefly before unmount — otherwise React rips the popup out the instant
// the animation's last frame fires and the eye sees it pop instead of fade.
const PLAY_DURATION_MS = 1900;

// Ledger-stamp variant of the submit animation. The original coin-burst
// fired nine projectiles toward the balance counter — gimmicky in rapid
// banking. Subsequent iterations went too loud, too jittery, too snappy;
// this pass is the quiet read: a 1px green underline drifts L→R across the
// row's bottom edge and lifts off as it fades, while a "+N" popup glides
// up out of the balance chip and tapers to 0 simultaneously. Total run is
// ~1.85s end-to-end with linear-easing fades so nothing snaps shut.
//
// Lifetime: the parent (useTaskSubmission) flips `active` back to false at
// ~900ms — well before our animations finish. To stop React from unmounting
// the popup mid-fade, we keep our own `playing` state that latches true on
// active→true, then clears on a timer matched to the animation length.
// `active` is effectively a one-shot trigger, not a render gate.
export default function BankBurstEffect({ active, amount = 0 }: Props) {
  const [playing, setPlaying] = useState(false);
  const [balanceCenter, setBalanceCenter] = useState<{ x: number; y: number } | null>(null);
  // Captured `amount` from the trigger so re-renders during the play window
  // don't show "+0" if the parent has already cleared its point state.
  const [snapshotAmount, setSnapshotAmount] = useState(0);
  // Holds the pending cleanup timer + the chip we attached the glow class
  // to, so a re-trigger inside the play window can cancel the previous
  // cleanup and replay cleanly instead of yanking the glow mid-pulse.
  const stopTimerRef = useRef<number | null>(null);
  const glowTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Re-trigger: cancel any in-flight cleanup first so a previous run
    // doesn't strip the glow class out from under the new run.
    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
      glowTargetRef.current?.classList.remove("bank-stamp-glow");
    }

    // The balance chip only renders for authenticated users (see
    // AuthHeader's early-return on !hasToken). On the static demo / GitHub
    // Pages, querySelector returns null — we still want the row underline
    // to play, just without the balance glow + +N popup attached to a
    // non-existent target. Earlier code bailed here on null and the entire
    // animation went unrendered.
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

  // Final unmount cleanup — yanks any pending timer + lingering glow so a
  // navigation away during the play window doesn't leak the class.
  useEffect(() => () => {
    if (stopTimerRef.current !== null) {
      window.clearTimeout(stopTimerRef.current);
    }
    glowTargetRef.current?.classList.remove("bank-stamp-glow");
  }, []);

  if (!playing) return null;

  return (
    <>
      {/* Row underline — 1px success-coloured bar pinned to the row's
          bottom edge, glides L→R then drifts up + fades. The host TaskRow
          wraps this component in a position:relative container, so inset
          works against the row. */}
      <div
        aria-hidden
        className="bank-stamp-underline"
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 1,
          // Full success colour as the source; intensity is controlled by
          // the bank-stamp-underline-fade keyframes (peak 0.55) so layering
          // a low-alpha rgba on top would make the bar disappear entirely.
          // Halo stays small + soft to bleed rather than glow.
          background: "var(--color-success)",
          boxShadow: "0 0 3px rgba(74, 222, 128, 0.22)",
          pointerEvents: "none",
          zIndex: 28,
        }}
      />

      {/* +N popup — portaled to body so it floats above sidebars/headers.
          Skipped when the snapshotted amount is 0 so an undo-then-redo
          flow with stale state doesn't render a "+0". */}
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
              // Brand green stays so the text is legible; the
              // bank-stamp-popup-fade keyframes peak at 0.7 so the +N reads
              // as a soft drift rather than a bright pop.
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
