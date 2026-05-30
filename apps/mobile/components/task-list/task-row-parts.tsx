import { View } from "react-native";
import Svg, { Circle, Path, Polyline, Rect } from "react-native-svg";

import { isCycleClosed, parseLocalDate, type CheckInCycleDto, type TaskDto } from "@wahaha/shared";
import type { useColors } from "@/hooks/use-colors";
import { styles } from "@/components/task-list/styles";

export function CoinIcon({ overdue }: { overdue?: boolean }) {
  const fill = "rgb(245, 158, 11)";
  return (
    <Svg width={10} height={12} viewBox="0 0 10 12" fill="none">
      <Path
        d="M3 2 H7 V3 H8 V4 H9 V8 H8 V9 H7 V10 H3 V9 H2 V8 H1 V4 H2 V3 H3 Z"
        fill={fill}
        opacity={overdue ? 0.55 : 0.95}
      />
      <Rect x={4} y={5} width={2} height={2} fill="#000" opacity={0.35} />
    </Svg>
  );
}

// Bronze/Silver/Gold as filled medal discs; Diamond swaps to a faceted 4-point gem.
const TIER_FILL: Record<number, string> = {
  1: "#CD7F32",
  2: "#C7C7CD",
  3: "#E5B547",
  4: "#7DD3FC",
};
const TIER_RIM: Record<number, string> = {
  1: "rgba(120,70,25,0.85)",
  2: "rgba(110,110,118,0.85)",
  3: "rgba(150,108,30,0.85)",
  4: "rgba(40,140,180,0.85)",
};

export function TierMedal({ tier }: { tier: number }) {
  const fill = TIER_FILL[tier];
  const rim = TIER_RIM[tier];
  if (tier === 4) {
    return (
      <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
        <Path d="M6 1 L11 6 L6 11 L1 6 Z" fill={fill} stroke={rim} strokeWidth={0.9} strokeLinejoin="round" />
        <Path d="M3 6 L6 3 L9 6" stroke="rgba(255,255,255,0.55)" strokeWidth={0.7} fill="none" strokeLinecap="round" />
        <Path d="M6 3 L6 9" stroke="rgba(255,255,255,0.35)" strokeWidth={0.5} />
      </Svg>
    );
  }
  return (
    <Svg width={12} height={12} viewBox="0 0 12 12" fill="none">
      <Circle cx={6} cy={6} r={5} fill={fill} stroke={rim} strokeWidth={0.9} />
      <Circle cx={6} cy={6} r={2.6} fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={0.7} />
    </Svg>
  );
}

export function dueLabel(dueDate: string | null): string {
  if (!dueDate) return "—";
  return parseLocalDate(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type Bounds = { left: number; top: number; right: number; bottom: number };

// Leading cell: a check-in checkbox for actionable recurring rows, else the priority dot.
export function CheckinLead({
  useCheckinCheckbox,
  item,
  isInProgress,
  isCompleted,
  wasCheckedInToday,
  latestCheckinCycle,
  todayKey,
  canCheckInThisCycle,
  overdueRecurring,
  dot,
  c,
  onBounds,
}: {
  useCheckinCheckbox?: boolean;
  item: TaskDto;
  isInProgress: boolean;
  isCompleted: boolean;
  wasCheckedInToday: boolean;
  latestCheckinCycle: CheckInCycleDto | null;
  todayKey: string;
  canCheckInThisCycle: boolean;
  overdueRecurring: boolean;
  dot: string;
  c: ReturnType<typeof useColors>;
  onBounds: (b: Bounds) => void;
}) {
  if (useCheckinCheckbox && item.isRecurring && !isInProgress && !isCompleted) {
    // Priority-coloured checkbox lead — taps commit/undo via hit-test.
    const checkedThisCycle = wasCheckedInToday || isCycleClosed(item.dueDate, item.lastCheckInDate);
    // Multi-day cadences: lock the box on prior-day check-ins (server only undoes same-day).
    const couldBeTodaysCheckin = wasCheckedInToday
      || (!!latestCheckinCycle
        && latestCheckinCycle.checkInDate.split("T")[0] === todayKey);
    const isCheckedButLocked = checkedThisCycle && !couldBeTodaysCheckin;
    const isActionable = !checkedThisCycle && (canCheckInThisCycle || overdueRecurring);
    const isLocked = (!checkedThisCycle && !isActionable) || isCheckedButLocked;
    return (
      <View
        style={[
          styles.checkinBox,
          {
            borderColor: dot,
            // Opacity rather than colour mix (rgba).
            opacity: isLocked ? 0.35 : 1,
          },
        ]}
        // Record bounds in row coord space for hit-test.
        onLayout={(e) => {
          const { x, y, width, height } = e.nativeEvent.layout;
          onBounds({ left: x, top: y, right: x + width, bottom: y + height });
        }}
      >
        {checkedThisCycle ? (
          <Svg width={10} height={8} viewBox="0 0 12 9" fill="none">
            <Polyline
              points="1.5,4.5 4.5,7.5 10.5,1.5"
              stroke={c.fgMuted}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        ) : null}
      </View>
    );
  }
  return <View style={[styles.priorityDot, { backgroundColor: dot }]} />;
}
