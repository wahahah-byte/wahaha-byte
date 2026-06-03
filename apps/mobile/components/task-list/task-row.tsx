import { memo, useEffect, useRef } from "react";
import { View } from "react-native";
import { router } from "expo-router";
import Svg, { Polyline } from "react-native-svg";

import {
  canCheckInNow,
  CATEGORY_COLOR,
  currentStreakTier,
  isCycleClosed,
  isOverdue,
  PRIORITY_DOT,
  todayLocalKey,
  type TaskDto,
} from "@wahaha/shared";
import { tasksApi } from "@/lib/api";
import { taskCache } from "@/lib/task-cache";
import { taskEvents } from "@/lib/task-events";
import { ThemedText } from "@/components/themed-text";
import type { useColors } from "@/hooks/use-colors";
import {
  ArchiveIcon,
  CheckIcon,
  DeleteIcon,
  PauseIcon,
  StartIcon,
  UnarchiveIcon,
  UndoIcon,
} from "@/components/action-icons";
import { BankBurstEffect } from "@/components/bank-burst-effect";
import { CheckInBurstEffect } from "@/components/checkin-burst-effect";
import { SwipeableRow, type SwipeAction } from "@/components/swipeable-row";
import { CheckinLead, CoinIcon, dueLabel, TierMedal } from "@/components/task-list/task-row-parts";
import { styles } from "@/components/task-list/styles";

type ActiveFilter = "pending" | "in_progress" | "completed" | "all";

export interface TaskRowProps {
  item: TaskDto;
  activeFilter?: ActiveFilter;
  c: ReturnType<typeof useColors>;
  prevId?: string;
  nextId?: string;
  isSelected: boolean;
  burstActive: boolean;
  bankActive: boolean;
  onToggleSelect?: (taskId: string) => void;
  onCheckIn: (t: TaskDto) => void;
  onComplete: (t: TaskDto) => void;
  onStart: (t: TaskDto) => void;
  onPause: (t: TaskDto) => void;
  onArchive: (t: TaskDto) => void;
  onDelete: (t: TaskDto) => void;
  onUndoCheckIn: (t: TaskDto, cycleId: number) => void;
  onUndoComplete: (t: TaskDto) => void;
  submittedTaskIds?: Set<string>;
  canActNow: (taskId: string) => boolean;
  tryNavigate: () => boolean;
  refreshTick: number;
  useCheckinCheckbox?: boolean;
  // True while check-in POST is in flight.
  isCheckInPending: (taskId: string) => boolean;
  // Queues undo intent until real cycleId lands.
  queueUndoOnCommit: (taskId: string) => void;
}

export const TaskRow = memo(TaskRowImpl, (prev, next) => {
  // Skip re-render on callback identity churn — handlers are stable in behavior.
  return (
    prev.item === next.item &&
    prev.activeFilter === next.activeFilter &&
    prev.c === next.c &&
    prev.prevId === next.prevId &&
    prev.nextId === next.nextId &&
    prev.isSelected === next.isSelected &&
    prev.burstActive === next.burstActive &&
    prev.bankActive === next.bankActive &&
    prev.useCheckinCheckbox === next.useCheckinCheckbox &&
    prev.refreshTick === next.refreshTick
  );
});

