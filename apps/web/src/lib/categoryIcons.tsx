// Pixelated placeholder icons per category; PNG icons in /public/icons take precedence.

import { assetPath } from "./assetPath";

// 10×10 grid; strokes are 2 pixels wide so nothing disappears at small sizes.
const ICONS: Record<string, string[]> = {
  Career: [
    "..........",
    "...XXXX...",
    "...XXXX...",
    ".XXXXXXXX.",
    ".XXXXXXXX.",
    ".XX....XX.",
    ".XX....XX.",
    ".XXXXXXXX.",
    ".XXXXXXXX.",
    "..........",
  ],
  Design: [
    "........XX",
    ".......XXX",
    "......XXX.",
    ".....XXX..",
    "....XXX...",
    "...XXX....",
    "..XXX.....",
    ".XXXX.....",
    "XXX.......",
    "XX........",
  ],
  Dev: [
    "..........",
    "....XX..XX",
    "...XX..XX.",
    "..XX..XX..",
    ".XX..XX...",
    "..XX..XX..",
    "...XX..XX.",
    "....XX..XX",
    "..........",
    "..........",
  ],
  Finance: [
    "..........",
    "..XXXXXX..",
    ".XX....XX.",
    "..XXXXXX..",
    ".XX....XX.",
    "..XXXXXX..",
    ".XX....XX.",
    "..XXXXXX..",
    ".XX....XX.",
    "..XXXXXX..",
  ],
  Fitness: [
    "..........",
    "XXX....XXX",
    "XXX....XXX",
    "XXXXXXXXXX",
    "XXXXXXXXXX",
    "XXXXXXXXXX",
    "XXXXXXXXXX",
    "XXX....XXX",
    "XXX....XXX",
    "..........",
  ],
  Habits: [
    "..XXXXXX..",
    ".XXXXXXXX.",
    "XX..XX..XX",
    "XX.XXXX.XX",
    "XXXXXXXXXX",
    "XXXXXXXXXX",
    "XX.XXXX.XX",
    "XX..XX..XX",
    ".XXXXXXXX.",
    "..XXXXXX..",
  ],
  Health: [
    "..........",
    "...XXXX...",
    "...XXXX...",
    "...XXXX...",
    "XXXXXXXXXX",
    "XXXXXXXXXX",
    "...XXXX...",
    "...XXXX...",
    "...XXXX...",
    "..........",
  ],
  Learning: [
    "..........",
    "....XX....",
    "...XXXX...",
    "..XXXXXX..",
    ".XXXXXXXX.",
    "XXXXXXXXXX",
    "....XX....",
    ".XXXXXXXX.",
    ".XXXXXXXX.",
    "..........",
  ],
  Other: [
    "..........",
    "..........",
    "..........",
    "..XX..XX..",
    "..XX..XX..",
    "..XX..XX..",
    "..XX..XX..",
    "..........",
    "..........",
    "..........",
  ],
  Personal: [
    "..........",
    "...XXXX...",
    "..XXXXXX..",
    "..XXXXXX..",
    "...XXXX...",
    "..XXXXXX..",
    ".XXXXXXXX.",
    "XXX.XX.XXX",
    "....XX....",
    "...XXXX...",
  ],
  Productivity: [
    ".....XXXX.",
    "....XXXX..",
    "...XXXX...",
    "..XXXX....",
    ".XXXXXXXX.",
    "....XXXX..",
    "...XXXX...",
    "..XXXX....",
    ".XXXX.....",
    ".XXX......",
  ],
  Study: [
    "..XXXXXX..",
    ".XXXXXXXX.",
    ".XX....XX.",
    ".XX.XX.XX.",
    ".XX....XX.",
    ".XX.XX.XX.",
    ".XX....XX.",
    ".XX.XX.XX.",
    ".XXXXXXXX.",
    "..XXXXXX..",
  ],
  Work: [
    "..XXXXXX..",
    ".XXXXXXXX.",
    "XXXXXXXXXX",
    "XXXXXXXXXX",
    ".XXXXXXXX.",
    "....XX....",
    "....XX....",
    "....XX....",
    "....XX....",
    "...XXXX...",
  ],
};

// PNG assets in /public/icons; filenames don't always match category name verbatim.
const ICON_PATHS: Record<string, string> = {
  Career: "/icons/Careers.png",
  Design: "/icons/Design.png",
  Dev: "/icons/dev.png",
  Finance: "/icons/Finance.png",
  Fitness: "/icons/Fitness.png",
  Habits: "/icons/Habits.png",
  Health: "/icons/Health.png",
  Learning: "/icons/Learn.png",
  Personal: "/icons/Personal.png",
  Productivity: "/icons/Productivity.png",
  Study: "/icons/Study.png",
  Work: "/icons/Work.png",
};

type Props = {
  category: string;
  size?: number;
  // Only applies to the pixel-grid fallback; PNG icons keep baked-in colors.
  color?: string;
};

export function CategoryIcon({ category, size = 12, color = "currentColor" }: Props) {
  const src = ICON_PATHS[category];
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        // Route through assetPath() so static builds get correct prefix.
        src={assetPath(src)}
        alt=""
        width={size}
        height={size}
        style={{
          display: "inline-block",
          objectFit: "contain",
          background: "transparent",
        }}
      />
    );
  }

  const pixels = ICONS[category];
  if (!pixels) {
    // Fallback: small dot.
    return (
      <svg width={size} height={size} viewBox="0 0 10 10" fill="none" shapeRendering="crispEdges">
        <rect x="4" y="4" width="2" height="2" fill={color} />
      </svg>
    );
  }

  const h = pixels.length;
  const w = pixels[0]?.length ?? 10;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${w} ${h}`}
      fill="none"
      shapeRendering="crispEdges"
      preserveAspectRatio="xMidYMid meet"
    >
      {pixels.flatMap((row, y) =>
        Array.from(row).map((char, x) =>
          char !== "." ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={color} />
          ) : null
        )
      )}
    </svg>
  );
}
