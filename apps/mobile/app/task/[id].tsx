import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import BottomSheet, {
  BottomSheetScrollView,
  type BottomSheetBackgroundProps,
} from "@gorhom/bottom-sheet";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Polyline } from "react-native-svg";

import {
  canCheckInNow,
  CATEGORY_COLOR,
  type CheckInCycleDto,
  getNextDueDate,
  parseLocalDate,
  PRIORITY_DOT,
  type Subtask,
  type TaskDto,
  type UpdateTaskRequest,
  type UserInventoryDto,
} from "@wahaha/shared";
import { subtasksApi, tasksApi } from "@/lib/api";
import { equippedCache } from "@/lib/equipped-cache";
import { taskCache } from "@/lib/task-cache";
import { taskEvents } from "@/lib/task-events";
import { CheckIcon, DeleteIcon, PauseIcon, StartIcon, UndoIcon } from "@/components/action-icons";
import { SwipeableRow } from "@/components/swipeable-row";
import { SwipeRowProvider } from "@/components/swipe-row-context";
import { ChibiAvatar } from "@/components/chibi-avatar";
import { DetailPager } from "@/components/detail-pager";
import { HeatmapStrip } from "@/components/heatmap-strip";
import { QuickLogStepper } from "@/components/quick-log-stepper";
import { SlideToCheckIn } from "@/components/slide-to-checkin";
import { StreakDisplay } from "@/components/streak-display";
import { TaskForm, type TaskFormValues, emptyTaskForm } from "@/components/task-form";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";
import { useQuickLog } from "@/hooks/use-quick-log";

