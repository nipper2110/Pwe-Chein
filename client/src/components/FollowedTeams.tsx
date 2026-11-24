import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import type { Favorite } from '../api/favorites'
import { useUnfollowTeam } from '../hooks/useFavorites'

export default function FollowedTeams({ teams }: { teams: Favorite[] }) {
  const { t } = useTranslation()
  const unfollow = useUnfollowTeam()

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {teams.map((team) => (
        <li key={team.teamId} className="flex items-center gap-3 rounded-xl bg-surface p-3">
          <Link to={`/team/${team.teamId}`} className="flex min-w-0 flex-1 items-center gap-3 hover:text-pitch">
            <img src={team.logo} alt="" loading="lazy" className="h-9 w-9 shrink-0 object-contain" />
            <span className="truncate font-medium">{team.name}</span>
          </Link>
          <button
            type="button"
            aria-label={t('follow.unfollowTeam', { name: team.name })}
            disabled={unfollow.isPending && unfollow.variables === team.teamId}
            onClick={() => unfollow.mutate(team.teamId)}
            className="shrink-0 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-50"
          >
            ★ {t('follow.unfollow')}
          </button>
        </li>
      ))}
    </ul>
  )
}
