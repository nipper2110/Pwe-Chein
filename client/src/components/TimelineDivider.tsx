/** A centred marker between events, e.g. "HT 0-0" or "FT 4-0". */
export default function TimelineDivider({ label, score }: { label: string; score?: string }) {
  return (
    <li className="flex items-center gap-3 border-t border-slate-800 bg-slate-900/60 px-3 py-1.5 first:border-t-0" aria-label={`${label} ${score ?? ''}`.trim()}>
      <span className="h-px flex-1 bg-slate-700" />
      <span className="rounded-full bg-slate-800 px-3 py-0.5 font-mono text-xs font-bold text-slate-200">
        {label}
        {score ? ` ${score}` : ''}
      </span>
      <span className="h-px flex-1 bg-slate-700" />
    </li>
  )
}