function fmtShort(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function fmtFull(dateStr: string | null | undefined): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// Drag handle pill shown at the very top of the sheet. @gorhom/bottom-sheet
// uses this as both the visual affordance and a guaranteed drag target —
// even when the body content is a scrollable list, dragging the handle
// dismisses immediately. Top inset padding lives here (not on the body)
// so the pill sits below the status bar in landscape / notched devices.
function makeSheetHandle(c: ReturnType<typeof useColors>, topInset: number) {
  return function SheetHandle() {
    return (
      <View
        style={[
          styles.dragZone,
          { paddingTop: topInset + 10, backgroundColor: c.bg },
        ]}
      >
        <View style={[styles.dragHandle, { backgroundColor: c.border }]} />
      </View>
    );
  };
}

// Solid sheet background — keeps the sheet opaque against whatever screen
// the transparent-modal route is presented over.
function makeSheetBackground(bg: string) {
  return function SheetBackground({ style }: BottomSheetBackgroundProps) {
    return <View style={[style, { backgroundColor: bg }]} />;
  };
}

// Full-page header shared by every render path. Renders the back arrow on
// the left and an optional right-side slot (overflow / Cancel). Keeps the
// loading / error / edit / main screens visually aligned.
function PageHeader({
  c,
  onBack,
  backLabel,
  right,
}: {
  c: ReturnType<typeof useColors>;
  onBack: () => void;
  backLabel?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={[styles.pageHeader, { borderColor: c.borderHairline }]}>
      <Pressable
        onPress={onBack}
        hitSlop={10}
        style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.5 : 1 }]}
      >
        <ThemedText style={[styles.backArrow, { color: c.fg }]}>‹</ThemedText>
        {backLabel ? (
          <ThemedText style={[styles.backLabel, { color: c.fg }]}>{backLabel}</ThemedText>
        ) : null}
      </Pressable>
      <View style={styles.headerRight}>{right}</View>
    </View>
  );
}

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const insets = useSafeAreaInsets();

  // Seed from the list's task cache so the screen renders with full content
  // on the first frame — no spinner flash while the round-trip lands. The
  // background fetch below replaces this with canonical state (subtasks,
  // recentCycles, etc. that aren't included in the list endpoint rows).
  const [task, setTask] = useState<TaskDto | null>(() => taskCache.read(id) ?? null);
  const [loading, setLoading] = useState(() => !taskCache.read(id));
  const [error, setError] = useState<string | null>(null);
  const [newSubtask, setNewSubtask] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  // Overflow menu (Archive) anchored to the page header.
  const [menuOpen, setMenuOpen] = useState(false);
  // Lazy add-subtask input — the field only renders once the user taps the
  // "+ Add subtask" affordance, saving a row's worth of space until needed.
  const [addingSubtaskOpen, setAddingSubtaskOpen] = useState(false);
  // Imperative handle for the body BottomSheetScrollView. The subtask add
  // row asks for a scrollToEnd on focus so the input rises above the keyboard.
  const scrollRef = useRef<React.ComponentRef<typeof BottomSheetScrollView>>(null);
  // Measured header + footer heights. Both are absolute-positioned at the
  // top / bottom of the sheet content, and the body box is then absolute-
  // positioned between them (top=headerHeight, bottom=footerHeight). That
  // gives the body a *guaranteed* bounded height — independent of any
  // flex propagation through BottomSheet's internal wrappers — so the
  // subtasks BottomSheetScrollView inside actually has a parent to scroll
  // against. Without this, the body's flex:1 silently collapses to its
  // content size in some sheet configurations and the panel grows to fit
  // every row, pushing the footer past the screen edge.
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  // Keyboard handling for the "+ Add subtask" input lives in the
  // SubtaskAddBar component below — it renders OUTSIDE the BottomSheet
  // as an absolute-positioned floating bar (same pattern as
  // app/new-task.tsx) so it can lift above the keyboard via translateY
  // without depending on BottomSheet's full-screen-broken keyboard math.

  // BottomSheet ref + a single full-screen snap point. The sheet handles
  // its own slide-up mount animation and the pan-down-to-close gesture —
  // BottomSheetScrollView below it coordinates inner scroll with the
  // dismiss pan, so a downward drag at scroll offset 0 dismisses in ONE
  // gesture (no more "swipe-once-to-stop-scrolling, then again to close").
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["100%"], []);
  const SheetHandle = useMemo(() => makeSheetHandle(c, insets.top), [c, insets.top]);
  const SheetBackground = useMemo(() => makeSheetBackground(c.bg), [c.bg]);

  const handleSheetChange = useCallback((index: number) => {
    // Sheet animated past its last snap point → pop the route. We pop on
    // -1 (closed) so the route stays alive during the slide-down animation.
    if (index === -1) router.back();
  }, []);

  // Header back / edit-cancel: animate the sheet down first so the exit
  // matches the user's drag gesture. router.back() fires from onClose.
  const closeSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // Once we've shown the slider in this screen session, keep it mounted even
  // after commit flips canCheckIn → false. Otherwise the slider unmounts the
  // moment onConfirm fires, the footer column collapses by ~62 px, and the
  // body shifts. The slider's own fade-out already drops it to opacity 0,
  // so keeping it mounted just preserves the layout slot. MUST be declared
  // before any early return so hook order stays stable across render paths.
  const sliderEverShownRef = useRef(false);

  const load = useCallback(async () => {
    setError(null);
    const res = await tasksApi.getById(id);
    if (!res.data) {
      setError(res.error ?? "Task not found.");
      return;
    }
    // Merge into the existing task instead of replacing wholesale. The list
    // endpoint (getAll) and the detail endpoint (getById) sometimes return
    // different subsets of TaskDto — notably the list includes
    // currentStreakCount while a fresh getById may omit it. Replacing the
    // whole object made the streak bar visibly flash off after the
    // background fetch landed; this preserves any cached field whose fresh
    // counterpart is undefined.
    const fresh = res.data;
    let mergedForCache: TaskDto | null = null;
    setTask((prev) => {
      if (!prev) { mergedForCache = fresh; return fresh; }
      const merged: TaskDto = { ...prev };
      for (const k of Object.keys(fresh) as (keyof TaskDto)[]) {
        const v = fresh[k];
        if (v !== undefined) (merged as Record<string, unknown>)[k as string] = v;
      }
      mergedForCache = merged;
      return merged;
    });
    // Cache the merged task (not just fresh) so the cache accumulates all
    // known fields — otherwise subsequent reads would lose any field that
    // getById doesn't return but getAll does.
    if (mergedForCache) taskCache.set(mergedForCache);
  }, [id]);

  useEffect(() => {
    // Only show the spinner when we have no cached snapshot to render. With
    // a cache hit, the fetch runs silently in the background and quietly
    // replaces state when canonical data lands — no spinner flash.
    const hadCache = !!taskCache.read(id);
    if (!hadCache) setLoading(true);
    load().finally(() => setLoading(false));
  }, [load, id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  // (scrollToEnd is now consolidated into the keyboardDidShow handler
  // above — it always fires after the keyboardHeight-driven re-render
  // so the input lands at the bottom of the shrunken visible panel.)

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

  async function handleCheckIn() {
    if (!task) return;
    // Optimistic broadcast: TaskList instances behind the screen pick this
    // up and reshuffle the row into the "Checked In" / "Upcoming" section
    // instantly. We advance dueDate locally with getNextDueDate so the
    // splitCheckedIn predicate (`today < dueDate`) actually flips — daily
    // tasks have dueDate = today before check-in, so without the advance
    // the row visibly gets a "checked-in today" border but doesn't move.
    // The server call below is authoritative; TaskList's useFocusEffect
    // refetches on focus for correctness.
    const todayIso = new Date().toISOString().split("T")[0];
    const nextDueIso = task.recurrenceRule
      ? getNextDueDate(task.dueDate, task.recurrenceRule)
      : task.dueDate ?? todayIso;
    taskEvents.emitCheckedIn({
      taskId: task.taskId,
      lastCheckInDateIso: todayIso,
      nextDueDateIso: nextDueIso,
    });
    // Optimistic local patch so canCheckIn flips immediately — the slider
    // fade-out completes and the footer unmounts in one beat instead of
    // briefly re-rendering at opacity 1 after the slide finishes its
    // commit animation but before load() lands. Server is authoritative;
    // load() reconciles below.
    setTask((prev) => (prev ? {
      ...prev,
      lastCheckInDate: todayIso,
      dueDate: nextDueIso ?? prev.dueDate,
    } : prev));
    const res = await tasksApi.checkIn(task.taskId);
    if (res.error) { setError(res.error); return; }
    await load();
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

  // Mirrors web's `canUndo` path in useTaskActions.handleAdvance — reverts a
  // completed-but-not-submitted task to in_progress so the user can edit and
  // re-complete it. The server side is a regular update; no special API.
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
    // No confirm dialog — the overflow-menu tap is enough intent, and an
    // extra prompt is friction. Mirrors the swipe-delete on the task list.
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

  // Computed pre-early-return so all hooks below run on every render path —
  // React errors with "rendered fewer hooks than expected" if a useRef
  // (sliderEverShownRef) sits after a conditional return.
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
        // Edit mode disables pan-down-to-close — the form is wall-to-wall
        // TextInputs and Pressables and the user has an explicit Cancel
        // button right there. A sheet-wide dismiss-pan would compete with
        // text-field scrolling and accidental flicks.
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        onChange={handleSheetChange}
        handleComponent={SheetHandle}
        backgroundComponent={SheetBackground}
      >
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
      </BottomSheet>
    );
  }

  // Web's canUndo: completed (one-off) but not submitted yet and no points
  // awarded — the row is still rollback-able from "completed" → "in_progress".
  const canUndo =
    task.status === "completed" &&
    task.submitted !== true &&
    !task.pointsAwarded;

  // Edit is hidden for completed tasks (web behaviour) — only Undo and
  // Delete are useful from there.
  const showEdit = task.status !== "completed";
  // Archive only makes sense for one-off tasks; recurring routines are
  // deleted, not archived. The triple-dot overflow only exists to host it,
  // so it disappears entirely on recurring rows.
  const showArchive = !task.isRecurring;
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
        <SlideToCheckIn pointValue={task.pointValue} onConfirm={handleCheckIn} />
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
      enablePanDownToClose
      enableDynamicSizing={false}
      onChange={handleSheetChange}
      handleComponent={SheetHandle}
      backgroundComponent={SheetBackground}
      // "extend" shrinks the sheet's content area to sit above the keyboard
      // (BottomSheetContent.tsx subtracts keyboardHeightWithinContainer from
      // contentHeight). At our 100% snap that means the sheet stops just
      // above the keyboard instead of being covered by it, so the absolute-
      // positioned footer rides up and the scrollToEnd call below lands the
      // "+ Add subtask" input at the bottom of the visible panel.
      // "interactive" was wrong for our use case — it's for cases where the
      // user drags the sheet to dismiss the keyboard, not where we want the
      // sheet to automatically resize. Android also needs adjustResize so the
      // window itself shrinks when the soft input opens.
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
        {/* Body is absolute-positioned between the measured header (top)
            and footer (bottom) so it has a guaranteed bounded height —
            inner flex chains (subtasks panel → BottomSheetScrollView)
            then have a real container to fit and scroll against. */}
        <View style={[styles.body, { top: headerHeight, bottom: footerHeight }]}>
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

              {/* Streak (recurring + count >= 3) */}
              {task.isRecurring ? (
                <StreakDisplay
                  currentStreakCount={task.currentStreakCount}
                  longestStreakCount={task.longestStreakCount}
                />
              ) : null}

              {/* Description */}
              {task.description ? (
                <ThemedText style={{ color: c.fgMuted, fontSize: 12, lineHeight: 18 }}>
                  {task.description}
                </ThemedText>
              ) : null}

              {/* Locked pill (pending+recurring+not-yet-checkable) — inline cue. */}
              {task.status === "pending" && task.isRecurring && !canCheckIn ? (
                <View
                  style={{
                    alignSelf: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderWidth: 1,
                    borderRadius: 999,
                    borderColor: c.warningBorder,
                    backgroundColor: c.warningBg,
                  }}
                >
                  <ThemedText style={{ fontSize: 11, color: c.warning, letterSpacing: 1.4, textTransform: "uppercase" }}>
                    Locked · {fmtShort(task.dueDate)}
                  </ThemedText>
                </View>
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

          {/* CounterPanel — the DetailPager inside has its own horizontal
              pan. BottomSheet's pan-down-to-close only activates on
              vertical motion (failOffsetX is the default), so they don't
              conflict, but we keep this comment as a reminder for anyone
              adding ancestor gestures here. */}
          {task.isRecurring && task.recurrenceRule ? (
            <CounterPanel
              task={task}
              onCycleAppend={(cycle) =>
                setTask((prev) => prev
                  ? { ...prev, recentCycles: [cycle, ...(prev.recentCycles ?? [])] }
                  : prev
                )
              }
              onError={setError}
            />
          ) : null}

          {/* Subtasks panel — claims remaining body height (flex:1) and
              scrolls internally. minHeight:0 is required so a flex child
              can shrink below its intrinsic content size — without it the
              panel grows to fit all subtask rows and pushes the footer
              off-screen, which is exactly what we're fixing. */}
          <View style={styles.subtasksPanel}>
            <BottomSheetScrollView
              ref={scrollRef}
              style={styles.subtasksScroll}
              contentContainerStyle={styles.subtasksContent}
              // "always" (not "handled") so a tap anywhere on the scroll
              // doesn't dismiss the keyboard while the input is open —
              // we rely on the explicit ✕ in SubtaskAddRow to close it.
              keyboardShouldPersistTaps="always"
            >
              {/* SwipeRowProvider scopes the "auto-close other rows" behaviour
                  to the subtask list — swiping one open closes any other open
                  one. Same pattern as the task-list rows. */}
              <SwipeRowProvider>
                {(task.subtasks ?? []).map((sub, idx, arr) => (
                  <SwipeableRow
                    key={sub.subtaskId}
                    rowId={sub.subtaskId}
                    prevId={arr[idx - 1]?.subtaskId}
                    nextId={arr[idx + 1]?.subtaskId}
                    // Match the sheet's bg so the row reads as part of
                    // the details panel; the SwipeableRow's wrapper
                    // (which shows when swiping) keeps the darker
                    // surfaceDeep so the delete chip stands out against
                    // it.
                    backgroundColor={c.bg}
                    actions={[
                      {
                        key: "delete",
                        icon: <DeleteIcon color={c.danger} />,
                        pressBg: c.dangerBg,
                        onPress: () => deleteSubtask(sub),
                      },
                    ]}
                    // Full-swipe to delete: drag the row past ~half its
                    // width and release. The row slides off-screen,
                    // wrapper bg flashes to c.danger past the
                    // threshold as a "release to commit" cue, and
                    // deleteSubtask fires.
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

              {/* Tap-target opens the floating SubtaskAddBar (rendered as a
                  sibling of the BottomSheet, see end of return). The input
                  itself lives there — not inline — so it can lift above
                  the soft keyboard with a translateY transform. */}
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

        {/* Footer is anchored to the sheet bottom via absolute positioning
            so it stays visible no matter how tall the body grows. onLayout
            feeds back the measured height to footerHeight state, which the
            body reads as paddingBottom (see above) to keep the subtasks
            scroll panel from being hidden behind it. */}
        <View
          style={styles.footerAnchor}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h && h !== footerHeight) setFooterHeight(h);
          }}
        >
          {pageFooter}
        </View>

        {/* Overflow popover — Archive only (one-off tasks). Edit + Delete
            live in the page footer below the slider. Positioned absolutely
            within the sheet content. */}
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
    {addingSubtaskOpen ? (
      <>
        {/* Full-screen tap-target behind the bar. Tapping anywhere
            outside the input row closes the bar and dismisses the
            keyboard. Rendered before the bar in tree order, and the
            bar's wrapper has elevation/zIndex, so the bar sits on top
            and taps on it stay with the bar. */}
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

// Heatmap + counter stepper share pendingLog so the heatmap's today cell
// reflects buffered taps in real time. Lives in its own subcomponent because
// useQuickLog requires a non-null TaskDto.
function CounterPanel({
  task,
  onCycleAppend,
  onError,
}: {
  task: TaskDto;
  onCycleAppend: (cycle: CheckInCycleDto) => void;
  onError: (msg: string) => void;
}) {
  const flushQuickLog = useCallback(
    async (taskId: string, delta: number): Promise<CheckInCycleDto | null> => {
      if (delta === 0) return null;
      const res = await tasksApi.logCounter(taskId, delta);
      if (res.error) {
        if (res.status === 404) return null;
        if (res.status === 400 && /already checked in/i.test(res.error)) return null;
        const signed = `${delta > 0 ? "+" : ""}${delta}`;
        onError(`Couldn't save log (${signed}): ${res.error}`);
        return null;
      }
      if (!res.data) return null;
      onCycleAppend(res.data);
      return res.data;
    },
    [onCycleAppend, onError],
  );

  const cycles = task.recentCycles ?? [];
  const { pendingLog, cycleSumToday, handleStepperIncrement, handleStepperDecrement } = useQuickLog({
    task,
    heatmapCycles: cycles,
    onFlushQuickLog: flushQuickLog,
  });

  // Equipped avatar — module-level cache (lib/equipped-cache) keeps the
  // last-known equipped set in memory so subsequent screen opens skip the
  // /api/avatar/equipped round-trip and the chibi renders in the same
  // frame the screen mounts. The cache also runs `applyHints` so per-item
  // render hints are baked in before ChibiAvatar composes the layers. A
  // background revalidate on mount picks up any changes from the avatar
  // screen.
  const [equipped, setEquipped] = useState<UserInventoryDto[]>(
    () => equippedCache.read() ?? [],
  );
  useEffect(() => {
    const unsubscribe = equippedCache.subscribe(setEquipped);
    equippedCache.revalidate();
    return unsubscribe;
  }, []);

  // Heatmap is meaningful only for daily / weekdays cadence (matches web).
  // For weekly / biweekly / monthly the second tab would mostly be empty, so
  // skip it and render the Stage card alone.
  const rule = task.recurrenceRule ?? "";
  const showStatsTab = rule === "daily" || rule === "weekdays";
  const checkedInToday = (task.lastCheckInDate ?? "").split("T")[0] === new Date().toISOString().split("T")[0];
  const showStepper = task.hasCounter === true && task.status === "pending" && !checkedInToday;

  const stageCard = (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 8 }}>
      <ChibiAvatar equipped={equipped} height={168} />
      {task.hasCounter ? (
        <QuickLogStepper
          cycleSum={cycleSumToday}
          pendingLog={pendingLog}
          showStepper={showStepper}
          counterUnit={task.counterUnit ?? null}
          counterGoal={task.counterGoal ?? null}
          capAtGoal={task.capLogAtGoal ?? undefined}
          onIncrement={handleStepperIncrement}
          onDecrement={handleStepperDecrement}
        />
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
      labels={showStatsTab ? ["Stage", "Stats"] : ["Stage"]}
      cards={
        showStatsTab
          ? [
              { key: "stage", content: stageCard },
              { key: "stats", content: statsCard },
            ]
          : [{ key: "stage", content: stageCard }]
      }
    />
  );
}


// Floating add-subtask bar. Same pattern as app/new-task.tsx: an
// absolutely-positioned bar pinned to the bottom of the route, lifted
// above the soft keyboard by a reanimated translateY driven by live
// Keyboard.addListener events. We render this OUTSIDE the BottomSheet
// so it isn't constrained by the sheet's content area (which BottomSheet
// doesn't shrink on keyboard open for full-screen snap points). Plain RN
// TextInput is fine here — we're no longer in the sheet's gesture tree,
// so the BottomSheetTextInput registration ceremony isn't needed.
function SubtaskAddBar({
  value,
  onChange,
  onSubmit,
  onCancel,
  disabled,
}: {
  value: string;
  onChange: (next: string) => void;
  // Returns true if the submit succeeded so the bar knows to flash the
  // "Added" toast and re-focus the input for the next entry.
  onSubmit: () => Promise<boolean>;
  onCancel: () => void;
  disabled: boolean;
}) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<TextInput>(null);
  const kbHeight = useSharedValue(0);
  // "Added" toast — fades in and rises slightly, holds, then fades back.
  const toastOpacity = useSharedValue(0);
  const toastTranslateY = useSharedValue(8);
  const toastHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Will* on iOS for a smoother ride-up; Did* on Android because Will*
    // isn't reliably emitted there.
    const showEvt = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const show = Keyboard.addListener(showEvt, (e) => {
      kbHeight.value = withTiming(e.endCoordinates.height, { duration: 200 });
    });
    const hide = Keyboard.addListener(hideEvt, () => {
      kbHeight.value = withTiming(0, { duration: 200 });
    });
    return () => {
      show.remove();
      hide.remove();
      if (toastHideTimer.current) clearTimeout(toastHideTimer.current);
    };
  }, [kbHeight]);

  const barStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -kbHeight.value }],
  }));
  const toastStyle = useAnimatedStyle(() => ({
    opacity: toastOpacity.value,
    transform: [{ translateY: toastTranslateY.value }],
  }));

  // Submit wrapper — on success flashes the "Added" pill. We deliberately
  // do NOT call inputRef.focus() here: blurOnSubmit={false} keeps focus
  // already, and a manual .focus() after the async submit was creating a
  // dismiss → re-show flash (focus was briefly gone, then forced back).
  async function handleSubmit() {
    const ok = await onSubmit();
    if (!ok) return;
    if (toastHideTimer.current) clearTimeout(toastHideTimer.current);
    toastOpacity.value = withTiming(1, { duration: 140 });
    toastTranslateY.value = withTiming(0, { duration: 140 });
    toastHideTimer.current = setTimeout(() => {
      toastOpacity.value = withTiming(0, { duration: 220 });
      toastTranslateY.value = withTiming(8, { duration: 220 });
    }, 900);
  }

  // Stable button — single Pressable across both states. Swapping between
  // a ↑-Pressable and a ✕-Pressable on every submit (when value flips
  // empty) unmounts the element the user just tapped, which iOS would
  // sometimes interpret as a focus-out on the adjacent TextInput.
  const hasText = value.trim().length > 0;
  const onButtonPress = hasText ? handleSubmit : onCancel;

  return (
    <Animated.View style={[styles.subtaskAddBarWrapper, barStyle]}>
      {/* "Added" pill — rendered ABOVE the bar in column flow (not as an
          absolute child of the bar) so Android's elevation+shadow on the
          bar can't clip it onto the input. */}
      <Animated.View
        pointerEvents="none"
        style={[styles.subtaskAddedToast, toastStyle]}
      >
        <View
          style={[
            styles.subtaskAddedToastPill,
            { backgroundColor: c.success, borderColor: c.success },
          ]}
        >
          <ThemedText
            style={{
              color: c.bg,
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 1.4,
              textTransform: "uppercase",
            }}
          >
            Added
          </ThemedText>
        </View>
      </Animated.View>

      <View
        style={[
          styles.subtaskAddBar,
          {
            backgroundColor: c.panel,
            borderTopColor: c.border,
            paddingBottom: 10 + insets.bottom,
          },
        ]}
      >
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChange}
          placeholder="Add a subtask…"
          placeholderTextColor={c.fgSubtle}
          onSubmitEditing={handleSubmit}
          returnKeyType="done"
          // DELIBERATELY no `editable={!disabled}` — flipping editable to
          // false while addSubtask is in flight calls
          // setUserInteractionEnabled(false) on the native UITextField,
          // which iOS treats as a focus loss and dismisses the keyboard.
          // The await is fast enough that letting the user type more
          // characters during it is fine; if they tap submit during the
          // gap the parent's addSubtask no-ops on an empty title anyway.
          autoFocus
          blurOnSubmit={false}
          textAlignVertical="center"
          style={[
            styles.subtaskAddBarInput,
            { color: c.inputFg },
          ]}
        />
        <Pressable
          onPress={onButtonPress}
          disabled={disabled && hasText}
          hitSlop={8}
          style={[
            styles.subtaskAddBarBtn,
            { backgroundColor: hasText ? c.activeHighlight : c.input },
          ]}
        >
          <ThemedText
            style={{
              color: hasText ? c.bg : c.fgSubtle,
              fontSize: hasText ? 16 : 14,
              fontWeight: hasText ? "700" : "400",
              lineHeight: hasText ? 18 : 16,
            }}
          >
            {hasText ? "↑" : "✕"}
          </ThemedText>
        </Pressable>
      </View>
    </Animated.View>
  );
}

