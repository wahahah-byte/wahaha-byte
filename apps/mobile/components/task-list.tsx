import { memo, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Svg, { Path, Polyline, Rect } from "react-native-svg";

import { ArchiveIcon, CheckIcon, DeleteIcon, UnarchiveIcon } from "@/components/action-icons";
import { BankBurstEffect } from "@/components/bank-burst-effect";
import { CheckInBurstEffect } from "@/components/checkin-burst-effect";
import { SLASH_MS, SlashingRow } from "@/components/slashing-row";
import { SwipeRowProvider, useSwipeRow } from "@/components/swipe-row-context";
import { SwipeableRow, type SwipeAction } from "@/components/swipeable-row";

/** Wraps children in a gesture detector that closes any open swipe row on tap. */
function CloseOnTap({ children }: { children: ReactNode }) {
  const ctx = useSwipeRow();
  const close = ctx?.closeAll;
  const tap = Gesture.Tap()
    .maxDistance(8)
    .onEnd(() => {
      if (close) runOnJS(close)();
    });
  return (
    <GestureDetector gesture={tap}>
      <View style={{ flex: 1 }}>{children}</View>
    </GestureDetector>
  );
}

function CoinIcon({ overdue }: { overdue?: boolean }) {
  // Pixel-coin from web TaskRow.tsx — 10×12 viewBox.
  const fill = "rgb(245, 158, 11)"; // matches --color-warning
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

import {
  buildListItems,
  canCheckInNow,
  CATEGORY_COLOR,
  chunkListItems,
  currentStreakTier,
  dateKey,
  isCheckedInThisCycle,
  isCycleClosed,
  isOverdue,
  getPrevPeriodStart,
  parseLocalDate,
  type CheckInCycleDto,
  PRIORITY_DOT,
  sep,
  todayLocalKey,
  type GroupMode,
  type SortMode,
  type TaskDto,
  type TaskFilterParams,
} from "@wahaha/shared";
import { tasksApi } from "@/lib/api";
import { taskCache } from "@/lib/task-cache";
import { taskEvents } from "@/lib/task-events";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";

interface Props {
  filters?: TaskFilterParams;
  emptyText?: string;
  activeFilter?: "pending" | "in_progress" | "completed" | "all";
  groupMode?: GroupMode;
  sortMode?: SortMode;
  /** Bump to force a refetch from the parent (e.g. after a quick-add). */
  refreshKey?: number;
  /** Optional client-side predicate applied before buildListItems. Used by the
   *  Routines tab to filter by today/upcoming/missed. */
  preFilter?: (task: TaskDto) => boolean;
  /** Routines-only: split out tasks that are checked-in for their current cycle
   *  into a separate "Checked In" section below the active routines. Matches
   *  web's recurring page behavior for the "all" filter. */
  splitCheckedIn?: boolean;
  /** Called whenever a fetch lands. Lets parent screens inspect the loaded set. */
  onTasksLoaded?: (tasks: TaskDto[]) => void;
  /** Submit/bank flow. When provided, completed-tab rows render a check pill
   *  and tapping it toggles the task into the parent's selection set. */
  selectedIds?: Set<string>;
  onToggleSelect?: (taskId: string) => void;
  /** IDs of tasks that have been submitted in this session — they're filtered
   *  out of the completed list (mirrors web's behaviour). */
  submittedTaskIds?: Set<string>;
  /** IDs currently playing the bank-burst animation. Set by the parent right
   *  after a successful submit; the parent should clear them once the burst
   *  has had time to play (~2 s). Mirrors web's BankBurstEffect trigger. */
  bankingIds?: Set<string>;
  /** Routines-only: swap the leading priority dot for a priority-coloured
   *  checkbox. Tapping it checks in (or undoes today's check-in) without
   *  navigating into the detail screen. */
  useCheckinCheckbox?: boolean;
}

function LockIcon() {
  return (
    <Svg width={7} height={8} viewBox="0 0 10 12" fill="none">
      <Rect x={2} y={5} width={6} height={6} rx={0.8} stroke="rgba(245,158,11,0.55)" strokeWidth={1.2} fill="none" />
      <Path d="M3.5 5V3.5a1.5 1.5 0 0 1 3 0V5" stroke="rgba(245,158,11,0.55)" strokeWidth={1.2} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

function dueLabel(dueDate: string | null): string {
  if (!dueDate) return "—";
  return parseLocalDate(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function TaskList({
  filters,
  emptyText = "No tasks.",
  activeFilter = "pending",
  groupMode = "none",
  sortMode = "due",
  refreshKey,
  preFilter,
  splitCheckedIn,
  onTasksLoaded,
  selectedIds,
  onToggleSelect,
  submittedTaskIds,
  bankingIds,
  useCheckinCheckbox,
}: Props) {
  const c = useColors();

  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Web's `uncompletedCollapsed` — toggles whether the chunks before the
  // Completed separator are rendered. Only relevant on the "all" filter.
  const [uncompletedCollapsed, setUncompletedCollapsed] = useState(false);
  // Task currently playing the check-in burst animation. Cleared after
  // ~900 ms so the row's particle effect goes away naturally.
  const [burstTaskId, setBurstTaskId] = useState<string | null>(null);
  const burstTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Task currently playing the slash-to-delete animation. Mirrors web's
  // `slashingId` — the row stays mounted for SLASH_MS while SlashingRow
  // plays the underline + collapse, then we yank it from the list.
  const [slashingId, setSlashingId] = useState<string | null>(null);
  useEffect(() => () => {
    if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
  }, []);

  const fetchTasks = useCallback(async () => {
    setError(null);
    const res = await tasksApi.getAll({ pageSize: 50, ...filters });
    if (!res.data) {
      setError(res.error ?? "Failed to load tasks.");
      return;
    }
    setTasks(res.data.data);
    // Seed the task cache so the detail modal can render synchronously
    // when the user taps a row — eliminates the spinner-then-content flash.
    taskCache.setMany(res.data.data);
    onTasksLoaded?.(res.data.data);
  }, [filters, onTasksLoaded]);

  useEffect(() => {
    setLoading(true);
    fetchTasks().finally(() => setLoading(false));
  }, [fetchTasks, refreshKey]);

  useFocusEffect(useCallback(() => { fetchTasks(); }, [fetchTasks]));

  // Optimistic check-in updates from the detail modal — see lib/task-events.
  // The modal emits the moment the slide commits, so the row visibly moves
  // into the "Checked In" / "Upcoming" section under the modal while the
  // slide's celebration animation is still playing. We patch dueDate too
  // because isCheckedInThisCycle gates on `today < dueDate` — without the
  // advance, daily tasks (dueDate = today) wouldn't move sections.
  useEffect(() => {
    return taskEvents.subscribeCheckedIn(({ taskId, lastCheckInDateIso, nextDueDateIso }) => {
      setTasks((prev) =>
        prev.map((t) =>
          t.taskId === taskId
            ? { ...t, lastCheckInDate: lastCheckInDateIso, dueDate: nextDueDateIso }
            : t
        )
      );
    });
  }, []);


  async function handleCheckIn(task: TaskDto) {
    // Fire the burst on the row that's about to check in. Matches web's
    // recurringPopups pattern — the row stays visible while the particles
    // animate, then on refetch the task lands in the "Checked In" section.
    if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
    setBurstTaskId(task.taskId);
    burstTimeoutRef.current = setTimeout(() => {
      setBurstTaskId(null);
      burstTimeoutRef.current = null;
    }, 900);

    // Haptic feedback. Stronger pulse when this check-in crosses a streak
    // tier boundary (3/7/14/30) — mirrors web's useTaskActions distinction.
    // Skipped on web (expo-haptics is a no-op there anyway, but the guard
    // avoids the async call entirely).
    if (Platform.OS !== "web") {
      const prevStreak = task.currentStreakCount ?? 0;
      const nextStreak = prevStreak + 1;
      const crosses = [3, 7, 14, 30].some((at) => prevStreak < at && nextStreak >= at);
      Haptics.impactAsync(
        crosses ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light,
      ).catch(() => {/* swallow — haptics are best-effort */});
    }

    // Optimistic patch right away so the row visibly moves to "Checked In"
    // before the network round-trip. We then apply the server response in
    // place — no fetchTasks() refetch afterward, which was a major source
    // of perceived sluggishness (extra network + extra full-list re-render
    // after every action). useFocusEffect already refreshes on tab focus
    // so any drift is reconciled when the user navigates away and back.
    const todayIso = todayLocalKey();
    setTasks((prev) => prev.map((t) =>
      t.taskId === task.taskId
        ? { ...t, lastCheckInDate: todayIso }
        : t,
    ));

    const res = await tasksApi.checkIn(task.taskId);
    if (res.error) {
      setError(res.error);
      return;
    }
    if (res.data) {
      const data = res.data;
      // Apply the authoritative server response in place — covers nextDueDate,
      // updated streak counts, and the new cycle id so the leading checkbox's
      // undo path has the right cycleId for an immediate within-day undo.
      const newCycle: CheckInCycleDto = {
        cycleId: data.cycleId,
        taskId: task.taskId,
        checkInDate: todayIso,
        counterValue: null,
        createdAt: new Date().toISOString(),
        cycleType: "checkin",
      };
      setTasks((prev) => prev.map((t) =>
        t.taskId === task.taskId
          ? {
              ...t,
              dueDate: data.nextDueDate ?? t.dueDate,
              currentStreakCount: data.streakCount,
              longestStreakCount: data.longestCount,
              recentCycles: [newCycle, ...(t.recentCycles ?? [])],
            }
          : t,
      ));
    }
  }

  // Shared optimistic undo — mirrors web's useTaskActions.handleUndoCheckIn:
  // patch the row in-place from the server response (filter out the undone
  // cycle, restore lastCheckInDate + dueDate from the snapshot fields the
  // API returns). fetchTasks alone wasn't enough — the underlying list was
  // sometimes still rendering the old recentCycles[0] after the refresh,
  // leaving the Undo pill stuck on a now-active row.
  async function performUndoCheckIn(taskId: string, cycleId: number) {
    // Optimistic-first: patch the row immediately so the checkbox flips
    // back to unchecked on tap, then reconcile with the server response.
    // Without the optimistic step, a second tap fired during the ~200–800 ms
    // server round-trip still sees the undone cycle in recentCycles[0] and
    // tries to delete it again → "Check-in cycle N was not found" 404.
    let snapshot: TaskDto | null = null;
    setTasks((prev) => prev.map((t) => {
      if (t.taskId !== taskId) return t;
      snapshot = t;
      const cycles = (t.recentCycles ?? []).filter((c) => c.cycleId !== cycleId);
      const optimisticDue = t.dueDate && t.recurrenceRule
        ? dateKey(getPrevPeriodStart(parseLocalDate(t.dueDate), t.recurrenceRule))
        : t.dueDate;
      return {
        ...t,
        recentCycles: cycles,
        currentStreakCount: Math.max(0, (t.currentStreakCount ?? 0) - 1),
        dueDate: optimisticDue,
        lastCheckInDate: null,
      };
    }));

    const res = await tasksApi.undoCheckIn(taskId, cycleId);
    if (res.error || !res.data) {
      // 404 / "not found" means the cycle is already deleted server-side
      // (a previous undo for the same cycle landed first). Our optimistic
      // state already removed it — rolling back would visibly snap the
      // box from unchecked → checked, which reads as "the tap didn't
      // work". Leave the optimistic state alone and don't toast.
      const cycleAlreadyGone = !!res.error && /not\s*found/i.test(res.error);
      if (!cycleAlreadyGone && snapshot) {
        const captured = snapshot;
        setTasks((prev) => prev.map((t) => t.taskId === taskId ? captured : t));
      }
      if (res.error && !cycleAlreadyGone) {
        setError(res.error);
      }
      return;
    }
    const data = res.data;
    setTasks((prev) => prev.map((t) => {
      if (t.taskId !== taskId) return t;
      const cycles = (t.recentCycles ?? []).filter((c) => c.cycleId !== cycleId);
      // Empty string from server = "no prior check-in" — null it so
      // canCheckInNow() unlocks the task.
      const restoredLastCheckIn = data.previousLastCheckInDate || null;
      // If the server has no previousDueDate snapshot (older cycles created
      // before the rollback fields were added), compute it client-side by
      // rolling dueDate back one period. Without this, dueDate stays at
      // "tomorrow" and isCheckedInThisCycle keeps the row pinned to the
      // Checked In section even though lastCheckInDate is cleared.
      const restoredDueDate = data.previousDueDate
        || (t.dueDate && t.recurrenceRule
          ? dateKey(getPrevPeriodStart(parseLocalDate(t.dueDate), t.recurrenceRule))
          : t.dueDate);
      return {
        ...t,
        recentCycles: cycles,
        currentStreakCount: data.streakCount,
        longestStreakCount: data.longestCount,
        dueDate: restoredDueDate,
        lastCheckInDate: restoredLastCheckIn,
      };
    }));
  }

  // Within-day inline undo — fires from the leading checkbox on each row
  // (see TaskRow). Available until midnight so the user can reverse a
  // check-in long after the moment of action.
  async function handleUndoCheckIn(task: TaskDto, cycleId: number) {
    await performUndoCheckIn(task.taskId, cycleId);
  }

  async function handleComplete(task: TaskDto) {
    // Optimistic patch only — the local state already reflects the new
    // status. fetchTasks was running unconditionally and re-rendering the
    // entire list after each completion, which was a major source of
    // perceived lag. On error, refetch to reconcile.
    setTasks((prev) =>
      prev.map((t) => (t.taskId === task.taskId ? { ...t, status: "completed" } : t))
    );
    const res = await tasksApi.complete(task.taskId);
    if (res.error) {
      setError(res.error);
      await fetchTasks();
    }
  }

  async function handleArchive(task: TaskDto) {
    setTasks((prev) => prev.filter((t) => t.taskId !== task.taskId));
    const fn = task.isArchived ? tasksApi.unarchive : tasksApi.archive;
    const res = await fn(task.taskId);
    if (res.error) {
      setError(res.error);
      await fetchTasks();
    }
  }

  async function handleDelete(task: TaskDto) {
    // No confirm — swipe-action commitment is enough intent. Mirrors web's
    // useTaskActions.handleDelete: fire the API request in parallel with
    // the slash animation; after SLASH_MS the row is pulled from the list
    // so the collapse plays to completion before the layout shifts.
    setSlashingId(task.taskId);
    const deletePromise = tasksApi.delete(task.taskId);
    await new Promise((r) => setTimeout(r, SLASH_MS));
    setSlashingId(null);
    setTasks((prev) => prev.filter((t) => t.taskId !== task.taskId));
    taskCache.remove(task.taskId);
    const res = await deletePromise;
    if (res.error) {
      setError(res.error);
      await fetchTasks();
    }
  }

  const { sections, showCollapse, activeCount } = useMemo(() => {
    const base = preFilter ? tasks.filter(preFilter) : tasks;
    const items = buildListItems({
      tasks: base,
      activeFilter,
      groupMode,
      sortMode,
      submittedTaskIds: submittedTaskIds ?? new Set(),
    });

    // Routines-only: pull tasks that are checked-in for this cycle out of the
    // top section and put them under a "Checked In" separator below — only when
    // both sets are non-empty, matching web's mobile recurring view.
    let finalItems = items;
    if (splitCheckedIn) {
      const active: TaskDto[] = [];
      const checkedIn: TaskDto[] = [];
      for (const it of items) {
        if ("__sep" in it) {
          // The base recurring list shouldn't carry any separators (groupMode
          // = "none" + activeFilter = "all"), but if a future caller uses
          // groupMode we preserve their layout untouched.
          active.push(it as unknown as TaskDto);
          continue;
        }
        if (isCheckedInThisCycle(it)) checkedIn.push(it);
        else active.push(it);
      }
      if (active.length > 0 && checkedIn.length > 0) {
        finalItems = [...active, sep("Checked In", "__sep-checked-in"), ...checkedIn];
      }
    }

    const chunks = chunkListItems(finalItems);
    // Active-section collapse — when the user is on the "all" filter and the
    // list has a Completed separator, expose the uncompleted-chunk count and
    // (when collapsed) drop those chunks entirely.
    const compIdx = chunks.findIndex((c) => c.sep?.sepKey === "__sep-completed");
    const hasComp = compIdx >= 0;
    const showCollapse = activeFilter === "all" && hasComp;
    const uncompChunks = hasComp ? chunks.slice(0, compIdx) : chunks;
    const activeCount = uncompChunks.reduce((s, c) => s + c.tasks.length, 0);
    const visibleChunks = showCollapse && uncompletedCollapsed ? chunks.slice(compIdx) : chunks;
    const mapped = visibleChunks.map((ch, i) => ({
      key: ch.sep?.sepKey ?? `__nosep-${i}`,
      label: ch.sep?.label ?? "",
      data: ch.tasks,
    }));
    return { sections: mapped, showCollapse, activeCount };
  }, [tasks, activeFilter, groupMode, sortMode, preFilter, splitCheckedIn, submittedTaskIds, uncompletedCollapsed]);

  async function onRefresh() {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }

  if (error) {
    return <ThemedText style={{ color: c.danger, marginTop: 12 }}>{error}</ThemedText>;
  }

  if (loading && tasks.length === 0) {
    return <ActivityIndicator color={c.activeHighlight} />;
  }

  const isEmpty = sections.length === 0 || sections.every((s: { data: TaskDto[] }) => s.data.length === 0);
  if (isEmpty) {
    return (
      <View style={{ flex: 1, position: "relative" }}>
        <SectionList
          sections={[]}
          renderItem={() => null}
          keyExtractor={() => ""}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.activeHighlight} />}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: "center", marginTop: 24, color: c.fgMuted }}>
              {emptyText}
            </ThemedText>
          }
        />
      </View>
    );
  }

  return (
    <SwipeRowProvider>
    <View style={{ flex: 1, position: "relative" }}>
    <CloseOnTap>
    <SectionList
      sections={sections}
      keyExtractor={(item) => item.taskId}
      stickySectionHeadersEnabled={false}
      // Virtualization tuning. Each row hosts ~9 shared values (gestures
      // + slash + bank-burst) so mount cost is real. Trimming the window
      // keeps fewer offscreen rows alive at any time without affecting
      // visible-area scroll smoothness on a phone-sized list.
      initialNumToRender={10}
      maxToRenderPerBatch={8}
      windowSize={5}
      removeClippedSubviews
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={c.activeHighlight} />}
      ListHeaderComponent={
        showCollapse ? (
          <ActiveSectionToggle
            count={activeCount}
            collapsed={uncompletedCollapsed}
            onToggle={() => setUncompletedCollapsed((v) => !v)}
            c={c}
          />
        ) : null
      }
      renderSectionHeader={({ section }) =>
        section.label ? (
          <ThemedView style={styles.sectionHeader}>
            <ThemedText style={{ fontSize: 11, color: c.fgSubtle, letterSpacing: 1 }}>
              {section.label.toUpperCase()}
            </ThemedText>
          </ThemedView>
        ) : null
      }
      renderItem={({ item, section, index }) => {
        const data = section.data as TaskDto[];
        const prevId = index > 0 ? data[index - 1]?.taskId : undefined;
        const nextId = index < data.length - 1 ? data[index + 1]?.taskId : undefined;
        return (
          <SlashingRow isSlashing={slashingId === item.taskId}>
            <TaskRow
              item={item}
              activeFilter={activeFilter}
              c={c}
              prevId={prevId}
              nextId={nextId}
              isSelected={selectedIds?.has(item.taskId) ?? false}
              burstActive={burstTaskId === item.taskId}
              bankActive={bankingIds?.has(item.taskId) ?? false}
              onToggleSelect={onToggleSelect}
              onCheckIn={handleCheckIn}
              onComplete={handleComplete}
              onArchive={handleArchive}
              onUndoCheckIn={handleUndoCheckIn}
              onDelete={handleDelete}
              useCheckinCheckbox={useCheckinCheckbox}
            />
          </SlashingRow>
        );
      }}
    />
    </CloseOnTap>
    </View>
    </SwipeRowProvider>
  );
}

