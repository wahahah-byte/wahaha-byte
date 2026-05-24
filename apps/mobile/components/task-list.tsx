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

// Enable LayoutAnimation on Android (iOS supports it natively).
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { router, useFocusEffect } from "expo-router";
import * as Haptics from "expo-haptics";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import Svg, { Line, Path, Polyline, Rect } from "react-native-svg";

import { ArchiveIcon, CheckIcon, DeleteIcon, PauseIcon, StartIcon, UnarchiveIcon } from "@/components/action-icons";
import { BankBurstEffect } from "@/components/bank-burst-effect";
import { CheckInBurstEffect } from "@/components/checkin-burst-effect";
import { SLASH_MS, SlashingRow } from "@/components/slashing-row";
import { SwipeRowProvider, useSwipeRow } from "@/components/swipe-row-context";
import { SwipeableRow, type SwipeAction } from "@/components/swipeable-row";

// Closes any open swipe row on tap.
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

// Transient error pill, auto-dismisses after 7s.
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
import { useUndo } from "@/context/undo-context";

interface Props {
  filters?: TaskFilterParams;
  emptyText?: string;
  activeFilter?: "pending" | "in_progress" | "completed" | "all";
  groupMode?: GroupMode;
  sortMode?: SortMode;
  // Bump to force refetch.
  refreshKey?: number;
  // Optional client-side predicate before buildListItems.
  preFilter?: (task: TaskDto) => boolean;
  // Routines-only: split checked-in tasks into a separate section.
  splitCheckedIn?: boolean;
  // Called whenever a fetch lands.
  onTasksLoaded?: (tasks: TaskDto[]) => void;
  // Submit/bank flow selection set.
  selectedIds?: Set<string>;
  onToggleSelect?: (taskId: string) => void;
  // IDs filtered out of the completed list this session.
  submittedTaskIds?: Set<string>;
  // IDs playing bank-burst animation.
  bankingIds?: Set<string>;
  // Routines-only: swap priority dot for check-in checkbox.
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
  const undo = useUndo();

  const [tasks, setTasks] = useState<TaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Refresh counter — lets TaskRow self-clear stuck guards on pull-to-refresh.
  const [refreshTick, setRefreshTick] = useState(0);
  // Pin freshly-checked-in rows to top of Checked In section.
  const [recentCheckinTs, setRecentCheckinTs] = useState<Map<string, number>>(new Map());
  // Global nav lock — prevents rapid taps from stacking modals.
  const lastNavAtRef = useRef<number>(0);
  const tryNavigate = useCallback((): boolean => {
    const now = Date.now();
    if (now - lastNavAtRef.current < 600) return false;
    lastNavAtRef.current = now;
    return true;
  }, []);
  // Active-section collapse toggle (only on "all" filter).
  const [uncompletedCollapsed, setUncompletedCollapsed] = useState(false);
  // Check-in burst animation owner.
  const [burstTaskId, setBurstTaskId] = useState<string | null>(null);
  const burstTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Slash-to-delete animation owner.
  const [slashingId, setSlashingId] = useState<string | null>(null);
  useEffect(() => () => {
    if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
  }, []);

  // Guard against fetchTasks clobbering optimistic check-in state.
  const PENDING_CHECKIN_TTL_MS = 5000;
  const pendingCheckInsRef = useRef<Map<string, number>>(new Map());
  const markPendingCheckIn = useCallback((taskId: string) => {
    pendingCheckInsRef.current.set(taskId, Date.now());
  }, []);
  const clearPendingCheckIn = useCallback((taskId: string) => {
    pendingCheckInsRef.current.delete(taskId);
  }, []);
  // Undos queued while the check-in POST is still in flight.
  const queuedUndosRef = useRef<Set<string>>(new Set());
  const queueUndoOnCommit = useCallback((taskId: string) => {
    queuedUndosRef.current.add(taskId);
  }, []);
  // Forward-ref so subscribeCheckInCommitted calls the latest closure.
  const performUndoRef = useRef<(taskId: string, cycleId: number) => Promise<void>>(
    () => Promise.resolve(),
  );
  // True while a check-in POST is genuinely in flight.
  const isCheckInPending = useCallback((taskId: string) => {
    const ts = pendingCheckInsRef.current.get(taskId);
    if (ts === undefined) return false;
    if (Date.now() - ts > PENDING_CHECKIN_TTL_MS) {
      pendingCheckInsRef.current.delete(taskId);
      return false;
    }
    return true;
  }, []);

