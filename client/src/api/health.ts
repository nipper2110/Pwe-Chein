import { request } from './http'

export interface HealthResponse {
  ok: boolean
  season: number
}

// The frontend only talks to OUR backend, never to API-Football.
export const fetchHealth = (): Promise<HealthResponse> => request<HealthResponse>('/api/health')
