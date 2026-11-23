import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function FormField({ label, error, id, ...inputProps }: Props) {
  const inputId = id ?? inputProps.name
  return (
    <div className="space-y-1">
      <label htmlFor={inputId} className="block text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`w-full rounded-lg border bg-base px-3 py-2 text-sm text-white placeholder:text-slate-600 ${
          error ? 'border-amber-500' : 'border-slate-700'
        }`}
        {...inputProps}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-amber-500">
          {error}
        </p>
      )}
    </div>
  )
}
