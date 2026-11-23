import { ApiError, request } from './http'

export interface User {
  id: string
  name: string
  email: string
}

export { ApiError }

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
