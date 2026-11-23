import { Link } from 'react-router-dom'

interface Props {
  title?: string
  message?: string
}

export default function NotFoundState({ title = 'Page not found', message = "We couldn't find what you were looking for." }: Props) {
  return (
    <div className="rounded-xl bg-surface p-8 text-center">
      <p className="font-mono text-5xl font-bold text-pitch" aria-hidden="true">404</p>
      <h1 className="mt-2 text-xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-slate-400">{message}</p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Link to="/" className="rounded-full bg-pitch px-4 py-1.5 text-sm font-semibold text-on-pitch">
          Today's matches
        </Link>
        <Link to="/league" className="rounded-full bg-slate-800 px-4 py-1.5 text-sm font-medium text-slate-300 hover:text-white">
          Leagues
        </Link>
      </div>
    </div>
  )
}
