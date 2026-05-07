// Pixelated placeholder icons per category. The user plans to replace these
// with custom artwork later — these are rough recognizable silhouettes drawn
// from string-based pixel grids so they render crisp and tint with currentColor.

const ICONS: Record<string, string[]> = {
  Career: [
    "...XXXX...",
    "...X..X...",
    ".XXXXXXXX.",
    ".X..XX..X.",
    ".X..XX..X.",
    ".X......X.",
    ".XXXXXXXX.",
  ],
  Design: [
    "........XX",
    ".......XXX",
    "......XXX.",
    ".....XXX..",
    "....XXX...",
    "...XXX....",
    "..XXX.....",
    ".XX.......",
    "X.........",
  ],
  Dev: [
    "..X....X..",
    ".X......X.",
    "X........X",
    "X........X",
    ".X......X.",
    "..X....X..",
  ],
  Finance: [
    "....X.....",
    "...XXX....",
    "..X.X.....",
    "...XX.....",
    "....X.X...",
    "...XX.....",
    "...XXX....",
    "....X.....",
  ],
  Fitness: [
    "X........X",
    "X........X",
    "XXX....XXX",
    "X.XXXXXX.X",
    "X.XXXXXX.X",
    "XXX....XXX",
    "X........X",
    "X........X",
  ],
  Habits: [
    ".XXXX.....",
    "X....X....",
    "X....X....",
    "X....X....",
    "X....X....",
    ".X..XX....",
    ".XXX..X...",
    "......XX..",
    ".......X..",
  ],
  Health: [
    ".XX.XX....",
    "XXXXXXX...",
    "XXXXXXX...",
    ".XXXXX....",
    "..XXX.....",
    "...X......",
  ],
  Learning: [
    ".XX...XX..",
    "X..XXX..X.",
    "X..X.X..X.",
    "X..X.X..X.",
    "X..X.X..X.",
    ".XXXXXXX..",
  ],
  Other: [
    "...XXXX...",
    "..XXXXXX..",
    ".XXXXXXXX.",
    ".XXXXXXXX.",
    "..XXXXXX..",
    "...XXXX...",
  ],
  Personal: [
    "...XXXX...",
    "...XXXX...",
    "..XXXXXX..",
    ".XXXXXXXX.",
    ".XX.XX.XX.",
    "....XX....",
    "....XX....",
    "...XXXX...",
  ],
  Productivity: [
    ".....XXX..",
    "....XXX...",
    "...XXX....",
    "..XXXXXX..",
    "......XXX.",
    ".....XXX..",
    "....XXX...",
    "...XX.....",
  ],
  Study: [
    "....X.....",
    "XXXXXXXXXX",
    ".XXXXXXXX.",
    "..X....X..",
    "..X....X..",
    "...XXXX...",
  ],
  Work: [
    "..X....XXX",
    "XXXXX..XXX",
    "XXXXX..XXX",
    "XXXXXXXXXX",
    "X.X.X.X.X.",
    "XXXXXXXXXX",
    "X.X.X.X.X.",
    "XXXXXXXXXX",
  ],
};

type Props = {
  category: string;
  size?: number;
  color?: string;
};

export function CategoryIcon({ category, size = 12, color = "currentColor" }: Props) {
  const pixels = ICONS[category];
  if (!pixels) {
    // Fallback: small dot
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
