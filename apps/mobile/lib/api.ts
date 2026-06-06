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

// Collapses a burst of concurrent 401s (e.g. tasks + profile firing at once on an
// expired token) into a single sign-out so we don't clear caches / emit refresh N times.
let sessionExpiring: Promise<void> | null = null;
async function handleSessionExpired() {
  // No token means we're already signed out — a 401 here is expected, not a session
  // that just expired, so there's nothing to tear down.
  if (!(await AsyncStorage.getItem(TOKEN_KEY))) return;
  if (sessionExpiring) return sessionExpiring;
  // Lazy require to avoid a static cycle: session.ts imports from this module.
  const { signOut } = require("@/lib/session") as typeof import("@/lib/session");
  sessionExpiring = signOut().finally(() => {
    sessionExpiring = null;
  });
  return sessionExpiring;
}

export const apiClient = createApiClient({
  baseUrl: process.env.EXPO_PUBLIC_API_URL!,
  getToken: () => AsyncStorage.getItem(TOKEN_KEY),
  getTimezoneOffset: () => new Date().getTimezoneOffset(),
  onUnauthorized: handleSessionExpired,
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

// signOut() lives in lib/session.ts so the per-user caches it wipes can import the
// API clients they revalidate against without forming a require cycle with api.ts.
