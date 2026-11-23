import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { ApiError } from '../api/auth'
import AuthPageShell from '../components/AuthPageShell'
import { usePageMeta } from '../hooks/usePageMeta'
import FormField from '../components/FormField'
import { useRegister, useUser } from '../hooks/useAuth'

export default function Register() {
  usePageMeta({ title: 'Sign up', noindex: true })
  const user = useUser()
  const register = useRegister()
  const from = (useLocation().state as { from?: string } | null)?.from ?? '/dashboard'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  if (user.data) return <Navigate to={from} replace />

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    register.mutate({ name, email, password })
  }
  const fields = register.error instanceof ApiError ? register.error.fields : {}

  return (
    <AuthPageShell title="Create your account">
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormField label="Name" name="name" autoComplete="name" required maxLength={50} value={name}
          onChange={(e) => setName(e.target.value)} error={fields.name} />
        <FormField label="Email" name="email" type="email" autoComplete="email" required value={email}
          onChange={(e) => setEmail(e.target.value)} error={fields.email} />
        <FormField label="Password" name="password" type="password" autoComplete="new-password" required minLength={8}
          maxLength={72} value={password} onChange={(e) => setPassword(e.target.value)} error={fields.password} />
        <p className="-mt-2 text-xs text-slate-400">At least 8 characters.</p>

        {register.isError && Object.keys(fields).length === 0 && (
          <p role="alert" className="text-sm text-amber-500">{register.error.message}</p>
        )}

        <button type="submit" disabled={register.isPending}
          className="w-full rounded-full bg-pitch px-4 py-2 text-sm font-semibold text-on-pitch disabled:opacity-60">
          {register.isPending ? 'Creating account…' : 'Sign up'}
        </button>
      </form>
      <p className="text-sm text-slate-400">
        Already have an account? <Link to="/login" state={{ from }} className="text-pitch hover:underline">Log in</Link>
      </p>
    </AuthPageShell>
  )
}
