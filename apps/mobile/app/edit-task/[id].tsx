import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import type { TaskDto, UpdateTaskRequest } from "@wahaha/shared";
import { tasksApi } from "@/lib/api";
import { TaskForm, type TaskFormValues, emptyTaskForm } from "@/components/task-form";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColors } from "@/hooks/use-colors";

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const c = useColors();
  const [task, setTask] = useState<TaskDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    tasksApi.getById(id).then((res) => {
      setLoading(false);
      if (!res.data) setLoadError(res.error ?? "Task not found.");
      else setTask(res.data);
    });
  }, [id]);

  async function handleSubmit(v: TaskFormValues): Promise<string | null> {
    if (!task) return "Task not loaded.";
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
      hasCounter: task.hasCounter,
      counterUnit: task.counterUnit,
      counterGoal: task.counterGoal,
      capLogAtGoal: task.capLogAtGoal,
    };
    const res = await tasksApi.update(task.taskId, dto);
    if (res.error) return res.error;
    router.back();
    return null;
  }

  if (loading) {
    return (
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <ActivityIndicator color={c.activeHighlight} />
      </ThemedView>
    );
  }
  if (!task) {
    return (
      <ThemedView style={{ flex: 1, padding: 16 }}>
        <ThemedText style={{ color: c.danger }}>{loadError}</ThemedText>
      </ThemedView>
    );
  }

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
  };

  return (
    <TaskForm
      initial={initial}
      submitLabel="Save"
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
