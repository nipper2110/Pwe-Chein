import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { ApiError } from '../api/auth'
import AuthPageShell from '../components/AuthPageShell'
import { usePageMeta } from '../hooks/usePageMeta'
import FormField from '../components/FormField'
import { useRegister, useUser } from '../hooks/useAuth'
import { useErrorText } from '../hooks/useErrorText'
import { currentLanguage } from '../i18n'

export default function Register() {
  const { t } = useTranslation()
  const { errorText, fieldText } = useErrorText()
  usePageMeta({ title: t('auth.signup'), noindex: true })
  const user = useUser()
  const register = useRegister()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/dashboard'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (user.data) return <Navigate to={from} replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    register.mutate({ name, email, password, language: currentLanguage() }) // new accounts start with the language being used now
  }
  const fields = register.error instanceof ApiError ? register.error.fields : {}

  return (
    <AuthPageShell title={t('auth.createTitle')}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormField label={t('auth.name')} name="name" autoComplete="name" required maxLength={50} value={name}
          onChange={(e) => setName(e.target.value)} error={fieldText(fields.name)} />
        <FormField label={t('auth.email')} name="email" type="email" autoComplete="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} error={fieldText(fields.email)} />
        <FormField label={t('auth.password')} name="password" type="password" autoComplete="new-password" required minLength={8}
          maxLength={72} value={password} onChange={(e) => setPassword(e.target.value)} error={fieldText(fields.password)} />
        <p className="-mt-2 text-xs text-slate-400">{t('auth.passwordHint')}</p>

        {register.isError && Object.keys(fields).length === 0 && (
          <p role="alert" className="text-sm text-amber-500">{errorText(register.error)}</p>
        )}

        <button type="submit" disabled={register.isPending}
          className="w-full rounded-full bg-pitch px-4 py-2 text-sm font-semibold text-on-pitch disabled:opacity-60">
          {register.isPending ? t('auth.creatingAccount') : t('auth.signup')}
        </button>
      </form>
      <p className="text-sm text-slate-400">
        {t('auth.haveAccount')} <Link to="/login" state={{ from }} className="text-pitch underline underline-offset-2 hover:no-underline">{t('auth.login')}</Link>
      </p>
    </AuthPageShell>
  )
}
