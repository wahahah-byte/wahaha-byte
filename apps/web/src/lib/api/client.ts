import { createApiClient } from "@wahaha/shared";

const isBrowser = typeof window !== "undefined";
// In `next dev` we proxy `/backend/*` through the Next dev server (config rewrite).
// In a static export — `next build` with `output: "export"` deployed to GitHub Pages —
// there is no Node server to honour the rewrite, so the browser must call the
// Azure API directly via its absolute URL.
const isDev = process.env.NODE_ENV === "development";

export const apiClient = createApiClient({
  baseUrl: isBrowser && isDev ? "/backend" : process.env.NEXT_PUBLIC_API_URL!,
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
