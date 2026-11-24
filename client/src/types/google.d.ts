// The small part of Google Identity Services (https://accounts.google.com/gsi/client) that we use.
// Declared by hand so we do not need another package just for types.
interface GoogleCredentialResponse {
  /** The Google ID token (a JWT). We send it to our server, which verifies it. */
  credential: string
}

interface GoogleButtonOptions {
  type?: 'standard' | 'icon'
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  logo_alignment?: 'left' | 'center'
  width?: number
  locale?: string
}

interface Window {
  google?: {
    accounts: {
      id: {
        initialize(config: {
          client_id: string
          callback: (response: GoogleCredentialResponse) => void
          ux_mode?: 'popup' | 'redirect'
        }): void
        renderButton(parent: HTMLElement, options: GoogleButtonOptions): void
      }
    }
  }
}
