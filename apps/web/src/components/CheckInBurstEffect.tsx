"use client";

import { useEffect, useState } from "react";

const PARTICLE_COUNT = 12;

interface Particle {
  dx: number;
  dy: number;
  size: number;
  delay: number;
  color: string;
  rot: number;
}

function buildParticles(): Particle[] {
  const cols = ["var(--color-active-highlight-alt)", "var(--color-success)", "var(--color-warning)"];
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    // Spray upward in a wide cone for visible burst on a row.
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * (Math.PI * 0.95);
    const dist = 36 + Math.random() * 28;
    return {
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist,
      size: i % 3 === 0 ? 4 : 3,
      delay: Math.floor(Math.random() * 60),
      color: cols[i % cols.length],
      rot: (Math.random() - 0.5) * 90,
    };
  });
}

interface Props {
  active: boolean;
}

// Small confetti burst rendered absolutely inside its parent. Parent should be
// position:relative; the burst originates from its center-bottom area, which
// reads as "rising from the row" when placed on a TaskRow.
export default function CheckInBurstEffect({ active }: Props) {
  const [particles, setParticles] = useState<Particle[] | null>(null);

  useEffect(() => {
    if (!active) {
      setParticles(null);
      return;
    }
    setParticles(buildParticles());
    const t = setTimeout(() => setParticles(null), 900);
    return () => clearTimeout(t);
  }, [active]);

  if (!particles) return null;

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "visible",
        zIndex: 27,
      }}
    >
      {particles.map((p, i) => (
        <span
          key={i}
          className="checkin-particle"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            marginLeft: -p.size / 2,
            marginTop: -p.size / 2,
            width: p.size,
            height: p.size,
            background: p.color,
            ["--p-end" as string]: `translate(${Math.round(p.dx)}px, ${Math.round(p.dy)}px) rotate(${Math.round(p.rot * 2)}deg) scale(0.4)`,
            animationDelay: `${p.delay}ms`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
