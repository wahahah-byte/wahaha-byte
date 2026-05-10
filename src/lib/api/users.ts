import { authedGet, authedPost, authedDelete, authedPostFormData } from "./client";
import { resizeImage } from "@/lib/imageResize";

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

export const usersApi = {
  getMe: () => authedGet<UserProfile>("/api/users/me"),
  submitPoints: (taskIds: string[]) =>
    authedPost<SubmitPointsResponse>("/api/points/submit", { taskIds }),

  // Resize the picture client-side (~256x256, ~50KB) before uploading. This
  // keeps phone-camera uploads from blowing past the backend's 1MB cap and
  // avoids paying to store full-resolution photos for an image we always
  // render small.
  uploadProfilePicture: async (file: File) => {
    const blob = await resizeImage(file, { maxDimension: 256, type: "image/jpeg", quality: 0.85 });
    const form = new FormData();
    // Server reads from the `file` field name (IFormFile parameter).
    // Filename is required; we synthesize one since the original may have
    // had a stale extension after re-encoding.
    form.append("file", blob, "profile.jpg");
    return authedPostFormData<UserProfile>("/api/users/me/profile-picture", form);
  },

  deleteProfilePicture: () =>
    authedDelete<void>("/api/users/me/profile-picture"),
};
