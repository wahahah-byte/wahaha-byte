import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createApiClient,
  createAuthApi,
  createAvatarApi,
  createSubtasksApi,
  createTasksApi,
  createUsersApi,
  type UserProfile,
} from "@wahaha/shared";
import { taskCache } from "@/lib/task-cache";
import { equippedCache } from "@/lib/equipped-cache";
import { taskEvents } from "@/lib/task-events";

const TOKEN_KEY = "auth_token";

export const apiClient = createApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL!,
  getToken: () => AsyncStorage.getItem(TOKEN_KEY),
  getTimezoneOffset: () => new Date().getTimezoneOffset(),
});

export const authApi = createAuthApi(apiClient);
export const tasksApi = createTasksApi(apiClient);
export const subtasksApi = createSubtasksApi(apiClient);
const sharedUsers = createUsersApi(apiClient);
export const avatarApi = createAvatarApi(apiClient);

// Extend shared users API with mobile profile-picture upload via FormData.
export const usersApi = {
  ...sharedUsers,
  uploadProfilePicture: async (
    fileUri: string,
    mimeType?: string,
  ) => {
    const form = new FormData();
    const inferredName = fileUri.split("/").pop() || "profile.jpg";
    const inferredType = mimeType
      || (inferredName.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg");
    // RN FormData accepts {uri,name,type} — cast bypasses DOM File typing.
    form.append("file", {
      uri: fileUri,
      name: inferredName,
      type: inferredType,
    } as unknown as Blob);
    return apiClient.authedPostFormData<UserProfile>(
      "/api/users/me/profile-picture",
      form,
    );
  },
};

export async function saveToken(token: string) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken() {
  await AsyncStorage.removeItem(TOKEN_KEY);
}

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

// Single entry point for both sign-out and account-deletion: drops the token, wipes
// every cache that holds per-user data (tasks, equipped avatar), and broadcasts a
// refresh so screens hosting live state re-fetch and discover the absent token. Use
// this instead of `clearToken()` from sign-out paths so a previous user's tasks /
// avatar can't linger after the next render.
export async function signOut() {
  await clearToken();
  taskCache.clear();
  equippedCache.clear();
  taskEvents.emitRefreshRequested();
}
