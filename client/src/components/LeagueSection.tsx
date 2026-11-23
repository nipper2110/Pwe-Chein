import type { Fixture } from '../types/fixture'
import LeagueLogo from './LeagueLogo'
import MatchCard from './MatchCard'

interface Props {
  title: string
  logo?: string
  matches: Fixture[]
  showDate?: boolean
  resultForTeamId?: number
}

export default function LeagueSection({ title, logo, matches, showDate, resultForTeamId }: Props) {
  return (
    <section className="overflow-hidden rounded-xl bg-surface">
      <h2 className="flex items-center gap-2 px-4 py-3 text-sm font-semibold">
        {logo && <LeagueLogo src={logo} />}
        {title}
      </h2>
      {matches.map((m) => (
        <MatchCard key={m.fixture.id} match={m} showDate={showDate} resultForTeamId={resultForTeamId} />
      ))}
    </section>
  )
}
