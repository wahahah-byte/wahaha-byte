import { createTasksApi } from "@wahaha/shared";
import { apiClient } from "./client";

export type {
  Subtask,
  TaskDto,
  CreateTaskRequest,
  UpdateTaskRequest,
  CheckInCycleDto,
  TaskFilterParams,
  PagedResult,
  CheckInResponse,
  SkipCycleResponse,
  UndoCheckInResponse,
} from "@wahaha/shared";

export const tasksApi = createTasksApi(apiClient);
