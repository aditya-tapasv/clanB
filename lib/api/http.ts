import { API_BASE_URL } from "./config";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Thin fetch wrapper for the NestJS API. Used by the (currently commented) "Real API"
 * blocks in `lib/api/*`. NestJS error bodies look like `{ statusCode, message, error }`.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Accept: "application/json", ...init?.headers },
  });
  if (!res.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const body = (await res.json()) as { message?: string | string[] };
      if (body.message) message = Array.isArray(body.message) ? body.message.join(" ") : body.message;
    } catch {
      // Non-JSON error body: keep the generic message.
    }
    throw new ApiError(res.status, message);
  }
  return (await res.json()) as T;
}

/**
 * Authenticated call for signed-in areas (admin, vendor, account). Goes through the Next.js
 * pass-through at /api/backend/*, which attaches the user's backend token from the httpOnly
 * session cookie — the browser never sees the token.
 */
export async function backendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api/backend${path}`, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", Accept: "application/json", ...init?.headers },
  });
  if (res.status === 401) {
    throw new ApiError(401, "Your session has expired. Please log in again.");
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string | string[] };
    const message = Array.isArray(body.message) ? body.message.join(" ") : body.message;
    throw new ApiError(res.status, message ?? "Something went wrong. Please try again.");
  }
  return (await res.json()) as T;
}
