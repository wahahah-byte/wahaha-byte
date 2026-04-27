import { authedGet, authedPut } from "./client";

export interface StreakDto {
  streakId: number;
  userId: string;
  taskId: string;
  streakType: string;
  currentCount: number;
  longestCount: number;
  lastActivityDate: string;
  bonusMultiplier: number;
  isActive: boolean;
}

export const streaksApi = {
  getActive: () => authedGet<StreakDto[]>("/api/streaks/active"),
  update: (id: number, dto: StreakDto) => authedPut<void>(`/api/streaks/${id}`, dto),
};
