"use client";

import { useCallback, useRef, useState } from "react";

interface Props {
  label?: string;
  disabled?: boolean;
  onConfirm: () => void;
}

const COMMIT_FRACTION = 0.78;     // need to drag this far across to commit
const SPRING_BACK_MS = 260;
const COMMIT_GLIDE_MS = 320;       // ease-into-end after threshold crossed
const DRAG_SMOOTH_MS = 80;         // tiny transition during drag — kills jitter without feeling laggy
const COMMIT_FIRE_DELAY = COMMIT_GLIDE_MS - 40; // fire onConfirm just before the glide settles
const THUMB_SIZE = 48;
const TRACK_HEIGHT = 52;
const TRACK_PAD = 2;              // inner padding so thumb doesn't touch the rim

type Phase = "idle" | "dragging" | "committing" | "springing";

export default function SlideToCheckIn({ label = "Slide to check in", disabled, onConfirm }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; max: number } | null>(null);
  const [offset, setOffset] = useState(0);
  const [committed, setCommitted] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");

  function maxOffset(): number {
    const w = trackRef.current?.clientWidth ?? 0;
    return Math.max(0, w - THUMB_SIZE - TRACK_PAD * 2);
  }

  const startDrag = useCallback((clientX: number) => {
    if (disabled || committed) return;
    const max = maxOffset();
    if (max <= 0) return;
    dragRef.current = { startX: clientX, max };
    setPhase("dragging");
  }, [disabled, committed]);

  const moveDrag = useCallback((clientX: number) => {
    const d = dragRef.current;
    if (!d) return;
    const next = Math.max(0, Math.min(d.max, clientX - d.startX));
    setOffset(next);
    if (next / d.max >= COMMIT_FRACTION) {
      // Commit — glide smoothly to the end instead of snapping.
      dragRef.current = null;
      setPhase("committing");
      setOffset(d.max);
      setCommitted(true);
      setTimeout(onConfirm, COMMIT_FIRE_DELAY);
    }
  }, [onConfirm]);

  const endDrag = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setPhase("springing");
    setOffset(0);
    setTimeout(() => setPhase("idle"), SPRING_BACK_MS);
  }, []);

  // Mouse handlers (desktop / hybrid devices).
  const onMouseMove = useCallback((e: MouseEvent) => moveDrag(e.clientX), [moveDrag]);
  const onMouseUp = useCallback(() => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    endDrag();
  }, [onMouseMove, endDrag]);

  // Fade the label as the thumb advances; cap progress at 1.
  const max = maxOffset();
  const progress = max > 0 ? offset / max : 0;
  const labelOpacity = committed ? 0 : Math.max(0, 1 - progress * 1.4);

  // Per-phase easing — each transition models a different physical feel:
  //  - dragging: 80ms light low-pass that smooths input jitter without obvious lag
  //  - committing: 320ms slow-out so crossing the threshold glides into the end
  //  - springing: 260ms back-ease for a soft return when released early
  //  - idle: no transition (thumb pinned at 0)
  const thumbTransition =
    phase === "dragging"   ? `transform ${DRAG_SMOOTH_MS}ms cubic-bezier(0.18, 0.7, 0.4, 1)`
  : phase === "committing" ? `transform ${COMMIT_GLIDE_MS}ms cubic-bezier(0.22, 0.85, 0.3, 1)`
  : phase === "springing"  ? `transform ${SPRING_BACK_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
  : "none";

  const labelTransition =
    phase === "springing" ? "opacity 0.22s ease-out"
  : phase === "dragging"  ? `opacity ${DRAG_SMOOTH_MS}ms linear`
  : "opacity 0.18s ease-out";

  return (
    <div
      ref={trackRef}
      role="button"
      aria-disabled={disabled || committed}
      aria-label={label}
      onTouchStart={(e) => startDrag(e.touches[0].clientX)}
      onTouchMove={(e) => { if (dragRef.current) moveDrag(e.touches[0].clientX); }}
      onTouchEnd={endDrag}
      onTouchCancel={endDrag}
      onMouseDown={(e) => {
        e.preventDefault();
        startDrag(e.clientX);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);
      }}
      style={{
        position: "relative",
        width: "100%",
        height: TRACK_HEIGHT,
        borderRadius: 999,
        background: "var(--color-input)",
        border: "1px solid var(--color-border-hairline)",
        overflow: "hidden",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "grab",
        userSelect: "none",
        touchAction: "pan-y",
      }}
    >
      {/* Centered hint label — fades out as the thumb moves */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 600,
          color: "var(--color-fg-muted)",
          opacity: labelOpacity,
          transition: labelTransition,
          paddingLeft: THUMB_SIZE / 2,
        }}
      >
        {label}
      </span>

      {/* Thumb — layered gradient + inset highlights for a glossy 3D pill */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: TRACK_PAD,
          top: TRACK_PAD,
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          borderRadius: 999,
          background:
            "linear-gradient(180deg, " +
              "color-mix(in srgb, var(--color-active-highlight-alt) 78%, white) 0%, " +
              "var(--color-active-highlight-alt) 52%, " +
              "color-mix(in srgb, var(--color-active-highlight-alt) 84%, black) 100%)",
          color: "var(--color-on-active-highlight-alt)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${offset}px)`,
          transition: thumbTransition,
          boxShadow: [
            "inset 0 1.5px 0.5px rgba(255, 255, 255, 0.55)",   // top sheen
            "inset 0 -1.5px 0.5px rgba(0, 0, 0, 0.22)",        // bottom shading
            "inset 0 0 0 1px rgba(0, 0, 0, 0.10)",             // crisp rim
            "0 4px 10px rgba(0, 0, 0, 0.32)",                  // primary lift
            "0 1px 2px rgba(0, 0, 0, 0.22)",                   // contact shadow
          ].join(", "),
          willChange: "transform",
        }}
      >
        {committed ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <polyline points="3,8 7,12 13,4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="3.5" y1="8" x2="11.5" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <polyline points="8,4.5 12,8 8,11.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )}
      </div>
    </div>
  );
}
