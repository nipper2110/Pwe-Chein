import type { TeamDetail } from '../types/team'
import { request } from './http'

export const fetchTeam = (id: number): Promise<TeamDetail> => request<TeamDetail>(`/api/teams/${id}`)
