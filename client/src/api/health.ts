export interface HealthResponse {
  ok: boolean
  season: number
}

// The frontend only talks to OUR backend, never to API-Football.
export async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch('/api/health')
  if (!res.ok) throw new Error(`Server responded with HTTP ${res.status}`)
  return (await res.json()) as HealthResponse
}