function TaskRowImpl({
  item,
  activeFilter,
  c,
  prevId,
  nextId,
  isSelected,
  burstActive,
  bankActive,
  onToggleSelect,
  onCheckIn,
  onComplete,
  onStart,
  onPause,
  onArchive,
  onDelete,
  onUndoCheckIn,
  onUndoComplete,
  submittedTaskIds,
  canActNow,
  tryNavigate,
  refreshTick,
  useCheckinCheckbox,
  isCheckInPending,
  queueUndoOnCommit,
}: TaskRowProps) {
  const isInProgress = item.status === "in_progress";
  const isCompleted = item.status === "completed";
  // LOCAL date key — UTC drifts late-evening in negative offsets.
  const todayKey = todayLocalKey();
  const wasCheckedInToday = item.isRecurring && item.lastCheckInDate
    ? item.lastCheckInDate.split("T")[0] === todayKey
    : false;
  // Latest check-in cycle (skips counter "log" cycles at head).
  const latestCheckinCycle = (() => {
    if (!item.isRecurring) return null;
    const cycles = item.recentCycles ?? [];
    for (const c of cycles) {
      if (c.cycleType === "checkin") return c;
    }
    return null;
  })();
  // Checkbox hit-test bounds (Pressables are swallowed by SwipeableRow).
  const checkboxBoundsRef = useRef<{ left: number; top: number; right: number; bottom: number } | null>(null);
  // In-flight action guard, cleared by natural observation or safety timeout.
  const inFlightActionRef = useRef<{ kind: "check-in" | "undo"; cycleId: number } | null>(null);
  // Proactive clear once today's check-in cycle lands.
  useEffect(() => {
    const cycles = item.recentCycles ?? [];
    const inFlight = inFlightActionRef.current;
    if (!inFlight) return;
    if (inFlight.kind === "check-in") {
      const todaysCheckin = cycles.find(
        (c) => c.cycleType === "checkin" && c.checkInDate.split("T")[0] === todayKey,
      );
      if (todaysCheckin) inFlightActionRef.current = null;
    }
  }, [item.recentCycles, todayKey]);
  // User-driven recovery — pull-to-refresh clears latched guards.
  useEffect(() => {
    inFlightActionRef.current = null;
  }, [refreshTick]);
  const overdueRecurring = item.isRecurring && !isInProgress && !isCompleted && isOverdue(item.dueDate);
  const overdueRegular = !item.isRecurring && !isCompleted && isOverdue(item.dueDate);
  const overdueRow = overdueRecurring || overdueRegular;
  // Grey closed cycles and locked/in-progress pending rows. Mirror the leading
  // checkbox's `wasCheckedInToday || isCycleClosed` so the row greys the instant
  // a check-in lands (optimistic patch sets lastCheckInDate=today) rather than
  // waiting for the dueDate to advance on the next refetch.
  const checkedInThisCycle =
    item.isRecurring && (wasCheckedInToday || isCycleClosed(item.dueDate, item.lastCheckInDate));
  const isGreyed = checkedInThisCycle || (activeFilter === "pending" && (
    (item.isRecurring && !canCheckInNow(item.dueDate, item.recurrenceRule, item.lastCheckInDate))
    || isInProgress
  ));
  const due = dueLabel(item.dueDate);
  const dot = PRIORITY_DOT[item.priority.toLowerCase()] ?? c.fgMuted;
  const categoryColor = CATEGORY_COLOR[item.category] ?? c.fgMuted;

  const borderLeftColor = isInProgress
    ? c.activeHighlight
    : overdueRecurring
      ? c.danger
      : "transparent";
  // Checked-in rows: mute foreground content (text/badges/checkboxes) without
  // touching the row background. Opacity is applied per-cell, not on the row.
  // Use the same immediate signal as the background grey + checkbox so the row
  // dims the instant a check-in lands — not on the next refetch. (wasCheckedInToday
  // alone can lag: it compares a UTC check-in date against the local day.)
  const checkedInMute = checkedInThisCycle && !isInProgress;
  const cellOpacity = checkedInMute ? 0.55 : 1;

  const canCheckInThisCycle =
    item.isRecurring &&
    !overdueRecurring &&
    !checkedInThisCycle &&
    canCheckInNow(item.dueDate, item.recurrenceRule, item.lastCheckInDate);
  // Non-recurring swipe action gating.
  const canStart = !item.isRecurring && item.status === "pending";
  const canPause = !item.isRecurring && isInProgress;
  const canComplete = !item.isRecurring && isInProgress;

  const actions: SwipeAction[] = [];
  if (canCheckInThisCycle) {
    actions.push({
      key: "check-in",
      icon: <CheckIcon color={c.activeHighlight} />,
      pressBg: c.activeHighlightBg,
      onPress: () => onCheckIn(item),
    });
  } else {
    if (canStart) {
      actions.push({
        key: "start",
        icon: <StartIcon color={overdueRegular ? c.danger : c.activeHighlight} />,
        pressBg: overdueRegular ? c.dangerBg : c.activeHighlightBg,
        onPress: () => onStart(item),
      });
    }
    if (canPause) {
      actions.push({
        key: "pause",
        icon: <PauseIcon color={c.warning} />,
        pressBg: c.warningBg,
        onPress: () => onPause(item),
      });
    }
    if (canComplete) {
      actions.push({
        key: "complete",
        icon: <CheckIcon color={c.success} />,
        pressBg: c.successBg,
        onPress: () => onComplete(item),
      });
    }
  }
  // Archive hidden for recurring; only completed+submitted regulars qualify.
  const isSubmittedForArchive = item.submitted === true || !!item.pointsAwarded;
  // Undo revert: completed one-off task not yet submitted/awarded.
  const canUndoComplete =
    !item.isRecurring &&
    isCompleted &&
    !isSubmittedForArchive &&
    !(submittedTaskIds?.has(item.taskId) ?? false);
  if (canUndoComplete) {
    actions.push({
      key: "undo-complete",
      icon: <UndoIcon color={c.warning} />,
      pressBg: c.warningBg,
      onPress: () => onUndoComplete(item),
    });
  }
  if (
    !item.isRecurring &&
    (item.isArchived || (isCompleted && isSubmittedForArchive))
  ) {
    actions.push({
      key: "archive",
      icon: item.isArchived ? <UnarchiveIcon color={c.accent} /> : <ArchiveIcon color={c.accent} />,
      pressBg: c.accentBg,
      onPress: () => onArchive(item),
    });
  }
  actions.push({
    key: "delete",
    icon: <DeleteIcon color={c.danger} />,
    pressBg: c.dangerBg,
    onPress: () => onDelete(item),
  });

  const rowBg = isGreyed ? c.rowGreyed : isCompleted ? c.bg : c.surface;
  // Completed-tab selection gate. Three layers: the persisted server flag
  // (item.submitted), the legacy pointsAwarded hint, and the in-session
  // submittedTaskIds set — needed because the post-submit refetch is deferred
  // ~1.9s for the bank-burst animation, and without the session set the
  // checkbox would remain tappable (and resubmittable) during that window.
  const isSelectable =
    activeFilter === "completed" &&
    isCompleted &&
    !item.submitted &&
    !item.pointsAwarded &&
    !(submittedTaskIds?.has(item.taskId) ?? false) &&
    !!onToggleSelect;

  return (
    <SwipeableRow
      rowId={item.taskId}
      prevId={prevId}
      nextId={nextId}
      actions={actions}
      backgroundColor={rowBg}
      onTap={(e) => {
        // Leading checkbox hit-test (Routines tab).
        if (useCheckinCheckbox && item.isRecurring && !isInProgress && !isCompleted && checkboxBoundsRef.current) {
          const b = checkboxBoundsRef.current;
          // Generous hit-slop around the small visible box.
          const SLOP = 22;
          if (e.x >= b.left - SLOP && e.x <= b.right + SLOP && e.y >= b.top - SLOP && e.y <= b.bottom + SLOP) {
            // Drop tap if same action mid-flight.
            const inFlight = inFlightActionRef.current;
            const cycleClosedNow = isCycleClosed(item.dueDate, item.lastCheckInDate);
            const checkedThisCycle = wasCheckedInToday || cycleClosedNow;
            const armGuard = (kind: "check-in" | "undo", cycleId: number) => {
              inFlightActionRef.current = { kind, cycleId };
              // 1s lock — covers typical response time, then auto-clears.
              setTimeout(() => {
                if (inFlightActionRef.current?.kind === kind
                    && inFlightActionRef.current.cycleId === cycleId) {
                  inFlightActionRef.current = null;
                }
              }, 1000);
            };
            // Strict in-flight gate — blocks alternating taps too.
            if (inFlight) return;
            if (checkedThisCycle && latestCheckinCycle) {
              // Server only undoes same-day; require cycle's checkInDate == today, not just wasCheckedInToday (which optimistic patch sets before recentCycles updates).
              const isTodaysCycle = latestCheckinCycle.checkInDate.split("T")[0] === todayKey;
              if (isTodaysCycle) {
                if (!canActNow(item.taskId)) return;
                armGuard("undo", latestCheckinCycle.cycleId);
                onUndoCheckIn(item, latestCheckinCycle.cycleId);
                return;
              }
              // wasCheckedInToday but cycle is stale = race window (POST in flight) — queue or repair.
              if (wasCheckedInToday) {
                if (isCheckInPending(item.taskId)) {
                  queueUndoOnCommit(item.taskId);
                  return;
                }
                tasksApi.repairCheckIn(item.taskId).finally(() => {
                  taskEvents.emitRefreshRequested();
                });
                return;
              }
              // Multi-day cadence past its commit day — fall through.
            } else if (canCheckInThisCycle || overdueRecurring) {
              // Overdue routines check in (server reschedules).
              if (!canActNow(item.taskId)) return;
              armGuard("check-in", 0);
              onCheckIn(item);
              return;
            }
            // Stuck-state repair: closed cycle with no backing cycle row at all.
            if (checkedThisCycle && !latestCheckinCycle) {
              if (isCheckInPending(item.taskId)) {
                queueUndoOnCommit(item.taskId);
                return;
              }
              tasksApi.repairCheckIn(item.taskId).finally(() => {
                taskEvents.emitRefreshRequested();
              });
              return;
            }
            // Else fall through to default tap.
          }
        }
        // Selection tap on Completed.
        if (isSelectable) onToggleSelect?.(item.taskId);
        else {
          // Global nav lock.
          if (!tryNavigate()) return;
          // Prime cache so detail mounts with data on first render.
          taskCache.set(item);
          router.push({ pathname: "/task/[id]", params: { id: item.taskId } });
        }
      }}
    >
      <View
        style={[
          styles.row,
          {
            borderLeftColor,
            backgroundColor: rowBg,
            opacity: isCompleted ? 0.65 : 1,
            position: "relative",
          },
        ]}
      >
          {/* Check-in particle burst. */}
          <CheckInBurstEffect active={burstActive} />
          {/* Bank-stamp underline + "+N" popup on submit. */}
          <BankBurstEffect active={bankActive} amount={item.pointValue} />
          <View style={[styles.rowLeft, { opacity: cellOpacity }]}>
            {isSelectable ? (
              // Visual-only — row's onTap toggles selection.
              <View
                style={[
                  styles.selectBox,
                  {
                    borderColor: isSelected ? c.success : c.borderHairline,
                    backgroundColor: isSelected ? c.successBg : "transparent",
                  },
                ]}
              >
                {isSelected ? (
                  <Svg width={9} height={7} viewBox="0 0 8 6" fill="none">
                    <Polyline
                      points="1,3 3,5 7,1"
                      stroke={c.success}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </Svg>
                ) : null}
              </View>
            ) : null}
            <CheckinLead
              useCheckinCheckbox={useCheckinCheckbox}
              item={item}
              isInProgress={isInProgress}
              isCompleted={isCompleted}
              wasCheckedInToday={wasCheckedInToday}
              latestCheckinCycle={latestCheckinCycle}
              todayKey={todayKey}
              canCheckInThisCycle={canCheckInThisCycle}
              overdueRecurring={overdueRecurring}
              dot={dot}
              c={c}
              onBounds={(b) => { checkboxBoundsRef.current = b; }}
            />
            <View style={styles.titleWrap}>
              <ThemedText
                numberOfLines={1}
                style={[
                  { color: isCompleted || isGreyed ? c.fgMuted : c.fg, fontSize: 14 },
                  isCompleted ? { textDecorationLine: "line-through" } : null,
                ]}
              >
                {item.title.length > 18 ? `${item.title.slice(0, 17)}…` : item.title}
              </ThemedText>
              <View style={styles.metaRow}>
                {item.category ? (
                  <View
                    style={[
                      styles.categoryPill,
                      {
                        backgroundColor: `${categoryColor}18`,
                        borderColor: `${categoryColor}40`,
                      },
                    ]}
                  >
                    <ThemedText
                      style={{
                        fontSize: 9,
                        lineHeight: 10,
                        letterSpacing: 0.8,
                        fontWeight: "600",
                        color: categoryColor,
                      }}
                    >
                      {item.category.toUpperCase()}
                    </ThemedText>
                  </View>
                ) : null}
                {item.isRecurring && item.recurrenceRule && !isInProgress && !isCompleted ? (() => {
                  const ruleAbbr = item.recurrenceRule === "daily" ? "D"
                    : item.recurrenceRule === "weekdays" ? "WD"
                    : item.recurrenceRule === "weekly" ? "W"
                    : item.recurrenceRule === "biweekly" ? "2W"
                    : item.recurrenceRule === "monthly" ? "M"
                    : null;
                  if (!ruleAbbr) return null;
                  const overdue = isOverdue(item.dueDate);
                  const locked = !overdue && !canCheckInNow(item.dueDate, item.recurrenceRule, item.lastCheckInDate);
                  const fg = overdue ? c.danger : locked ? c.warning : c.activeHighlightAlt;
                  const bg = overdue ? c.dangerBg : locked ? c.warningBg : c.activeHighlightAltBg;
                  const border = overdue ? c.dangerBorder : locked ? c.warningBorder : c.activeHighlightAltBorder;
                  return (
                    <View style={[styles.recurChip, { backgroundColor: bg, borderColor: border }]}>
                      <ThemedText style={{ fontSize: 9, lineHeight: 10, color: fg }}>↻</ThemedText>
                      <ThemedText style={{ fontSize: 9, lineHeight: 10, color: fg, letterSpacing: 0.8, fontWeight: "600", fontVariant: ["tabular-nums"] }}>
                        {ruleAbbr}
                      </ThemedText>
                    </View>
                  );
                })() : null}
                {item.wasPenalized ? (
                  <View style={[styles.badge, { backgroundColor: c.dangerBg, borderColor: c.dangerBorder }]}>
                    <ThemedText style={{ fontSize: 9, color: c.danger, letterSpacing: 0.5 }}>
                      PENALIZED
                    </ThemedText>
                  </View>
                ) : null}
                {item.isRecurring ? (() => {
                  const t = currentStreakTier(item.currentStreakCount ?? 0);
                  return t ? <TierMedal tier={t.tier} /> : null;
                })() : null}
              </View>
            </View>
          </View>
          <View style={[styles.pointsCol, { opacity: cellOpacity }]}>
            <CoinIcon overdue={overdueRow} />
            <ThemedText style={{
              fontSize: 12,
              fontWeight: "600",
              color: c.warning,
              fontVariant: ["tabular-nums"],
            }}>
              {item.pointValue.toLocaleString()}
            </ThemedText>
          </View>
          <View style={[styles.dateCol, { opacity: cellOpacity }]}>
            {/* Overdue cue is the date colour going red. */}
            <ThemedText style={{
              fontSize: 12,
              color: overdueRow ? c.danger : c.fgMuted,
              fontWeight: overdueRow ? "600" : "400",
              fontVariant: ["tabular-nums"],
            }}>
              {due}
            </ThemedText>
          </View>
        </View>
    </SwipeableRow>
  );
}
