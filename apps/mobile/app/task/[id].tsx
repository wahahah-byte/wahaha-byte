import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Polyline } from "react-native-svg";

import {
  canCheckInNow,
  CATEGORY_COLOR,
  type CheckInCycleDto,
  getNextDueDate,
  isOverdue,
  willStreakResetOnCheckIn,
  PRIORITY_DOT,
  type Subtask,
  type TaskDto,
  type UpdateTaskRequest,
} from "@wahaha/shared";
import { subtasksApi, tasksApi } from "@/lib/api";
import { taskCache } from "@/lib/task-cache";
import { taskEvents } from "@/lib/task-events";
import { useUndo } from "@/context/undo-context";
import { CheckIcon, DeleteIcon, PauseIcon, StartIcon, UndoIcon } from "@/components/action-icons";
import { SwipeableRow } from "@/components/swipeable-row";
import { SwipeRowProvider } from "@/components/swipe-row-context";
import { CustomLogModal } from "@/components/custom-log-modal";
import { LogCheckinButton } from "@/components/log-checkin-button";
import { QuickLogStepper } from "@/components/quick-log-stepper";
import { TapSlideCheckIn } from "@/components/tap-slide-check-in";
import { TaskForm, type TaskFormValues, emptyTaskForm } from "@/components/task-form";
import { AvatarOnlyHero, CounterPanel } from "@/components/task-detail/avatar-hero";
import { EditPaneSwipeWrapper } from "@/components/task-detail/edit-pane-swipe";
import { MetaChip } from "@/components/task-detail/meta-chip";
import { PageHeader } from "@/components/task-detail/page-header";
import { SubtaskAddBar } from "@/components/task-detail/subtask-add-bar";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";
import { awaitPendingLogFlushes, useQuickLog } from "@/hooks/use-quick-log";
import { fmtFull, fmtShort, makeSheetBackground, makeSheetHandle } from "@/lib/task-detail-helpers";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const insets = useSafeAreaInsets();
  const undo = useUndo();

  // Seed from list task cache so first frame renders content without spinner.
  const [task, setTask] = useState<TaskDto | null>(() => taskCache.read(id) ?? null);
  const [loading, setLoading] = useState(() => !taskCache.read(id));
  const [error, setError] = useState<string | null>(null);
  const [newSubtask, setNewSubtask] = useState("");
  const [newSubtaskSets, setNewSubtaskSets] = useState("");
  const [newSubtaskReps, setNewSubtaskReps] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);
  // The id of the subtask currently being edited via the floating bar; null when adding.
  const [editingSubtaskId, setEditingSubtaskId] = useState<number | null>(null);
  // Hit-test bounds for sets/reps chips (SwipeableRow blocks Pressable children).
  const chipBoundsRef = useRef<Map<number, { left: number; top: number; right: number; bottom: number }>>(new Map());
  const [isEditing, setIsEditing] = useState(false);
  // Overflow menu (Archive) anchored to header.
  const [menuOpen, setMenuOpen] = useState(false);
  // Lazy add-subtask input.
  const [addingSubtaskOpen, setAddingSubtaskOpen] = useState(false);
  // Body scroll ref for scrollToEnd on subtask focus.
  const scrollRef = useRef<React.ComponentRef<typeof BottomSheetScrollView>>(null);
  // Measured header + footer heights so absolute-positioned body has bounded height.
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  // Blocks sheet dismissal while check-in POST is in flight (~200ms).
  const [checkingIn, setCheckingIn] = useState(false);
  // Custom-log modal (opened by tapping the counter widget).
  const [customLogOpen, setCustomLogOpen] = useState(false);

  // BottomSheet ref + partial snap. 70% balances "anchored to the bottom"
  // with enough vertical room for hero + chips + a non-trivial subtasks
  // list. The hero/heatmap were independently shrunk so this height
  // actually translates into roomy subtasks.
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["70%"], []);
  // Rounded top corners on the sheet container itself (with overflow:hidden
  // so the inner content clips), mirroring web mobile's
  // borderTopLeftRadius: 16 / borderTopRightRadius: 16 on the sheet wrapper.
  const sheetStyle = useMemo(
    () => ({
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: "hidden" as const,
    }),
    [],
  );
  // No topInset needed — the sheet's top edge sits below the status bar.
  const SheetHandle = useMemo(() => makeSheetHandle(c, 0), [c]);
  const SheetBackground = useMemo(() => makeSheetBackground(c.bg), [c.bg]);
  // Dimmed backdrop above the underlying transparentModal route, mirroring
  // the web mobile sheet's --color-modal-overlay scrim. While the add-subtask
  // bar is open, disable the backdrop's close-on-press — the floating bar's
  // own overlay handles dismissing it; we don't want both the bar and the
  // sheet to close together.
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior={addingSubtaskOpen ? "none" : "close"}
      />
    ),
    [addingSubtaskOpen],
  );

  const handleSheetChange = useCallback((index: number) => {
    // Pop route on close (-1) so route stays alive during slide-down.
    if (index === -1) router.back();
  }, []);

  // Animate sheet down on close; suppressed during in-flight check-in.
  const closeSheet = useCallback(() => {
    if (checkingIn) return;
    sheetRef.current?.close();
  }, [checkingIn]);

  // Keep slider mounted after commit so footer doesn't collapse.
  const sliderEverShownRef = useRef(false);

  const load = useCallback(async () => {
    setError(null);
    // Wait for any in-flight log flush from a prior dismiss so the GET sees the new cycle.
    await awaitPendingLogFlushes(id);
    const res = await tasksApi.getById(id);
    if (!res.data) {
      setError(res.error ?? "Task not found.");
      return;
    }
    // Merge into existing task to preserve cached fields (e.g. streak from list).
    const fresh = res.data;
    let mergedForCache: TaskDto | null = null;
    setTask((prev) => {
      if (!prev) { mergedForCache = fresh; return fresh; }
      const merged: TaskDto = { ...prev };
      for (const k of Object.keys(fresh) as (keyof TaskDto)[]) {
        const v = fresh[k];
        if (v !== undefined) (merged as unknown as Record<string, unknown>)[k as string] = v;
      }
      mergedForCache = merged;
      return merged;
    });
    // Cache merged task so all known fields accumulate.
    if (mergedForCache) taskCache.set(mergedForCache);
  }, [id]);

  useEffect(() => {
    // Spinner only on cache miss; cached snapshot fetches silently in bg.
    const hadCache = !!taskCache.read(id);
    if (!hadCache) setLoading(true);
    load().finally(() => setLoading(false));
  }, [load, id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  // Sync with underlying TaskList mutations (e.g. list-fired undo).
  useEffect(() => {
    return taskEvents.subscribeRefreshRequested(() => { load(); });
  }, [load]);

  // Append a freshly-logged counter cycle so heatmap + button overshoot math see it.
  const appendCycle = useCallback((cycle: CheckInCycleDto) => {
    setTask((prev) => prev
      ? { ...prev, recentCycles: [cycle, ...(prev.recentCycles ?? [])] }
      : prev,
    );
  }, []);

  const flushQuickLog = useCallback(
    async (taskId: string, delta: number): Promise<CheckInCycleDto | null> => {
      if (delta === 0) return null;
      // Optimistic cache stub before the network round-trip: a reopen that
      // lands during an in-flight flush (typical "close modal before debounce
      // settles, immediately reopen") would otherwise read the pre-log
      // cycleSum and snap to the real value only after the GET finishes.
      const todayIso = new Date().toISOString().split("T")[0];
      const stubCycleId = -Math.floor(Math.random() * 1_000_000_000) - 1;
      const stubCycle: CheckInCycleDto = {
        cycleId: stubCycleId,
        taskId,
        checkInDate: todayIso,
        counterValue: delta,
        createdAt: new Date().toISOString(),
        cycleType: "log",
      };
      const beforeCached = taskCache.read(taskId);
      if (beforeCached) {
        taskCache.set({
          ...beforeCached,
          recentCycles: [stubCycle, ...(beforeCached.recentCycles ?? [])],
        });
      }
      const res = await tasksApi.logCounter(taskId, delta);
      if (res.error) {
        // Roll back the stub on failure so cycleSum doesn't carry phantom logs.
        const rb = taskCache.read(taskId);
        if (rb) {
          taskCache.set({
            ...rb,
            recentCycles: (rb.recentCycles ?? []).filter((c) => c.cycleId !== stubCycleId),
          });
        }
        if (res.status === 404) return null;
        if (res.status === 400 && /already checked in/i.test(res.error)) return null;
        const signed = `${delta > 0 ? "+" : ""}${delta}`;
        setError(`Couldn't save log (${signed}): ${res.error}`);
        return null;
      }
      if (!res.data) return null;
      // Swap the stub for the authoritative cycle from the server response so
      // the next modal mount sees the real cycleId.
      const afterCached = taskCache.read(taskId);
      if (afterCached) {
        taskCache.set({
          ...afterCached,
          recentCycles: [
            res.data,
            ...(afterCached.recentCycles ?? []).filter((c) => c.cycleId !== stubCycleId),
          ],
        });
      }
      appendCycle(res.data);
      return res.data;
    },
    [appendCycle],
  );

  const quickLog = useQuickLog({
    task,
    heatmapCycles: task?.recentCycles ?? [],
    onFlushQuickLog: flushQuickLog,
  });

  async function toggleSubtask(sub: Subtask) {
    const next = !sub.completed;
    setTask((prev) =>
      prev
        ? {
            ...prev,
            subtasks: prev.subtasks?.map((s) =>
              s.subtaskId === sub.subtaskId ? { ...s, completed: next } : s
            ),
          }
        : prev
    );
    const res = await subtasksApi.update(sub.subtaskId, { completed: next });
    if (res.error) {
      setError(res.error);
      await load();
    }
  }

  async function addSubtask(): Promise<boolean> {
    if (!task) return false;
    const title = newSubtask.trim();
    if (!title) return false;
    const isFitness = task.category === "Fitness";
    const setsNum = isFitness && newSubtaskSets.trim() !== "" ? Number(newSubtaskSets) : NaN;
    const repsNum = isFitness && newSubtaskReps.trim() !== "" ? Number(newSubtaskReps) : NaN;
    const setsTarget = Number.isFinite(setsNum) && setsNum > 0 ? setsNum : null;
    const repsTarget = Number.isFinite(repsNum) && repsNum > 0 ? repsNum : null;
    // Edit branch — save back to the existing subtask instead of creating a new one.
    if (editingSubtaskId != null) {
      const existing = (task.subtasks ?? []).find((s) => s.subtaskId === editingSubtaskId);
      if (!existing) { setEditingSubtaskId(null); return false; }
      const fields: { title?: string; setsTarget?: number | null; repsTarget?: number | null } = {};
      if (title !== existing.title) fields.title = title;
      if (setsTarget !== (existing.setsTarget ?? null)) fields.setsTarget = setsTarget;
      if (repsTarget !== (existing.repsTarget ?? null)) fields.repsTarget = repsTarget;
      // Clear inputs so a subsequent open is in add-mode again.
      setNewSubtask("");
      setNewSubtaskSets("");
      setNewSubtaskReps("");
      setEditingSubtaskId(null);
      if (Object.keys(fields).length === 0) return true;
      setTask((prev) =>
        prev
          ? { ...prev, subtasks: prev.subtasks?.map((s) => s.subtaskId === existing.subtaskId ? { ...s, ...fields } : s) }
          : prev
      );
      const res = await subtasksApi.update(existing.subtaskId, fields);
      if (res.error) { setError(res.error); await load(); return false; }
      return true;
    }
    setAddingSubtask(true);
    setNewSubtask("");
    setNewSubtaskSets("");
    setNewSubtaskReps("");
    const res = await subtasksApi.create(task.taskId, { title, setsTarget, repsTarget });
    setAddingSubtask(false);
    if (res.error || !res.data) {
      setError(res.error ?? "Failed to add subtask.");
      setNewSubtask(title);
      if (setsTarget != null) setNewSubtaskSets(String(setsTarget));
      if (repsTarget != null) setNewSubtaskReps(String(repsTarget));
      return false;
    }
    setTask((prev) =>
      prev ? { ...prev, subtasks: [...(prev.subtasks ?? []), res.data!] } : prev
    );
    return true;
  }

  async function deleteSubtask(sub: Subtask) {
    if (!task) return;
    const prevList = task.subtasks ?? [];
    setTask((prev) =>
      prev ? { ...prev, subtasks: prev.subtasks?.filter((s) => s.subtaskId !== sub.subtaskId) } : prev
    );
    const res = await subtasksApi.delete(sub.subtaskId);
    if (res.error) {
      setError(res.error);
      setTask((prev) => (prev ? { ...prev, subtasks: prevList } : prev));
    }
  }

  // Open the floating add bar pre-filled with a subtask's values for editing.
  // Reusing the bar (instead of an inline editor) avoids the iOS keyboard-position bug.
  function startEditSubtask(sub: Subtask) {
    setEditingSubtaskId(sub.subtaskId);
    setNewSubtask(sub.title);
    setNewSubtaskSets(sub.setsTarget != null ? String(sub.setsTarget) : "");
    setNewSubtaskReps(sub.repsTarget != null ? String(sub.repsTarget) : "");
    setAddingSubtaskOpen(true);
  }

  async function handleCheckIn(counterValue?: number) {
    if (!task) return;
    // Block dismissal until POST returns (~200ms) so list sees cycleId before user.
    setCheckingIn(true);
    // Optimistic broadcast — TaskList reshuffles row to "Checked In" instantly.
    const todayIso = new Date().toISOString().split("T")[0];
    // Overdue: advance from today so daily lands tomorrow, not stale today.
    const dueBase = task.recurrenceRule && isOverdue(task.dueDate) ? todayIso : task.dueDate;
    const nextDueIso = task.recurrenceRule
      ? getNextDueDate(dueBase, task.recurrenceRule)
      : task.dueDate ?? todayIso;
    // Predict streak (matches server logic) so list badge updates same frame.
    const willResetStreak = willStreakResetOnCheckIn(task.recurrenceRule, task.lastCheckInDate, task.dueDate);
    const predictedStreak = willResetStreak ? 1 : (task.currentStreakCount ?? 0) + 1;
    const predictedLongest = Math.max(task.longestStreakCount ?? 0, predictedStreak);
    taskEvents.emitCheckedIn({
      taskId: task.taskId,
      lastCheckInDateIso: todayIso,
      nextDueDateIso: nextDueIso,
      currentStreakCount: predictedStreak,
      longestStreakCount: predictedLongest,
    });
    // Optimistic local patch so canCheckIn flips immediately. When the
    // check-in carries an absolute counterValue, also splice today's log
    // cycles out of recentCycles and insert a stub checkin cycle so the
    // displayed daily total snaps to the committed value — otherwise
    // consumePending() drops pendingLog to 0 first and the user briefly
    // sees the old preserved-from-undo value until load() returns.
    const stubCycleId = -Math.floor(Math.random() * 1_000_000_000) - 1;
    setTask((prev) => {
      if (!prev) return prev;
      const patchedCycles = counterValue !== undefined
        ? [
            {
              cycleId: stubCycleId,
              taskId: prev.taskId,
              checkInDate: todayIso,
              counterValue,
              createdAt: new Date().toISOString(),
              cycleType: "checkin" as const,
            },
            ...(prev.recentCycles ?? []).filter(
              (c) => c.checkInDate.split("T")[0] !== todayIso,
            ),
          ]
        : prev.recentCycles;
      return {
        ...prev,
        lastCheckInDate: todayIso,
        dueDate: nextDueIso ?? prev.dueDate,
        currentStreakCount: predictedStreak,
        longestStreakCount: predictedLongest,
        recentCycles: patchedCycles,
      };
    });
    try {
      const res = await tasksApi.checkIn(task.taskId, counterValue);
      if (res.error) { setError(res.error); return; }
      if (res.data) {
        // Hand authoritative cycle data to list so subsequent row tap routes to undo.
        taskEvents.emitCheckInCommitted({
          taskId: task.taskId,
          cycleId: res.data.cycleId,
          checkInDateIso: todayIso,
          nextDueDateIso: res.data.nextDueDate || nextDueIso || todayIso,
          currentStreakCount: res.data.streakCount,
          longestStreakCount: res.data.longestCount,
        });
      }
      await load();
    } finally {
      // Release dismissal lock; list is now fully consistent.
      setCheckingIn(false);
    }
  }

  // Counter-task check-in. When the user has signalled a counter intent in
  // this session (tap-buffered, slide tap-absorption, or a custom-log Set
  // that lowered pendingLog below zero), commit the absolute today-total so
  // the new cycle represents "today equals X". The server consolidates any
  // existing log cycles for the day, so the preserved value from a prior
  // undo can't double-count. With no user signal we pass undefined and the
  // server leaves existing log cycles intact (the silent "just slide to
  // confirm what's already there" path).
  async function handleCheckInWithCounter(touchValue: number) {
    if (!task) return;
    const buffered = quickLog.consumePending();
    const hasUserSignal = buffered !== 0 || touchValue !== 0;
    if (!hasUserSignal) {
      await handleCheckIn(undefined);
      return;
    }
    let absolute = Math.max(0, quickLog.cycleSumToday + buffered + touchValue);
    // Cap-at-goal: post-undo path can carry an already-at-goal cycleSumToday
    // plus the slide's absorbed +1, which would otherwise overshoot.
    if (task.capLogAtGoal && task.counterGoal != null && absolute > task.counterGoal) {
      absolute = task.counterGoal;
    }
    await handleCheckIn(absolute);
  }

  // Custom-log modal submit: edit semantics — `amount` is the new absolute total for today.
  // If the new total meets the goal, auto-checkin with it; otherwise set pending to the signed delta.
  function handleCustomLogSubmit(amount: number) {
    if (!task || amount < 0) return;
    setCustomLogOpen(false);
    // Defense-in-depth: even though the modal already clamps, hard-cap the
    // amount here when capLogAtGoal is on so no codepath can write more than
    // the goal into the cycle.
    const clamped =
      task.capLogAtGoal && task.counterGoal != null && amount > task.counterGoal
        ? task.counterGoal
        : amount;
    const wouldOvershoot =
      task.counterGoal != null && clamped >= task.counterGoal;
    if (wouldOvershoot) {
      // The entered amount IS the absolute total. Bypass the slide wrapper
      // (which would add cycleSumToday + buffered on top) and commit
      // directly so the new checkin cycle replaces today's running total.
      quickLog.consumePending();
      void handleCheckIn(clamped);
      return;
    }
    quickLog.setPending(clamped);
  }

  async function handleStart() {
    if (!task) return;
    const res = await tasksApi.start(task.taskId);
    if (res.error) { setError(res.error); return; }
    await load();
  }

  async function handleComplete() {
    if (!task) return;
    const res = await tasksApi.complete(task.taskId);
    if (res.error) { setError(res.error); return; }
    await load();
  }

  async function handlePause() {
    if (!task) return;
    const dto: UpdateTaskRequest = {
      taskId: task.taskId,
      title: task.title,
      description: task.description ?? undefined,
      category: task.category,
      priority: task.priority,
      status: "pending",
      pointValue: task.pointValue,
      dueDate: task.dueDate ?? undefined,
      isRecurring: task.isRecurring,
      recurrenceRule: task.recurrenceRule ?? undefined,
      submitted: task.submitted,
    };
    const res = await tasksApi.update(task.taskId, dto);
    if (res.error) { setError(res.error); return; }
    await load();
  }

  // Reverts completed-but-not-submitted task to in_progress.
  async function handleUndoComplete() {
    if (!task) return;
    const dto: UpdateTaskRequest = {
      taskId: task.taskId,
      title: task.title,
      description: task.description ?? undefined,
      category: task.category,
      priority: task.priority,
      status: "in_progress",
      pointValue: task.pointValue,
      dueDate: task.dueDate ?? undefined,
      completedAt: undefined,
      isRecurring: task.isRecurring,
      recurrenceRule: task.recurrenceRule ?? undefined,
      submitted: task.submitted,
    };
    const res = await tasksApi.update(task.taskId, dto);
    if (res.error) { setError(res.error); return; }
    await load();
  }

  async function handleArchive() {
    if (!task) return;
    const fn = task.isArchived ? tasksApi.unarchive : tasksApi.archive;
    const res = await fn(task.taskId);
    if (res.error) { setError(res.error); return; }
    router.back();
  }

  function handleDelete() {
    if (!task) return;
    // No confirm — overflow tap is enough intent. Defer the DELETE through the undo toast.
    const snapshot = task;
    taskCache.remove(snapshot.taskId);
    // Notify any open list to drop the row immediately.
    taskEvents.publishDeleted(snapshot.taskId);
    router.back();
    undo.arm({
      prefix: "Deleted",
      subject: snapshot.title,
      onUndo: () => {
        taskCache.set(snapshot);
        taskEvents.publishRestored(snapshot);
      },
      onCommit: async () => {
        const res = await tasksApi.delete(snapshot.taskId);
        if (res.error) {
          // Best-effort surfacing — detail screen unmounted, so republish for the list.
          taskEvents.publishRestored(snapshot);
        }
      },
    });
  }

  async function handleEditSubmit(v: TaskFormValues): Promise<string | null> {
    if (!task) return "Task not loaded.";
    const goalNum =
      v.isRecurring && v.hasCounter && v.counterGoal.trim() !== "" && Number(v.counterGoal) > 0
        ? Number(v.counterGoal)
        : null;
    const dto: UpdateTaskRequest = {
      taskId: task.taskId,
      title: v.title,
      description: v.description || undefined,
      category: v.category,
      priority: v.priority,
      status: task.status,
      pointValue: v.pointValue,
      dueDate: v.dueDate ?? undefined,
      completedAt: task.completedAt ?? undefined,
      isRecurring: v.isRecurring,
      recurrenceRule: v.isRecurring ? v.recurrenceRule : undefined,
      submitted: task.submitted,
      hasCounter: v.isRecurring ? v.hasCounter : false,
      counterUnit: v.isRecurring && v.hasCounter && v.counterUnit ? v.counterUnit : null,
      counterGoal: goalNum,
      capLogAtGoal: v.isRecurring && v.hasCounter && v.capLogAtGoal && goalNum != null,
    };
    const res = await tasksApi.update(task.taskId, dto);
    if (res.error) return res.error;
    await load();
    setIsEditing(false);
    return null;
  }

  if (loading && !task) {
    return (
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        handleComponent={SheetHandle}
        backgroundComponent={SheetBackground}
        backdropComponent={renderBackdrop}
        style={sheetStyle}
      >
        <View style={styles.page}>
          <PageHeader c={c} onBack={closeSheet} />
          <View style={{ padding: 16 }}>
            <ActivityIndicator color={c.activeHighlight} />
          </View>
        </View>
      </BottomSheet>
    );
  }

  if (!task) {
    return (
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        handleComponent={SheetHandle}
        backgroundComponent={SheetBackground}
        backdropComponent={renderBackdrop}
        style={sheetStyle}
      >
        <View style={styles.page}>
          <PageHeader c={c} onBack={closeSheet} />
          <View style={{ padding: 16 }}>
            <ThemedText style={{ color: c.danger }}>{error ?? "Task not found."}</ThemedText>
          </View>
        </View>
      </BottomSheet>
    );
  }

  const dot = PRIORITY_DOT[task.priority.toLowerCase()] ?? c.fgMuted;
  const catColor = CATEGORY_COLOR[task.category] ?? c.fg;
  const dateLabel = task.completedAt ? fmtFull(task.completedAt) : fmtShort(task.dueDate);

  // Computed before any early return so hook order stays stable.
  const canCheckIn =
    task.status === "pending" &&
    task.isRecurring &&
    canCheckInNow(task.dueDate, task.recurrenceRule, task.lastCheckInDate);
  if (canCheckIn) sliderEverShownRef.current = true;
  const renderSlider = canCheckIn || sliderEverShownRef.current;

  if (isEditing) {
    const initial: TaskFormValues = {
      ...emptyTaskForm,
      title: task.title,
      description: task.description ?? "",
      category: task.category,
      priority: task.priority,
      pointValue: task.pointValue,
      isRecurring: task.isRecurring,
      recurrenceRule: task.recurrenceRule ?? "daily",
      dueDate: task.dueDate ?? null,
      hasCounter: task.hasCounter ?? false,
      counterUnit: task.counterUnit ?? "",
      counterGoal: task.counterGoal != null ? String(task.counterGoal) : "",
      capLogAtGoal: task.capLogAtGoal ?? false,
    };
    return (
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        // Edit mode disables sheet-owned pans; our own swipe-wrapper handles dismiss.
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        handleComponent={SheetHandle}
        backgroundComponent={SheetBackground}
        backdropComponent={renderBackdrop}
        style={sheetStyle}
      >
        <EditPaneSwipeWrapper onDismiss={() => setIsEditing(false)}>
          <View style={styles.page}>
            <PageHeader
              c={c}
              onBack={() => setIsEditing(false)}
              backLabel="Cancel"
            />
            <TaskForm
              initial={initial}
              submitLabel="Save"
              onSubmit={handleEditSubmit}
              onCancel={() => setIsEditing(false)}
              hideAvatar
              ScrollComponent={BottomSheetScrollView}
            />
          </View>
        </EditPaneSwipeWrapper>
      </BottomSheet>
    );
  }

  // canUndo: completed one-off, not yet submitted/awarded.
  const canUndo =
    task.status === "completed" &&
    task.submitted !== true &&
    !task.pointsAwarded;

  // Edit hidden for completed tasks.
  const showEdit = task.status !== "completed";
  // Archive only for completed+submitted one-off tasks (or already-archived).
  const isSubmittedForArchive = task.submitted === true || !!task.pointsAwarded;
  const showArchive =
    !task.isRecurring &&
    (task.isArchived || (task.status === "completed" && isSubmittedForArchive));
  // Vertical-dot management menu trigger. Lives inline beside whatever the
  // current primary action is (slider for recurring, CTA for non-recurring),
  // so it stays at the lower right without taking its own row.
  const overflowTrigger = (
    <Pressable
      onPress={() => setMenuOpen((v) => !v)}
      hitSlop={8}
      style={styles.overflowBtn}
      accessibilityLabel="Task actions"
    >
      <ThemedText style={{ fontSize: 20, lineHeight: 20, color: c.fgMuted, fontWeight: "700" }}>⋮</ThemedText>
    </Pressable>
  );

  const pageFooter = (
    <View
      style={[
        styles.footerStack,
        {
          borderColor: c.borderHairline,
          backgroundColor: c.bg,
          paddingBottom: 12 + insets.bottom,
        },
      ]}
    >
      {renderSlider ? (
        task.hasCounter ? (
          <View style={{ gap: 10 }}>
            <QuickLogStepper
              cycleSum={quickLog.cycleSumToday}
              pendingLog={quickLog.pendingLog}
              showStepper={false}
              counterUnit={task.counterUnit ?? null}
              counterGoal={task.counterGoal ?? null}
              capAtGoal={task.capLogAtGoal ?? undefined}
              onIncrement={quickLog.handleStepperIncrement}
              onDecrement={quickLog.handleStepperDecrement}
              onPress={() => setCustomLogOpen(true)}
              disabled={checkingIn || !canCheckIn}
            />
            <View style={styles.actionRow}>
              <View style={{ flex: 1 }}>
                <LogCheckinButton
                  // Re-key by check-in date so the slider's internal `committed`
                  // state can never outlive the cycle it committed.
                  key={task.lastCheckInDate ?? "open"}
                  cycleSum={quickLog.cycleSumToday}
                  pendingLog={quickLog.pendingLog}
                  counterGoal={task.counterGoal ?? null}
                  pointValue={task.pointValue}
                  disabled={checkingIn || !canCheckIn}
                  onLog={quickLog.handleStepperIncrement}
                  onCheckInWithCounter={handleCheckInWithCounter}
                />
              </View>
              {overflowTrigger}
            </View>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <TapSlideCheckIn
                key={task.lastCheckInDate ?? "open"}
                pointValue={task.pointValue}
                onCommit={() => handleCheckIn()}
                disabled={checkingIn || !canCheckIn}
              />
            </View>
            {overflowTrigger}
          </View>
        )
      ) : task.status === "pending" && !task.isRecurring ? (
        <View style={styles.actionRow}>
          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [
              styles.primaryCta,
              {
                flex: 1,
                backgroundColor: pressed ? c.activeHighlightBg : c.activeHighlight,
                borderColor: c.activeHighlight,
              },
            ]}
          >
            <StartIcon color={c.onActiveHighlight} />
            <ThemedText style={[styles.primaryCtaLabel, { color: c.onActiveHighlight }]}>
              Start
            </ThemedText>
          </Pressable>
          {overflowTrigger}
        </View>
      ) : task.status === "in_progress" ? (
        <View style={styles.actionRow}>
          <Pressable
            onPress={handleComplete}
            style={({ pressed }) => [
              styles.primaryCta,
              {
                flex: 2,
                backgroundColor: pressed ? c.successBg : c.success,
                borderColor: c.success,
              },
            ]}
          >
            <CheckIcon color={c.bg} />
            <ThemedText style={[styles.primaryCtaLabel, { color: c.bg }]}>
              Complete
            </ThemedText>
          </Pressable>
          <Pressable
            onPress={handlePause}
            style={({ pressed }) => [
              styles.secondaryCta,
              {
                flex: 1,
                backgroundColor: pressed ? c.warningBg : "transparent",
                borderColor: c.warning,
              },
            ]}
          >
            <PauseIcon color={c.warning} />
            <ThemedText style={[styles.primaryCtaLabel, { color: c.warning }]}>
              Pause
            </ThemedText>
          </Pressable>
          {overflowTrigger}
        </View>
      ) : canUndo && !task.isRecurring ? (
        <View style={styles.actionRow}>
          <Pressable
            onPress={handleUndoComplete}
            style={({ pressed }) => [
              styles.primaryCta,
              {
                flex: 1,
                backgroundColor: pressed ? c.warningBg : c.warning,
                borderColor: c.warning,
              },
            ]}
          >
            <UndoIcon color={c.bg} />
            <ThemedText style={[styles.primaryCtaLabel, { color: c.bg }]}>
              Undo
            </ThemedText>
          </Pressable>
          {overflowTrigger}
        </View>
      ) : (
        // No primary action available (e.g. completed + submitted/awarded);
        // ⋮ alone, right-aligned.
        <View style={{ alignItems: "flex-end" }}>{overflowTrigger}</View>
      )}
    </View>
  );

  return (
    <>
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      // Block pan-down-to-close while check-in POST in flight (~200ms).
      enablePanDownToClose={!checkingIn}
      enableDynamicSizing={false}
      onChange={handleSheetChange}
      handleComponent={SheetHandle}
      backgroundComponent={SheetBackground}
      backdropComponent={renderBackdrop}
      style={sheetStyle}
      // "extend" shrinks content above keyboard so footer rides up.
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      <View style={styles.page}>
        <View
          style={styles.headerAnchor}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h && h !== headerHeight) setHeaderHeight(h);
          }}
        >
          <PageHeader
            c={c}
            onBack={closeSheet}
          />
        </View>
        {/* Body absolute-positioned between header + footer for bounded height. */}
        <View style={[styles.body, { top: headerHeight, bottom: footerHeight }]}>
          {/* Avatar hero pinned at top so interactive content sits in thumb zone. */}
          {task.isRecurring && task.recurrenceRule ? (
            <CounterPanel
              task={task}
              pendingLog={quickLog.pendingLog}
            />
          ) : (
            <AvatarOnlyHero />
          )}

          <View style={styles.topBlock}>
              {/* Title */}
              <ThemedText style={{ fontSize: 16, fontWeight: "600", color: c.fg, letterSpacing: 0.2 }}>
                {task.title}
              </ThemedText>

              {/* Metadata row — rounded pills with tinted backgrounds. */}
              <View style={styles.chipRow}>
                <MetaChip
                  color={dot}
                  label={task.priority.toUpperCase()}
                  leading={<View style={[styles.chipDot, { backgroundColor: dot }]} />}
                />
                {task.category ? (
                  <MetaChip color={catColor} label={task.category.toUpperCase()} />
                ) : null}
                <MetaChip color={c.warning} label={`${task.pointValue.toLocaleString()}P`} />
                {dateLabel ? (
                  <MetaChip color={c.fg} label={dateLabel} />
                ) : null}
                {task.isRecurring && task.recurrenceRule ? (
                  <MetaChip
                    color={c.secondaryAccent}
                    label={task.recurrenceRule.toUpperCase()}
                    leading={
                      <ThemedText style={{ fontSize: 11, lineHeight: 11, color: c.secondaryAccent }}>↻</ThemedText>
                    }
                  />
                ) : null}
              </View>

              {/* Streak moved below the chibi in CounterPanel. */}

              {/* Description */}
              {task.description ? (
                <ThemedText style={{ color: c.fgMuted, fontSize: 12, lineHeight: 18 }}>
                  {task.description}
                </ThemedText>
              ) : null}

              {/* Start/Complete/Pause/Undo moved to the primary CTA in the
                  footer so they read as "the action" rather than yet another
                  tinted pill alongside the meta chips. */}
            </View>

          {/* Subtasks panel — flex:1 + minHeight:0 so it scrolls internally. */}
          <View style={styles.subtasksPanel}>
            <BottomSheetScrollView
              ref={scrollRef}
              style={styles.subtasksScroll}
              contentContainerStyle={styles.subtasksContent}
              // "always" so taps on scroll don't dismiss keyboard.
              keyboardShouldPersistTaps="always"
            >
              {/* SwipeRowProvider scopes auto-close to subtask list. */}
              <SwipeRowProvider>
                {(task.subtasks ?? []).map((sub, idx, arr) => {
                  const isFitness = task.category === "Fitness";
                  const hasSetsReps = (sub.setsTarget ?? 0) > 0 || (sub.repsTarget ?? 0) > 0;
                  return (
                  <SwipeableRow
                    key={sub.subtaskId}
                    rowId={String(sub.subtaskId)}
                    prevId={arr[idx - 1]?.subtaskId != null ? String(arr[idx - 1].subtaskId) : undefined}
                    nextId={arr[idx + 1]?.subtaskId != null ? String(arr[idx + 1].subtaskId) : undefined}
                    // Row bg matches sheet; wrapper keeps surfaceDeep on swipe.
                    backgroundColor={c.bg}
                    actions={[
                      {
                        key: "delete",
                        icon: <DeleteIcon color={c.danger} />,
                        pressBg: c.dangerBg,
                        onPress: () => deleteSubtask(sub),
                      },
                    ]}
                    // Full-swipe past half row → slides off + deletes.
                    fullSwipeAction={() => deleteSubtask(sub)}
                    fullSwipeThreshold={0.5}
                    fullSwipeColor={c.danger}
                    // Hit-test the chip area on tap; SwipeableRow blocks Pressable children, so we route taps manually.
                    onTap={(e) => {
                      const b = chipBoundsRef.current.get(sub.subtaskId);
                      if (isFitness && b && e.x >= b.left && e.x <= b.right && e.y >= b.top && e.y <= b.bottom) {
                        startEditSubtask(sub);
                        return;
                      }
                      toggleSubtask(sub);
                    }}
                  >
                    <View style={[styles.subRow, styles.subRowPadded]}>
                      <View
                        style={[
                          styles.subCheckbox,
                          {
                            borderColor: sub.completed ? c.success : c.border,
                            backgroundColor: sub.completed ? c.successBg : "transparent",
                          },
                        ]}
                      >
                        {sub.completed ? (
                          <Svg width={8} height={6} viewBox="0 0 8 6" fill="none">
                            <Polyline
                              points="1,3 3,5 7,1"
                              stroke={c.success}
                              strokeWidth={1.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </Svg>
                        ) : null}
                      </View>
                      <ThemedText
                        numberOfLines={2}
                        style={[
                          { flex: 1, fontSize: 12, color: sub.completed ? c.fgMuted : c.fg },
                          sub.completed ? { textDecorationLine: "line-through" } : null,
                        ]}
                      >
                        {sub.title}
                      </ThemedText>
                      {isFitness ? (
                        <View
                          onLayout={(ev) => {
                            const { x, y, width, height } = ev.nativeEvent.layout;
                            chipBoundsRef.current.set(sub.subtaskId, { left: x, top: y, right: x + width, bottom: y + height });
                          }}
                          style={[styles.setsChip, {
                            borderColor: hasSetsReps ? c.borderSoft : c.borderHairline,
                          }]}
                        >
                          <ThemedText style={{
                            fontSize: 10,
                            fontWeight: "600",
                            color: hasSetsReps ? c.fgMuted : c.fgSubtle,
                            letterSpacing: 0.2,
                            fontVariant: ["tabular-nums"],
                          }}>
                            {hasSetsReps
                              ? `${sub.setsTarget ?? "—"}×${sub.repsTarget ?? "—"}`
                              : "+ sets"}
                          </ThemedText>
                        </View>
                      ) : null}
                    </View>
                  </SwipeableRow>
                  );
                })}
              </SwipeRowProvider>

              {/* Opens floating SubtaskAddBar (sibling of BottomSheet). */}
              {!addingSubtaskOpen ? (
                <Pressable
                  onPress={() => setAddingSubtaskOpen(true)}
                  style={({ pressed }) => [styles.subRow, { opacity: pressed ? 0.5 : 1 }]}
                >
                  <View style={[styles.subCheckbox, { borderColor: c.borderHairline }]} />
                  <ThemedText style={{ color: c.fgSubtle, fontSize: 12 }}>
                    + Add subtask
                  </ThemedText>
                </Pressable>
              ) : null}

              {error ? <ThemedText style={{ color: c.danger, fontSize: 12 }}>{error}</ThemedText> : null}
            </BottomSheetScrollView>
          </View>
        </View>

        {/* Footer absolute-positioned at sheet bottom; height feeds body padding. */}
        <View
          style={styles.footerAnchor}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h && h !== footerHeight) setFooterHeight(h);
          }}
        >
          {pageFooter}
        </View>

        {/* Overflow popover — Edit / Archive / Delete management actions. */}
        {menuOpen ? (
          <>
            <Pressable
              style={StyleSheet.absoluteFillObject}
              onPress={() => setMenuOpen(false)}
            />
            <View
              style={[
                styles.overflowMenu,
                {
                  backgroundColor: c.surface,
                  borderColor: c.border,
                  // Sit just above the floating ⋮ trigger; the trigger lives
                  // inside the footer with paddingBottom = 12 + insets.bottom,
                  // and is ~36px tall + a 12px gap = ~60px above the safe area.
                  bottom: insets.bottom + 60,
                },
              ]}
            >
              {showEdit ? (
                <Pressable
                  onPress={() => { setMenuOpen(false); setIsEditing(true); }}
                  style={({ pressed }) => [
                    styles.overflowMenuItem,
                    { backgroundColor: pressed ? c.overlayHover : "transparent" },
                  ]}
                >
                  <ThemedText style={[styles.overflowMenuLabel, { color: c.fgMuted }]}>
                    Edit
                  </ThemedText>
                </Pressable>
              ) : null}
              {showArchive ? (
                <Pressable
                  onPress={() => { setMenuOpen(false); handleArchive(); }}
                  style={({ pressed }) => [
                    styles.overflowMenuItem,
                    { backgroundColor: pressed ? c.overlayHover : "transparent" },
                  ]}
                >
                  <ThemedText style={[styles.overflowMenuLabel, { color: c.fgMuted }]}>
                    {task.isArchived ? "Unarchive" : "Archive"}
                  </ThemedText>
                </Pressable>
              ) : null}
              <Pressable
                onPress={() => { setMenuOpen(false); handleDelete(); }}
                style={({ pressed }) => [
                  styles.overflowMenuItem,
                  { backgroundColor: pressed ? c.overlayHover : "transparent" },
                ]}
              >
                <ThemedText style={[styles.overflowMenuLabel, { color: c.danger }]}>
                  Delete
                </ThemedText>
              </Pressable>
            </View>
          </>
        ) : null}
      </View>
    </BottomSheet>
    {task.hasCounter ? (
      <CustomLogModal
        visible={customLogOpen}
        cycleSum={quickLog.cycleSumToday}
        pendingLog={quickLog.pendingLog}
        counterGoal={task.counterGoal ?? null}
        counterUnit={task.counterUnit ?? null}
        capLogAtGoal={task.capLogAtGoal ?? false}
        onCancel={() => setCustomLogOpen(false)}
        onSubmit={handleCustomLogSubmit}
      />
    ) : null}
    {addingSubtaskOpen ? (
      <>
        {/* Full-screen tap-target behind bar — tap outside closes + dismisses keyboard. */}
        <Pressable
          style={styles.subtaskAddBarOverlay}
          onPress={() => {
            setNewSubtask("");
            setNewSubtaskSets("");
            setNewSubtaskReps("");
            setEditingSubtaskId(null);
            setAddingSubtaskOpen(false);
            Keyboard.dismiss();
          }}
        />
        <SubtaskAddBar
          value={newSubtask}
          onChange={setNewSubtask}
          disabled={addingSubtask}
          onSubmit={addSubtask}
          showSetsReps={task?.category === "Fitness"}
          setsValue={newSubtaskSets}
          onSetsChange={setNewSubtaskSets}
          repsValue={newSubtaskReps}
          onRepsChange={setNewSubtaskReps}
          onCancel={() => {
            setNewSubtask("");
            setNewSubtaskSets("");
            setNewSubtaskReps("");
            setEditingSubtaskId(null);
            setAddingSubtaskOpen(false);
            Keyboard.dismiss();
          }}
        />
      </>
    ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  // Page = sheet content root; explicit relative for 3 absolute children.
  // (dragZone/dragHandle moved to lib/task-detail-helpers.ts with makeSheetHandle.
  //  pageHeader/backBtn/backArrow/backLabel/headerRight moved to components/task-detail/page-header.tsx.)
  page: { flex: 1, position: "relative" },
  overflowBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  overflowMenu: {
    position: "absolute",
    // Anchored to the lower-right; `bottom` set inline so it can include
    // insets.bottom + footer trigger height for the correct upward offset.
    // right matches footerStack's paddingHorizontal so the menu's right
    // edge aligns with the ⋮ trigger.
    right: 16,
    minWidth: 140,
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
    boxShadow: "0px 6px 18px rgba(0, 0, 0, 0.3)",
    elevation: 12,
  },
  overflowMenuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  overflowMenuLabel: {
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontWeight: "500",
  },
  // Body between header + footer; absolute top/bottom gives bounded height.
  body: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 14,
  },
  // Header anchor — onLayout feeds height back to body's `top`.
  headerAnchor: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  // Non-scrolling top: title/chips/streak/description/actions/counter.
  topBlock: { gap: 14 },
  // Subtasks panel — flex:1 + minHeight:0 so inner ScrollView respects bounds.
  subtasksPanel: { flex: 1, minHeight: 0 },
  subtasksScroll: { flex: 1 },
  subtasksContent: { paddingTop: 4, paddingBottom: 16 },
  // Footer anchor — absolute at sheet bottom; height feeds body padding.
  footerAnchor: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Invisible full-screen tap target behind SubtaskAddBar; zIndex between sheet + bar.
  // (SubtaskAddBar's own styles live in components/task-detail/subtask-add-bar.tsx.)
  subtaskAddBarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
  },
  // Footer column: TapSlideCheckIn + Edit/Delete row.
  footerStack: {
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  // Horizontal row that holds the primary action (slider / CTA buttons) on
  // the left and the ⋮ overflow trigger on the right. alignItems:center keeps
  // the trigger vertically centered against the taller CTA / slider.
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Primary CTA — filled fill, icon + label. Solid bg is unique in the
  // modal so it reads unambiguously as the action. Secondary CTA (Pause
  // beside Complete) keeps the outlined variant to demote it to a "less
  // common" action without losing recognizability.
  primaryCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  secondaryCta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  primaryCtaLabel: {
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  // Compact pill row sized to label. (chip + iconActionBtn moved to
  // components/task-detail/meta-chip.tsx with MetaChip/IconActionBtn.)
  chipRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6 },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    // minHeight (not fixed height) so a wrapped 2-line subtask title doesn't
    // get clipped against the row's box.
    minHeight: 28,
    gap: 8,
  },
  // Subtask row padding inside SwipeableRow for breathing room.
  subRowPadded: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    minHeight: 36,
  },
  subCheckbox: {
    width: 14,
    height: 14,
    borderWidth: 1,
    borderRadius: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  subTrash: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  // Fitness-only chip on the right of a subtask row; tap to open the inline editor.
  setsChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
  },
});
