import { isLowerBetter, statLabel } from '../utils/statLabels'

interface Props {
  type: string
  home: number | string | null
  away: number | string | null
}

const toNumber = (v: number | string | null): number => {
  const n = typeof v === 'number' ? v : parseFloat(String(v ?? '0').replace('%', ''))
  return Number.isFinite(n) ? n : 0
}

const BETTER = 'font-bold text-white'
const WORSE = 'font-normal text-slate-500'
const EVEN = 'font-semibold text-slate-300'

/** One statistic: values on both sides and a bar split in proportion to them. */
export default function StatRow({ type, home, away }: Props) {
  const label = statLabel(type)
  const h = toNumber(home)
  const a = toNumber(away)
  const total = h + a
  const homeShare = total === 0 ? 50 : (h / total) * 100

  // The better side is bold and white, the other muted. Equal values look the same.
  const homeIsBetter = isLowerBetter(type) ? h < a : h > a
  const homeClass = h === a ? EVEN : homeIsBetter ? BETTER : WORSE
  const awayClass = h === a ? EVEN : homeIsBetter ? WORSE : BETTER

  return (
    <li className="px-3 py-2">
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className={`font-mono ${homeClass}`}>{home ?? 0}</span>
        <span className="text-xs text-slate-400">{label}</span>
        <span className={`font-mono ${awayClass}`}>{away ?? 0}</span>
      </div>
      <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full bg-slate-800" role="img" aria-label={`${label}: ${home ?? 0} to ${away ?? 0}`}>
        <div className="bg-pitch" style={{ width: `${homeShare}%` }} />
        <div className="bg-sky-500" style={{ width: `${100 - homeShare}%` }} />
      </div>
    </li>
  )
}