  // Hide tasks during the undo window so focus refetches don't resurrect them before the server delete fires.
  const PENDING_DELETE_TTL_MS = 7000;
  const pendingDeletesRef = useRef<Map<string, number>>(new Map());
  const markPendingDelete = useCallback((taskId: string) => {
    pendingDeletesRef.current.set(taskId, Date.now());
  }, []);
  const clearPendingDelete = useCallback((taskId: string) => {
    pendingDeletesRef.current.delete(taskId);
  }, []);

  const fetchTasks = useCallback(async () => {
    setError(null);
    const res = await tasksApi.getAll({ pageSize: 50, ...filters });
    if (!res.data) {
      setError(res.error ?? "Failed to load tasks.");
      return;
    }
    const now = Date.now();
    // Drop stale pending-delete entries; filter rest out of the incoming list.
    for (const [tid, ts] of pendingDeletesRef.current) {
      if (now - ts > PENDING_DELETE_TTL_MS) pendingDeletesRef.current.delete(tid);
    }
    const incoming = pendingDeletesRef.current.size > 0
      ? res.data.data.filter((t) => !pendingDeletesRef.current.has(t.taskId))
      : res.data.data;
    // Drop stale pending-checkin entries.
    for (const [tid, ts] of pendingCheckInsRef.current) {
      if (now - ts > PENDING_CHECKIN_TTL_MS) pendingCheckInsRef.current.delete(tid);
    }
    if (pendingCheckInsRef.current.size === 0) {
      setTasks(incoming);
    } else {
      const todayKey = todayLocalKey();
      setTasks((prev) => {
        const prevById = new Map(prev.map((t) => [t.taskId, t]));
        return incoming.map((fresh) => {
          if (!pendingCheckInsRef.current.has(fresh.taskId)) return fresh;
          // Server caught up — trust fresh data.
          const freshLastCheckInToday =
            (fresh.lastCheckInDate ?? "").split("T")[0] === todayKey;
          const freshHasTodaysCheckin = (fresh.recentCycles ?? []).some(
            (c) =>
              c.cycleType === "checkin" &&
              c.checkInDate.split("T")[0] === todayKey,
          );
          if (freshLastCheckInToday && freshHasTodaysCheckin) {
            pendingCheckInsRef.current.delete(fresh.taskId);
            return fresh;
          }
          // Preserve optimistic patch until server catches up.
          return prevById.get(fresh.taskId) ?? fresh;
        });
      });
    }
    setRefreshTick((t) => t + 1);
    // Seed cache so detail modal renders synchronously.
    taskCache.setMany(incoming);
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    fetchTasks().finally(() => setLoading(false));
  }, [fetchTasks, refreshKey]);

  useFocusEffect(useCallback(() => { fetchTasks(); }, [fetchTasks]));

  // Stuck-row recovery refresh.
  useEffect(() => {
    return taskEvents.subscribeRefreshRequested(() => { fetchTasks(); });
  }, [fetchTasks]);

  // Mirror local tasks to parent for live derived UI.
  useEffect(() => {
    onTasksLoaded?.(tasks);
  }, [tasks, onTasksLoaded]);

  // Optimistic check-in patch from detail modal.
  useEffect(() => {
    return taskEvents.subscribeCheckedIn(({ taskId, lastCheckInDateIso, nextDueDateIso, currentStreakCount, longestStreakCount }) => {
      markPendingCheckIn(taskId);
      setTasks((prev) =>
        prev.map((t) => {
          if (t.taskId !== taskId) return t;
          // Remember pre-checkin dueDate for instant undo restore.
          preCheckinDueDateRef.current.set(taskId, t.dueDate);
          return {
            ...t,
            lastCheckInDate: lastCheckInDateIso,
            dueDate: nextDueDateIso,
            currentStreakCount,
            longestStreakCount,
          };
        })
      );
      // Pin to top of Checked In.
      setRecentCheckinTs((prev) => {
        const next = new Map(prev);
        next.set(taskId, Date.now());
        return next;
      });
    });
  }, [markPendingCheckIn]);

  // Cross-screen optimistic delete/restore (detail-screen overflow delete).
  useEffect(() => {
    const offDel = taskEvents.subscribeDeleted((taskId) => {
      markPendingDelete(taskId);
      setTasks((prev) => prev.filter((t) => t.taskId !== taskId));
    });
    const offRes = taskEvents.subscribeRestored((task) => {
      clearPendingDelete(task.taskId);
      setTasks((prev) => prev.some((t) => t.taskId === task.taskId) ? prev : [task, ...prev]);
    });
    return () => { offDel(); offRes(); };
  }, [markPendingDelete, clearPendingDelete]);

