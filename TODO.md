# TODO

## Done in Phase 9

- [x] **Rate limiting** (`server/src/middleware/rateLimit.ts`)
  - 300 requests / 15 min per visitor on all `/api` routes.
  - 60 / 15 min on `/api/fixtures` and `/api/leagues/*`.
  - 40 / 15 min shared by `/api/matches/:id`, `/api/teams/:id` and following a team (all can spend a real API-Football request).
  - Friendly `429` message with `Retry-After`; the client shows it and does not retry 4xx errors.
- [x] **Login brute-force protection**
  - Login: 5 failed attempts / 15 min per account + IP, and 20 failed attempts / 15 min per IP. Successful logins are never counted.
  - Register: 5 / hour per IP.
- [x] Light/dark toggle, SEO titles and meta tags, 404 page, accessibility pass (axe-core: 0 violations on all pages in both themes).

## Before or during Phase 10 (deploy)

- [ ] **Render and `trust proxy`**: production uses `trust proxy = 1` (one proxy in front). Confirm on Render that rate limits count real visitor IPs, not the proxy's IP.
- [ ] **Cookies across sites**: Vercel (client) and Render (server) are different sites, so the login cookie may be blocked (Safari). Cleanest fix: a Vercel rewrite that proxies `/api` to Render, so everything is same-origin.
- [ ] Set `JWT_SECRET`, `MONGODB_URI`, `API_FOOTBALL_KEY`, `SEASON`, `NODE_ENV=production` on Render, and update the CORS origin to the Vercel URL.
- [ ] Add a **sitemap.xml** once the production domain is known.

## Ideas for later

- [ ] Rate-limit counters live in server memory (reset on restart or when Render's free instance sleeps). If we ever run more than one instance, use a shared store.
- [ ] Social link previews (WhatsApp, Facebook) do not run JavaScript, so every page shows the generic site preview. Fixing it needs prerendering or server-side rendering.
- [ ] Some team logos (for example Juventus) are white/outlined and look faint on the light theme.
- [ ] The dashboard and match cards could use a "last updated" hint, since cached data can be up to an hour old.
- [ ] Desktop has no "Account" page link (the avatar menu covers it); only the mobile tab bar opens `/account`.
