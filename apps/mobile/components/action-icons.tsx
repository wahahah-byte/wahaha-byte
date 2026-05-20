import Svg, { Line, Path, Polyline, Polygon, Rect } from "react-native-svg";

// Action icons ported from web TaskRow — identical paths/strokes.

export function CheckIcon({ color }: { color: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 10 10" fill="none">
      <Polyline
        points="1,5 4,8 9,2"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function ArchiveIcon({ color }: { color: string }) {
  return (
    <Svg width={12} height={12} viewBox="0 0 10 10" fill="none">
      <Rect x={1} y={1.5} width={8} height={2} stroke={color} strokeWidth={1} fill="none" />
      <Path d="M2 3.5V8.5H8V3.5" stroke={color} strokeWidth={1} strokeLinejoin="round" fill="none" />
      <Line x1={4} y1={5.5} x2={6} y2={5.5} stroke={color} strokeWidth={1} strokeLinecap="round" />
    </Svg>
  );
}

export function UnarchiveIcon({ color }: { color: string }) {
  return (
    <Svg width={12} height={12} viewBox="0 0 10 10" fill="none">
      <Rect x={1} y={6.5} width={8} height={2} stroke={color} strokeWidth={1} fill="none" />
      <Path d="M2 6.5V1.5H8V6.5" stroke={color} strokeWidth={1} strokeLinejoin="round" fill="none" />
      <Polyline
        points="3.5,4 5,2.5 6.5,4"
        stroke={color}
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function StartIcon({ color }: { color: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 10 10" fill="none">
      <Polygon points="2.5,1.5 8.5,5 2.5,8.5" fill={color} />
    </Svg>
  );
}

export function PauseIcon({ color }: { color: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 10 10" fill="none">
      <Rect x={2.5} y={1.5} width={1.6} height={7} fill={color} />
      <Rect x={5.9} y={1.5} width={1.6} height={7} fill={color} />
    </Svg>
  );
}

export function UndoIcon({ color }: { color: string }) {
  return (
    <Svg width={12} height={12} viewBox="0 0 10 10" fill="none">
      <Path
        d="M2 4 A3 3 0 1 1 5 8"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        fill="none"
      />
      <Polyline
        points="0.8,2.5 2,4 3.5,2.8"
        stroke={color}
        strokeWidth={1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

export function DeleteIcon({ color }: { color: string }) {
  return (
    <Svg width={12} height={12} viewBox="0 0 10 10" fill="none">
      <Path d="M3.8 2V1.3h2.4V2" stroke={color} strokeWidth={0.9} strokeLinecap="round" fill="none" />
      <Line x1={1.3} y1={2.5} x2={8.7} y2={2.5} stroke={color} strokeWidth={1} strokeLinecap="round" />
      <Path
        d="M2.6 3L3.1 8.5h3.8L7.4 3"
        stroke={color}
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <Line x1={4.2} y1={4.5} x2={4.2} y2={7.5} stroke={color} strokeWidth={0.7} strokeLinecap="round" />
      <Line x1={5.8} y1={4.5} x2={5.8} y2={7.5} stroke={color} strokeWidth={0.7} strokeLinecap="round" />
    </Svg>
  );
}
