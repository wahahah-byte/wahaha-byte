import { useEffect, useState } from "react";
import { View } from "react-native";

import { type TaskDto, type UserInventoryDto } from "@wahaha/shared";

import { ChibiAvatar } from "@/components/chibi-avatar";
import { DetailPager } from "@/components/detail-pager";
import { HeatmapStrip } from "@/components/heatmap-strip";
import { StreakDisplay } from "@/components/streak-display";
import { useAvatarsEnabled } from "@/hooks/use-avatars-enabled";
import { equippedCache } from "@/lib/equipped-cache";

// Non-recurring tasks show just the chibi avatar (no stats tab). When avatars are
// disabled by user preference, render nothing — caller is responsible for any layout
// shift since the slot just collapses.
export function AvatarOnlyHero() {
  const avatarsEnabled = useAvatarsEnabled();
  const equipped = useEquippedAvatar();
  if (!avatarsEnabled) return null;
  return (
    <View style={{ height: 232, alignItems: "center", justifyContent: "center" }}>
      <ChibiAvatar equipped={equipped} height={168} />
    </View>
  );
}

// Recurring/counter tasks get a two-card pager: chibi + streak on tab 1, heatmap on tab 2.
// Heatmap reads pendingLog so today's cell updates in real-time as the user logs.
export function CounterPanel({
  task,
  pendingLog,
}: {
  task: TaskDto;
  pendingLog: number;
}) {
  const cycles = task.recentCycles ?? [];
  const avatarsEnabled = useAvatarsEnabled();
  const equipped = useEquippedAvatar();
  const rule = task.recurrenceRule ?? "";

  // When avatars are disabled, the stage card centers the streak alone so the
  // pager still has a usable first tab. For non-recurring tasks (no streak) the
  // stage card just collapses to an empty centred view — better than removing
  // the pager entirely and breaking the parent's expected height.
  const stageCard = (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 10 }}>
      {avatarsEnabled ? <ChibiAvatar equipped={equipped} height={168} /> : null}
      {task.isRecurring ? (
        <View style={{ width: "78%", maxWidth: 320 }}>
          <StreakDisplay
            currentStreakCount={task.currentStreakCount}
            longestStreakCount={task.longestStreakCount}
          />
        </View>
      ) : null}
    </View>
  );

  const statsCard = (
    <View style={{ flex: 1, paddingTop: 4 }}>
      <HeatmapStrip
        rule={rule}
        hasCounter={task.hasCounter ?? false}
        cycles={cycles}
        pendingTodayDelta={task.hasCounter ? pendingLog : 0}
      />
    </View>
  );

  return (
    <DetailPager
      height={232}
      labels={["Stage", "Stats"]}
      cards={[
        { key: "stage", content: stageCard },
        { key: "stats", content: statsCard },
      ]}
    />
  );
}

// Shared subscription helper — both heroes need the live equipped inventory for the chibi.
function useEquippedAvatar(): UserInventoryDto[] {
  const [equipped, setEquipped] = useState<UserInventoryDto[]>(
    () => equippedCache.read() ?? [],
  );
  useEffect(() => {
    const unsubscribe = equippedCache.subscribe(setEquipped);
    equippedCache.revalidate();
    return unsubscribe;
  }, []);
  return equipped;
}
