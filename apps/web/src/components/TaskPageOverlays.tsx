"use client";

import { ReactNode } from "react";
import type { TaskDto } from "@/lib/api/tasks";
import NewTaskModal from "@/components/NewTaskModal";
import CounterPromptModal from "@/components/CounterPromptModal";
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

  // Undo-most-recent-checkin toast
  undoableCheckIn: UndoableCheckIn | null;
  tasks: TaskDto[];
  onUndoCheckInFromToast: (task: TaskDto, cycleId: number) => void;
  onDismissUndoableCheckIn: () => void;

  // Extra overlays slot (page-specific extras like CapWarningModal).
  children?: ReactNode;
}

// Global overlays for Today + Routines pages.
export default function TaskPageOverlays({
  showNewTask, onCloseNewTask, onTaskCreated, newTaskInitialRecurring,
  counterPromptTask, onCloseCounterPrompt, onSubmitCounterCheckIn,
  logPromptTask, onCancelLog, onSubmitLog,
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
