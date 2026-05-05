import { authedGet, authedPost } from "./client";

export interface UserProfile {
  userId: string;
  username: string;
  currentBalance: number;
  totalPointsEarned: number;
  level: number;
  pointsSubmittedToday: number;
  recurringPointsSubmittedToday: number;
}

export interface TaskSubmissionResult {
  taskId: string;
  awarded: number;
  basePoints: number;
  bonusMultiplier: number;
  error?: string | null;
}

export interface SubmitPointsResponse {
  pointsAwarded: number;
  newBalance: number;
  dailyTotal: number;
  recurringDailyTotal: number;
  errors?: string[];
  results?: TaskSubmissionResult[];
}

export const usersApi = {
  getMe: () => authedGet<UserProfile>("/api/users/me"),
  submitPoints: (taskIds: string[]) =>
    authedPost<SubmitPointsResponse>("/api/points/submit", { taskIds }),
};
