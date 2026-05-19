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
  // Auth state drives the DemoModeBanner — unauthenticated users see the
  // tabs but with an inline "changes not saved" prompt at the top of /.
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    getToken().then((t) => setHasToken(!!t));
  }, [refreshKey]);

  // Submit/bank flow state — mirrors web's useTaskSubmission. Selection only
  // applies on the Completed tab; SubmitBar replaces the action-bar slot when
  // anything is selected.
  const [me, setMe] = useState<UserProfile | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [submittedTaskIds, setSubmittedTaskIds] = useState<Set<string>>(new Set());
  // IDs that just got banked — these play the BankBurstEffect overlay for
  // ~2 s before being cleared. Set right after a successful submit so the
  // rows are still mounted (refetch hasn't dropped them yet).
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

  // Daily cap math — same shape as web's useTaskSubmission.
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
    if (!tk) return;
    const res = await usersApi.getMe();
    if (res.data) setMe(res.data);
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile, refreshKey]);

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

  // Unsubmitted points indicator: any completed task that hasn't been
  // submitted yet drives a warning dot on the Completed tab — matches
  // web's badgeColor behaviour. `submitted === false && !pointsAwarded`
  // mirrors web's `unsubmitted` check in page.tsx.
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

  // Clear the selection whenever the user leaves the Completed tab — matches
  // web's pattern where the SubmitBar is only relevant on that filter.
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
    // Trigger the bank-burst overlay for these rows. The refetch below
    // would normally pull the rows out of the completed list immediately,
    // so we defer it by ~1.9 s — same as the burst duration — to let the
    // animation finish on a row that's still mounted.
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

  // Manual keyboard tracking. KeyboardAvoidingView's internal layout recalc
  // is unreliable on Android with edgeToEdgeEnabled: true (both `height` and
  // `padding` behaviors left a ~30-40px stuck offset after dismiss — the
  // restore under-corrected by the nav-bar height, lifting the action bar
  // and the filter strip with it). Listening to Keyboard events ourselves
  // and applying paddingBottom equal to the exact measured keyboard height
  // (or zero when closed) avoids that whole class of drift.
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
          // Match web's useTasks hook: only one-off tasks on the To Do tab.
          // Recurring routines live on /recurring and would otherwise leak
          // into this list (they're returned by tasksApi.getAll when
          // isRecurring is not filtered).
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
  // When the demo banner is shown above, the banner already handles the
  // status-bar inset — drop the header's top padding accordingly.
  headerCompact: { paddingTop: 8 },
  listWrap: { flex: 1, paddingHorizontal: 16 },
});
