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

## Deploy: Vercel (client) -> rewrite /api/* -> Render (server)

Done in code: `client/vercel.json` (the /api rewrite + single-page-app fallback), `trust proxy` hop count from the
`TRUST_PROXY_HOPS` variable (default 2 in production), same-site `SameSite=Lax` login cookie, CORS off in production,
`no-store` on per-user routes, a per-email login limit, and a temporary `GET /api/_ip` helper.

### Before deploying

- [ ] In `client/vercel.json`, replace `YOUR-RENDER-SERVICE.onrender.com` with your real Render hostname (keep `/api/:path*`).
- [ ] Vercel project: Root Directory `client`, Framework `Vite`, build `npm run build`, output `dist`. No environment variables needed.
- [ ] Render service: Root Directory `server`; start command `npm start`. Build command `npm install --include=dev && npm run build`
      (TypeScript is a dev dependency, and Render sets NODE_ENV=production, which would skip it otherwise).
- [ ] Render environment variables: `NODE_ENV=production`, `MONGODB_URI`, `API_FOOTBALL_KEY`, `SEASON=2024`, `JWT_SECRET` (a NEW long random value, not your local one),
      `DEBUG_IP_ENDPOINT=true` (temporary, see below). Leave `TRUST_PROXY_HOPS` unset for now.
- [ ] MongoDB Atlas > Network Access: allow `0.0.0.0/0` (Render's outgoing IPs change).
- [ ] Render health check path: `/api/health`.

### After deploying: what to check (in this order)

1. **The visitor's real IP is what rate limits see.** Open `https://<your-vercel-domain>/api/_ip` in the browser.
   - `ip` must be YOUR public IP (search "what is my IP"). `forwardedFor` shows the chain; `ips` lists the trusted addresses.
   - If `ip` is a Vercel or Render address (not yours): the hop count is too LOW. Set `TRUST_PROXY_HOPS=3` on Render and redeploy.
   - If `ip` is something you typed or does not look like a real visitor: too HIGH. Lower it.
   - Spoof test: `curl -H "X-Forwarded-For: 6.6.6.6" https://<your-vercel-domain>/api/_ip` must STILL show your IP, not 6.6.6.6.
   - Then set `DEBUG_IP_ENDPOINT=false` and redeploy (the route disappears: it should return 404).
2. **Rate limits count each visitor separately.** Request `https://<your-vercel-domain>/api/matches/abc` 41 times: the 41st gives 429.
   Then try once from another network (phone on mobile data): it must NOT be blocked.
3. **The cookie is same-site.** Log in, then DevTools > Application > Cookies. Only the Vercel domain should have `pwechein_token`, with HttpOnly, Secure and SameSite=Lax,
   and no cookie for `onrender.com`. Reload the page: you stay logged in. Log out: the cookie disappears. Try Safari or a private window too.
4. **No caching of personal data.** In DevTools > Network, `/api/auth/me` must show `cache-control: no-store`.
5. **Pages and API are routed correctly.** Open `https://<your-vercel-domain>/league/39` directly (must load the app, not a 404) and
   `https://<your-vercel-domain>/api/health` (must show JSON, not the app).
6. **Cold start.** Render's free server sleeps after about 15 minutes. The first request afterwards can take 30-60 seconds, and Vercel's rewrite may time out
   (you would see the red "try again" box). Just press Try again. A free uptime pinger on `/api/health` every 10 minutes avoids this, if you want.
7. **Server logs on Render** should say `[proxy] trusting 2 proxy hop(s)` and must NOT show `express-rate-limit` ERR_ERL_ warnings.

### Known limits

- Anyone who calls the Render URL **directly** (skipping Vercel) can fake `X-Forwarded-For`, because a Vercel rewrite cannot add a secret header for Render to check.
  Effect: they can dodge the per-visitor limits. Login is still protected by the per-account limit (15 failures per hour, by email, ignoring the IP).
  Stronger fix if it ever matters: put a Vercel Edge Middleware or a Cloudflare worker in front that adds a secret header, and make the server require it.
- The per-account login limit also lets a stranger lock your account for an hour by failing 15 times. Accepted trade-off.

## Ideas for later

- [ ] Rate-limit counters live in server memory (reset on restart or when Render's free instance sleeps). If we ever run more than one instance, use a shared store.
- [ ] Social link previews (WhatsApp, Facebook) do not run JavaScript, so every page shows the generic site preview. Fixing it needs prerendering or server-side rendering.
- [ ] Some team logos (for example Juventus) are white/outlined and look faint on the light theme.
- [ ] The dashboard and match cards could use a "last updated" hint, since cached data can be up to an hour old.
- [ ] Desktop has no "Account" page link (the avatar menu covers it); only the mobile tab bar opens `/account`.
