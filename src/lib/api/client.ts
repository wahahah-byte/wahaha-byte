// Use /backend in the browser so requests proxy through Next.js (no CORS).
// On the server, call the API directly.
const API_URL =
  typeof window !== "undefined" ? "/backend" : process.env.NEXT_PUBLIC_API_URL;

export type ApiResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

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
      // Identity errors come back as string[], plain errors as a string
      message = Array.isArray(json) ? json.join(" ") : String(json);
    } catch {
      message = text || res.statusText;
    }
    return { data: null, error: message };
  }

  // 204 No Content
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
