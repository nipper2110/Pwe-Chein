import { useTranslation } from 'react-i18next'
import { useFormat } from '../hooks/useFormat'
import type { TeamDetail } from '../types/team'
import FollowButton from './FollowButton'

function Fact({ label, value }: { label: string; value: string | number | null }) {
  if (value === null || value === '') return null
  return (
    <div>
      <dt className="text-[10px] uppercase text-slate-400">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  )
}

export default function TeamHeader({ data }: { data: TeamDetail }) {
  const { t } = useTranslation()
  const format = useFormat()
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
          <Fact label={t('team.country')} value={team.country} />
          <Fact label={t('team.founded')} value={team.founded} />
          <Fact label={t('team.stadium')} value={venue.name} />
          <Fact label={t('team.capacity')} value={venue.capacity ? format.number(venue.capacity) : null} />
        </dl>
      </div>
    </section>
  )
}
