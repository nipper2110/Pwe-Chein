import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useFormat } from '../hooks/useFormat'
import { usePageMeta } from '../hooks/usePageMeta'
import EmptyState from '../components/EmptyState'
import ErrorState from '../components/ErrorState'
import FollowedTeams from '../components/FollowedTeams'
import LeagueSection from '../components/LeagueSection'
import MatchListSkeleton from '../components/MatchListSkeleton'
import PageLayout from '../components/PageLayout'
import TableSkeleton from '../components/TableSkeleton'
import { useUser } from '../hooks/useAuth'
import { useFavorites } from '../hooks/useFavorites'
import { useFollowedMatches } from '../hooks/useFollowedMatches'
import { useNow } from '../hooks/useNow'

function FollowedMatches({ teamIds }: { teamIds: Set<number> }) {
  const { t } = useTranslation()
  const format = useFormat()
  const now = useNow(60_000)
  const { liveMatches, days, isPending, error, refetch } = useFollowedMatches(teamIds, now)
  const withMatches = days.filter((d) => d.matches.length > 0)

  if (isPending) return <MatchListSkeleton />
  if (error) return <ErrorState error={error} onRetry={refetch} />
  if (withMatches.length === 0 && liveMatches.length === 0) {
    return <EmptyState text={t('dashboard.noneThisWeek')} />
  }
  return (
    <div className="space-y-4">
      {liveMatches.length > 0 && <LeagueSection title={`🔴 ${t('live.now')}`} matches={liveMatches} showCompetition />}
      {withMatches.map((d) => (
        <LeagueSection
          key={d.date}
          title={`${t(`date.${d.key}`)} · ${format.date(`${d.date}T12:00:00`, { weekday: 'short', day: 'numeric', month: 'short' })}`}
          matches={d.matches}
          showCompetition
        />
      ))}
    </div>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  usePageMeta({ title: t('dashboard.title'), noindex: true })
  const user = useUser()
  const favorites = useFavorites()
  const teamIds = useMemo(() => new Set((favorites.data ?? []).map((f) => f.teamId)), [favorites.data])

  return (
    <PageLayout className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-sm text-slate-400">{t('auth.welcomeBack', { name: user.data?.name ?? '' })}</p>
      </div>

      {favorites.isPending && <TableSkeleton rows={3} />}
      {favorites.isError && <ErrorState error={favorites.error} onRetry={() => void favorites.refetch()} />}

      {favorites.isSuccess && favorites.data.length === 0 && (
        <div className="rounded-xl bg-surface p-8 text-center">
          <p className="mb-1 text-3xl">☆</p>
          <p className="mb-4 text-sm text-slate-400">{t('dashboard.none')}</p>
          <Link to="/league" className="rounded-full bg-pitch px-4 py-1.5 text-sm font-semibold text-on-pitch">
            {t('dashboard.find')}
          </Link>
          <p className="mt-3 text-xs text-slate-400">{t('dashboard.hint')}</p>
        </div>
      )}

      {favorites.isSuccess && favorites.data.length > 0 && (
        <>
          <section aria-labelledby="teams-title" className="space-y-2">
            <h2 id="teams-title" className="font-semibold">{t('dashboard.teamsYouFollow')}</h2>
            <FollowedTeams teams={favorites.data} />
          </section>

          <section aria-labelledby="matches-title" className="space-y-2">
            <h2 id="matches-title" className="font-semibold">{t('dashboard.yourMatches')}</h2>
            <FollowedMatches teamIds={teamIds} />
          </section>
        </>
      )}
    </PageLayout>
  )
}
