import { authedGet, authedPost } from "./client";

export interface UserProfile {
  userId: string;
  username: string;
  currentBalance: number;
  totalPointsEarned: number;
  level: number;
  pointsSubmittedToday: number;
}

export interface SubmitPointsResponse {
  pointsAwarded: number;
  newBalance: number;
  dailyTotal: number;
}

export const usersApi = {
  getMe: () => authedGet<UserProfile>("/api/users/me"),
  submitPoints: (taskIds: string[]) =>
    authedPost<SubmitPointsResponse>("/api/points/submit", { taskIds }),
};
