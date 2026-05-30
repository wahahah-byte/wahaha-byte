import { useRef, useState, type Dispatch, type SetStateAction } from "react";

import { type Subtask, type TaskDto } from "@wahaha/shared";
import { subtasksApi } from "@/lib/api";

type ChipBounds = { left: number; top: number; right: number; bottom: number };

interface Args {
  task: TaskDto | null;
  setTask: Dispatch<SetStateAction<TaskDto | null>>;
  setError: Dispatch<SetStateAction<string | null>>;
  load: () => Promise<void>;
}

// Subtask CRUD + the floating add/edit bar's input state for the task-detail screen.
export function useSubtaskOperations({ task, setTask, setError, load }: Args) {
  const [newSubtask, setNewSubtask] = useState("");
  const [newSubtaskSets, setNewSubtaskSets] = useState("");
  const [newSubtaskReps, setNewSubtaskReps] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);
  // The id of the subtask currently being edited via the floating bar; null when adding.
  const [editingSubtaskId, setEditingSubtaskId] = useState<number | null>(null);
  // Lazy add-subtask input.
  const [addingSubtaskOpen, setAddingSubtaskOpen] = useState(false);
  // Hit-test bounds for sets/reps chips (SwipeableRow blocks Pressable children).
  const chipBoundsRef = useRef<Map<number, ChipBounds>>(new Map());

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

  return {
    newSubtask,
    setNewSubtask,
    newSubtaskSets,
    setNewSubtaskSets,
    newSubtaskReps,
    setNewSubtaskReps,
    addingSubtask,
    editingSubtaskId,
    setEditingSubtaskId,
    addingSubtaskOpen,
    setAddingSubtaskOpen,
    chipBoundsRef,
    toggleSubtask,
    addSubtask,
    deleteSubtask,
    startEditSubtask,
  };
}
