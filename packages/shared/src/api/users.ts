import type { ApiClient } from "./client";

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  currentBalance: number;
  totalPointsEarned: number;
  level: number;
  pointsSubmittedToday: number;
  recurringPointsSubmittedToday: number;
  profilePictureUrl?: string | null;
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

export function createUsersApi(client: ApiClient) {
  return {
    getMe: () => client.authedGet<UserProfile>("/api/users/me"),
    submitPoints: (taskIds: string[]) =>
      client.authedPost<SubmitPointsResponse>("/api/points/submit", { taskIds }),
    deleteProfilePicture: () =>
      client.authedDelete<void>("/api/users/me/profile-picture"),
  };
}

export type UsersApi = ReturnType<typeof createUsersApi>;
