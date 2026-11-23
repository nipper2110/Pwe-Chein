import { Link } from 'react-router-dom'
import type { Favorite } from '../api/favorites'
import { useUnfollowTeam } from '../hooks/useFavorites'

export default function FollowedTeams({ teams }: { teams: Favorite[] }) {
  const unfollow = useUnfollowTeam()

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {teams.map((t) => (
        <li key={t.teamId} className="flex items-center gap-3 rounded-xl bg-surface p-3">
          <Link to={`/team/${t.teamId}`} className="flex min-w-0 flex-1 items-center gap-3 hover:text-pitch">
            <img src={t.logo} alt="" loading="lazy" className="h-9 w-9 shrink-0 object-contain" />
            <span className="truncate font-medium">{t.name}</span>
          </Link>
          <button
            type="button"
            aria-label={`Unfollow ${t.name}`}
            disabled={unfollow.isPending && unfollow.variables === t.teamId}
            onClick={() => unfollow.mutate(t.teamId)}
            className="shrink-0 rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-50"
          >
            ★ Unfollow
          </button>
        </li>
      ))}
    </ul>
  )
}
