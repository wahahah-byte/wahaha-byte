import { authedPost, authedPatch, authedDelete } from "./client";
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

export const subtasksApi = {
  create: (taskId: string, payload: string | CreateSubtaskRequest) =>
    authedPost<Subtask>(
      `/api/tasks/${taskId}/subtasks`,
      typeof payload === "string" ? { title: payload } : payload
    ),

  update: (id: number, fields: UpdateSubtaskRequest) =>
    authedPatch<Subtask>(`/api/subtasks/${id}`, fields),

  delete: (id: number) => authedDelete<void>(`/api/subtasks/${id}`),

  reorder: (taskId: string, orderedIds: number[]) =>
    authedPost<void>(`/api/tasks/${taskId}/subtasks/reorder`, { orderedIds }),
};
