import { post } from "./client";

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

export const authApi = {
  register: (dto: RegisterRequest) =>
    post<AuthResponse>("/api/auth/register", dto),

  login: (dto: LoginRequest) =>
    post<AuthResponse>("/api/auth/login", dto),
};
