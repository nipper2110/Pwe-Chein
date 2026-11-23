export interface User {
  id: string
  name: string
  email: string
}

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
async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
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

/** The logged-in user, or null if nobody is logged in (a 401 is a normal answer here, not an error). */
export async function fetchMe(): Promise<User | null> {
  try {
    return (await request<{ user: User }>('/api/auth/me')).user
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) return null
    throw err
  }
}

export const registerUser = async (input: { name: string; email: string; password: string }): Promise<User> =>
  (await request<{ user: User }>('/api/auth/register', { method: 'POST', body: JSON.stringify(input) })).user

export const loginUser = async (input: { email: string; password: string }): Promise<User> =>
  (await request<{ user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify(input) })).user

export const logoutUser = async (): Promise<void> => {
  await request<{ ok: boolean }>('/api/auth/logout', { method: 'POST' })
}