interface TaskRowProps {
  item: TaskDto;
  activeFilter: Props["activeFilter"];
  c: ReturnType<typeof useColors>;
  prevId?: string;
  nextId?: string;
  isSelected: boolean;
  burstActive: boolean;
  bankActive: boolean;
  onToggleSelect?: (taskId: string) => void;
  onCheckIn: (t: TaskDto) => void;
  onComplete: (t: TaskDto) => void;
  onArchive: (t: TaskDto) => void;
  onDelete: (t: TaskDto) => void;
  onUndoCheckIn: (t: TaskDto, cycleId: number) => void;
  useCheckinCheckbox?: boolean;
}

const TaskRow = memo(TaskRowImpl, (prev, next) => {
  // Skip re-rendering when only the parent's callback identities change —
  // the handler bodies are stable in behavior even though their refs churn
  // every render (they're defined inside the TaskList function). Comparing
  // just the data + state props keeps the row from re-rendering on every
  // tasks-state mutation in TaskList. Without this memo, ANY check-in
  // triggered a full re-render of every visible row.
  return (
    prev.item === next.item &&
    prev.activeFilter === next.activeFilter &&
    prev.c === next.c &&
    prev.prevId === next.prevId &&
    prev.nextId === next.nextId &&
    prev.isSelected === next.isSelected &&
    prev.burstActive === next.burstActive &&
    prev.bankActive === next.bankActive &&
    prev.useCheckinCheckbox === next.useCheckinCheckbox
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
  onArchive,
  onDelete,
  onUndoCheckIn,
  useCheckinCheckbox,
}: TaskRowProps) {
  const isInProgress = item.status === "in_progress";
  const isCompleted = item.status === "completed";
  // LOCAL date key, not UTC. toISOString returns UTC, which silently drifts
  // a day off in any timezone behind UTC late in the evening — comparing
  // a server-stored local date string against a UTC string then never
  // matches and the row loses its "checked-in today" indicators.
  const todayKey = todayLocalKey();
  const wasCheckedInToday = item.isRecurring && item.lastCheckInDate
    ? item.lastCheckInDate.split("T")[0] === todayKey
    : false;
  // Latest check-in cycle (any date) — used by the leading checkbox to undo
  // a committed check-in from anywhere in the current cycle (today's, or e.g.
  // a weekly routine checked in 3 days ago). Counter tasks can log values
  // after the check-in lands (cycleType === "log"), and those logs sit at
  // the head of recentCycles ahead of the check-in itself — so we scan for
  // the most recent "checkin" rather than reading index 0.
  const latestCheckinCycle = (() => {
    if (!item.isRecurring) return null;
    const cycles = item.recentCycles ?? [];
    for (const c of cycles) {
      if (c.cycleType === "checkin") return c;
    }
    return null;
  })();
  // Same hit-test pattern as the (removed) dateColBoundsRef — used when the
  // leading priority dot is rendered as a check-in checkbox so a tap there
  // routes to onCheckIn / onUndoCheckIn instead of opening the detail screen.
  const checkboxBoundsRef = useRef<{ left: number; top: number; right: number; bottom: number } | null>(null);
  // Guards against rapid double-taps on the check-in checkbox. Stores the
  // cycleId currently being undone (or 0 for an in-flight check-in) so any
  // follow-up tap that would re-fire the same action is dropped. Cleared
  // after a generous upper-bound timeout in case the server hangs.
  const inFlightActionRef = useRef<{ kind: "check-in" | "undo"; cycleId: number } | null>(null);
  const overdueRecurring = item.isRecurring && !isInProgress && !isCompleted && isOverdue(item.dueDate);
  const overdueRegular = !item.isRecurring && !isCompleted && isOverdue(item.dueDate);
  const overdueRow = overdueRecurring || overdueRegular;
  // Always grey a recurring row whose current cycle is already closed
  // (= committed for this period), regardless of the active filter — so the
  // user sees at a glance which routines are done. The pending-tab leg
  // additionally greys rows that aren't actionable yet (lockouts /
  // in-progress).
  const checkedInThisCycle = item.isRecurring && isCycleClosed(item.dueDate, item.lastCheckInDate);
  const isGreyed = checkedInThisCycle || (activeFilter === "pending" && (
    (item.isRecurring && !canCheckInNow(item.dueDate, item.recurrenceRule, item.lastCheckInDate))
    || isInProgress
  ));
  const due = dueLabel(item.dueDate);
  const dot = PRIORITY_DOT[item.priority.toLowerCase()] ?? c.fgMuted;
  const categoryColor = CATEGORY_COLOR[item.category] ?? c.fgMuted;

  const borderLeftColor = isInProgress
    ? c.activeHighlight
    : wasCheckedInToday
      ? c.secondaryAccent
      : overdueRecurring
        ? c.danger
        : "transparent";

  const canCheckInThisCycle =
    item.isRecurring &&
    !overdueRecurring &&
    canCheckInNow(item.dueDate, item.recurrenceRule, item.lastCheckInDate);
  const canComplete = !item.isRecurring && !isCompleted;

  const actions: SwipeAction[] = [];
  if (canCheckInThisCycle) {
    actions.push({
      key: "check-in",
      icon: <CheckIcon color={c.activeHighlight} />,
      pressBg: c.activeHighlightBg,
      onPress: () => onCheckIn(item),
    });
  } else if (canComplete) {
    actions.push({
      key: "complete",
      icon: <CheckIcon color={c.success} />,
      pressBg: c.successBg,
      onPress: () => onComplete(item),
    });
  }
  // Archive is hidden for recurring tasks — routines aren't meant to be
  // archived; delete is the right exit for them.
  if (!item.isRecurring) {
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
  // Web's isSelectable check: completed-tab + status=completed + not submitted
  // yet (web filters by `!isSubmitted`; we approximate via `pointsAwarded`).
  const isSelectable =
    activeFilter === "completed" &&
    isCompleted &&
    !item.pointsAwarded &&
    !!onToggleSelect;

  return (
    <SwipeableRow
      rowId={item.taskId}
      prevId={prevId}
      nextId={nextId}
      actions={actions}
      backgroundColor={rowBg}
      onTap={(e) => {
        // Leading checkbox hit-test (Routines tab): tap inside the priority-
        // coloured square commits or undoes the cycle's check-in. Same coord-
        // based routing as the dateCol/undo pill — Pressables are swallowed
        // by SwipeableRow's pointerEvents:none. The visible box is small so
        // we pad the hit area by SLOP px on each side; the row is otherwise
        // tappable for navigation, but the checkbox owns its slop region.
        if (useCheckinCheckbox && item.isRecurring && !isInProgress && !isCompleted && checkboxBoundsRef.current) {
          const b = checkboxBoundsRef.current;
          const SLOP = 14;
          if (e.x >= b.left - SLOP && e.x <= b.right + SLOP && e.y >= b.top - SLOP && e.y <= b.bottom + SLOP) {
            // Drop the tap if the SAME action is mid-flight. Cycle-id matching
            // keeps the row responsive (uncheck-then-recheck still works once
            // the optimistic state lands) while preventing duplicate server
            // calls on rapid same-direction double-taps.
            const inFlight = inFlightActionRef.current;
            const cycleClosedNow = isCycleClosed(item.dueDate, item.lastCheckInDate);
            const checkedThisCycle = wasCheckedInToday || cycleClosedNow;
            const armGuard = (kind: "check-in" | "undo", cycleId: number) => {
              inFlightActionRef.current = { kind, cycleId };
              // Generous upper bound — the optimistic state update normally
              // lands within a frame, but if the JS thread is busy or the
              // server hangs we don't want the row stuck disabled forever.
              setTimeout(() => {
                if (inFlightActionRef.current?.kind === kind
                    && inFlightActionRef.current.cycleId === cycleId) {
                  inFlightActionRef.current = null;
                }
              }, 2000);
            };
            if (checkedThisCycle && latestCheckinCycle) {
              if (inFlight?.kind === "undo" && inFlight.cycleId === latestCheckinCycle.cycleId) return;
              // When a check-in is mid-flight the optimistic lastCheckInDate
              // makes wasCheckedInToday true, but the NEW cycle may not
              // have landed yet — latestCheckinCycle could still point at
              // the prior (possibly weeks-old) check-in, and undoing that
              // surfaces "only recently checked-in tasks can be undone".
              // Gate on the actual data, not the in-flight timer: as soon
              // as today's cycle is at the head of recentCycles, the
              // check-in has reconciled and undo is safe — clear the
              // stale check-in guard so we don't keep blocking taps for
              // the rest of its 2 s window.
              if (inFlight?.kind === "check-in") {
                const newCycleLanded =
                  latestCheckinCycle.checkInDate.split("T")[0] === todayKey;
                if (!newCycleLanded) return;
                inFlightActionRef.current = null;
              }
              armGuard("undo", latestCheckinCycle.cycleId);
              onUndoCheckIn(item, latestCheckinCycle.cycleId);
              return;
            }
            // Overdue routines check in too: server reschedules the dueDate
            // on commit, so a missed routine recovers in one tap. We keep
            // the swipe-action gate (canCheckInThisCycle) excluding overdue
            // for backwards compatibility, but the checkbox is the fast path.
            if (canCheckInThisCycle || overdueRecurring) {
              if (inFlight?.kind === "check-in") return;
              armGuard("check-in", 0);
              onCheckIn(item);
              return;
            }
            // Not yet due — swallow so a mis-tap on the disabled box doesn't
            // open the detail screen unexpectedly.
            return;
          }
        }
        // Selection-tap on the Completed tab — same pattern as web's checkbox,
        // but mobile users tap anywhere on the row since the action-bar slot
        // is given over to SubmitBar in this mode.
        if (isSelectable) onToggleSelect?.(item.taskId);
        else {
          // Prime the per-id cache right before navigation so the detail
          // screen mounts with task data on its very first render — that
          // skips the loading-spinner branch (which would render the sheet
          // without a footer and make the slider "pop in" late). setMany
          // on list fetch already populates this; the explicit set here is
          // belt-and-suspenders for any path that bypassed a fresh fetch.
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
          {/* Particle burst on routine check-in. Origin is the row's centre;
              particles spray upward in a cone for ~900 ms. Overflows the row's
              top edge intentionally — the row's parent doesn't clip. */}
          <CheckInBurstEffect active={burstActive} />
          {/* Bank-stamp underline + "+N" popup when this row's points are
              submitted. Mirrors web's BankBurstEffect. */}
          <BankBurstEffect active={bankActive} amount={item.pointValue} />
          <View style={styles.rowLeft}>
            {isSelectable ? (
              // Visual-only — the surrounding row's onTap toggles selection.
              // A Pressable here is swallowed by SwipeableRow's pointerEvents:none.
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
            {useCheckinCheckbox && item.isRecurring && !isInProgress && !isCompleted ? (() => {
              // Priority-coloured checkbox lead. Tapping it (via the row's
              // onTap hit-test against checkboxBoundsRef) checks in or undoes
              // today's check-in. Filled for the full cycle; undoable only
              // on the day the cycle was committed (matches the Undo pill).
              const checkedThisCycle = wasCheckedInToday || isCycleClosed(item.dueDate, item.lastCheckInDate);
              // Overdue is "actionable" for the checkbox — see the matching
              // gate in onTap above. Locked = not-yet-due / cycle-closed only.
              const isActionable = !checkedThisCycle && (canCheckInThisCycle || overdueRecurring);
              const isLocked = !checkedThisCycle && !isActionable;
              return (
                <View
                  style={[
                    styles.checkinBox,
                    {
                      borderColor: dot,
                      // Locked state stays subtle; use opacity rather than
                      // alpha-mixing the colour (c.fgMuted is rgba so string
                      // concatenation isn't safe).
                      opacity: isLocked ? 0.35 : 1,
                    },
                  ]}
                  // Record bounds in the row's coord space so onTap can
                  // hit-test against them (same trick as dateColBoundsRef).
                  onLayout={(e) => {
                    const { x, y, width, height } = e.nativeEvent.layout;
                    checkboxBoundsRef.current = { left: x, top: y, right: x + width, bottom: y + height };
                  }}
                >
                  {checkedThisCycle ? (
                    <Svg width={10} height={8} viewBox="0 0 12 9" fill="none">
                      <Polyline
                        points="1.5,4.5 4.5,7.5 10.5,1.5"
                        stroke={dot}
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </Svg>
                  ) : null}
                </View>
              );
            })() : (
              <View style={[styles.priorityDot, { backgroundColor: dot }]} />
            )}
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
                        fontSize: 8,
                        letterSpacing: 1.1,
                        color: categoryColor,
                      }}
                    >
                      {item.category.toUpperCase()}
                    </ThemedText>
                  </View>
                ) : null}
                {item.isRecurring && !isInProgress && !overdueRecurring ? (
                  canCheckInNow(item.dueDate, item.recurrenceRule, item.lastCheckInDate) ? (
                    <ThemedText style={{ fontSize: 10, color: c.secondaryAccent, lineHeight: 12 }}>
                      ↻
                    </ThemedText>
                  ) : (
                    <LockIcon />
                  )
                ) : null}
                {item.wasPenalized ? (
                  <View style={[styles.badge, { backgroundColor: c.dangerBg, borderColor: c.dangerBorder }]}>
                    <ThemedText style={{ fontSize: 9, color: c.danger, letterSpacing: 0.5 }}>
                      PENALIZED
                    </ThemedText>
                  </View>
                ) : null}
                {item.isRecurring && (() => {
                  const tier = currentStreakTier(item.currentStreakCount ?? 0);
                  if (!tier) return null;
                  return (
                    <ThemedText style={{
                      fontSize: 8,
                      color: c.secondaryAccent,
                      letterSpacing: 1.5,
                      fontVariant: ["tabular-nums"],
                      opacity: 0.85,
                    }}>
                      {tier.label} · {item.currentStreakCount}
                    </ThemedText>
                  );
                })()}
              </View>
            </View>
          </View>
          <View style={styles.dateCol}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              {overdueRow ? (
                <ThemedText style={{ color: c.danger, fontSize: 11, fontWeight: "700" }}>⚠</ThemedText>
              ) : null}
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
          <View style={styles.pointsCol}>
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
        </View>
    </SwipeableRow>
  );
}

function ActiveSectionToggle({
  count, collapsed, onToggle, c,
}: {
  count: number;
  collapsed: boolean;
  onToggle: () => void;
  c: ReturnType<typeof useColors>;
}) {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [
        styles.activeToggle,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <ThemedText
        style={{
          fontSize: 11,
          fontWeight: "600",
          color: c.fgMuted,
          letterSpacing: 1.4,
          textTransform: "uppercase",
        }}
      >
        Active ({count})
      </ThemedText>
      <ThemedText
        style={{
          color: c.fgMuted,
          fontSize: 11,
          marginLeft: 4,
          transform: [{ rotate: collapsed ? "-90deg" : "0deg" }],
        }}
      >
        ▾
      </ThemedText>
      <View style={[styles.activeToggleRule, { backgroundColor: c.borderSoft }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderLeftWidth: 2,
  },
  rowLeft: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10, minWidth: 0 },
  priorityDot: { width: 6, height: 6, borderRadius: 3, flexShrink: 0 },
  checkinBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  selectBox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  titleWrap: { flex: 1, gap: 2, minWidth: 0 },
  metaRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6 },
  dateCol: { width: 64, alignItems: "center", justifyContent: "center" },
  pointsCol: {
    width: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
  },
  badge: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 3, borderWidth: 1 },
  categoryPill: { paddingHorizontal: 5, paddingVertical: 1, borderRadius: 2, borderWidth: 1 },
  sectionHeader: { paddingTop: 16, paddingBottom: 6, paddingHorizontal: 4 },
  activeToggle: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 12,
    paddingHorizontal: 4,
    gap: 6,
  },
  activeToggleRule: {
    flex: 1,
    height: 1,
    marginLeft: 12,
  },
});
