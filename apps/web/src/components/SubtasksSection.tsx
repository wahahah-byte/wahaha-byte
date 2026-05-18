"use client";

import { useEffect, useState } from "react";
import { TaskDto, Subtask } from "@/lib/api/tasks";
import { subtasksApi } from "@/lib/api/subtasks";
import { isCycleClosed } from "@/lib/dateUtils";
import SubtaskRow from "@/components/SubtaskRow";

interface Props {
  task: TaskDto;
  onChange?: (subtasks: Subtask[]) => void;
}

export default function SubtasksSection({ task, onChange }: Props) {
  const isAuthenticated = typeof window !== "undefined" && !!localStorage.getItem("auth_token");
  const isFitness = task.category === "Fitness";
  // Subtasks are frozen for the remainder of a closed cycle so a routine's
  // per-cycle progress (which subtasks are checked, set counters) isn't
  // mutated after the cycle's been finalised by a check-in.
  const subtasksReadOnly = task.isRecurring && isCycleClosed(task.dueDate, task.lastCheckInDate);

  const [subtasks, setSubtasksState] = useState<Subtask[]>(task.subtasks ?? []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newSubtaskSets, setNewSubtaskSets] = useState("");
  const [newSubtaskReps, setNewSubtaskReps] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubtasksState(task.subtasks ?? []);
  }, [task.taskId, task.subtasks]);

  function commitSubtasks(next: Subtask[]) {
    setSubtasksState(next);
    onChange?.(next);
  }

  function nextLocalId(): number {
    const min = subtasks.reduce((m, s) => Math.min(m, s.subtaskId), 0);
    return Math.min(min, 0) - 1;
  }

  async function handleToggleSubtask(s: Subtask) {
    const snapshot = subtasks;
    const next = snapshot.map((x) => x.subtaskId === s.subtaskId ? { ...x, completed: !x.completed } : x);
    commitSubtasks(next);
    if (!isAuthenticated || s.subtaskId < 0) return;
    const { error } = await subtasksApi.update(s.subtaskId, { completed: !s.completed });
    if (error) commitSubtasks(snapshot);
  }

  async function handleDeleteSubtask(s: Subtask) {
    const snapshot = subtasks;
    const next = snapshot.filter((x) => x.subtaskId !== s.subtaskId);
    commitSubtasks(next);
    if (!isAuthenticated || s.subtaskId < 0) return;
    const { error } = await subtasksApi.delete(s.subtaskId);
    if (error) commitSubtasks(snapshot);
  }

  async function handleAddSubtask() {
    const title = newSubtaskTitle.trim();
    if (!title || addingSubtask || task.status === "completed") return;
    setAddingSubtask(true);
    const snapshot = subtasks;
    const sortOrder = (snapshot[snapshot.length - 1]?.sortOrder ?? -1) + 1;
    const setsTarget = newSubtaskSets.trim() && Number(newSubtaskSets) > 0
      ? Number(newSubtaskSets) : null;
    const repsTarget = newSubtaskReps.trim() && Number(newSubtaskReps) > 0
      ? Number(newSubtaskReps) : null;
    const optimistic: Subtask = {
      subtaskId: nextLocalId(),
      taskId: task.taskId,
      title,
      completed: false,
      sortOrder,
      createdAt: new Date().toISOString(),
      setsTarget,
      repsTarget,
      setsCompleted: setsTarget != null ? 0 : null,
    };
    const optimisticList = [...snapshot, optimistic];
    commitSubtasks(optimisticList);
    setNewSubtaskTitle("");
    setNewSubtaskSets("");
    setNewSubtaskReps("");
    if (!isAuthenticated) { setAddingSubtask(false); return; }
    const { data, error } = await subtasksApi.create(task.taskId, {
      title,
      setsTarget,
      repsTarget,
    });
    setAddingSubtask(false);
    if (error) {
      commitSubtasks(snapshot);
      return;
    }
    commitSubtasks(optimisticList.map((x) => x.subtaskId === optimistic.subtaskId ? data! : x));
  }

  async function handleUpdateSubtask(s: Subtask, fields: { title?: string; setsTarget?: number | null; repsTarget?: number | null }) {
    if (Object.keys(fields).length === 0) return;
    const snapshot = subtasks;
    // If the user shrinks setsTarget below their current setsCompleted, clamp
    // setsCompleted so the displayed "done/target" stays sensible.
    const next = snapshot.map((x) => {
      if (x.subtaskId !== s.subtaskId) return x;
      const merged = { ...x, ...fields };
      if (fields.setsTarget !== undefined) {
        const target = fields.setsTarget;
        if (target == null) merged.setsCompleted = null;
        else if ((merged.setsCompleted ?? 0) > target) merged.setsCompleted = target;
      }
      return merged;
    });
    commitSubtasks(next);
    if (!isAuthenticated || s.subtaskId < 0) return;
    const updatedRow = next.find((x) => x.subtaskId === s.subtaskId)!;
    const apiFields: { title?: string; setsTarget?: number | null; repsTarget?: number | null; setsCompleted?: number | null } = { ...fields };
    if (fields.setsTarget !== undefined && updatedRow.setsCompleted !== s.setsCompleted) {
      apiFields.setsCompleted = updatedRow.setsCompleted ?? null;
    }
    const { error } = await subtasksApi.update(s.subtaskId, apiFields);
    if (error) commitSubtasks(snapshot);
  }

  async function handleIncrementSet(s: Subtask) {
    if (s.setsTarget == null) return;
    const currentDone = s.setsCompleted ?? 0;
    if (currentDone >= s.setsTarget) return;
    const nextDone = currentDone + 1;
    const nextCompleted = nextDone >= s.setsTarget;
    const snapshot = subtasks;
    const next = snapshot.map((x) => x.subtaskId === s.subtaskId
      ? { ...x, setsCompleted: nextDone, completed: nextCompleted || x.completed }
      : x);
    commitSubtasks(next);
    if (!isAuthenticated || s.subtaskId < 0) return;
    const { error } = await subtasksApi.update(s.subtaskId, {
      setsCompleted: nextDone,
      ...(nextCompleted && !s.completed ? { completed: true } : {}),
    });
    if (error) commitSubtasks(snapshot);
  }

  const subtaskDoneCount = subtasks.filter((s) => s.completed).length;

  // Hidden entirely when completed and there's nothing to read.
  if (task.status === "completed" && subtasks.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.18em", textTransform: "uppercase" }}>
          Subtasks
        </span>
        {subtasks.length > 0 && (
          <span style={{ color: "var(--color-fg-subtle)", fontSize: "9px", letterSpacing: "0.05em" }}>
            {subtaskDoneCount}/{subtasks.length} done
          </span>
        )}
      </div>
      {subtasks.map((s) => (
        <SubtaskRow
          key={s.subtaskId}
          subtask={s}
          readOnly={subtasksReadOnly}
          showSetsReps={isFitness}
          onToggle={() => handleToggleSubtask(s)}
          onDelete={() => handleDeleteSubtask(s)}
          onIncrementSet={() => handleIncrementSet(s)}
          onUpdate={(fields) => handleUpdateSubtask(s, fields)}
        />
      ))}
      {task.status !== "completed" && !subtasksReadOnly && (
        <div className="flex items-center gap-2 mt-0.5">
          <span className="w-3.5 h-3.5 flex-shrink-0 flex items-center justify-center" style={{ color: "var(--color-fg-subtle)", fontSize: "12px", lineHeight: 1 }}>+</span>
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); handleAddSubtask(); }
            }}
            placeholder={isFitness ? "Exercise…" : "Add subtask…"}
            disabled={addingSubtask}
            className="flex-1 text-xs outline-none bg-transparent"
            style={{ color: "var(--color-fg)", border: "none", padding: "2px 0", minWidth: 0 }}
          />
          {isFitness && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <input
                type="number"
                inputMode="numeric"
                min="1"
                value={newSubtaskSets}
                onChange={(e) => setNewSubtaskSets(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); handleAddSubtask(); }
                }}
                placeholder="sets"
                aria-label="Sets"
                className="num-input-themed"
              />
              <span style={{ color: "var(--color-fg-subtle)", fontSize: 10, fontWeight: 600 }}>×</span>
              <input
                type="number"
                inputMode="numeric"
                min="1"
                value={newSubtaskReps}
                onChange={(e) => setNewSubtaskReps(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") { e.preventDefault(); handleAddSubtask(); }
                }}
                placeholder="reps"
                aria-label="Reps"
                className="num-input-themed"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
