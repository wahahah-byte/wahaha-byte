export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: string; status: number };

export interface ApiConfig {
  baseUrl: string;
  getToken?: () => string | null | Promise<string | null>;
  getTimezoneOffset?: () => number;
}

export interface AuthOpts {
  auth?: boolean;
}

async function buildHeaders(
  config: ApiConfig,
  auth: boolean,
  extra?: HeadersInit,
  withJsonContentType = true
): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  if (withJsonContentType) headers["Content-Type"] = "application/json";

  const tz = config.getTimezoneOffset?.();
  if (typeof tz === "number") headers["X-Timezone-Offset"] = String(tz);

  if (auth && config.getToken) {
    const token = await config.getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  if (extra) Object.assign(headers, extra as Record<string, string>);
  return headers;
}

async function parseError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const json = JSON.parse(text);
    return Array.isArray(json) ? json.join(" ") : String(json);
  } catch {
    return text || res.statusText;
  }
}

async function formDataRequest<T>(
  config: ApiConfig,
  path: string,
  form: FormData,
  method: "POST" | "PUT"
): Promise<ApiResult<T>> {
  let res: Response;
  try {
    const headers = await buildHeaders(config, true, undefined, false);
    res = await fetch(`${config.baseUrl}${path}`, { method, body: form, headers });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    return { data: null, error: msg, status: 0 };
  }
  if (!res.ok) return { data: null, error: await parseError(res), status: res.status };
  if (res.status === 204) return { data: null as T, error: null };
  try {
    return { data: (await res.json()) as T, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Response parse error";
    return { data: null, error: msg, status: res.status };
  }
}

async function apiFetch<T>(
  config: ApiConfig,
  path: string,
  init: RequestInit,
  auth: boolean
): Promise<ApiResult<T>> {
  let res: Response;
  try {
    const headers = await buildHeaders(config, auth, init.headers);
    res = await fetch(`${config.baseUrl}${path}`, { ...init, headers });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Network error";
    return { data: null, error: msg, status: 0 };
  }

  if (!res.ok) {
    return { data: null, error: await parseError(res), status: res.status };
  }
  if (res.status === 204) return { data: null as T, error: null };
  try {
    return { data: (await res.json()) as T, error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Response parse error";
    return { data: null, error: msg, status: res.status };
  }
}

export function createApiClient(config: ApiConfig) {
  return {
    get: <T>(path: string, init?: RequestInit) =>
      apiFetch<T>(config, path, { method: "GET", ...init }, false),
    post: <T>(path: string, body: unknown, init?: RequestInit) =>
      apiFetch<T>(config, path, { method: "POST", body: JSON.stringify(body), ...init }, false),
    authedGet: <T>(path: string, init?: RequestInit) =>
      apiFetch<T>(config, path, { method: "GET", ...init }, true),
    authedPost: <T>(path: string, body: unknown, init?: RequestInit) =>
      apiFetch<T>(config, path, { method: "POST", body: JSON.stringify(body), ...init }, true),
    authedPut: <T>(path: string, body: unknown, init?: RequestInit) =>
      apiFetch<T>(config, path, { method: "PUT", body: JSON.stringify(body), ...init }, true),
    authedPatch: <T>(path: string, body?: unknown, init?: RequestInit) =>
      apiFetch<T>(
        config,
        path,
        {
          method: "PATCH",
          ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
          ...init,
        },
        true
      ),
    authedDelete: <T>(path: string, init?: RequestInit) =>
      apiFetch<T>(config, path, { method: "DELETE", ...init }, true),

    authedPostFormData: async <T>(path: string, form: FormData): Promise<ApiResult<T>> => formDataRequest(config, path, form, "POST"),
    authedPutFormData: async <T>(path: string, form: FormData): Promise<ApiResult<T>> => formDataRequest(config, path, form, "PUT"),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;