function IconActionBtn({
  color,
  bg,
  onPress,
  icon,
}: {
  color: string;
  bg: string;
  onPress: () => void;
  icon: React.ReactNode;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconActionBtn,
        {
          borderColor: color,
          backgroundColor: pressed ? color : bg,
        },
      ]}
    >
      {icon}
    </Pressable>
  );
}

function MetaChip({
  color,
  label,
  leading,
}: {
  color: string;
  label: string;
  leading?: React.ReactNode;
}) {
  // Translucent tint based on the line color. `${color}1A` appends 10%
  // alpha (1A == 26/255). Works for both #rgb hex and the rgb()
  // palette values our theme uses for fg/active highlights.
  const bg = color.startsWith("#") ? `${color}1A` : color;
  return (
    <View
      style={[
        styles.chip,
        {
          borderColor: color,
          backgroundColor: color.startsWith("#") ? bg : "transparent",
        },
      ]}
    >
      {leading}
      <ThemedText
        style={{
          color,
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 1.2,
        }}
      >
        {label}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  // Page is the sheet's content root. position:relative is the default
  // for RN Views but we make it explicit because we hang three absolute-
  // positioned children off it (header anchor, body, footer anchor).
  page: { flex: 1, position: "relative" },
  // Generous swipe target above the header — same recipe the old SheetShell
  // used (full-width, ~32 px tall) so it's an easy drag target without
  // covering any tappable controls.
  dragZone: {
    paddingTop: 10,
    paddingBottom: 8,
    alignItems: "center",
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 4,
    minHeight: 44,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  backArrow: {
    fontSize: 28,
    lineHeight: 28,
    fontWeight: "300",
  },
  backLabel: {
    fontSize: 14,
    marginLeft: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
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
  // Body wrapper sits between the header and the footer. Absolute
  // positioning with top/bottom (set inline from measured header/footer
  // heights) gives the body an explicit bounded height — that's what
  // lets the inner subtasks panel's flex:1 child actually compute a
  // height to scroll within.
  body: {
    position: "absolute",
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 14,
  },
  // Header sits at the top of the sheet. onLayout reports its height
  // back to the body so the body knows where to start.
  headerAnchor: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  // Non-scrolling top section — title, chips, streak, description, the
  // Locked pill or primary-action row, and the CounterPanel underneath.
  // Whatever lives here is always visible; it's the subtasks panel that
  // absorbs any vertical overflow.
  topBlock: { gap: 14 },
  // Self-scrolling subtasks panel. flex:1 + minHeight:0 are both required
  // for the contained BottomSheetScrollView to respect the available
  // height instead of expanding to fit every row.
  subtasksPanel: { flex: 1, minHeight: 0 },
  subtasksScroll: { flex: 1 },
  subtasksContent: { gap: 14, paddingTop: 4, paddingBottom: 16 },
  // Footer anchor: absolute-positioned at the sheet bottom so it stays
  // on-screen no matter how the body lays out. The body reads this
  // element's measured height (via onLayout) into a paddingBottom so the
  // scrollable subtasks panel doesn't end behind the footer.
  footerAnchor: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Invisible full-screen tap target rendered behind the SubtaskAddBar
  // while it's open. Catches taps outside the input row and dismisses
  // the bar + keyboard. zIndex sits between the BottomSheet chrome and
  // the bar's wrapper so a tap on the bar still reaches the bar.
  subtaskAddBarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 90,
  },
  // Wrapper anchors the bar (and the toast sibling above it) to the
  // bottom of the route. The reanimated translateY for keyboard lift is
  // applied here so the toast rides up with the bar in a single
  // transform. zIndex/elevation lift the whole wrapper above the
  // BottomSheet's footer chrome.
  subtaskAddBarWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "stretch",
    zIndex: 100,
    elevation: 18,
  },
  // Floating add-subtask bar — child of the wrapper, sits at its bottom
  // edge. No own absolute positioning so the toast sibling above it
  // takes its natural place in column flow.
  subtaskAddBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    boxShadow: "0px -8px 24px rgba(0, 0, 0, 0.35)",
  },
  subtaskAddBarInput: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 6,
    includeFontPadding: false,
  },
  subtaskAddBarBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  // "Added" toast — column sibling above the bar, centered horizontally.
  // marginBottom adds breathing room between the pill and the input row.
  // pointerEvents:none on the wrapper (in JSX) so it never steals taps.
  subtaskAddedToast: {
    alignItems: "center",
    marginBottom: 8,
  },
  subtaskAddedToastPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  // Bottom-anchored footer column: SlideToCheckIn on top (when shown), Edit /
  // Delete row below it. paddingBottom is composed inline with insets.bottom.
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
  // Compact pill row: each chip is borderless-wide and sized to its label.
  chipRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 6 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipDot: { width: 6, height: 6, borderRadius: 3 },
  // Round icon button used by the primary-action row. Same diameter as the
  // submit pill in the new-task quick-add bar so the visual vocabulary is
  // consistent across the app.
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  subRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 28,
    gap: 8,
  },
  // Extra padding applied to subtask rows that live inside SwipeableRow.
  // The row's bg is now c.bg (matching the sheet), so the text/checkbox
  // need horizontal breathing room from the row's edges. Vertical padding
  // bumps the touch target a bit too.
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
