import { createApiClient } from "@wahaha/shared";

const isBrowser = typeof window !== "undefined";

export const apiClient = createApiClient({
  baseUrl: isBrowser ? "/backend" : process.env.NEXT_PUBLIC_API_URL!,
  getToken: () => (isBrowser ? localStorage.getItem("auth_token") : null),
  getTimezoneOffset: () => (isBrowser ? new Date().getTimezoneOffset() : 0),
});

export const {
  get,
  post,
  authedGet,
  authedPost,
  authedPut,
  authedPatch,
  authedDelete,
  authedPostFormData,
  authedPutFormData,
} = apiClient;

export type { ApiResult } from "@wahaha/shared";
