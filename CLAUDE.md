# ပွဲချိန် (Pwechein) — Live Football Scores & Stats

## About me

- I am a student building this as a portfolio project. I want to learn, not just copy code.
- **Always explain what you did and why in Burmese (မြန်မာဘာသာ).** Keep code, comments, commit messages and file names in English.
- Explain simply. If you use a new concept (e.g. caching, JWT, middleware), explain it in 2–3 simple sentences.

## Project overview

A full-stack football website showing live scores, fixtures, standings, match details and top scorers, using API-Football. Logged-in users can follow favorite teams and get a personal dashboard.

## Tech stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS v4 (`@tailwindcss/vite`), React Router, TanStack Query
- **Backend:** Express + TypeScript (run with `tsx`), Node's built-in `fetch`
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** JWT stored in an httpOnly cookie, passwords hashed with bcrypt
- **Validation:** zod
- **Deploy:** Vercel (client), Render (server)

## Folder structure

```
pwechein/
├── client/src/
│   ├── components/   # reusable UI (MatchCard, StandingsTable, LiveBadge...)
│   ├── pages/        # Home, Match, League, Team, Login, Register, Dashboard
│   ├── api/          # functions that call our backend
│   ├── hooks/        # custom hooks (useFixtures, useStandings...)
│   └── types/        # shared TypeScript types
└── server/src/
    ├── routes/
    ├── controllers/
    ├── services/     # apiFootball.ts (only place that calls API-Football)
    ├── models/       # Mongoose models (User, CacheEntry)
    ├── middleware/   # auth, error handler
    └── index.ts
```

## API-Football rules (VERY IMPORTANT)

- Base URL: `https://v3.football.api-sports.io`, header `x-apisports-key`.
- **Free plan = only 100 requests per day.** Never waste requests.
- The API key lives ONLY in `server/.env` as `API_FOOTBALL_KEY`. Never send it to the client, never log it, never commit `.env`.
- The frontend NEVER calls API-Football directly. It only calls our Express backend.
- All API-Football calls go through `server/src/services/apiFootball.ts`, which checks a MongoDB cache first (`CacheEntry` model with key, data, expiresAt).
- Cache time (TTL):
  - Leagues, teams, players: 24 hours
  - Standings, top scorers: 6 hours
  - Fixtures (not live): 1 hour
  - Live matches: 60 seconds, and only while matches are actually live
  - Finished match details (lineups, events, statistics): 7 days (they never change)
- Use **lazy caching** (fetch only when a user requests data and the cache is expired). Do not use cron jobs that run all day, because the free Render server sleeps and it wastes requests.
- Log every real API call with the endpoint name so I can count usage. Add a `/api/status` route that returns remaining daily requests (the `/status` endpoint does not use quota).
- The free plan may only allow certain seasons. Put the season in `.env` as `SEASON` and check `/status` / errors in the response. API-Football returns errors inside `response.errors`, even with HTTP 200 — always check it.
- Supported leagues (ids): Premier League 39, La Liga 140, Serie A 135, Bundesliga 78, Ligue 1 61, Champions League 2.

## Design: "Stadium Night" dark theme

Defined in `client/src/index.css`:

```css
@theme {
  --color-pitch: #10b981; /* main green */
  --color-live: #ef4444; /* LIVE badge, goals only */
  --color-surface: #0f172a; /* cards */
  --color-base: #020617; /* background */
}
```

- Logo text "ပွဲချိန်" with subtitle "Live Football Scores & Stats".
- Fonts: Inter for text, a monospace font for scores, Noto Sans Myanmar for Burmese text.
- Red is used ONLY for live/goal things. LIVE badge uses `animate-pulse`.
- Show team logos from the API.
- Mobile-first and responsive. Add loading skeletons and friendly empty/error states.
- Light/dark toggle in the last phase.

## Coding rules

- TypeScript strict mode. No `any` unless there is no other way (explain why).
- Small, readable components. One component per file.
- Handle loading and error states on every page.
- Do not install extra libraries without telling me why.
- Never delete or overwrite my existing code without asking first.

## How we work

- Work **one phase at a time**. At the end of each phase, STOP and tell me (in Burmese):
  1. What you built
  2. Which files changed
  3. How to run and test it
  4. What I should learn from this phase
- Wait for me to say "next" before starting the next phase.
- Suggest a git commit message at the end of each phase.
- **Never run `git commit` or `git push`** (and never create commits or pushes in any other way). I commit and push myself. At the end of each phase, only give me the suggested commit message.

## Phases

1. **Setup check** — client + server running, proxy `/api` → `localhost:5001`, `/api/health` and `/api/status` working.
2. **API service + MongoDB cache** — `apiFootball.ts`, `CacheEntry` model, request logging.
3. **Home page** — today's fixtures grouped by league, live matches at the top, date picker (yesterday/today/tomorrow).
4. **League page** — standings table + top scorers, league switcher.
5. **Match detail page** — score, events timeline (goals, cards, subs), lineups, statistics bars.
6. **Team page** — team info, recent results, next fixtures.
7. **Auth** — register, login, logout, protected routes.
8. **Favorites + Dashboard** — follow teams, personal dashboard of followed teams' matches.
9. **Polish** — light/dark toggle, SEO title/meta, 404 page, accessibility check.
10. **Deploy** — Vercel + Render + MongoDB Atlas, environment variables, and a great README with screenshots.
