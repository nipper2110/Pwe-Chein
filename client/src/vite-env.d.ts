/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Google OAuth client ID. Not a secret (it is visible in the page). Empty/missing = no Google button. */
  readonly VITE_GOOGLE_CLIENT_ID?: string
}
