import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import LanguageSync from './components/LanguageSync'
import ProtectedRoute from './components/ProtectedRoute'
import Account from './pages/Account'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import League from './pages/League'
import Login from './pages/Login'
import Match from './pages/Match'
import Privacy from './pages/Privacy'
import NotFound from './pages/NotFound'
import Register from './pages/Register'
import Team from './pages/Team'
import Terms from './pages/Terms'
import { DEFAULT_LEAGUE_ID } from './utils/leagues'

/**
 * A normal website reloads on every link, which resets scroll and focus. In a single-page app
 * nothing reloads, so we do it ourselves: scroll to the top and move keyboard/screen-reader
 * focus to the new page's <main>. (Not on the very first load.)
 */
function RouteChangeEffects() {
  const { pathname } = useLocation()
  // Compare with the previous path instead of using a "first render" flag: in development React
  // runs effects twice, which would wrongly count as a page change on the very first load.
  const previousPath = useRef(pathname)

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    window.scrollTo(0, 0)
    document.getElementById('main')?.focus({ preventScroll: true })
  }, [pathname])

  return null
}

function App() {
  const { t } = useTranslation()
  return (
    <>
      {/* First thing a keyboard user can Tab to: jump past the header straight to the content. */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-pitch focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-pitch"
      >
        {t('nav.skip')}
      </a>
      <RouteChangeEffects />
      <LanguageSync />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/league" element={<Navigate to={`/league/${DEFAULT_LEAGUE_ID}`} replace />} />
        <Route path="/league/:id" element={<League />} />
        <Route path="/match/:id" element={<Match />} />
        <Route path="/team/:id" element={<Team />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        {/* Everything inside needs a login */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
