import { recordResponse } from './staleStore'

/**
 * An error from our server.
 * - `code` is a stable name such as "INVALID_CREDENTIALS"; the UI turns it into a message in the user's language.
 * - `params` carries values the message needs (e.g. { max: 20 }).
 * - `fields` maps input names to validation codes, e.g. { email: "invalid_email" }.
 * - `status` is the HTTP status (0 = we never reached the server).
 */
export class ApiError extends Error {
  status: number
  code: string | undefined
  params: Record<string, unknown>
  fields: Record<string, string>
  constructor(
    message: string,
    status: number,
    extra: { code?: string; params?: Record<string, unknown>; fields?: Record<string, string> } = {},
  ) {
    super(message)
    this.status = status
    this.code = extra.code
    this.params = extra.params ?? {}
    this.fields = extra.fields ?? {}
  }
}

// credentials: 'include' makes the browser send and store the httpOnly login cookie.
export async function request<T>(url: string, init: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(url, {
      ...init,
      credentials: 'include',
      headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
    })
  } catch {
    // fetch only throws when the request never got an answer (offline, server down).
    throw new ApiError('Network error', 0)
  }
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as
      | ({ error?: string; code?: string; fields?: Record<string, string> } & Record<string, unknown>)
      | null
    const { error, code, fields, ...params } = body ?? {}
    throw new ApiError(error ?? `Server responded with HTTP ${res.status}`, res.status, { code, params, fields })
  }
  // The server marks answers built from saved (expired) data, so the page can say so.
  if ((init.method ?? 'GET') === 'GET') recordResponse(url, res.headers.get('X-Data-Stale') === 'true')
  return (await res.json()) as T
}
