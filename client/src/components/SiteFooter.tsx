import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

/** Small footer shown on every page: legal links and the copyright line. */
export default function SiteFooter() {
  const { t } = useTranslation()
  const link = 'underline-offset-2 hover:text-slate-200 hover:underline'
  return (
    <footer className="mt-8 border-t border-slate-800 pt-4 text-xs text-slate-400">
      <nav aria-label={t('footer.nav')} className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Link to="/privacy" className={link}>{t('footer.privacy')}</Link>
        <span aria-hidden="true">·</span>
        <Link to="/terms" className={link}>{t('footer.terms')}</Link>
        <span className="ms-auto">{t('footer.copyright')}</span>
      </nav>
    </footer>
  )
}
