"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const COIN_COUNT = 9;

interface CoinDef {
  spawnSpread: number;
  rot: number;
  delay: number;
  arcLift: number;
}

const COINS: CoinDef[] = Array.from({ length: COIN_COUNT }, (_, i) => {
  const center = (COIN_COUNT - 1) / 2;
  const offset = i - center;
  return {
    spawnSpread: Math.round(offset * 5 + (i % 2 === 0 ? 3 : -3)),
    rot: i % 2 === 0 ? 540 : -540,
    delay: i * 22,
    arcLift: 32 + Math.abs(offset) * 6,
  };
});

interface Anchor {
  spawnX: number;
  spawnY: number;
  dx: number;
  dy: number;
  uid: string;
}

export default function BankBurstEffect({ active }: { active: boolean }) {
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);

  useEffect(() => {
    if (!active) {
      setAnchor(null);
      return;
    }

    const trigger = triggerRef.current;
    if (!trigger) return;

    const tr = trigger.getBoundingClientRect();
    const spawnX = tr.left + tr.width / 2;
    const spawnY = tr.top + tr.height / 2;

    const target = document.querySelector('[data-coin-target="balance"]') as HTMLElement | null;
    let dx = 0;
    let dy = -180;
    if (target) {
      const targRect = target.getBoundingClientRect();
      dx = targRect.left + targRect.width / 2 - spawnX;
      dy = targRect.top + targRect.height / 2 - spawnY;
    }

    const uid = `bb${Math.random().toString(36).slice(2, 8)}`;

    const el = document.createElement("style");
    let css = `@keyframes ${uid}-flash {
      0%   { opacity: 0; }
      20%  { opacity: 0.18; }
      100% { opacity: 0; }
    }`;

    COINS.forEach((c, i) => {
      const finalDX = dx - c.spawnSpread;
      const finalDY = dy;
      const arcMidX = finalDX * 0.55;
      const arcMidY = finalDY * 0.55 - c.arcLift;
      const liftY = -10 - Math.abs(c.spawnSpread) * 0.2;

      css += `@keyframes ${uid}-coin${i} {
        0%   { transform: translate(0, 0) rotate(0deg) scale(1); opacity: 0; }
        8%   { transform: translate(${Math.round(c.spawnSpread * 0.2)}px, ${Math.round(liftY)}px) rotate(${Math.round(c.rot * 0.04)}deg) scale(1.05); opacity: 1; }
        55%  { transform: translate(${Math.round(arcMidX)}px, ${Math.round(arcMidY)}px) rotate(${Math.round(c.rot * 0.55)}deg) scale(0.85); opacity: 1; }
        92%  { opacity: 0.85; }
        100% { transform: translate(${Math.round(finalDX)}px, ${Math.round(finalDY)}px) rotate(${c.rot}deg) scale(0.2); opacity: 0; }
      }`;
    });

    el.textContent = css;
    document.head.appendChild(el);
    styleRef.current = el;

    setAnchor({ spawnX, spawnY, dx, dy, uid });

    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
        styleRef.current = null;
      }
    };
  }, [active]);

  return (
    <>
      <div ref={triggerRef} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {active && anchor && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 28,
              pointerEvents: "none",
              background: "var(--color-success)",
              opacity: 0,
              animation: `${anchor.uid}-flash 0.45s ease-out forwards`,
            }}
          />
        )}
      </div>

      {active && anchor && typeof document !== "undefined" &&
        createPortal(
          <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }}>
            {COINS.map((c, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${anchor.spawnX + c.spawnSpread}px`,
                  top: `${anchor.spawnY}px`,
                  marginLeft: "-5px",
                  marginTop: "-6px",
                  opacity: 0,
                  willChange: "transform, opacity",
                  animation: `${anchor.uid}-coin${i} 0.78s cubic-bezier(0.42, 0, 0.6, 1) ${c.delay}ms forwards`,
                }}
              >
                <svg width="11" height="13" viewBox="0 0 10 12" fill="none" shapeRendering="crispEdges">
                  <path
                    d="M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z"
                    style={{ fill: "var(--color-warning)" }}
                  />
                  <rect
                    x="4"
                    y="5"
                    width="2"
                    height="2"
                    style={{ fill: "var(--color-bg)" }}
                    opacity="0.4"
                  />
                </svg>
              </div>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
