"use client";

import { ReactNode } from "react";
import type { TaskDto } from "@/lib/api/tasks";
import NewTaskModal from "@/components/NewTaskModal";
import CounterPromptModal from "@/components/CounterPromptModal";
import TierUpBanner, { TierUpMessage } from "@/components/TierUpBanner";
import CheckInUndoToast from "@/components/CheckInUndoToast";

interface UndoableCheckIn {
  taskId: string;
  taskTitle: string;
  cycleId: number;
}

interface Props {
  // New-task modal
  showNewTask: boolean;
  onCloseNewTask: () => void;
  onTaskCreated: (task: TaskDto) => void;
  newTaskInitialRecurring?: boolean;

  // Counter prompt (collected before a hasCounter check-in)
  counterPromptTask: TaskDto | null;
  onCloseCounterPrompt: () => void;
  onSubmitCounterCheckIn: (task: TaskDto, value?: number) => void;

  // Log prompt (TaskRow swipe-Log → useLogCounter)
  logPromptTask: TaskDto | null;
  onCancelLog: () => void;
  onSubmitLog: (value: number) => void;

  // Streak tier-up banner
  tierUp: TierUpMessage | null;
  onDismissTierUp: () => void;

  // Undo-most-recent-checkin toast
  undoableCheckIn: UndoableCheckIn | null;
  tasks: TaskDto[];
  onUndoCheckInFromToast: (task: TaskDto, cycleId: number) => void;
  onDismissUndoableCheckIn: () => void;

  // Extra overlays slot — used by the Today page for CapWarningModal.
  children?: ReactNode;
}

// Groups the global overlays both Today and Routines render alongside their
// main content (modals, banners, toasts). Page-specific extras (e.g. the
// Today page's CapWarningModal) ride in via `children`.
export default function TaskPageOverlays({
  showNewTask, onCloseNewTask, onTaskCreated, newTaskInitialRecurring,
  counterPromptTask, onCloseCounterPrompt, onSubmitCounterCheckIn,
  logPromptTask, onCancelLog, onSubmitLog,
  tierUp, onDismissTierUp,
  undoableCheckIn, tasks, onUndoCheckInFromToast, onDismissUndoableCheckIn,
  children,
}: Props) {
  const recentValuesFor = (t: TaskDto) =>
    (t.recentCycles ?? [])
      .map((c) => c.counterValue)
      .filter((v): v is number => typeof v === "number");

  const undoTask = undoableCheckIn ? tasks.find((t) => t.taskId === undoableCheckIn.taskId) : null;

  return (
    <>
      {showNewTask && (
        <NewTaskModal
          initialRecurring={newTaskInitialRecurring}
          onClose={onCloseNewTask}
          onCreated={onTaskCreated}
        />
      )}
      {children}
      {counterPromptTask && (
        <CounterPromptModal
          taskTitle={counterPromptTask.title}
          unit={counterPromptTask.counterUnit}
          recentValues={recentValuesFor(counterPromptTask)}
          onClose={onCloseCounterPrompt}
          onSubmit={(value) => onSubmitCounterCheckIn(counterPromptTask, value)}
        />
      )}
      {logPromptTask && (
        <CounterPromptModal
          taskTitle={logPromptTask.title}
          unit={logPromptTask.counterUnit}
          mode="log"
          recentValues={recentValuesFor(logPromptTask)}
          onClose={onCancelLog}
          onSubmit={(value) => { if (value !== undefined) onSubmitLog(value); }}
        />
      )}
      <TierUpBanner message={tierUp} onDone={onDismissTierUp} />
      {undoableCheckIn && undoTask && (
        <CheckInUndoToast
          taskTitle={undoableCheckIn.taskTitle}
          onUndo={() => onUndoCheckInFromToast(undoTask, undoableCheckIn.cycleId)}
          onDismiss={onDismissUndoableCheckIn}
        />
      )}
    </>
  );
}
