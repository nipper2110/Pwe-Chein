import { Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { t } = useTranslation()
  const { theme, toggle } = useTheme()
  const label = theme === 'dark' ? t('theme.toLight') : t('theme.toDark')
  const Icon = theme === 'dark' ? Sun : Moon

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`size-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-white ${className || 'inline-flex'}`}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  )
}
