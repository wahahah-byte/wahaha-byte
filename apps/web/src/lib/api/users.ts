import { createUsersApi } from "@wahaha/shared";
import { apiClient } from "./client";
import { resizeImage } from "@/lib/imageResize";

export type { UserProfile, TaskSubmissionResult, SubmitPointsResponse } from "@wahaha/shared";

const sharedUsers = createUsersApi(apiClient);

export const usersApi = {
  ...sharedUsers,

  uploadProfilePicture: async (file: File) => {
    const blob = await resizeImage(file, { maxDimension: 256, type: "image/jpeg", quality: 0.85 });
    const form = new FormData();
    form.append("file", blob, "profile.jpg");
    return apiClient.authedPostFormData<import("@wahaha/shared").UserProfile>(
      "/api/users/me/profile-picture",
      form
    );
  },
};
