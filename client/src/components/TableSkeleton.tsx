import { useTranslation } from 'react-i18next'

export default function TableSkeleton({ rows = 10 }: { rows?: number }) {
  const { t } = useTranslation()
  return (
    <div className="animate-pulse space-y-2 rounded-xl bg-surface p-4" role="status" aria-busy="true" aria-label={t('common.loading')}>
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="h-6 rounded bg-slate-800" />
      ))}
    </div>
  )
}
