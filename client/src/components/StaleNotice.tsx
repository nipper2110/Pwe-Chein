import { useTranslation } from 'react-i18next'
import { useHasStaleData } from '../api/staleStore'

/** A small note shown when the server had to use saved data because the football data provider is unavailable. */
export default function StaleNotice() {
  const { t } = useTranslation()
  if (!useHasStaleData()) return null
  return (
    <p role="status" className="rounded-lg bg-surface px-3 py-2 text-xs text-amber-500">
      {t('common.staleNotice')}
    </p>
  )
}
