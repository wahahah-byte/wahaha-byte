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
  BottomSheetScrollView,
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
import { IconActionBtn, MetaChip } from "@/components/task-detail/meta-chip";
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

  // Seed from list task cache so first frame renders content without spinner.
  const [task, setTask] = useState<TaskDto | null>(() => taskCache.read(id) ?? null);
  const [loading, setLoading] = useState(() => !taskCache.read(id));
  const [error, setError] = useState<string | null>(null);
  const [newSubtask, setNewSubtask] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);
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

  // BottomSheet ref + single full-screen snap.
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["100%"], []);
  const SheetHandle = useMemo(() => makeSheetHandle(c, insets.top), [c, insets.top]);
  const SheetBackground = useMemo(() => makeSheetBackground(c.bg), [c.bg]);

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
      const res = await tasksApi.logCounter(taskId, delta);
      if (res.error) {
        if (res.status === 404) return null;
        if (res.status === 400 && /already checked in/i.test(res.error)) return null;
        const signed = `${delta > 0 ? "+" : ""}${delta}`;
        setError(`Couldn't save log (${signed}): ${res.error}`);
        return null;
      }
      if (!res.data) return null;
      // Write the new cycle straight into the module cache so the next modal mount
      // sees it even if our local setTask ran on an unmounted component (unmount-flush path).
      const cached = taskCache.read(taskId);
      if (cached) {
        taskCache.set({
          ...cached,
          recentCycles: [res.data, ...(cached.recentCycles ?? [])],
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
    setAddingSubtask(true);
    setNewSubtask("");
    const res = await subtasksApi.create(task.taskId, title);
    setAddingSubtask(false);
    if (res.error || !res.data) {
      setError(res.error ?? "Failed to add subtask.");
      setNewSubtask(title);
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
    // Optimistic local patch so canCheckIn flips immediately.
    setTask((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        lastCheckInDate: todayIso,
        dueDate: nextDueIso ?? prev.dueDate,
        currentStreakCount: predictedStreak,
        longestStreakCount: predictedLongest,
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

  // Counter-task check-in: drains pending buffered logs into the final cycle's counterValue.
  async function handleCheckInWithCounter(touchValue: number) {
    if (!task) return;
    const buffered = quickLog.consumePending();
    const total = touchValue + buffered;
    await handleCheckIn(total > 0 ? total : undefined);
  }

  // Custom-log modal submit: edit semantics — `amount` is the new absolute total for today.
  // If the new total meets the goal, auto-checkin with it; otherwise set pending to the signed delta.
  function handleCustomLogSubmit(amount: number) {
    if (!task || amount < 0) return;
    setCustomLogOpen(false);
    const wouldOvershoot =
      task.counterGoal != null && amount >= task.counterGoal;
    if (wouldOvershoot) {
      // Drain any buffered pending; the entered amount is the new absolute total committed to the cycle.
      quickLog.consumePending();
      handleCheckInWithCounter(amount);
      return;
    }
    quickLog.setPending(amount);
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

  async function handleDelete() {
    if (!task) return;
    // No confirm — overflow tap is enough intent; mirrors swipe-delete.
    const res = await tasksApi.delete(task.taskId);
    if (res.error) { setError(res.error); return; }
    taskCache.remove(task.taskId);
    router.back();
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
            />
            <LogCheckinButton
              cycleSum={quickLog.cycleSumToday}
              pendingLog={quickLog.pendingLog}
              counterGoal={task.counterGoal ?? null}
              pointValue={task.pointValue}
              disabled={checkingIn || !canCheckIn}
              onLog={quickLog.handleStepperIncrement}
              onCheckInWithCounter={handleCheckInWithCounter}
            />
          </View>
        ) : (
          <TapSlideCheckIn pointValue={task.pointValue} onCommit={() => handleCheckIn()} />
        )
      ) : null}
      <View style={styles.bottomActionRow}>
        {showEdit ? (
          <Pressable
            onPress={() => setIsEditing(true)}
            style={({ pressed }) => [
              styles.bottomActionBtn,
              {
                borderColor: c.borderHairline,
                backgroundColor: pressed ? c.overlayHover : "transparent",
              },
            ]}
          >
            <ThemedText style={[styles.bottomActionLabel, { color: c.activeHighlight }]}>
              Edit
            </ThemedText>
          </Pressable>
        ) : null}
        <Pressable
          onPress={handleDelete}
          style={({ pressed }) => [
            styles.bottomActionBtn,
            {
              borderColor: c.borderHairline,
              backgroundColor: pressed ? c.overlayHover : "transparent",
            },
          ]}
        >
          <ThemedText style={[styles.bottomActionLabel, { color: c.danger }]}>
            Delete
          </ThemedText>
        </Pressable>
      </View>
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
            right={
              showArchive ? (
                <Pressable
                  onPress={() => setMenuOpen((v) => !v)}
                  hitSlop={8}
                  style={styles.overflowBtn}
                >
                  <ThemedText style={{ fontSize: 18, lineHeight: 18, color: c.fgMuted }}>⋯</ThemedText>
                </Pressable>
              ) : null
            }
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

              {(task.status === "pending" && !task.isRecurring)
              || task.status === "in_progress"
              || (canUndo && !task.isRecurring) ? (
                <View style={styles.actionRow}>
                  {task.status === "pending" && !task.isRecurring ? (
                    <IconActionBtn
                      color={c.activeHighlight}
                      bg={c.activeHighlightBg}
                      onPress={handleStart}
                      icon={<StartIcon color={c.activeHighlight} />}
                    />
                  ) : null}
                  {task.status === "in_progress" ? (
                    <>
                      <IconActionBtn
                        color={c.success}
                        bg={c.successBg}
                        onPress={handleComplete}
                        icon={<CheckIcon color={c.success} />}
                      />
                      <IconActionBtn
                        color={c.warning}
                        bg={c.warningBg}
                        onPress={handlePause}
                        icon={<PauseIcon color={c.warning} />}
                      />
                    </>
                  ) : null}
                  {canUndo && !task.isRecurring ? (
                    <IconActionBtn
                      color={c.warning}
                      bg={c.warningBg}
                      onPress={handleUndoComplete}
                      icon={<UndoIcon color={c.warning} />}
                    />
                  ) : null}
                </View>
              ) : null}
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
                {(task.subtasks ?? []).map((sub, idx, arr) => (
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
                    onTap={() => toggleSubtask(sub)}
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
                        numberOfLines={1}
                        style={[
                          { flex: 1, fontSize: 12, color: sub.completed ? c.fgMuted : c.fg },
                          sub.completed ? { textDecorationLine: "line-through" } : null,
                        ]}
                      >
                        {sub.title}
                      </ThemedText>
                    </View>
                  </SwipeableRow>
                ))}
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

        {/* Overflow popover — Archive only; absolute within sheet content. */}
        {menuOpen && showArchive ? (
          <>
            <Pressable
              style={StyleSheet.absoluteFillObject}
              onPress={() => setMenuOpen(false)}
            />
            <View
              style={[
                styles.overflowMenu,
                { backgroundColor: c.surface, borderColor: c.border },
              ]}
            >
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
            setAddingSubtaskOpen(false);
            Keyboard.dismiss();
          }}
        />
        <SubtaskAddBar
          value={newSubtask}
          onChange={setNewSubtask}
          disabled={addingSubtask}
          onSubmit={addSubtask}
          onCancel={() => {
            setNewSubtask("");
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
    top: 48,
    right: 14,
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
  bottomActionRow: {
    flexDirection: "row",
    gap: 8,
  },
  bottomActionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomActionLabel: {
    fontSize: 11,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  // Compact pill row sized to label. (chip + iconActionBtn moved to
  // components/task-detail/meta-chip.tsx with MetaChip/IconActionBtn.)
  chipRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6 },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  // Status-action row holds 1–2 IconActionBtns (start/complete/pause/undo).
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 28,
    gap: 8,
  },
  // Subtask row padding inside SwipeableRow for breathing room.
  subRowPadded: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    height: 36,
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
});
