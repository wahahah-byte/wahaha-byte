import { memo, useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ActivityIndicator,
  LayoutAnimation,
  Platform,
  Pressable,
  RefreshControl,
  SectionList,
  StyleSheet,
  UIManager,
  View,
} from "react-native";

// Enable LayoutAnimation on Android — iOS supports it out of the box. Without
// this the row-moves-between-sections transition stays a hard jump on Android.
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { router, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Svg, { Path, Polyline, Rect } from "react-native-svg";

import { ArchiveIcon, CheckIcon, DeleteIcon, PauseIcon, StartIcon, UnarchiveIcon } from "@/components/action-icons";
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

/** Top-of-screen pill that surfaces transient errors without replacing the
 *  list. Auto-dismisses after 7 s; resets the timer if the message changes
 *  (a fresh error supersedes any pending dismissal of the previous one). */
function ErrorToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const c = useColors();
  useEffect(() => {
    const t = setTimeout(onDismiss, 7000);
    return () => clearTimeout(t);
  }, [message, onDismiss]);
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        top: 12,
        left: 16,
        right: 16,
        zIndex: 50,
        alignItems: "center",
      }}
    >
      <Pressable
        onPress={onDismiss}
        style={{
          backgroundColor: c.dangerBg,
          borderColor: c.danger,
          borderWidth: 1,
          borderRadius: 999,
          paddingVertical: 10,
          paddingHorizontal: 18,
          maxWidth: "100%",
        }}
      >
        <ThemedText style={{ color: c.danger, fontSize: 12, textAlign: "center" }}>
          {message}
        </ThemedText>
      </Pressable>
    </View>
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
  getNextDueDate,
  isCheckedInThisCycle,
  isCycleClosed,
  isOverdue,
  getPrevPeriodStart,
  parseLocalDate,
  type CheckInCycleDto,
  PRIORITY_DOT,
  sep,
  todayLocalKey,
  willStreakResetOnCheckIn,
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
  // Monotonic counter bumped on every successful fetchTasks. Threaded down to
  // each TaskRow so its inFlightActionRef can self-clear on refresh — gives
  // the user a manual recovery path (pull-to-refresh) for any row whose
  // guard somehow latched without a natural clear. The 2 s safety timeout
  // is still the primary recovery; this just makes it user-driven.
  const [refreshTick, setRefreshTick] = useState(0);
  // Per-task timestamp of the most recent in-session check-in. Drives the
  // sort order inside the Checked In section so a freshly-checked-in row
  // always lands on top — even if it was previously undone and re-checked
  // in. For tasks the user hasn't touched this session, we fall back to
  // the latest cycle's createdAt so prior-session check-ins still order
  // most-recent-first.
  const [recentCheckinTs, setRecentCheckinTs] = useState<Map<string, number>>(new Map());
  // Global navigation lock — prevents rapid taps from stacking multiple
  // detail-screen modals on top of each other. Expo Router's push is
  // fire-and-forget; without this, three quick taps push three modals,
  // each requiring its own back gesture to dismiss, and an over-stack of
  // modals leaves the underlying tab screen unable to handle other
  // gestures (drawer swipe, new-task tap). 600 ms covers the modal-open
  // animation; subsequent taps after that animate normally.
  const lastNavAtRef = useRef<number>(0);
  const tryNavigate = useCallback((): boolean => {
    const now = Date.now();
    if (now - lastNavAtRef.current < 600) return false;
    lastNavAtRef.current = now;
    return true;
  }, []);
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
    setRefreshTick((t) => t + 1);
    // Seed the task cache so the detail modal can render synchronously
    // when the user taps a row — eliminates the spinner-then-content flash.
    taskCache.setMany(res.data.data);
    // No need to call onTasksLoaded here — the effect below mirrors the
    // local `tasks` state to the parent on every change, including this
    // initial setTasks call.
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    fetchTasks().finally(() => setLoading(false));
  }, [fetchTasks, refreshKey]);

  useFocusEffect(useCallback(() => { fetchTasks(); }, [fetchTasks]));

  // Stuck-row recovery. A TaskRow that detects checkedThisCycle=true but
  // latestCheckinCycle=null (rapid-tap session left local recentCycles
  // stale) emits this event; we refetch so the next interaction sees
  // canonical state. useFocusEffect alone doesn't catch this because
  // /task/[id] is presented as a transparentModal — the list never blurs.
  useEffect(() => {
    return taskEvents.subscribeRefreshRequested(() => { fetchTasks(); });
  }, [fetchTasks]);

  // Mirror the local tasks state to the parent so derived UI (filter
  // counts, submit bar totals, etc.) reflects optimistic mutations the
  // moment they happen — check-ins, completes, archives, deletes, undos.
  // Previously onTasksLoaded only fired after a full fetchTasks call, so
  // local setTasks calls (which exist precisely to avoid round-trips)
  // left the parent's view of the list stale.
  useEffect(() => {
    onTasksLoaded?.(tasks);
  }, [tasks, onTasksLoaded]);

  // Optimistic check-in updates from the detail modal — see lib/task-events.
  // The modal emits the moment the slide commits, so the row visibly moves
  // into the "Checked In" / "Upcoming" section under the modal while the
  // slide's celebration animation is still playing. We patch dueDate too
  // because isCheckedInThisCycle gates on `today < dueDate` — without the
  // advance, daily tasks (dueDate = today) wouldn't move sections.
  useEffect(() => {
    return taskEvents.subscribeCheckedIn(({ taskId, lastCheckInDateIso, nextDueDateIso }) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.taskId !== taskId) return t;
          // Capture pre-checkin dueDate so the inline undo can restore the
          // original overdue state instantly — mirrors handleCheckIn's
          // bookkeeping for check-ins committed via the leading checkbox.
          preCheckinDueDateRef.current.set(taskId, t.dueDate);
          return { ...t, lastCheckInDate: lastCheckInDateIso, dueDate: nextDueDateIso };
        })
      );
      // Pin to top of Checked In — same logic as handleCheckIn's optimistic
      // path, just triggered by a check-in committed from the detail modal.
      setRecentCheckinTs((prev) => {
        const next = new Map(prev);
        next.set(taskId, Date.now());
        return next;
      });
    });
  }, []);


  // Per-task debounce. Without this, rapidly tapping the same row's checkbox
  // (or alternating check-in / undo too fast) caused overlapping server
  // requests — partial-write states on the backend (task.LastCheckInDate
  // updated but no cycle written, etc.) and DbUpdateConcurrencyException on
  // shared rows like streaks. 400ms is long enough to absorb a triple-tap
  // burst but short enough that intentional sequential taps feel fine.
  const lastActionAtRef = useRef<Map<string, number>>(new Map());
  const ACTION_DEBOUNCE_MS = 400;
  // Remember the dueDate each task had at check-in time so the immediate
  // undo path can restore it optimistically. Without this, the undo's
  // optimistic patch rolls dueDate back by one period via getPrevPeriodStart
  // (e.g. tomorrow → today), which is correct for tasks that weren't overdue
  // but loses the original overdue state for tasks that were behind multiple
  // periods. The server response carries previousDueDate ~300 ms later, but
  // until then the red overdue border doesn't reappear — that's the gap
  // the user was seeing.
  const preCheckinDueDateRef = useRef<Map<string, string | null>>(new Map());
  const tryClaimAction = useCallback((taskId: string): boolean => {
    const now = Date.now();
    const last = lastActionAtRef.current.get(taskId) ?? 0;
    if (now - last < ACTION_DEBOUNCE_MS) return false;
    lastActionAtRef.current.set(taskId, now);
    return true;
  }, []);
  // Read-only peek for the tap handler: returns true iff a tryClaimAction call
  // RIGHT NOW would succeed. Used to short-circuit the row's armGuard so it
  // doesn't latch the inFlight ref on a tap whose underlying handler is about
  // to be debounce-blocked anyway — that combination produced a stuck checkbox
  // (guard set, no in-flight work to clear it, 2 s safety timeout to recover).
  const canActNow = useCallback((taskId: string): boolean => {
    const now = Date.now();
    const last = lastActionAtRef.current.get(taskId) ?? 0;
    return now - last >= ACTION_DEBOUNCE_MS;
  }, []);

  async function handleCheckIn(task: TaskDto) {
    if (!tryClaimAction(task.taskId)) return;

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
    // Remember the original dueDate so an immediate undo can restore the
    // pre-checkin overdue state instantly (see preCheckinDueDateRef).
    preCheckinDueDateRef.current.set(task.taskId, task.dueDate);
    // Advance dueDate optimistically too — without this the row stays in the
    // active section until the server response lands (~300 ms), because
    // isCheckedInThisCycle requires today < dueDate. Mirrors server's
    // ComputeNextDueDate so the row jumps straight to "Checked In". Fall
    // back to "daily" if recurrenceRule is somehow missing — only recurring
    // tasks reach this handler, and the worst-case is one extra day of
    // optimistic dueDate that the server response immediately corrects.
    // For overdue tasks, base the next-period advance on today, not on the
    // past dueDate — a daily task overdue by a day would otherwise land on
    // today (yesterday + 1) instead of tomorrow, and the row would visibly
    // correct itself once the server response (which already does this
    // catch-up) landed ~300 ms later.
    const dueBase = task.isRecurring && isOverdue(task.dueDate) ? todayIso : task.dueDate;
    const optimisticDue = task.isRecurring
      ? getNextDueDate(dueBase, task.recurrenceRule ?? "daily")
      : task.dueDate;
    // Pin this row to the top of the Checked In section — even if the user
    // had previously undone and re-checked in, the fresh timestamp wins
    // over its earlier position.
    setRecentCheckinTs((prev) => {
      const next = new Map(prev);
      next.set(task.taskId, Date.now());
      return next;
    });
    // Smooth the SectionList re-layout. Even though the optimistic patch
    // recomputes `sections` synchronously and the row's new home is the
    // Checked In section, RN's SectionList has a perceptible delay when an
    // item crosses a section boundary (it unmounts in the old section and
    // remounts in the new one) — the user reads that as the row briefly
    // "staying" at the bottom of active before snapping into place. A short
    // ease-in-out smooths the transition so the row visibly slides into its
    // new home in one motion instead of two paint stages.
    LayoutAnimation.configureNext({
      duration: 220,
      create: { type: "easeInEaseOut", property: "opacity" },
      update: { type: "easeInEaseOut" },
      delete: { type: "easeInEaseOut", property: "opacity" },
    });
    // Optimistic streak increment so the in-row badge reflects the new
    // value in the same frame as the row's section move. Mirrors the
    // server's reset rule in CheckInTask.cs (daysSinceLast > maxGapDays
    // per recurrence rule) so the prediction matches the authoritative
    // value with no intermediate bounce. Previously this used isOverdue
    // as the proxy, which over-predicted reset for weekdays tasks (a 1-2
    // day gap is within the 3-day tolerance but is still "overdue" by
    // dueDate) and made the streak briefly drop to 1 before snapping
    // back to N+1.
    const willResetStreak = willStreakResetOnCheckIn(task.recurrenceRule, task.lastCheckInDate, task.dueDate);
    const predictedStreak = willResetStreak ? 1 : (task.currentStreakCount ?? 0) + 1;
    // longestStreakCount tracks the all-time peak — only bump it when the
    // prediction exceeds the current peak (so the same +1 doesn't double-
    // count when the user re-checks-in after an undo).
    setTasks((prev) => prev.map((t) => {
      if (t.taskId !== task.taskId) return t;
      const prevLongest = t.longestStreakCount ?? 0;
      return {
        ...t,
        lastCheckInDate: todayIso,
        dueDate: optimisticDue,
        currentStreakCount: predictedStreak,
        longestStreakCount: Math.max(prevLongest, predictedStreak),
      };
    }));

    const res = await tasksApi.checkIn(task.taskId);
    if (res.error) {
      // "Already checked in for this cycle" is a race-condition false
      // positive — a previous tap (or a parallel request) already created
      // the cycle server-side. Our optimistic state matches reality, so do
      // nothing: don't toast, don't refetch. Refetching here would flicker
      // the row back to unchecked because fetchTasks can race ahead of the
      // FIRST tap's in-flight success response (which hasn't committed the
      // cycle to the DB yet), returning pre-checkin server state. When the
      // first response finally lands it patches recentCycles anyway, and
      // the next tab focus / pull-to-refresh reconciles cleanly.
      if (/already\s+checked\s*in/i.test(res.error)) return;
      // Other errors (cap reached, task vanished, etc.) — refresh from the
      // server to reconcile rather than rolling back blindly. Same end
      // result as a rollback for true-error cases (row returns to Active
      // because the server says it isn't checked in), but without the
      // intermediate "checked → unchecked → checked" flicker that the old
      // rollback caused on false positives.
      setError(res.error);
      fetchTasks();
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
      setTasks((prev) => prev.map((t) => {
        if (t.taskId !== task.taskId) return t;
        // Race-aware patch (symmetric to performUndoCheckIn). If the user
        // optimistically undid AFTER our optimistic check-in, t.lastCheckInDate
        // is null — we set it in the optimistic check-in patch above, and an
        // undo's optimistic patch is the only thing that nulls it. Restoring
        // dueDate to tomorrow here would pop the row back to the Checked In
        // section even though the user has since unchecked. Skip the state
        // restore in that case; still add the cycle for accurate history
        // (the undo's own server response will remove it if/when it lands).
        if (t.lastCheckInDate == null || t.lastCheckInDate === "") {
          return { ...t, recentCycles: [newCycle, ...(t.recentCycles ?? [])] };
        }
        return {
          ...t,
          dueDate: data.nextDueDate ?? t.dueDate,
          currentStreakCount: data.streakCount,
          longestStreakCount: data.longestCount,
          recentCycles: [newCycle, ...(t.recentCycles ?? [])],
        };
      }));
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
    // Prefer the remembered pre-checkin dueDate (set in handleCheckIn) when
    // the user is undoing a check-in committed in this session. This restores
    // the precise original state — critical for previously-overdue tasks
    // whose dueDate was N periods in the past: getPrevPeriodStart only rolls
    // back ONE period (tomorrow → today), so the red overdue border wouldn't
    // re-appear until the server response landed ~300 ms later. Falls back
    // to the one-period rollback for cycles that weren't created in this
    // session (no remembered value).
    const rememberedDue = preCheckinDueDateRef.current.get(taskId);
    // For cycles loaded from a previous session, the ref above is empty —
    // look up the cycle's previousDueDate (newly surfaced on the DTO) as
    // the next-best signal. This restores the precise overdue state on
    // undo without waiting for the server response, so the red border
    // re-appears in the same render.
    const cycleSnapshot = (() => {
      const t = tasks.find((x) => x.taskId === taskId);
      return t?.recentCycles?.find((c) => c.cycleId === cycleId) ?? null;
    })();
    const cyclePreviousDue = cycleSnapshot?.previousDueDate ?? undefined;
    // Smooth the cross-section move on the undo path too — mirrors the
    // LayoutAnimation in handleCheckIn. Without it, the row's animation
    // from Checked In back to Active is a hard jump (and the red overdue
    // border / cleared tier badge appear with a perceptible beat once the
    // section re-mount finishes). The eased layout transition keeps the
    // visual change in one motion.
    LayoutAnimation.configureNext({
      duration: 220,
      create: { type: "easeInEaseOut", property: "opacity" },
      update: { type: "easeInEaseOut" },
      delete: { type: "easeInEaseOut", property: "opacity" },
    });
    setTasks((prev) => prev.map((t) => {
      if (t.taskId !== taskId) return t;
      snapshot = t;
      const cycles = (t.recentCycles ?? []).filter((c) => c.cycleId !== cycleId);
      // Three-tier dueDate restore, most precise first:
      //   1. In-session preCheckinDueDateRef — exact pre-checkin dueDate
      //      captured at handleCheckIn time.
      //   2. Cycle's previousDueDate snapshot — exact value from the DB,
      //      handles cycles from prior sessions.
      //   3. getPrevPeriodStart fallback — one period back from current
      //      dueDate; close enough for the common case but loses the
      //      "originally overdue by multiple periods" detail until the
      //      server response patches it.
      const optimisticDue = rememberedDue !== undefined
        ? rememberedDue
        : cyclePreviousDue !== undefined && cyclePreviousDue !== null && cyclePreviousDue !== ""
          ? cyclePreviousDue.split("T")[0]
          : (t.dueDate && t.recurrenceRule
            ? dateKey(getPrevPeriodStart(parseLocalDate(t.dueDate), t.recurrenceRule))
            : t.dueDate);
      // Optimistic streak decrement. Unlike handleCheckIn — where a +1
      // prediction can bounce when the server resets the streak first
      // (gap crossed) — an undo against a specific cycleId is deterministic:
      // the server returns current-1 in the common case, so predicting it
      // here lets the in-row badge update in the same frame as the row's
      // section move instead of lagging until the response lands. longest
      // is left alone — the server preserves the all-time peak across
      // undos so a prediction would mis-fire on the boundary check-in.
      const prevCount = t.currentStreakCount ?? 0;
      return {
        ...t,
        recentCycles: cycles,
        dueDate: optimisticDue,
        lastCheckInDate: null,
        currentStreakCount: Math.max(0, prevCount - 1),
      };
    }));
    // Clear the remembered value — a subsequent check-in will repopulate it
    // with the fresh pre-checkin state. Leaving stale entries around would
    // mis-fire on a future undo whose check-in came from a refetch.
    preCheckinDueDateRef.current.delete(taskId);

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
      // Guard against out-of-order responses corrupting the row state. If
      // the user did check-in → undo → check-in in quick succession, the
      // undo's response (carrying the snapshot from BEFORE the first
      // check-in) can arrive after the second check-in's optimistic patch
      // OR its server response has already advanced dueDate / set
      // lastCheckInDate to today. Overwriting with the stale snapshot would
      // leave the row in a "grey but empty checkbox" zombie state where
      // lastCheckInDate is a prior date but dueDate is in the future.
      // Two signals say "a newer check-in already owns this row":
      //   - A higher cycleId in recentCycles (post-server-response).
      //   - lastCheckInDate is non-null (post-optimistic-patch). We
      //     EXPLICITLY set it to null in our undo's optimistic patch above,
      //     so a non-null value here means a re-checkin's optimistic patch
      //     intervened between our optimistic patch and this response.
      //     Without this second signal, the flicker shows up as: undo →
      //     optimistic re-checkin (row jumps to Checked In) → undo's
      //     server response lands first (row pops BACK to Active) →
      //     re-checkin's response lands (row settles in Checked In).
      const hasNewerCheckin = cycles.some(
        (c) => c.cycleType === "checkin" && c.cycleId > cycleId,
      ) || (t.lastCheckInDate != null && t.lastCheckInDate !== "");
      // Empty string from server = "no prior check-in" — null it so
      // canCheckInNow() unlocks the task.
      const restoredLastCheckIn = hasNewerCheckin
        ? t.lastCheckInDate
        : (data.previousLastCheckInDate || null);
      // If the server has no previousDueDate snapshot (older cycles created
      // before the rollback fields were added), compute it client-side by
      // rolling dueDate back one period. Without this, dueDate stays at
      // "tomorrow" and isCheckedInThisCycle keeps the row pinned to the
      // Checked In section even though lastCheckInDate is cleared.
      const restoredDueDate = hasNewerCheckin
        ? t.dueDate
        : (data.previousDueDate
          || (t.dueDate && t.recurrenceRule
            ? dateKey(getPrevPeriodStart(parseLocalDate(t.dueDate), t.recurrenceRule))
            : t.dueDate));
      return {
        ...t,
        recentCycles: cycles,
        currentStreakCount: data.streakCount,
        longestStreakCount: data.longestCount,
        dueDate: restoredDueDate,
        lastCheckInDate: restoredLastCheckIn,
      };
    }));
    // NOTE: deliberately NOT firing emitRefreshRequested here. It
    // triggered a follow-up fetchTasks that raced the response patch
    // above and, when the streak's IsActive flipped (legitimate reset
    // restore), the refresh returned currentStreakCount=null — making
    // the tier badge vanish until another full refresh. The detail
    // screen still syncs on focus via its own useFocusEffect.
  }

  // Within-day inline undo — fires from the leading checkbox on each row
  // (see TaskRow). Available until midnight so the user can reverse a
  // check-in long after the moment of action.
  async function handleUndoCheckIn(task: TaskDto, cycleId: number) {
    if (!tryClaimAction(task.taskId)) return;
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

  // Pending → in_progress. Mirrors web's useTaskActions.handleAdvance
  // pending-branch: optimistic status flip, hit the dedicated /start endpoint,
  // refetch on error to reconcile.
  async function handleStart(task: TaskDto) {
    setTasks((prev) =>
      prev.map((t) => (t.taskId === task.taskId ? { ...t, status: "in_progress" } : t))
    );
    const res = await tasksApi.start(task.taskId);
    if (res.error) {
      setError(res.error);
      await fetchTasks();
    }
  }

  // in_progress → pending. Web's handlePause uses tasksApi.update with the
  // full task payload because there's no dedicated /pause endpoint. We do the
  // same — the update call carries every required field so the server-side
  // validator doesn't reject a partial payload.
  async function handlePause(task: TaskDto) {
    setTasks((prev) =>
      prev.map((t) => (t.taskId === task.taskId ? { ...t, status: "pending" } : t))
    );
    const res = await tasksApi.update(task.taskId, {
      taskId: task.taskId,
      title: task.title,
      description: task.description ?? undefined,
      category: task.category,
      priority: task.priority,
      status: "pending",
      pointValue: task.pointValue,
      dueDate: task.dueDate ?? undefined,
      completedAt: undefined,
      isRecurring: task.isRecurring,
      recurrenceRule: task.recurrenceRule ?? undefined,
      submitted: task.submitted,
    });
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
      // Most-recent check-in on top: in-session timestamp wins over the
      // latest cycle's createdAt fallback (which keeps prior-session rows
      // ordered most-recent-first too). An undo+recheckin re-stamps the
      // timestamp, so the row jumps back to the top regardless of where
      // it sat before.
      const tsOf = (t: TaskDto): number => {
        const sessionTs = recentCheckinTs.get(t.taskId);
        if (sessionTs !== undefined) return sessionTs;
        const latestCycle = t.recentCycles?.find((c) => c.cycleType === "checkin");
        return latestCycle ? new Date(latestCycle.createdAt).getTime() : 0;
      };
      checkedIn.sort((a, b) => tsOf(b) - tsOf(a));
      // Three layout cases: both buckets non-empty → render with the
      // "Checked In" separator; only checkedIn non-empty → render the
      // sorted checkedIn list directly (no separator needed when nothing
      // is left to do); only active non-empty → fall back to the buildList
      // ordering (no checkedIn to put on top of).
      if (active.length > 0 && checkedIn.length > 0) {
        finalItems = [...active, sep("Checked In", "__sep-checked-in"), ...checkedIn];
      } else if (checkedIn.length > 0) {
        finalItems = [...checkedIn];
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
  }, [tasks, activeFilter, groupMode, sortMode, preFilter, splitCheckedIn, submittedTaskIds, uncompletedCollapsed, recentCheckinTs]);

  async function onRefresh() {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }

  // Errors no longer replace the entire list — see <ErrorToast/> injected in
  // the main and empty renders below. Replacing the SectionList wiped the
  // pull-to-refresh control too, leaving the user with no way out except a
  // tab switch.

  if (loading && tasks.length === 0) {
    return <ActivityIndicator color={c.activeHighlight} />;
  }

  const isEmpty = sections.length === 0 || sections.every((s: { data: TaskDto[] }) => s.data.length === 0);
  if (isEmpty) {
    return (
      <View style={{ flex: 1, position: "relative" }}>
        {error ? <ErrorToast message={error} onDismiss={() => setError(null)} /> : null}
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
    {error ? <ErrorToast message={error} onDismiss={() => setError(null)} /> : null}
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
      // Intentionally not using removeClippedSubviews — it caused the row to
      // visibly stall at the bottom of the active section for a beat before
      // settling into the Checked In section after a check-in. The clipping
      // pass appears to delay the cross-section re-mount on Android in
      // particular. Routines lists are short enough (~20-30 rows) that the
      // memory savings aren't worth the perceived UX hitch.
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
              onStart={handleStart}
              onPause={handlePause}
              onArchive={handleArchive}
              onUndoCheckIn={handleUndoCheckIn}
              onDelete={handleDelete}
              canActNow={canActNow}
              tryNavigate={tryNavigate}
              refreshTick={refreshTick}
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
  onStart: (t: TaskDto) => void;
  onPause: (t: TaskDto) => void;
  onArchive: (t: TaskDto) => void;
  onDelete: (t: TaskDto) => void;
  onUndoCheckIn: (t: TaskDto, cycleId: number) => void;
  canActNow: (taskId: string) => boolean;
  tryNavigate: () => boolean;
  refreshTick: number;
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
  canActNow,
  tryNavigate,
  refreshTick,
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
  // Proactive clear for check-in only: once today's check-in cycle has
  // landed in recentCycles (server response from handleCheckIn patched the
  // row), the in-flight guard is stale — clearing it here lets the user
  // tap the next action without waiting for the safety-net timeout.
  //
  // Intentionally NO undo branch: the undo's optimistic patch removes the
  // cycle from recentCycles BEFORE the network call settles, so a
  // symmetric "cycle disappeared → clear" rule fired immediately on the
  // optimistic patch and effectively disabled the lock. Without it the
  // tap handler's `if (inFlight) return;` gate works as advertised — the
  // undo's guard is cleared by the safety timeout (or by a subsequent
  // refresh) once the server has had time to settle.
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
  // User-driven recovery: bumping refreshTick (parent's fetchTasks completed)
  // clears any latched guard so a stuck row becomes tappable again after a
  // pull-to-refresh. The natural clear above handles the happy path; this
  // covers the rare case where the guard is stuck because the action never
  // produced an observable outcome (handler debounce-blocked, network
  // dropped silently, etc.) and the 2 s safety timeout hasn't fired yet.
  useEffect(() => {
    inFlightActionRef.current = null;
  }, [refreshTick]);
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
  // Non-recurring task action gating — mirrors web's TaskRow swipe panel.
  // Start shows for any pending task (overdue or not); web routes overdue
  // through onRestartOverdue with a danger-red icon, which we'll add later.
  // Pause and Complete both show on in_progress so the user can either back
  // off or finish from the swipe without a round-trip through the modal.
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
  // Archive is hidden for recurring tasks — routines aren't meant to be
  // archived; delete is the right exit for them. Backend rule
  // (ArchiveTask.cs): only completed tasks can be archived. On top of
  // that we also require the task to be *submitted* (points banked)
  // before archiving — completed-but-not-yet-banked rows belong in the
  // bulk-submit flow, not the archive. Unarchive is fine on any archived
  // task, so we keep that branch open.
  const isSubmittedForArchive = item.submitted === true || !!item.pointsAwarded;
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
          // Generous hit-slop — the checkbox itself stays small, but the
          // tap zone extends ~22 px past its visible bounds on every side
          // so a finger landing anywhere near it commits/undoes instead
          // of falling through to the row tap (which opens the detail
          // modal). Capped at 22 to avoid swallowing taps meant for the
          // task title / due date pill that sit to its right.
          const SLOP = 22;
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
              // Lock window — taps on this row are dropped until this
              // clears. Check-in clears naturally when the server's new
              // cycle lands in recentCycles (~300 ms typically). Undo has
              // no natural clear (the cycle is removed optimistically
              // before the server settles), so this 1 s timeout is the
              // only release. 1 s covers typical network response time
              // while still feeling responsive — the user's first action
              // commits before the second is allowed through.
              setTimeout(() => {
                if (inFlightActionRef.current?.kind === kind
                    && inFlightActionRef.current.cycleId === cycleId) {
                  inFlightActionRef.current = null;
                }
              }, 1000);
            };
            // Strict in-flight gate: block ALL taps on this row until the
            // previous action's outcome is observable. Previously the gate
            // was per-direction (check-in tap blocked if a check-in was in
            // flight, but an undo tap was allowed to clear the guard and
            // proceed). That meant rapid alternating taps queued up
            // sequential server calls — the user saw the row flip back and
            // forth as each one landed in turn. With a unidirectional gate
            // the row stays in whatever state the FIRST tap set it to until
            // that action's response (or the 2 s safety timeout) clears
            // inFlight, then the next tap is free to commit.
            if (inFlight) return;
            if (checkedThisCycle && latestCheckinCycle) {
              // Server rule (UndoCheckIn.cs): "Check-ins can only be undone
              // on the same day they were made." Two independent signals
              // say "today's check-in is the one to undo":
              //   - task.lastCheckInDate equals todayKey
              //   - latest cycle's checkInDate equals todayKey
              // Either is sufficient. For genuinely-old multi-day check-ins
              // (weekly etc. committed days ago), BOTH signals are false
              // and we fall through to the default tap (opens detail).
              const couldBeTodaysCheckin =
                wasCheckedInToday ||
                latestCheckinCycle.checkInDate.split("T")[0] === todayKey;
              if (couldBeTodaysCheckin) {
                if (!canActNow(item.taskId)) return;
                armGuard("undo", latestCheckinCycle.cycleId);
                onUndoCheckIn(item, latestCheckinCycle.cycleId);
                return;
              }
              // Neither signal points to today → fall through (open detail)
            } else if (canCheckInThisCycle || overdueRecurring) {
              // Overdue routines check in too: server reschedules the dueDate
              // on commit, so a missed routine recovers in one tap.
              if (!canActNow(item.taskId)) return;
              armGuard("check-in", 0);
              onCheckIn(item);
              return;
            }
            // Stuck-state direct repair. checkedThisCycle=true but no
            // checkin cycles exist means the task has task.LastCheckInDate
            // set without any backing cycle row (residue from a CheckInTask
            // request that crashed between updating the task and creating
            // the cycle — they're separate SaveChanges calls in
            // CheckInTask.cs, not transactional). The user's intent here
            // is "undo this", so we fire the dedicated repair endpoint
            // which clears LastCheckInDate and rolls DueDate back, then
            // refresh to surface the cleaned-up state. No detail-screen
            // detour because the action IS the recovery.
            if (checkedThisCycle && !latestCheckinCycle) {
              tasksApi.repairCheckIn(item.taskId).finally(() => {
                taskEvents.emitRefreshRequested();
              });
              return;
            }
            // Otherwise (locked not-yet-due, or some other "no action
            // applies" state), fall through to the default tap so the
            // user gets feedback (detail screen opens).
          }
        }
        // Selection-tap on the Completed tab — same pattern as web's checkbox,
        // but mobile users tap anywhere on the row since the action-bar slot
        // is given over to SubmitBar in this mode.
        if (isSelectable) onToggleSelect?.(item.taskId);
        else {
          // Global nav lock — drops the tap if another navigation just fired.
          // Without this, rapid taps stack multiple modals, requiring as many
          // back gestures to dismiss; an over-stacked screen also leaves the
          // underlying tab unable to handle drawer-swipe or new-task taps.
          if (!tryNavigate()) return;
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
              // Multi-day cadences (weekly / biweekly / monthly) can be in a
              // "checked this cycle but the check-in itself was days ago"
              // state. The server only allows same-day undo (UndoCheckIn.cs
              // gates on cycle.CheckInDate.Date == today), so the checkbox
              // tap is a no-op for those rows. Surface that via the same
              // locked opacity used for not-yet-due rows so users don't
              // wonder why nothing happens when they tap.
              //
              // The "could be today" predicate mirrors the tap handler
              // exactly — either the task's own lastCheckInDate is today
              // (wasCheckedInToday, what the server actually compares
              // against) or the cycle's CheckInDate string matches today.
              // Without both signals the box was getting locked on any
              // task whose cycle row date and task.lastCheckInDate had
              // drifted apart, even though tapping it would have fired
              // a valid undo.
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
                {item.isRecurring && !isInProgress && !overdueRecurring
                  && !canCheckInNow(item.dueDate, item.recurrenceRule, item.lastCheckInDate) ? (
                  <LockIcon />
                ) : null}
                {item.wasPenalized ? (
                  <View style={[styles.badge, { backgroundColor: c.dangerBg, borderColor: c.dangerBorder }]}>
                    <ThemedText style={{ fontSize: 9, color: c.danger, letterSpacing: 0.5 }}>
                      PENALIZED
                    </ThemedText>
                  </View>
                ) : null}
                {item.isRecurring && (() => {
                  // Show the streak for any positive count, even below the
                  // tier-1 threshold. Hiding the badge entirely once the
                  // count drops under 3 read as "the streak vanished" when
                  // the user undid a check-in that brought them back to
                  // 1 or 2 — really their streak is just one tier-up away
                  // again, not gone. The tier label only appears above the
                  // tier-1 boundary so the original tier ladder still
                  // signals progression.
                  const count = item.currentStreakCount ?? 0;
                  if (count < 1) return null;
                  const tier = currentStreakTier(count);
                  return (
                    <ThemedText style={{
                      fontSize: 8,
                      color: c.secondaryAccent,
                      letterSpacing: 1.5,
                      fontVariant: ["tabular-nums"],
                      opacity: 0.85,
                    }}>
                      {tier ? `${tier.label} · ${count}` : `STREAK · ${count}`}
                    </ThemedText>
                  );
                })()}
              </View>
            </View>
          </View>
          <View style={styles.dateCol}>
            {/* Overdue cue is conveyed entirely by the date colour going
                red — the prior ⚠ glyph was visual noise on top of that. */}
            <ThemedText style={{
              fontSize: 12,
              color: overdueRow ? c.danger : c.fgMuted,
              fontWeight: overdueRow ? "600" : "400",
              fontVariant: ["tabular-nums"],
            }}>
              {due}
            </ThemedText>
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
