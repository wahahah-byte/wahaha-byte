import { authedGet, authedPost, authedPut, authedPatch, authedDelete } from "./client";

export interface Subtask {
  subtaskId: number;
  taskId: string;
  title: string;
  completed: boolean;
  sortOrder: number;
  createdAt: string;
}

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
  wasPenalized?: boolean;
  currentStreakCount?: number;
  longestStreakCount?: number;
  lastCheckInDate?: string | null;
  isArchived?: boolean;
  hasCounter?: boolean;
  counterUnit?: string | null;
  subtasks?: Subtask[];
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
  hasCounter?: boolean;
  counterUnit?: string | null;
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
  hasCounter?: boolean;
  counterUnit?: string | null;
}

export interface CheckInCycleDto {
  cycleId: number;
  taskId: string;
  checkInDate: string;
  counterValue: number | null;
  createdAt: string;
}

export interface TaskFilterParams {
  pageNumber?: number;
  pageSize?: number;
  status?: string;
  priority?: string;
  category?: string;
  isRecurring?: boolean;
  submitted?: boolean;
  isArchived?: boolean;
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
  basePoints: number;
  newBalance: number;
  recurringDailyTotal: number;
  streakCount: number;
  longestCount: number;
  bonusMultiplier: number;
  streakReset: boolean;
  nextDueDate: string;
}

export interface SkipCycleResponse {
  nextDueDate: string;
  streakReset: boolean;
  streakCount: number;
}

export const tasksApi = {
  getAll: (filters: TaskFilterParams = {}) => {
    return authedGet<PagedResult<TaskDto>>(`/api/tasks${toQueryString(filters)}`)
  },

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

  checkIn: (id: string, counterValue?: number) =>
    authedPost<CheckInResponse>(
      `/api/tasks/${id}/checkin`,
      counterValue !== undefined ? { counterValue } : {}
    ),

  getCheckInHistory: (id: string, pageNumber = 1, pageSize = 30) =>
    authedGet<PagedResult<CheckInCycleDto>>(
      `/api/tasks/${id}/checkin-history?pageNumber=${pageNumber}&pageSize=${pageSize}`
    ),

  updateCheckInCycle: (taskId: string, cycleId: number, counterValue: number | null) =>
    authedPatch<void>(`/api/tasks/${taskId}/checkin-history/${cycleId}`, { counterValue }),

  logCounter: (id: string, counterValue: number) =>
    authedPost<CheckInCycleDto>(`/api/tasks/${id}/log-counter`, { counterValue }),

  skipCycle: (id: string) =>
    authedPost<SkipCycleResponse>(`/api/tasks/${id}/skip-cycle`, {}),

  archive: (id: string) =>
    authedPatch<void>(`/api/tasks/${id}/archive`),

  unarchive: (id: string) =>
    authedPatch<void>(`/api/tasks/${id}/unarchive`),
};
