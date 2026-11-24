import { useTranslation } from 'react-i18next'
import type { MatchDetail } from '../types/match'
import EmptyState from './EmptyState'
import TeamLineup from './TeamLineup'

export default function LineupsView({ match }: { match: MatchDetail }) {
  const { t } = useTranslation()
  if (match.lineups.length === 0) return <EmptyState text={t('match.noLineups')} />

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {match.lineups.map((l) => (
        <TeamLineup key={l.team.id} lineup={l} />
      ))}
    </div>
  )
}
