import type { MatchDetail } from '../types/match'

export async function fetchMatch(id: number): Promise<MatchDetail> {
  const res = await fetch(`/api/matches/${id}`)
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Server responded with HTTP ${res.status}`)
  }
  return (await res.json()) as MatchDetail
}
