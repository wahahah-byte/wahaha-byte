import { authedGet } from "./client";

export interface StreakDto {
  streakId: number;
  userId: string;
  streakType: string;
  currentCount: number;
  longestCount: number;
  lastActivityDate: string;
  bonusMultiplier: number;
  isActive: boolean;
}

export const streaksApi = {
  getActive: () => authedGet<StreakDto[]>("/api/streaks/active"),
};
