import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SectionList,
  View,
} from "react-native";
import { useFocusEffect } from "expo-router";

import {
  todayLocalKey,
  type CheckInCycleDto,
  type GroupMode,
  type SortMode,
  type TaskDto,
  type TaskFilterParams,
} from "@wahaha/shared";
import { getToken, tasksApi } from "@/lib/api";
import { taskCache } from "@/lib/task-cache";
import { taskEvents } from "@/lib/task-events";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";
import { useUndo } from "@/context/undo-context";
import { SlashingRow } from "@/components/slashing-row";
import { SwipeRowProvider } from "@/components/swipe-row-context";
import { TaskRow } from "@/components/task-list/task-row";
import { ActiveSectionToggle, CloseOnTap, ErrorToast } from "@/components/task-list/misc";
import { styles } from "@/components/task-list/styles";
import { useTaskListActions } from "@/hooks/use-task-list-actions";
import { useTaskListSections } from "@/hooks/use-task-list-sections";

// LayoutAnimation no longer needs to be enabled manually: it's on by default
// under the New Architecture, and setLayoutAnimationEnabledExperimental is a
// no-op there (it warned when called).

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
  // Archive-only: render one flat list with no Active/Completed split or collapse.
  flat?: boolean;
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
  flat,
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

  // Snapshot of pre-checkin dueDate for instant undo restore.
  const preCheckinDueDateRef = useRef<Map<string, string | null>>(new Map());

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
    // No token = signed out (or never signed in). Wipe local state so a previous user's
    // tasks don't linger after sign-out and bail before issuing an auth-only request.
    const tk = await getToken();
    if (!tk) {
      setTasks([]);
      taskCache.clear();
      return;
    }
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

  const {
    handleCheckIn,
    handleUndoCheckIn,
    handleComplete,
    handleStart,
    handlePause,
    handleArchive,
    handleUndoComplete,
    handleDelete,
  } = useTaskListActions({
    tasks,
    setTasks,
    setError,
    fetchTasks,
    setRecentCheckinTs,
    setBurstTaskId,
    burstTimeoutRef,
    setSlashingId,
    tryClaimAction,
    markPendingCheckIn,
    markPendingDelete,
    clearPendingDelete,
    preCheckinDueDateRef,
    performUndoRef,
    undo,
  });

  const { sections, showCollapse, activeCount } = useTaskListSections({
    tasks,
    activeFilter,
    groupMode,
    sortMode,
    preFilter,
    splitCheckedIn,
    submittedTaskIds,
    uncompletedCollapsed,
    recentCheckinTs,
    flat,
  });

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
              onUndoComplete={handleUndoComplete}
              onDelete={handleDelete}
              submittedTaskIds={submittedTaskIds}
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
