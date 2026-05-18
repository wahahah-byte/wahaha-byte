import type { ApiClient } from "./client";
import type { Subtask } from "./tasks";

export interface UpdateSubtaskRequest {
  title?: string;
  completed?: boolean;
  sortOrder?: number;
  setsTarget?: number | null;
  repsTarget?: number | null;
  setsCompleted?: number | null;
}

export interface CreateSubtaskRequest {
  title: string;
  setsTarget?: number | null;
  repsTarget?: number | null;
}

export function createSubtasksApi(client: ApiClient) {
  return {
    create: (taskId: string, payload: string | CreateSubtaskRequest) =>
      client.authedPost<Subtask>(
        `/api/tasks/${taskId}/subtasks`,
        typeof payload === "string" ? { title: payload } : payload
      ),

    update: (id: number, fields: UpdateSubtaskRequest) =>
      client.authedPatch<Subtask>(`/api/subtasks/${id}`, fields),

    delete: (id: number) => client.authedDelete<void>(`/api/subtasks/${id}`),

    reorder: (taskId: string, orderedIds: number[]) =>
      client.authedPost<void>(`/api/tasks/${taskId}/subtasks/reorder`, { orderedIds }),
  };
}

export type SubtasksApi = ReturnType<typeof createSubtasksApi>;
