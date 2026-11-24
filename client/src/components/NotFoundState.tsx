import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

interface Props {
  /** Defaults to the generic "Page not found" texts. */
  title?: string
  message?: string
}

export default function NotFoundState({ title, message }: Props) {
  const { t } = useTranslation()

  return (
    <div className="rounded-xl bg-surface p-8 text-center">
      <p className="font-mono text-5xl font-bold text-pitch" aria-hidden="true">404</p>
      <h1 className="mt-2 text-xl font-bold">{title ?? t('notFound.title')}</h1>
      <p className="mt-1 text-sm text-slate-400">{message ?? t('notFound.message')}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link to="/" className="rounded-full bg-pitch px-4 py-1.5 text-sm font-semibold text-on-pitch">
          {t('notFound.todaysMatches')}
        </Link>
        <Link to="/league" className="rounded-full bg-slate-800 px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white">
          {t('notFound.leagues')}
        </Link>
      </div>
    </div>
  )
}
