# ပွဲချိန် Pwechein

A free football scores and fixtures site in English, Burmese and Thai.

**Live site:** https://pwechein.vercel.app

![Pwechein screenshot](docs/screenshot.png)

## Features

- **Matches by date**: yesterday, today and tomorrow, grouped by league, with a date picker. Kick-off times are shown in your own time zone.
- **Live scores**: live matches are pinned at the top and refresh every minute while something is being played.
- **Match page**: score, events timeline (goals, cards, substitutions), lineups and statistics bars.
- **Leagues**: standings (with form and zone colours) and top scorers for Premier League, La Liga, Serie A, Bundesliga, Ligue 1 and Champions League.
- **Team page**: team info, season summary, recent results and next fixtures.
- **Follow teams** (up to 20) and a **dashboard** with the matches of your followed teams.
- **Accounts**: email + password sign-up, or "Sign in with Google".
- **Three languages**: English, Burmese and Thai. The choice is remembered on the device and, when logged in, on the account.
- **Dark and light theme**, responsive layout with a bottom tab bar on phones.
- **Accessibility and SEO**: skip link, keyboard-friendly menus, per-page titles and meta tags.
- **Privacy Policy and Terms of Service** pages (`/privacy`, `/terms`) in all three languages.

## Tech stack

| Part | Technologies |
|---|---|
| Client | React 19, TypeScript, Vite 8, Tailwind CSS v4, React Router 7, TanStack Query 5, react-i18next (i18next 27), lucide-react |
| Server | Node.js, Express 5, TypeScript (run with `tsx`), Mongoose 9 (MongoDB Atlas), zod 4, JSON Web Tokens in an httpOnly cookie, bcrypt, `express-rate-limit`, `google-auth-library` |
| Auth | Email + password, and Google Identity Services (the browser sends a Google ID token, the server verifies it) |
| Data | [API-Football](https://www.api-football.com/) (v3) |
| Hosting | Vercel (client), Render (server), MongoDB Atlas (database) |

## Architecture

```
Browser
  │  https://pwechein.vercel.app
  ▼
Vercel ── serves the React app
  │  rewrites /api/*  (same origin, so the login cookie works)
  ▼
Render ── Express API (auth, favorites, rate limits)
  │
  ├──► MongoDB Atlas ── users + cache (CacheEntry)
  │         ▲  cache hit: answer right away
  ▼         │  cache miss: fetch, then store with an expiry time
API-Football
```

The browser never talks to API-Football and never sees its key. Only `server/src/services/apiFootball.ts` calls it.

## How the API cache works

The free API-Football plan allows only **100 requests per day**, so every call is cached in MongoDB.
A request first looks for a `CacheEntry` (key + data + `expiresAt`). If it is still valid, the saved data is returned. If not, the server calls API-Football once and saves the answer.
MongoDB's TTL index deletes expired entries automatically. This is *lazy caching*: nothing runs in the background, data is fetched only when a visitor asks for it.
Every real API call is logged with its endpoint, and `GET /api/status` shows the remaining daily quota (that endpoint does not use quota).

| Data | Cache time |
|---|---|
| Leagues, teams, team season fixtures | 24 hours |
| Standings, top scorers | 6 hours |
| Fixtures of a **past** day | 7 days |
| Fixtures of a **future** day | 6 hours |
| Fixtures of **today** | 1 hour, or 5 minutes while a match is live |
| Live matches | 60 seconds |
| Match details (events, lineups, statistics) | 7 days once finished, 60 seconds while live, 1 hour before kick-off |

**When API-Football fails.** A circuit breaker stops all calls for a cooldown (15 minutes, or 60 for "account suspended") after the provider reports an account or limit problem, even inside an HTTP 200 answer. Expired cache entries are kept for 7 days, so the site can show saved data (the response gets the header `X-Data-Stale: true` and the page shows a note) instead of an error. With nothing saved, the API answers `503 API_UNAVAILABLE`. Identical requests that arrive at the same time share one API call.

Rate limits protect the quota and the login: a global limit, a stricter limit on match and team pages, and failed-login limits per IP and per account.

## Local setup

**Prerequisites:** Node.js 22 or newer, a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster, and a free [API-Football](https://www.api-football.com/) key.

```bash
git clone <repository-url>
cd Pwe-Chein

# server
cd server
npm install
cp .env.example .env      # then fill it in (see below)
npm run dev               # http://localhost:5001

# client (in a second terminal)
cd client
npm install
npm run dev               # http://localhost:5173  (proxies /api to localhost:5001)
```

Check that it works: open http://localhost:5001/api/health and http://localhost:5001/api/status.

### Server environment variables (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port of the API. Default `5001`. |
| `API_FOOTBALL_KEY` | Your API-Football key. Server only, never commit it. |
| `SEASON` | Season year to show. The free plan only allows 2022-2024. Default `2024`. |
| `MONGODB_URI` | MongoDB connection string (required). |
| `JWT_SECRET` | Long random string (at least 32 characters) that signs login tokens (required). |
| `API_BREAKER_MINUTES` | Circuit breaker: how long to stop calling API-Football after it reports an account or limit problem (`requests`, `rateLimit`, `token`). Empty = 15. |
| `API_BREAKER_ACCESS_MINUTES` | Same, for `access` errors such as a suspended account. Empty = 60. |
| `TRUST_PROXY_HOPS` | How many proxies sit in front of Express. Empty = default (2 in production, 0 locally). |
| `DEBUG_IP_ENDPOINT` | `true` enables `GET /api/_ip` briefly after deploying, to check the proxy setting. Default `false`. |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID. Empty = Google sign-in is switched off. |
| `NODE_ENV` | Set to `production` on the server host. |

### Client environment variables (`client/.env.local`)

| Variable | Description |
|---|---|
| `VITE_GOOGLE_CLIENT_ID` | Same Google client ID as on the server. It is not a secret. Empty = the Google button is hidden. |

### Useful scripts

```bash
cd client && npm run build        # type-check + production build
cd client && npm run lint         # oxlint
cd client && npm run i18n:check   # checks that en, my and th have the same keys
cd server && npm run typecheck
```

## Deployment

**Client on Vercel**
- Root Directory `client`, Framework `Vite`, build command `npm run build`, output `dist`.
- Environment variable `VITE_GOOGLE_CLIENT_ID`. Vite bakes it into the build, so redeploy after changing it.
- [`client/vercel.json`](client/vercel.json) rewrites `/api/*` to the Render URL and sends every other path to `index.html` (single-page app).

**Server on Render**
- Root Directory `server`, build command `npm install --include=dev && npm run build`, start command `npm start`, health check path `/api/health`.
- Environment variables: `NODE_ENV=production`, `MONGODB_URI`, `API_FOOTBALL_KEY`, `SEASON`, `JWT_SECRET` (a new random value), `GOOGLE_CLIENT_ID`.
- **`TRUST_PROXY_HOPS`**: in production the request passes through Vercel and Render's load balancer before Express, so Express must trust 2 proxies (the default) to read the visitor's real IP. Without it, every visitor would share one IP and the rate limits would hit everybody at once. Trusting too many is also unsafe, because the header can be faked.
- In MongoDB Atlas, allow network access from Render (its outgoing IPs change).

**Google sign-in (Google Cloud Console)**
1. Create an OAuth client ID of type **Web application** (and fill in the OAuth consent screen).
2. **Authorized JavaScript origins**: `http://localhost:5173` and `http://localhost` for development, and your production origin (for example `https://pwechein.vercel.app`). Not the Render URL.
3. Leave **Authorized redirect URIs** empty: the ID-token flow does not use a redirect.
4. Put the same client ID in `GOOGLE_CLIENT_ID` (Render) and `VITE_GOOGLE_CLIENT_ID` (Vercel).

More detail and a post-deploy checklist are in [TODO.md](TODO.md).

## Project structure

```
.
├── client/                 React app (Vite)
│   ├── src/
│   │   ├── api/            functions that call our backend
│   │   ├── components/     reusable UI (MatchCard, StandingsTable, ...)
│   │   ├── hooks/          data and UI hooks (useFixtures, useTheme, ...)
│   │   ├── i18n/           translations (locales/en, my, th) and date helpers
│   │   ├── pages/          Home, League, Match, Team, Dashboard, Login, ...
│   │   └── types/, utils/
│   └── vercel.json         /api rewrite + SPA fallback
├── server/                 Express API
│   └── src/
│       ├── controllers/    request handlers
│       ├── middleware/     auth, rate limits, error handler
│       ├── models/         User, CacheEntry (Mongoose)
│       ├── routes/         all /api routes
│       └── services/       apiFootball.ts (cache + the only API-Football caller), googleAuth.ts
├── TODO.md                 deploy checklist and ideas
└── TRANSLATION_NOTES.md    notes for reviewing the translations
```

## Known limitations

- **API-Football free plan**: 100 requests per day, and only seasons 2022-2024, so the site shows the season set in `SEASON`. Some endpoints (such as "last/next fixtures of a team") are blocked, so the team and dashboard pages are built from cached season and date lists instead.
- **Render free tier**: the server sleeps when idle, so the first request after a break can take about 50 seconds.
- **Rate-limit counters** live in server memory and reset on restart.
- **Burmese and Thai texts** were written with AI help and are waiting for a native-speaker review (see `TRANSLATION_NOTES.md`).
- A Google-only account cannot use the password login (there is no "set a password" feature yet).

## Contact

pwechein@gmail.com

## License

All rights reserved.
