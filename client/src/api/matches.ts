import type { MatchDetail } from '../types/match'
import { request } from './http'

export const fetchMatch = (id: number): Promise<MatchDetail> => request<MatchDetail>(`/api/matches/${id}`)
