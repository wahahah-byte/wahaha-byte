import { createAuthApi } from "@wahaha/shared";
import { apiClient } from "./client";

export type { RegisterRequest, LoginRequest, AuthResponse } from "@wahaha/shared";

export const authApi = createAuthApi(apiClient);
