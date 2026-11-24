import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FormDots from '../components/FormDots'
import LeagueSection from '../components/LeagueSection'
import SeasonBadge from '../components/SeasonBadge'
import SeasonSummary from '../components/SeasonSummary'
import PageLayout from '../components/PageLayout'
import TableSkeleton from '../components/TableSkeleton'
import TeamHeader from '../components/TeamHeader'
import { useTeam } from '../hooks/useTeam'
import { usePageMeta } from '../hooks/usePageMeta'
import { ApiError } from '../api/http'
import NotFoundState from '../components/NotFoundState'
import { resultFor } from '../utils/results'

function TeamShell({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  return (
    <PageLayout>
      <Link to="/league" className="inline-block text-sm text-slate-400 hover:text-slate-200">← {t('team.backToLeagues')}</Link>
      {children}
    </PageLayout>
  )
}

export default function Team() {
  const { t } = useTranslation()
  const { id } = useParams()
  const teamId = Number(id)
  if (!Number.isInteger(teamId) || teamId <= 0) {
    return <TeamShell><ErrorState message={t('errors.INVALID_TEAM_ID')} onRetry={() => history.back()} /></TeamShell>
  }
  return <TeamView teamId={teamId} />
}

function TeamView({ teamId }: { teamId: number }) {
  const { t } = useTranslation()
  const team = useTeam(teamId)
  const data = team.data
  const notFound = team.error instanceof ApiError && team.error.status === 404
  usePageMeta({
    title: data ? data.team.name : notFound ? t('notFound.teamTitle') : t('team.metaTitleFallback'),
    description: data
      ? t('team.metaDescription', { name: data.team.name, years: `${data.season}/${String(data.season + 1).slice(-2)}` })
      : undefined,
    noindex: !data,
  })

  return (
    <TeamShell>
      {team.isPending && <TableSkeleton rows={8} />}
      {notFound && <NotFoundState title={t('notFound.teamTitle')} message={t('notFound.teamMessage')} />}
      {team.isError && !notFound && <ErrorState error={team.error} onRetry={() => void team.refetch()} />}
      {team.isSuccess && (
        <>
          <TeamHeader data={team.data} />

          <p className="flex items-center gap-2 text-xs text-slate-400">
            <SeasonBadge /> {t('team.seasonNote')}
          </p>

          {team.data.summary && <SeasonSummary summary={team.data.summary} />}

          <section aria-labelledby="recent-title" className="space-y-2">
            <div className="flex items-center gap-3">
              <h2 id="recent-title" className="font-semibold">{t('team.recentResults')}</h2>
              {/* FormDots expects most recent first, which is how `recent` is already sorted. */}
              <FormDots form={team.data.recent.map((f) => resultFor(teamId, f) ?? '').join('')} />
            </div>
            {team.data.recent.length === 0 ? (
              <EmptyState text={t('team.noResults')} />
            ) : (
              <LeagueSection title={t('team.last5')} matches={team.data.recent} showDate showCompetition resultForTeamId={teamId} />
            )}
          </section>

          {/* Only shown when there are upcoming matches (the free plan usually has none). */}
          {team.data.upcoming.length > 0 && (
            <section aria-labelledby="next-title" className="space-y-2">
              <h2 id="next-title" className="font-semibold">{t('team.nextFixtures')}</h2>
              <LeagueSection title={t('team.upcoming')} matches={team.data.upcoming} showDate showCompetition />
            </section>
          )}
        </>
      )}
    </TeamShell>
  )
}
