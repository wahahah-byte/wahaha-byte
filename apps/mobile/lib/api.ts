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

// Extend the shared users API with mobile-only profile-picture upload.
// expo-image-picker hands us a local file URI + a mime type; FormData on
// RN takes a `{ uri, name, type }` object — RN's fetch implementation
// wraps it correctly for multipart/form-data posts.
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
    // The any cast is intentional — RN's FormData accepts a uri/name/type
    // descriptor here that doesn't match the DOM File type signature.
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
