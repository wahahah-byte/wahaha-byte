const API_URL =
  typeof window !== "undefined" ? "/backend" : process.env.NEXT_PUBLIC_API_URL;

export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: string; status: number };

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
  auth = false
): Promise<ApiResult<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(typeof window !== "undefined"
      ? { "X-Timezone-Offset": String(new Date().getTimezoneOffset()) }
      : {}),
    ...(options?.headers as Record<string, string>),
  };

  if (auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    let message: string;
    try {
      const json = JSON.parse(text);
      message = Array.isArray(json) ? json.join(" ") : String(json);
    } catch {
      message = text || res.statusText;
    }
    return { data: null, error: message, status: res.status };
  }

  if (res.status === 204) return { data: null as T, error: null };

  const data: T = await res.json();
  return { data, error: null };
}

export function get<T>(path: string, options?: RequestInit) {
  return apiFetch<T>(path, { method: "GET", ...options });
}

export function post<T>(path: string, body: unknown, options?: RequestInit) {
  return apiFetch<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
    ...options,
  });
}

export function authedGet<T>(path: string, options?: RequestInit) {
  return apiFetch<T>(path, { method: "GET", ...options }, true);
}

export function authedPost<T>(path: string, body: unknown, options?: RequestInit) {
  return apiFetch<T>(
    path,
    { method: "POST", body: JSON.stringify(body), ...options },
    true
  );
}

export function authedPut<T>(path: string, body: unknown, options?: RequestInit) {
  return apiFetch<T>(
    path,
    { method: "PUT", body: JSON.stringify(body), ...options },
    true
  );
}

export function authedPatch<T>(path: string, body?: unknown, options?: RequestInit) {
  return apiFetch<T>(
    path,
    {
      method: "PATCH",
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      ...options,
    },
    true
  );
}

export function authedDelete<T>(path: string, options?: RequestInit) {
  return apiFetch<T>(path, { method: "DELETE", ...options }, true);
}

// Multipart POST. Don't set Content-Type — the browser must set it itself so
// the boundary parameter is included. apiFetch defaults Content-Type to
// application/json, so we have to explicitly null it out via a sentinel
// (empty string would still send a header). We strip the JSON header here
// by passing a custom set that apiFetch will spread last and then we override.
export async function authedPostFormData<T>(path: string, form: FormData): Promise<ApiResult<T>> {
  return formDataFetch<T>(path, form, "POST");
}

export async function authedPutFormData<T>(path: string, form: FormData): Promise<ApiResult<T>> {
  return formDataFetch<T>(path, form, "PUT");
}

// Shared multipart fetch — same header rules as apiFetch but with no
// Content-Type set so the browser can append the multipart boundary.
async function formDataFetch<T>(path: string, form: FormData, method: "POST" | "PUT"): Promise<ApiResult<T>> {
  const token = getToken();
  const headers: Record<string, string> = {
    ...(typeof window !== "undefined"
      ? { "X-Timezone-Offset": String(new Date().getTimezoneOffset()) }
      : {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { method, body: form, headers });
  if (!res.ok) {
    const text = await res.text();
    let message: string;
    try {
      const json = JSON.parse(text);
      message = Array.isArray(json) ? json.join(" ") : String(json);
    } catch {
      message = text || res.statusText;
    }
    return { data: null, error: message, status: res.status };
  }
  if (res.status === 204) return { data: null as T, error: null };
  const data: T = await res.json();
  return { data, error: null };
}
