import { authedPost, authedPatch, authedDelete } from "./client";
import type { Subtask } from "./tasks";

export interface UpdateSubtaskRequest {
  title?: string;
  completed?: boolean;
  sortOrder?: number;
}

export const subtasksApi = {
  create: (taskId: string, title: string) =>
    authedPost<Subtask>(`/api/tasks/${taskId}/subtasks`, { title }),

  update: (id: number, fields: UpdateSubtaskRequest) =>
    authedPatch<Subtask>(`/api/subtasks/${id}`, fields),

  delete: (id: number) => authedDelete<void>(`/api/subtasks/${id}`),

  reorder: (taskId: string, orderedIds: number[]) =>
    authedPost<void>(`/api/tasks/${taskId}/subtasks/reorder`, { orderedIds }),
};
