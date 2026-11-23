import { useCallback, useEffect, useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'pwechein-theme'
const BROWSER_BAR_COLOR: Record<Theme, string> = { dark: '#020617', light: '#f1f5f9' }

// index.html already set data-theme before the first paint, so we just read it.
const readTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

// The page's data-theme attribute is the single source of truth. Every component that calls
// useTheme() listens to it, so two theme buttons on screen can never show different states.
function subscribe(onChange: () => void): () => void {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

/** The current theme and a function to switch. The choice is remembered in localStorage. */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, (): Theme => 'dark')

  // Tint the phone's browser bar to match the page.
  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BROWSER_BAR_COLOR[theme])
  }, [theme])

  const toggle = useCallback(() => {
    const next: Theme = readTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* private mode: the choice just will not be remembered */
    }
  }, [])

  return { theme, toggle }
}
