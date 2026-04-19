import { authedGet, authedPost, authedPut, authedPatch, authedDelete } from "./client";

export interface TaskDto {
  taskId: string;
  userId: string;
  title: string;
  description: string | null;
  category: string;
  priority: string;
  status: string;
  pointValue: number;
  dueDate: string | null;
  createdAt: string;
  completedAt: string | null;
  isRecurring: boolean;
  recurrenceRule: string | null;
  pointsAwarded?: boolean;
  submitted: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  category: string;
  priority: string;
  status?: string;
  pointValue?: number;
  dueDate?: string;
  isRecurring?: boolean;
  recurrenceRule?: string;
}

export interface UpdateTaskRequest {
  taskId: string;
  title: string;
  description?: string;
  category: string;
  priority: string;
  status: string;
  pointValue: number;
  dueDate?: string;
  completedAt?: string;
  isRecurring: boolean;
  recurrenceRule?: string;
  submitted: boolean;
}

export interface TaskFilterParams {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  priority?: string;
  category?: string;
  isRecurring?: boolean;
  submitted?: boolean;
}

export interface PagedResult<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

function toQueryString(params: TaskFilterParams): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
}

export interface CheckInResponse {
  pointsAwarded: number;
  newBalance: number;
  recurringDailyTotal: number;
  streakCount: number;
  longestCount: number;
  bonusMultiplier: number;
  streakReset: boolean;
  nextDueDate: string;
}

export const tasksApi = {
  getAll: (filters: TaskFilterParams = {}) =>
    authedGet<PagedResult<TaskDto>>(`/api/tasks${toQueryString(filters)}`),

  getById: (id: string) =>
    authedGet<TaskDto>(`/api/tasks/${id}`),

  getPending: () =>
    authedGet<TaskDto[]>(`/api/tasks/pending`),

  create: (dto: CreateTaskRequest) =>
    authedPost<TaskDto>(`/api/tasks`, dto),

  update: (id: string, dto: UpdateTaskRequest) =>
    authedPut<void>(`/api/tasks/${id}`, dto),

  start: (id: string) =>
    authedPatch<void>(`/api/tasks/${id}/start`),

  complete: (id: string) =>
    authedPatch<void>(`/api/tasks/${id}/complete`),

  delete: (id: string) =>
    authedDelete<void>(`/api/tasks/${id}`),

  checkIn: (id: string) =>
    authedPost<CheckInResponse>(`/api/tasks/${id}/checkin`, {}),
};
