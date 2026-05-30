import { useCallback, useMemo, useRef } from "react";
import { ActivityIndicator, Keyboard, Pressable, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  canCheckInNow,
  CATEGORY_COLOR,
  PRIORITY_DOT,
} from "@wahaha/shared";
import { CustomLogModal } from "@/components/custom-log-modal";
import { TaskForm, type TaskFormValues, emptyTaskForm } from "@/components/task-form";
import { AvatarOnlyHero, CounterPanel } from "@/components/task-detail/avatar-hero";
import { EditPaneSwipeWrapper } from "@/components/task-detail/edit-pane-swipe";
import { MetaChip } from "@/components/task-detail/meta-chip";
import { PageHeader } from "@/components/task-detail/page-header";
import { SubtaskAddBar } from "@/components/task-detail/subtask-add-bar";
import { SubtaskList } from "@/components/task-detail/subtask-list";
import { TaskFooter } from "@/components/task-detail/task-footer";
import { TaskOverflowMenu } from "@/components/task-detail/task-overflow-menu";
import { styles } from "@/components/task-detail/styles";
import { ThemedText } from "@/components/themed-text";
import { useColors } from "@/hooks/use-colors";
import { useTaskDetail } from "@/hooks/use-task-detail";
import { fmtFull, fmtShort, makeSheetBackground, makeSheetHandle } from "@/lib/task-detail-helpers";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const insets = useSafeAreaInsets();

  const d = useTaskDetail(id);
  const { task, quickLog } = d;

  // BottomSheet ref + partial snap. 70% balances "anchored to the bottom"
  // with enough vertical room for hero + chips + a non-trivial subtasks list.
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["70%"], []);
  // Rounded top corners on the sheet container itself (overflow:hidden so inner content clips).
  const sheetStyle = useMemo(
    () => ({
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      overflow: "hidden" as const,
    }),
    [],
  );
  const SheetHandle = useMemo(() => makeSheetHandle(c, 0), [c]);
  const SheetBackground = useMemo(() => makeSheetBackground(c.bg), [c.bg]);
  // Dimmed backdrop above the underlying transparentModal route. While the
  // add-subtask bar is open, disable close-on-press so the bar's own overlay
  // handles dismissing it without also collapsing the sheet.
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior={d.addingSubtaskOpen ? "none" : "close"}
      />
    ),
    [d.addingSubtaskOpen],
  );

  const handleSheetChange = useCallback((index: number) => {
    // Pop route on close (-1) so route stays alive during slide-down.
    if (index === -1) router.back();
  }, []);

  // Animate sheet down on close; suppressed during in-flight check-in.
  const closeSheet = useCallback(() => {
    if (d.checkingIn) return;
    sheetRef.current?.close();
  }, [d.checkingIn]);

  if (d.loading && !task) {
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
            <ThemedText style={{ color: c.danger }}>{d.error ?? "Task not found."}</ThemedText>
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
  if (canCheckIn) d.sliderEverShownRef.current = true;
  const renderSlider = canCheckIn || d.sliderEverShownRef.current;

  if (d.isEditing) {
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
        <EditPaneSwipeWrapper onDismiss={() => d.setIsEditing(false)}>
          <View style={styles.page}>
            <PageHeader
              c={c}
              onBack={() => d.setIsEditing(false)}
              backLabel="Cancel"
            />
            <TaskForm
              initial={initial}
              submitLabel="Save"
              onSubmit={d.handleEditSubmit}
              onCancel={() => d.setIsEditing(false)}
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

  return (
    <>
    <BottomSheet
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      // Block pan-down-to-close while check-in POST in flight (~200ms).
      enablePanDownToClose={!d.checkingIn}
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
            if (h && h !== d.headerHeight) d.setHeaderHeight(h);
          }}
        >
          <PageHeader
            c={c}
            onBack={closeSheet}
          />
        </View>
        {/* Body absolute-positioned between header + footer for bounded height. */}
        <View style={[styles.body, { top: d.headerHeight, bottom: d.footerHeight }]}>
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
            </View>

          {/* Subtasks panel — flex:1 + minHeight:0 so it scrolls internally. */}
          <SubtaskList
            task={task}
            c={c}
            scrollRef={d.scrollRef}
            chipBoundsRef={d.chipBoundsRef}
            addingSubtaskOpen={d.addingSubtaskOpen}
            error={d.error}
            onToggleSubtask={d.toggleSubtask}
            onDeleteSubtask={d.deleteSubtask}
            onStartEditSubtask={d.startEditSubtask}
            onAddOpen={() => d.setAddingSubtaskOpen(true)}
          />
        </View>

        {/* Footer absolute-positioned at sheet bottom; height feeds body padding. */}
        <View
          style={styles.footerAnchor}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h && h !== d.footerHeight) d.setFooterHeight(h);
          }}
        >
          <TaskFooter
            task={task}
            renderSlider={renderSlider}
            canCheckIn={canCheckIn}
            canUndo={canUndo}
            checkingIn={d.checkingIn}
            quickLog={quickLog}
            insets={insets}
            c={c}
            onToggleMenu={() => d.setMenuOpen((v) => !v)}
            onCustomLogOpen={() => d.setCustomLogOpen(true)}
            onCheckIn={() => d.handleCheckIn()}
            onCheckInWithCounter={d.handleCheckInWithCounter}
            onStart={d.handleStart}
            onComplete={d.handleComplete}
            onPause={d.handlePause}
            onUndoComplete={d.handleUndoComplete}
          />
        </View>

        {d.menuOpen ? (
          <TaskOverflowMenu
            task={task}
            c={c}
            insets={insets}
            showEdit={showEdit}
            showArchive={showArchive}
            onClose={() => d.setMenuOpen(false)}
            onEdit={() => d.setIsEditing(true)}
            onArchive={d.handleArchive}
            onDelete={d.handleDelete}
          />
        ) : null}
      </View>
    </BottomSheet>
    {task.hasCounter ? (
      <CustomLogModal
        visible={d.customLogOpen}
        cycleSum={quickLog.cycleSumToday}
        pendingLog={quickLog.pendingLog}
        counterGoal={task.counterGoal ?? null}
        counterUnit={task.counterUnit ?? null}
        capLogAtGoal={task.capLogAtGoal ?? false}
        onCancel={() => d.setCustomLogOpen(false)}
        onSubmit={d.handleCustomLogSubmit}
      />
    ) : null}
    {d.addingSubtaskOpen ? (
      <>
        {/* Full-screen tap-target behind bar — tap outside closes + dismisses keyboard. */}
        <Pressable
          style={styles.subtaskAddBarOverlay}
          onPress={() => {
            d.setNewSubtask("");
            d.setNewSubtaskSets("");
            d.setNewSubtaskReps("");
            d.setEditingSubtaskId(null);
            d.setAddingSubtaskOpen(false);
            Keyboard.dismiss();
          }}
        />
        <SubtaskAddBar
          value={d.newSubtask}
          onChange={d.setNewSubtask}
          disabled={d.addingSubtask}
          onSubmit={d.addSubtask}
          showSetsReps={task?.category === "Fitness"}
          setsValue={d.newSubtaskSets}
          onSetsChange={d.setNewSubtaskSets}
          repsValue={d.newSubtaskReps}
          onRepsChange={d.setNewSubtaskReps}
          onCancel={() => {
            d.setNewSubtask("");
            d.setNewSubtaskSets("");
            d.setNewSubtaskReps("");
            d.setEditingSubtaskId(null);
            d.setAddingSubtaskOpen(false);
            Keyboard.dismiss();
          }}
        />
      </>
    ) : null}
    </>
  );
}
