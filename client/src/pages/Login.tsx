import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { ApiError } from '../api/auth'
import AuthPageShell from '../components/AuthPageShell'
import { usePageMeta } from '../hooks/usePageMeta'
import FormField from '../components/FormField'
import GoogleSignIn from '../components/GoogleSignIn'
import { useLogin, useUser } from '../hooks/useAuth'
import { useErrorText } from '../hooks/useErrorText'

export default function Login() {
  const { t } = useTranslation()
  const { errorText, fieldText } = useErrorText()
  usePageMeta({ title: t('auth.login'), noindex: true })
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
    <AuthPageShell title={t('auth.login')}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormField label={t('auth.email')} name="email" type="email" autoComplete="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} error={fieldText(fields.email)} />
        <FormField label={t('auth.password')} name="password" type="password" autoComplete="current-password" required value={password}
          onChange={(e) => setPassword(e.target.value)} error={fieldText(fields.password)} />

        {login.isError && Object.keys(fields).length === 0 && (
          <p role="alert" className="text-sm text-amber-500">{errorText(login.error)}</p>
        )}

        <button type="submit" disabled={login.isPending}
          className="w-full rounded-full bg-pitch px-4 py-2 text-sm font-semibold text-on-pitch disabled:opacity-60">
          {login.isPending ? t('auth.loggingIn') : t('auth.login')}
        </button>
      </form>
      <GoogleSignIn mode="signin" />
      <p className="text-sm text-slate-400">
        {t('auth.newHere')} <Link to="/register" state={{ from }} className="text-pitch underline underline-offset-2 hover:no-underline">{t('auth.createLink')}</Link>
      </p>
    </AuthPageShell>
  )
}
