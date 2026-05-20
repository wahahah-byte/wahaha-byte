import { Image } from "react-native";
import Svg, { Rect } from "react-native-svg";

// Mirrors web categoryIcons: PNG preferred, pixel-grid SVG fallback.
// PNG asset map — filenames don't always match category name (e.g. Learning ↔ Learn.png).
const ICON_PNG: Record<string, number> = {
  Career: require("../assets/icons/Careers.png"),
  Design: require("../assets/icons/Design.png"),
  Dev: require("../assets/icons/dev.png"),
  Finance: require("../assets/icons/Finance.png"),
  Fitness: require("../assets/icons/Fitness.png"),
  Habits: require("../assets/icons/Habits.png"),
  Health: require("../assets/icons/Health.png"),
  Learning: require("../assets/icons/Learn.png"),
  Personal: require("../assets/icons/Personal.png"),
  Productivity: require("../assets/icons/Productivity.png"),
  Study: require("../assets/icons/Study.png"),
  Work: require("../assets/icons/Work.png"),
};
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

interface Props {
  category: string;
  size?: number;
  color?: string;
}

export function CategoryIcon({ category, size = 12, color = "currentColor" }: Props) {
  const png = ICON_PNG[category];
  if (png !== undefined) {
    return (
      <Image
        source={png}
        style={{ width: size, height: size }}
        resizeMode="contain"
      />
    );
  }
  const pixels = ICONS[category];
  if (!pixels) {
    return (
      <Svg width={size} height={size} viewBox="0 0 10 10">
        <Rect x={4} y={4} width={2} height={2} fill={color} />
      </Svg>
    );
  }
  const h = pixels.length;
  const w = pixels[0]?.length ?? 10;
  const cells: React.ReactElement[] = [];
  pixels.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== ".") {
        cells.push(<Rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={color} />);
      }
    }
  });
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
      {cells}
    </Svg>
  );
}
