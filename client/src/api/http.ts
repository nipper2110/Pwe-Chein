/** An error from our server. `fields` holds per-input messages, e.g. { email: "Already registered" }. */
export class ApiError extends Error {
  status: number
  fields: Record<string, string>
  constructor(message: string, status: number, fields: Record<string, string> = {}) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

// credentials: 'include' makes the browser send and store the httpOnly login cookie.
export async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(url, {
    ...init,
    credentials: 'include',
    headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string; fields?: Record<string, string> } | null
    throw new ApiError(body?.error ?? `Server responded with HTTP ${res.status}`, res.status, body?.fields)
  }
  return (await res.json()) as T
}