  // Authoritative server response — append real cycleId for undo path.
  useEffect(() => {
    return taskEvents.subscribeCheckInCommitted(({ taskId, cycleId, checkInDateIso, nextDueDateIso, currentStreakCount, longestStreakCount }) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.taskId !== taskId) return t;
          const cycles = t.recentCycles ?? [];
          // Guard against double-append on retried emit.
          const alreadyAppended = cycles.some((c) => c.cycleId === cycleId);
          const newCycle: CheckInCycleDto = {
            cycleId,
            taskId,
            checkInDate: checkInDateIso,
            counterValue: null,
            createdAt: new Date().toISOString(),
            cycleType: "checkin",
          };
          return {
            ...t,
            dueDate: nextDueDateIso || t.dueDate,
            currentStreakCount,
            longestStreakCount,
            recentCycles: alreadyAppended ? cycles : [newCycle, ...cycles],
          };
        })
      );
      clearPendingCheckIn(taskId);
      // Drain queued undos now that real cycleId is known.
      if (queuedUndosRef.current.has(taskId)) {
        queuedUndosRef.current.delete(taskId);
        void performUndoRef.current(taskId, cycleId);
      }
    });
  }, [clearPendingCheckIn]);


  // Per-task action debounce — prevents overlapping server requests.
  const lastActionAtRef = useRef<Map<string, number>>(new Map());
  const ACTION_DEBOUNCE_MS = 400;
  // Snapshot of pre-checkin dueDate for instant undo restore.
  const preCheckinDueDateRef = useRef<Map<string, string | null>>(new Map());
  const tryClaimAction = useCallback((taskId: string): boolean => {
    const now = Date.now();
    const last = lastActionAtRef.current.get(taskId) ?? 0;
    if (now - last < ACTION_DEBOUNCE_MS) return false;
    lastActionAtRef.current.set(taskId, now);
    return true;
  }, []);
  // Read-only peek for tap-handler short-circuit.
  const canActNow = useCallback((taskId: string): boolean => {
    const now = Date.now();
    const last = lastActionAtRef.current.get(taskId) ?? 0;
    return now - last >= ACTION_DEBOUNCE_MS;
  }, []);

  async function handleCheckIn(task: TaskDto) {
    if (!tryClaimAction(task.taskId)) return;
    // Guard fetchTasks during in-flight commit.
    markPendingCheckIn(task.taskId);

    // Fire check-in burst.
    if (burstTimeoutRef.current) clearTimeout(burstTimeoutRef.current);
    setBurstTaskId(task.taskId);
    burstTimeoutRef.current = setTimeout(() => {
      setBurstTaskId(null);
      burstTimeoutRef.current = null;
    }, 900);

    // Haptic — heavy pulse on tier crossing.
    if (Platform.OS !== "web") {
      const prevStreak = task.currentStreakCount ?? 0;
      const nextStreak = prevStreak + 1;
      const crosses = [3, 7, 14, 30].some((at) => prevStreak < at && nextStreak >= at);
      Haptics.impactAsync(
        crosses ? Haptics.ImpactFeedbackStyle.Heavy : Haptics.ImpactFeedbackStyle.Light,
      ).catch(() => {});
    }

    // Optimistic patch — no refetch on success.
    const todayIso = todayLocalKey();
    // Remember original dueDate for instant undo restore.
    preCheckinDueDateRef.current.set(task.taskId, task.dueDate);
    // Advance dueDate optimistically; overdue rebases on today.
    const dueBase = task.isRecurring && isOverdue(task.dueDate) ? todayIso : task.dueDate;
    const optimisticDue = task.isRecurring
      ? getNextDueDate(dueBase, task.recurrenceRule ?? "daily")
      : task.dueDate;
    // Pin row to top of Checked In.
    setRecentCheckinTs((prev) => {
      const next = new Map(prev);
      next.set(task.taskId, Date.now());
      return next;
    });
    // Smooth SectionList cross-section re-layout.
    LayoutAnimation.configureNext({
      duration: 220,
      create: { type: "easeInEaseOut", property: "opacity" },
      update: { type: "easeInEaseOut" },
      delete: { type: "easeInEaseOut", property: "opacity" },
    });
    // Optimistic streak increment (mirrors server reset rule).
    const willResetStreak = willStreakResetOnCheckIn(task.recurrenceRule, task.lastCheckInDate, task.dueDate);
    const predictedStreak = willResetStreak ? 1 : (task.currentStreakCount ?? 0) + 1;
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
      // "Already checked in" — race false positive, ignore.
      if (/already\s+checked\s*in/i.test(res.error)) return;
      // Other errors — refetch to reconcile.
      setError(res.error);
      fetchTasks();
      return;
    }
    if (res.data) {
      const data = res.data;
      // Apply authoritative server response.
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
        // Race-aware: skip state restore if user has since undone.
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

  // Shared optimistic undo — patch row in-place from server response.
  async function performUndoCheckIn(taskId: string, cycleId: number) {
    // Optimistic-first patch.
    let snapshot: TaskDto | null = null;
    // Prefer remembered pre-checkin dueDate for exact restore.
    const rememberedDue = preCheckinDueDateRef.current.get(taskId);
    // Fallback: cycle's previousDueDate snapshot.
    const cycleSnapshot = (() => {
      const t = tasks.find((x) => x.taskId === taskId);
      return t?.recentCycles?.find((c) => c.cycleId === cycleId) ?? null;
    })();
    const cyclePreviousDue = cycleSnapshot?.previousDueDate ?? undefined;
    // Smooth cross-section move back to Active.
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
      // Three-tier dueDate restore: remembered → cycle snapshot → period rollback.
      const optimisticDue = rememberedDue !== undefined
        ? rememberedDue
        : cyclePreviousDue !== undefined && cyclePreviousDue !== null && cyclePreviousDue !== ""
          ? cyclePreviousDue.split("T")[0]
          : (t.dueDate && t.recurrenceRule
            ? dateKey(getPrevPeriodStart(parseLocalDate(t.dueDate), t.recurrenceRule))
            : t.dueDate);
      // Optimistic streak decrement (longest left alone — server preserves peak).
      const prevCount = t.currentStreakCount ?? 0;
      return {
        ...t,
        recentCycles: cycles,
        dueDate: optimisticDue,
        lastCheckInDate: null,
        currentStreakCount: Math.max(0, prevCount - 1),
      };
    }));
    // Clear remembered value to avoid mis-fire on later undo.
    preCheckinDueDateRef.current.delete(taskId);

    const res = await tasksApi.undoCheckIn(taskId, cycleId);
    if (res.error || !res.data) {
      // 404 = already deleted server-side; keep optimistic state.
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
      // Guard against out-of-order responses corrupting row state.
      const hasNewerCheckin = cycles.some(
        (c) => c.cycleType === "checkin" && c.cycleId > cycleId,
      ) || (t.lastCheckInDate != null && t.lastCheckInDate !== "");
      // Empty string from server = "no prior check-in" — null it.
      const restoredLastCheckIn = hasNewerCheckin
        ? t.lastCheckInDate
        : (data.previousLastCheckInDate || null);
      // Keep optimistic dueDate when server snapshot is empty.
      const restoredDueDate = hasNewerCheckin
        ? t.dueDate
        : (data.previousDueDate || t.dueDate);
      return {
        ...t,
        recentCycles: cycles,
        currentStreakCount: data.streakCount,
        longestStreakCount: data.longestCount,
        dueDate: restoredDueDate,
        lastCheckInDate: restoredLastCheckIn,
      };
    }));
    // NOTE: do NOT fire emitRefreshRequested here — races the response patch.
  }

  // Within-day inline undo from leading checkbox.
  async function handleUndoCheckIn(task: TaskDto, cycleId: number) {
    if (!tryClaimAction(task.taskId)) return;
    await performUndoCheckIn(task.taskId, cycleId);
  }
  // Mirror latest closure into ref.
  performUndoRef.current = performUndoCheckIn;

  async function handleComplete(task: TaskDto) {
    // Optimistic only; refetch on error.
    setTasks((prev) =>
      prev.map((t) => (t.taskId === task.taskId ? { ...t, status: "completed" } : t))
    );
    const res = await tasksApi.complete(task.taskId);
    if (res.error) {
      setError(res.error);
      await fetchTasks();
    }
  }

  // pending → in_progress.
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

  // in_progress → pending (no dedicated endpoint — full update).
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
    // No confirm — swipe commitment is enough intent. Snapshot first so undo can restore.
    const snapshot = task;
    setSlashingId(task.taskId);
    await new Promise((r) => setTimeout(r, SLASH_MS));
    setSlashingId(null);
    setTasks((prev) => prev.filter((t) => t.taskId !== task.taskId));
    taskCache.remove(task.taskId);
    // Mark so concurrent focus-refetches don't resurrect the row during the undo window.
    markPendingDelete(snapshot.taskId);
    undo.arm({
      prefix: "Deleted",
      subject: snapshot.title,
      onUndo: () => {
        clearPendingDelete(snapshot.taskId);
        setTasks((prev) => prev.some((t) => t.taskId === snapshot.taskId) ? prev : [snapshot, ...prev]);
        taskCache.set(snapshot);
      },
      onCommit: async () => {
        const res = await tasksApi.delete(snapshot.taskId);
        clearPendingDelete(snapshot.taskId);
        if (res.error) {
          setError(res.error);
          await fetchTasks();
        }
      },
    });
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

    // Routines split: checked-in tasks under "Checked In" separator.
    let finalItems = items;
    if (splitCheckedIn) {
      const active: TaskDto[] = [];
      const checkedIn: TaskDto[] = [];
      for (const it of items) {
        if ("__sep" in it) {
          // Preserve any pre-existing separators.
          active.push(it as unknown as TaskDto);
          continue;
        }
        if (isCheckedInThisCycle(it)) checkedIn.push(it);
        else active.push(it);
      }
      // Most-recent check-in on top.
      const tsOf = (t: TaskDto): number => {
        const sessionTs = recentCheckinTs.get(t.taskId);
        if (sessionTs !== undefined) return sessionTs;
        const latestCycle = t.recentCycles?.find((c) => c.cycleType === "checkin");
        return latestCycle ? new Date(latestCycle.createdAt).getTime() : 0;
      };
      checkedIn.sort((a, b) => tsOf(b) - tsOf(a));
      // Layout cases: both → separator; only checkedIn → list directly.
      if (active.length > 0 && checkedIn.length > 0) {
        finalItems = [...active, sep("Checked In", "__sep-checked-in"), ...checkedIn];
      } else if (checkedIn.length > 0) {
        finalItems = [...checkedIn];
      }
    }

    const chunks = chunkListItems(finalItems);
    // Active-section collapse for "all" filter.
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

  // Errors render via <ErrorToast/> overlay (no list replacement).

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
      // Virtualization tuning — rows are expensive to mount.
      initialNumToRender={10}
      maxToRenderPerBatch={8}
      windowSize={5}
      // removeClippedSubviews intentionally off — stalls cross-section re-mount on Android.
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
              isCheckInPending={isCheckInPending}
              queueUndoOnCommit={queueUndoOnCommit}
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
  // True while check-in POST is in flight.
  isCheckInPending: (taskId: string) => boolean;
  // Queues undo intent until real cycleId lands.
  queueUndoOnCommit: (taskId: string) => void;
}

