const DOT: Record<string, { className: string; label: string }> = {
  W: { className: 'bg-pitch', label: 'win' },
  D: { className: 'bg-slate-500', label: 'draw' },
  L: { className: 'bg-amber-500', label: 'loss' }, // amber, because red is only for live/goals
}

/** Last results as small coloured dots, e.g. "WWDLW". */
export default function FormDots({ form }: { form: string | null }) {
  if (!form) return <span className="text-slate-600">–</span>
  const results = [...form].filter((c) => c in DOT)
  const summary = results.map((c) => DOT[c].label).join(', ')

  return (
    <span className="inline-flex gap-1" role="img" aria-label={`Last ${results.length}: ${summary}`}>
      {results.map((c, i) => (
        <span key={i} className={`h-2.5 w-2.5 rounded-full ${DOT[c].className}`} />
      ))}
    </span>
  )
}
