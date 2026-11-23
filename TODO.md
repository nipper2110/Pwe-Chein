# TODO

## Phase 9 - Polish

- [ ] **Rate limiting** on the Express API (for example `express-rate-limit`).
  - Every uncached request to `/api/matches/:id`, and every new `date` + `timezone` combination for `/api/fixtures`, costs 1 of our 100 daily API-Football requests.
  - Without limits, one visitor looping over match ids could use up the whole daily quota.
  - Ideas: a per-IP limit on all `/api` routes, with a stricter one on `/api/matches/:id`. Return `429 Too Many Requests` with a friendly message, and show it in the UI's error state.
  - **Login brute-force protection** (added in Phase 7): `POST /api/auth/login` and `/api/auth/register` need a much stricter limit, for example 5 failed logins per 15 minutes per IP and email. bcrypt makes each guess slow, but nothing stops unlimited guesses yet.
