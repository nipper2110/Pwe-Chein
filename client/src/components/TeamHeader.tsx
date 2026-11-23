import type { TeamDetail } from '../types/team'
import FollowButton from './FollowButton'

function Fact({ label, value }: { label: string; value: string | number | null }) {
  if (value === null || value === '') return null
  return (
    <div>
      <dt className="text-[10px] uppercase text-slate-500">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}

export default function TeamHeader({ data }: { data: TeamDetail }) {
  const { team, venue } = data
  return (
    <section className="flex flex-wrap items-center gap-4 rounded-xl bg-surface p-4">
      <img src={team.logo} alt="" className="h-20 w-20 object-contain" />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h1 className="text-2xl font-bold">{team.name}</h1>
          <FollowButton teamId={team.id} teamName={team.name} />
        </div>
        <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
          <Fact label="Country" value={team.country} />
          <Fact label="Founded" value={team.founded} />
          <Fact label="Stadium" value={venue.name} />
          <Fact label="Capacity" value={venue.capacity ? venue.capacity.toLocaleString() : null} />
        </dl>
      </div>
    </section>
  )
}
