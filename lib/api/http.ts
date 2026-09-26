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
