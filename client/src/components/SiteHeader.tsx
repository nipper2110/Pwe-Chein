import { NavLink, Link } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-1 text-sm font-medium ${isActive ? 'bg-slate-800 text-pitch' : 'text-slate-400 hover:text-slate-200'}`

export default function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2">
      <Link to="/" className="block">
        <span className="font-burmese text-3xl font-bold text-pitch">ပွဲချိန်</span>
        <span className="block text-sm text-slate-400">Live Football Scores & Stats</span>
      </Link>
      <nav className="flex gap-1" aria-label="Main">
        <NavLink to="/" end className={linkClass}>
          Matches
        </NavLink>
        <NavLink to="/league" className={linkClass}>
          Leagues
        </NavLink>
      </nav>
    </header>
  )
}
