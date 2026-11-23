import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { ApiError } from '../api/auth'
import AuthPageShell from '../components/AuthPageShell'
import { usePageMeta } from '../hooks/usePageMeta'
import FormField from '../components/FormField'
import { useLogin, useUser } from '../hooks/useAuth'

export default function Login() {
  usePageMeta({ title: 'Log in', noindex: true })
  const user = useUser()
  const login = useLogin()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/dashboard'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Already logged in (or just logged in): go to where the visitor was heading.
  if (user.data) return <Navigate to={from} replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    login.mutate({ email, password })
  }
  const fields = login.error instanceof ApiError ? login.error.fields : {}

  return (
    <AuthPageShell title="Log in">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormField label="Email" name="email" type="email" autoComplete="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} error={fields.email} />
        <FormField label="Password" name="password" type="password" autoComplete="current-password" required value={password}
          onChange={(e) => setPassword(e.target.value)} error={fields.password} />

        {login.isError && Object.keys(fields).length === 0 && (
          <p role="alert" className="text-sm text-amber-500">{login.error.message}</p>
        )}

        <button type="submit" disabled={login.isPending}
          className="w-full rounded-full bg-pitch px-4 py-2 text-sm font-semibold text-on-pitch disabled:opacity-60">
          {login.isPending ? 'Logging in…' : 'Log in'}
        </button>
      </form>
      <p className="text-sm text-slate-400">
        New here? <Link to="/register" state={{ from }} className="text-pitch underline underline-offset-2 hover:no-underline">Create an account</Link>
      </p>
    </AuthPageShell>
  )
}
