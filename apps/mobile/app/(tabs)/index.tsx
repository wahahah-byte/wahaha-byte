import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

import {
  FILTERS,
  REGULAR_CAP,
  type GroupMode,
  type SortMode,
  type TaskDto,
  type UserProfile,
} from "@wahaha/shared";

import { getToken, usersApi } from "@/lib/api";
import { taskEvents } from "@/lib/task-events";
import { useKeyboardHeight } from "@/hooks/use-keyboard-height";
import { CapWarningModal } from "@/components/cap-warning-modal";
import { DemoModeBanner } from "@/components/demo-mode-banner";
import { FilterStrip } from "@/components/filter-strip";
import { MobileActionBar } from "@/components/mobile-action-bar";
import { MobileSubmitBar } from "@/components/submit-bar";
import { TaskList } from "@/components/task-list";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";

type ActiveFilter = "all" | "pending" | "in_progress" | "completed";

export default function TasksScreen() {
  const c = useColors();

  const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loadedTasks, setLoadedTasks] = useState<TaskDto[]>([]);
  const [sortMode, setSortMode] = useState<SortMode>("due");
  const [groupMode, setGroupMode] = useState<GroupMode>("none");
  // Auth state — drives DemoModeBanner visibility.
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    getToken().then((t) => setHasToken(!!t));
  }, [refreshKey]);

  // Submit/bank flow — selection only on Completed tab.
  const [me, setMe] = useState<UserProfile | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());
  // Just-banked IDs — play BankBurstEffect for ~2s before cleared.
  const [bankingIds, setBankingIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCapWarning, setShowCapWarning] = useState(false);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  // Daily cap math — matches web useTaskSubmission.
  const regularSubmitted = me
    ? me.pointsSubmittedToday - me.recurringPointsSubmittedToday
    : 0;
  const remaining = Math.max(0, REGULAR_CAP - regularSubmitted);
  const selectedTasks = loadedTasks.filter((t) => selectedIds.has(t.taskId));
  const selectedPts = selectedTasks.reduce((s, t) => s + t.pointValue, 0);
  const willAward = Math.min(selectedPts, Math.max(0, remaining));
  const capped = selectedPts > remaining;
  const limitReached = remaining <= 0;

  const fetchProfile = useCallback(async () => {
    const tk = await getToken();
    if (!tk) { setMe(null); return; }
    const res = await usersApi.getMe();
    if (res.data) setMe(res.data);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile, refreshKey]);

  // signOut() emits a refresh — bump refreshKey so fetchProfile + TaskList re-run and
  // discover the missing token, clearing their state.
  useEffect(() => {
    return taskEvents.subscribeRefreshRequested(() => {
      setRefreshKey((k) => k + 1);
    });
  }, []);

  const filterCounts = useMemo(() => {
    const c: Record<ActiveFilter, number> = { all: 0, pending: 0, in_progress: 0, completed: 0 };
    for (const t of loadedTasks) {
      c.all++;
      if (t.status === "pending" || t.status === "in_progress") c.pending++;
      if (t.status === "in_progress") c.in_progress++;
      if (t.status === "completed") c.completed++;
    }
    return c;
  }, [loadedTasks]);

  // Warning dot on Completed when any task is unsubmitted.
  const hasUnsubmitted = useMemo(
    () => loadedTasks.some(
      (t) => t.status === "completed" && t.submitted === false && !t.pointsAwarded,
    ),
    [loadedTasks],
  );

  const getCount = useCallback(
    (v: string) => filterCounts[v as ActiveFilter] ?? 0,
    [filterCounts],
  );
  const badgeColor = useCallback(
    (v: string) => (v === "completed" && hasUnsubmitted ? c.warning : null),
    [hasUnsubmitted, c.warning],
  );

  // Clear selection when leaving Completed tab.
  useEffect(() => {
    if (activeFilter !== "completed" && selectedIds.size > 0) {
      setSelectedIds(new Set());
    }
  }, [activeFilter, selectedIds.size]);

  async function doSubmit() {
    if (selectedIds.size === 0 || remaining <= 0) return;
    const ids = [...selectedIds];
    setIsSubmitting(true);
    const { data, error: err } = await usersApi.submitPoints(ids);
    setIsSubmitting(false);
    if (err || !data) return;
    const failedIds = new Set(
      (data.results ?? []).filter((r) => r.error).map((r) => r.taskId),
    );
    const succeededIds = ids.filter((id) => !failedIds.has(id));
    if (succeededIds.length === 0) return;
    setSubmittedTaskIds((prev) => new Set([...prev, ...succeededIds]));
    // Trigger bank-burst overlay; defer refetch ~1.9s for animation.
    setBankingIds(new Set(succeededIds));
    setTimeout(() => {
      setBankingIds(new Set());
      setRefreshKey((k) => k + 1);
    }, 1900);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of succeededIds) next.delete(id);
      return next;
    });
    setMe((prev) =>
      prev
        ? {
            ...prev,
            currentBalance: data.newBalance,
            pointsSubmittedToday: data.dailyTotal,
            recurringPointsSubmittedToday: data.recurringDailyTotal,
          }
        : prev,
    );
  }

  function handleSubmit() {
    if (capped) { setShowCapWarning(true); return; }
    doSubmit();
  }

  const submitBarVisible =
    activeFilter === "completed" && selectedIds.size > 0;

  // Manual keyboard tracking — KeyboardAvoidingView unreliable on Android edge-to-edge.
  const keyboardHeight = useKeyboardHeight();
  return (
    <ThemedView style={[styles.container, { paddingBottom: keyboardHeight }]}>
      {!hasToken ? <DemoModeBanner /> : null}
      <View style={[styles.header, hasToken ? null : styles.headerCompact]}>
        <ThemedText
          style={{
            fontSize: 11, color: c.fg, fontWeight: "600",
            letterSpacing: 2, textTransform: "uppercase",
          }}
        >
          {FILTERS.find((f) => f.value === activeFilter)?.label ?? "All"}
        </ThemedText>
      </View>

      <View style={styles.listWrap}>
        <TaskList
          // Match web useTasks: only one-off tasks on To Do tab.
          filters={{ isRecurring: false, isArchived: false }}
          activeFilter={activeFilter}
          sortMode={sortMode}
          groupMode={groupMode}
          refreshKey={refreshKey}
          onTasksLoaded={setLoadedTasks}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          submittedTaskIds={submittedTaskIds}
          bankingIds={bankingIds}
          emptyText="No tasks yet."
        />
      </View>

      <FilterStrip
        options={FILTERS.map((f) => ({ value: f.value, label: f.shortLabel }))}
        value={activeFilter}
        onChange={(v) => setActiveFilter(v as ActiveFilter)}
        getCount={getCount}
        badgeColor={badgeColor}
      />
      {submitBarVisible ? (
        <MobileSubmitBar
          selectedCount={selectedIds.size}
          selectedPts={selectedPts}
          willAward={willAward}
          isSubmitting={isSubmitting}
          limitReached={limitReached}
          capped={capped}
          onSubmit={handleSubmit}
        />
      ) : (
        <MobileActionBar
          onCreated={() => setRefreshKey((k) => k + 1)}
          sortMode={sortMode}
          groupMode={groupMode}
          onSortChange={setSortMode}
          onGroupChange={setGroupMode}
        />
      )}

      <CapWarningModal
        visible={showCapWarning}
        selectedPts={selectedPts}
        willAward={willAward}
        remaining={remaining}
        onClose={() => setShowCapWarning(false)}
        onConfirm={() => doSubmit()}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 64, paddingBottom: 10 },
  // Demo banner handles status-bar inset, so drop header top padding.
  headerCompact: { paddingTop: 8 },
  listWrap: { flex: 1, paddingHorizontal: 16 },
});
