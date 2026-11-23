import type { TeamDetail } from '../types/team'

export async function fetchTeam(id: number): Promise<TeamDetail> {
  const res = await fetch(`/api/teams/${id}`)
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error ?? `Server responded with HTTP ${res.status}`)
  }
  return (await res.json()) as TeamDetail
}
