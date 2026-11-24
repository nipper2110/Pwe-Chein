import { useTranslation } from 'react-i18next'

export default function MatchListSkeleton() {
  const { t } = useTranslation()
  return (
    <div className="space-y-4" role="status" aria-busy="true" aria-label={t('common.loadingMatches')}>
      {[0, 1].map((i) => (
        <div key={i} className="animate-pulse rounded-xl bg-surface p-4">
          <div className="mb-4 h-4 w-32 rounded bg-slate-800" />
          {[0, 1, 2].map((j) => (
            <div key={j} className="flex items-center gap-3 py-3">
              <div className="h-6 flex-1 rounded bg-slate-800" />
              <div className="h-6 w-16 rounded bg-slate-800" />
              <div className="h-6 flex-1 rounded bg-slate-800" />
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
