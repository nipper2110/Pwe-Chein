import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../hooks/useAuth'
import { useFavorites, useFollowTeam, useUnfollowTeam } from '../hooks/useFavorites'

interface Props {
  teamId: number
  teamName: string
}

const BASE = 'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition'

/** Star button: follow or unfollow a team. Logged-out visitors are sent to log in first. */
export default function FollowButton({ teamId, teamName }: Props) {
  const user = useUser()
  const favorites = useFavorites()
  const follow = useFollowTeam()
  const unfollow = useUnfollowTeam()
  const location = useLocation()

  if (user.isPending) return null
  if (!user.data) {
    return (
      <Link to="/login" state={{ from: location.pathname }} className={`${BASE} bg-slate-800 text-slate-300 hover:text-white`}>
        <span aria-hidden="true">☆</span> Follow
      </Link>
    )
  }

  const following = favorites.data?.some((f) => f.teamId === teamId) ?? false
  const mutation = following ? unfollow : follow
  const busy = follow.isPending || unfollow.isPending || favorites.isPending

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        aria-pressed={following}
        aria-label={following ? `Unfollow ${teamName}` : `Follow ${teamName}`}
        disabled={busy}
        onClick={() => mutation.mutate(teamId)}
        className={`${BASE} disabled:opacity-60 ${
          following ? 'bg-pitch text-on-pitch' : 'bg-slate-800 text-slate-300 hover:text-white'
        }`}
      >
        <span aria-hidden="true">{following ? '★' : '☆'}</span>
        {following ? 'Following' : 'Follow'}
      </button>
      {mutation.isError && <p role="alert" className="text-xs text-amber-500">{mutation.error.message}</p>}
    </div>
  )
}
