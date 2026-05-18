import { createSubtasksApi } from "@wahaha/shared";
import { apiClient } from "./client";

export type { CreateSubtaskRequest, UpdateSubtaskRequest } from "@wahaha/shared";

export const subtasksApi = createSubtasksApi(apiClient);
