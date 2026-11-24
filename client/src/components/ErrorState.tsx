import { useTranslation } from 'react-i18next'
import { useErrorText } from '../hooks/useErrorText'

interface Props {
  /** The error that happened. Its message is shown in the user's language. */
  error?: unknown
  /** Or a ready-made message (already translated). */
  message?: string
  onRetry: () => void
}

export default function ErrorState({ error, message, onRetry }: Props) {
  const { t } = useTranslation()
  const { errorText } = useErrorText()

  return (
    <div role="alert" className="rounded-xl bg-surface p-6 text-center">
      <p className="mb-1 font-semibold">{t('common.somethingWrong')}</p>
      <p className="mb-4 text-sm text-slate-400">{message ?? errorText(error)}</p>
      <button type="button" onClick={onRetry} className="rounded-full bg-pitch px-4 py-1.5 text-sm font-medium text-on-pitch">
        {t('common.tryAgain')}
      </button>
    </div>
  )
}
