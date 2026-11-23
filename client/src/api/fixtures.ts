import type { Fixture } from '../types/fixture'
import { request } from './http'

// The server groups matches into days using the user's time zone, so "today" matches what they see.
export const fetchFixtures = (date: string, timezone: string): Promise<Fixture[]> =>
  request<Fixture[]>(`/api/fixtures?date=${date}&timezone=${encodeURIComponent(timezone)}`)

export const fetchLiveFixtures = (): Promise<Fixture[]> => request<Fixture[]>('/api/fixtures/live')
