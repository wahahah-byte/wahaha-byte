"use client";

import { useEffect, useRef } from "react";

function rng(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

interface ShardDef { clip: string; ox: string; oy: string; tx: number; ty: number; rot: number; d: number; }

function buildShards(): ShardDef[] {
  const COLS = 32, ROWS = 16;
  const cw = 100 / COLS;
  const ch = 100 / ROWS;

  const pts: [number, number][][] = [];
  for (let r = 0; r <= ROWS; r++) {
    const row: [number, number][] = [];
    for (let c = 0; c <= COLS; c++) {
      const bx = (c / COLS) * 100;
      const by = (r / ROWS) * 100;
      const edge = r === 0 || r === ROWS || c === 0 || c === COLS;
      const seed = r * 200 + c;
      row.push([
        bx + (edge ? 0 : (rng(seed)      - 0.5) * cw * 0.78),
        by + (edge ? 0 : (rng(seed + 100) - 0.5) * ch * 0.78),
      ]);
    }
    pts.push(row);
  }

  const shards: ShardDef[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const [x0, y0] = pts[r][c];
      const [x1, y1] = pts[r][c + 1];
      const [x2, y2] = pts[r + 1][c + 1];
      const [x3, y3] = pts[r + 1][c];

      const cx = (x0 + x1 + x2 + x3) / 4;
      const cy = (y0 + y1 + y2 + y3) / 4;

      const dx = cx - 50, dy = cy - 50;
      const dist = Math.sqrt(dx * dx + dy * dy) + 0.01;
      const speed = 30 + dist * 0.7;
      const tx  = Math.round((dx / dist) * speed * 0.3 + 55 + rng(r * 7 + c) * 50);
      const ty  = Math.round((dy / dist) * speed * 0.4 - 10 - rng(r * 11 + c * 3) * 18);
      const rot = Math.round((rng(r * 13 + c * 7 + 1) - 0.5) * 60);
      const d   = Math.floor(rng(r * 17 + c * 11 + 3) * 40);

      const f = (n: number) => n.toFixed(1);
      shards.push({
        clip: `${f(x0)}% ${f(y0)}%,${f(x1)}% ${f(y1)}%,${f(x2)}% ${f(y2)}%,${f(x3)}% ${f(y3)}%`,
        ox: `${f(cx)}%`, oy: `${f(cy)}%`,
        tx, ty, rot, d,
      });
    }
  }
  return shards;
}

const SHARDS = buildShards();

const DUST = Array.from({ length: 250 }, (_, i) => {
  const tx  = 65  + (i * 17)  % 115;           // 65–180px rightward
  const ty  = -8  - (i * 7)   % 28;            // -8 to -36px upward
  const mx  = Math.round(tx * 0.38);           // arc mid x
  const my  = Math.round(ty * 0.55 - (i % 3 === 0 ? 6 : 2)); // arc mid y, slight lift
  return {
    x:  1  + (i * 19 + i * i * 3) % 96,
    y:  2  + (i * 13 + 5)         % 94,
    tx, ty, mx, my,
    r:  i % 7 === 0 ? 3 : i % 4 === 0 ? 2 : i % 3 === 0 ? 1.5 : 1,
    d:  0  + (i * 23)             % 150,
  };
});

export default function ShatterEffect({ active }: { active: boolean }) {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const el = document.createElement("style");
    let css = "";

    SHARDS.forEach((s, i) => {
      css += `@keyframes sx${i}{
        0%  {transform:translate(0,0)rotate(0deg);opacity:.88;}
        35% {opacity:.55;}
        100%{transform:translate(${s.tx}px,${s.ty}px)rotate(${s.rot}deg);opacity:0;}
      }`;
    });

    DUST.forEach((p, i) => {
      css += `@keyframes dx${i}{
        0%  {opacity:.85;transform:translate(0,0);}
        38% {opacity:.55;transform:translate(${p.mx}px,${p.my}px);}
        100%{opacity:0;  transform:translate(${p.tx}px,${p.ty}px);}
      }`;
    });

    el.textContent = css;
    document.head.appendChild(el);
    styleRef.current = el;
    return () => {
      if (styleRef.current) { document.head.removeChild(styleRef.current); styleRef.current = null; }
    };
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 30, pointerEvents: "none", overflow: "hidden" }}>
      {SHARDS.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            inset: 0,
            clipPath: `polygon(${s.clip})`,
            background: "rgba(190,228,248,0.22)",
            boxShadow: "inset 0 0 0 0.6px rgba(220,245,255,0.6)",
            transformOrigin: `${s.ox} ${s.oy}`,
            animation: `sx${i} 0.52s cubic-bezier(0.2,0,0.55,1) ${s.d}ms forwards`,
          }}
        />
      ))}

      {DUST.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top:  `${p.y}%`,
            width:  `${p.r}px`,
            height: `${p.r}px`,
            borderRadius: "50%",
            background: "rgba(210,238,252,0.9)",
            boxShadow: "0 0 3px rgba(180,220,248,0.7)",
            opacity: 0,
            animation: `dx${i} 0.62s cubic-bezier(0.2,0,0.55,1) ${p.d}ms forwards`,
          }}
        />
      ))}
    </div>
  );
}
