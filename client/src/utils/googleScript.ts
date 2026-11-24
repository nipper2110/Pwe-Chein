let loading: Promise<void> | null = null

/** Loads Google's sign-in script once. Rejects if it cannot load (offline, or blocked by a privacy extension). */
export function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve()
  loading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => {
      loading = null // allow another try later
      script.remove()
      reject(new Error('Could not load the Google sign-in script'))
    }
    document.head.appendChild(script)
  })
  return loading
}
