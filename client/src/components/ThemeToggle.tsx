import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const next = theme === 'dark' ? 'light' : 'dark'
  const Icon = theme === 'dark' ? Sun : Moon

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className={`size-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-800 hover:text-white ${className || 'inline-flex'}`}
    >
      <Icon size={18} aria-hidden="true" />
    </button>
  )
}
