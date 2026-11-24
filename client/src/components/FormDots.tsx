import { useTranslation } from 'react-i18next'

const DOT = {
  W: { className: 'bg-pitch', label: 'results.win' },
  D: { className: 'bg-slate-500', label: 'results.draw' },
  L: { className: 'bg-amber-500', label: 'results.loss' }, // amber, because red is only for live/goals
} as const

type Result = keyof typeof DOT
const isResult = (c: string): c is Result => c in DOT

/**
 * Last results as small coloured dots.
 * API-Football sends the form string MOST RECENT FIRST (e.g. "DLDLW" = latest result is D),
 * so we reverse it: oldest on the left, most recent on the right.
 */
export default function FormDots({ form }: { form: string | null }) {
  const { t } = useTranslation()
  if (!form) return <span className="text-slate-600">–</span>
  const results = [...form].reverse().filter(isResult)
  const summary = results.map((c) => t(DOT[c].label)).join(', ')

  return (
    <span className="inline-flex gap-1.5" role="img" aria-label={t('results.formAria', { list: summary })}>
      {results.map((c, i) => (
        <span key={i} title={t(DOT[c].label)} className={`h-3 w-3 rounded-full ${DOT[c].className}`} />
      ))}
    </span>
  )
}
