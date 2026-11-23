import { useEffect, useState } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'pwechein-theme'
const BROWSER_BAR_COLOR: Record<Theme, string> = { dark: '#020617', light: '#f1f5f9' }

// index.html already set data-theme before the first paint, so we just read it.
const readTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

/** The current theme and a function to switch. The choice is remembered in localStorage. */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(readTheme)

  // Tint the phone's browser bar to match the page.
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BROWSER_BAR_COLOR[theme])
  }, [theme])

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* private mode: the choice just will not be remembered */
    }
    setTheme(next)
  }

  return { theme, toggle }
}
