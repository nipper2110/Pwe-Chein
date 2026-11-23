import type { Fixture } from '../types/fixture'

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Server responded with HTTP ${res.status}`)
  }
  return (await res.json()) as T
}

// The server groups matches into days using the user's time zone, so "today" matches what they see.
export const fetchFixtures = (date: string, timezone: string): Promise<Fixture[]> =>
  getJson<Fixture[]>(`/api/fixtures?date=${date}&timezone=${encodeURIComponent(timezone)}`)

export const fetchLiveFixtures = (): Promise<Fixture[]> => getJson<Fixture[]>('/api/fixtures/live')
