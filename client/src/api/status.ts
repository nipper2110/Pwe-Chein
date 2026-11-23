export interface StatusResponse {
  plan: string
  requestsToday: number
  requestsLimit: number
  requestsRemaining: number
}

export async function fetchStatus(): Promise<StatusResponse> {
  const res = await fetch('/api/status')
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Server responded with HTTP ${res.status}`)
  }
  return (await res.json()) as StatusResponse
}
