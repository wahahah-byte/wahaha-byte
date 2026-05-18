import type { ApiClient } from "./client";

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  expiry: string;
  userId: string;
  username: string;
  email: string;
}

export function createAuthApi(client: ApiClient) {
  return {
    register: (dto: RegisterRequest) => client.post<AuthResponse>("/api/auth/register", dto),
    login: (dto: LoginRequest) => client.post<AuthResponse>("/api/auth/login", dto),
  };
}

export type AuthApi = ReturnType<typeof createAuthApi>;