const TaskRow = memo(TaskRowImpl, (prev, next) => {
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
  // Grey closed cycles and locked/in-progress pending rows.
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
  // Completed-tab selection gate (mirrors web's !isSubmitted).
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
          <View style={styles.rowLeft}>
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
            {useCheckinCheckbox && item.isRecurring && !isInProgress && !isCompleted ? (() => {
              // Priority-coloured checkbox lead — taps commit/undo via hit-test.
              const checkedThisCycle = wasCheckedInToday || isCycleClosed(item.dueDate, item.lastCheckInDate);
              // Multi-day cadences: lock the box on prior-day check-ins (server only undoes same-day).
              const couldBeTodaysCheckin = wasCheckedInToday
                || (!!latestCheckinCycle
                  && latestCheckinCycle.checkInDate.split("T")[0] === todayKey);
              const isCheckedButLocked = checkedThisCycle && !couldBeTodaysCheckin;
              const isActionable = !checkedThisCycle && (canCheckInThisCycle || overdueRecurring);
              const isLocked = (!checkedThisCycle && !isActionable) || isCheckedButLocked;
              // Tier-coloured check: streak colour replaces priority on the check; iOS-only glow at T3/T4.
              const tier = currentStreakTier(item.currentStreakCount ?? 0);
              const checkStroke = tier ? c.secondaryAccent : dot;
              const checkWidth = !tier ? 2 : tier.tier >= 4 ? 2.5 : tier.tier === 3 ? 2.25 : 2;
              const glow = tier && tier.tier >= 3
                ? {
                    shadowColor: c.secondaryAccent,
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.95,
                    shadowRadius: tier.tier === 4 ? 4 : 2,
                  }
                : null;
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
                    checkboxBoundsRef.current = { left: x, top: y, right: x + width, bottom: y + height };
                  }}
                >
                  {checkedThisCycle ? (
                    <View style={glow ?? undefined}>
                      <Svg width={10} height={8} viewBox="0 0 12 9" fill="none">
                        <Polyline
                          points="1.5,4.5 4.5,7.5 10.5,1.5"
                          stroke={checkStroke}
                          strokeWidth={checkWidth}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          fill="none"
                        />
                      </Svg>
                    </View>
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
                {/* Tier moved to a corner badge on the check-in checkbox (LoL-style). */}
              </View>
            </View>
          </View>
          <View style={styles.dateCol}>
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
