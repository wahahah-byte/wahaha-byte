import type { ApiClient } from "./client";

export interface Subtask {
  subtaskId: number;
  taskId: string;
  title: string;
  completed: boolean;
  sortOrder: number;
  createdAt: string;
  setsTarget?: number | null;
  repsTarget?: number | null;
  setsCompleted?: number | null;
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
  counterGoal?: number | null;
  capLogAtGoal?: boolean;
  subtasks?: Subtask[];
  recentCycles?: CheckInCycleDto[];
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
  counterGoal?: number | null;
  capLogAtGoal?: boolean;
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
  counterGoal?: number | null;
  capLogAtGoal?: boolean;
}

export interface CheckInCycleDto {
  cycleId: number;
  taskId: string;
  checkInDate: string;
  counterValue: number | null;
  createdAt: string;
  cycleType?: "checkin" | "log";
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
  cycleId: number;
}

export interface SkipCycleResponse {
  nextDueDate: string;
  streakReset: boolean;
  streakCount: number;
}

export interface UndoCheckInResponse {
  newBalance: number;
  recurringDailyTotal: number;
  streakCount: number;
  longestCount: number;
  bonusMultiplier: number;
  previousDueDate: string;
  previousLastCheckInDate: string;
  pointsRefunded: number;
}

function toQueryString(params: TaskFilterParams): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (entries.length === 0) return "";
  return "?" + entries.map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join("&");
}

export function createTasksApi(client: ApiClient) {
  return {
    getAll: (filters: TaskFilterParams = {}) =>
      client.authedGet<PagedResult<TaskDto>>(`/api/tasks${toQueryString(filters)}`),

    getById: (id: string) => client.authedGet<TaskDto>(`/api/tasks/${id}`),

    getPending: () => client.authedGet<TaskDto[]>(`/api/tasks/pending`),

    create: (dto: CreateTaskRequest) => client.authedPost<TaskDto>(`/api/tasks`, dto),

    update: (id: string, dto: UpdateTaskRequest) =>
      client.authedPut<void>(`/api/tasks/${id}`, dto),

    start: (id: string) => client.authedPatch<void>(`/api/tasks/${id}/start`),
    complete: (id: string) => client.authedPatch<void>(`/api/tasks/${id}/complete`),
    delete: (id: string) => client.authedDelete<void>(`/api/tasks/${id}`),

    checkIn: (id: string, counterValue?: number) =>
      client.authedPost<CheckInResponse>(
        `/api/tasks/${id}/checkin`,
        counterValue !== undefined ? { counterValue } : {}
      ),

    getCheckInHistory: (id: string, pageNumber = 1, pageSize = 30) =>
      client.authedGet<PagedResult<CheckInCycleDto>>(
        `/api/tasks/${id}/checkin-history?pageNumber=${pageNumber}&pageSize=${pageSize}`
      ),

    updateCheckInCycle: (taskId: string, cycleId: number, counterValue: number | null) =>
      client.authedPatch<void>(`/api/tasks/${taskId}/checkin-history/${cycleId}`, { counterValue }),

    logCounter: (id: string, counterValue: number, init?: { keepalive?: boolean }) =>
      client.authedPost<CheckInCycleDto>(`/api/tasks/${id}/log-counter`, { counterValue }, init),

    undoCheckIn: (taskId: string, cycleId: number) =>
      client.authedPost<UndoCheckInResponse>(`/api/tasks/${taskId}/checkin/${cycleId}/undo`, {}),

    deleteLogCycle: (taskId: string, cycleId: number) =>
      client.authedDelete<void>(`/api/tasks/${taskId}/checkin-history/${cycleId}`),

    skipCycle: (id: string) =>
      client.authedPost<SkipCycleResponse>(`/api/tasks/${id}/skip-cycle`, {}),

    archive: (id: string) => client.authedPatch<void>(`/api/tasks/${id}/archive`),
    unarchive: (id: string) => client.authedPatch<void>(`/api/tasks/${id}/unarchive`),
  };
}

export type TasksApi = ReturnType<typeof createTasksApi>;
