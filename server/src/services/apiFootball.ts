import { config } from "../config.js";
import { CacheEntry } from "../models/CacheEntry.js";

const BASE_URL = "https://v3.football.api-sports.io";

// Cache lifetimes in seconds (from CLAUDE.md).
export const TTL = {
  STATIC: 24 * 60 * 60, // leagues, teams, players
  STANDINGS: 6 * 60 * 60, // standings, top scorers
  FIXTURES: 60 * 60, // fixtures that are not live
  LIVE: 60, // live matches
  FINISHED_MATCH: 7 * 24 * 60 * 60, // lineups, events, statistics of finished matches
} as const;

export interface ApiStatus {
  plan: string;
  requestsToday: number;
  requestsLimit: number;
  requestsRemaining: number;
}

export interface UsageStats {
  realApiCalls: number; // calls that used quota since the server started
  cacheHits: number;
  calls: { endpoint: string; at: string }[]; // last 20 real calls
}

const usage: UsageStats = { realApiCalls: 0, cacheHits: 0, calls: [] };

export function getUsageStats(): UsageStats {
  return usage;
}

interface ApiEnvelope<T> {
  errors: unknown;
  response: T;
}

// API-Football can return errors inside the body even with HTTP 200.
function hasApiErrors(errors: unknown): boolean {
  if (Array.isArray(errors)) return errors.length > 0;
  if (errors && typeof errors === "object") return Object.keys(errors).length > 0;
  return false;
}

async function callApi<T>(endpoint: string, query: string): Promise<ApiEnvelope<T>> {
  if (!config.API_FOOTBALL_KEY) {
    throw new Error("API_FOOTBALL_KEY is missing in server/.env");
  }
  const res = await fetch(`${BASE_URL}${endpoint}${query}`, {
    headers: { "x-apisports-key": config.API_FOOTBALL_KEY },
  });
  if (!res.ok) throw new Error(`API-Football ${endpoint} responded with HTTP ${res.status}`);

  const body = (await res.json()) as ApiEnvelope<T>;
  if (hasApiErrors(body.errors)) {
    throw new Error(`API-Football error on ${endpoint}: ${JSON.stringify(body.errors)}`);
  }
  return body;
}

// If two users ask for the same data at once, share one request instead of wasting two.
const inFlight = new Map<string, Promise<unknown>>();

/**
 * Cache-first fetch. Checks MongoDB; only calls API-Football when there is no fresh entry.
 * Errors are never cached.
 */
export async function cachedFetch<T>(
  endpoint: string,
  params: Record<string, string | number>,
  ttlSeconds: number,
): Promise<T> {
  const query = new URLSearchParams(
    Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, String(v)]),
  ).toString();
  const key = `${endpoint}?${query}`;

  const cached = await CacheEntry.findOne({ key, expiresAt: { $gt: new Date() } }).lean();
  if (cached) {
    usage.cacheHits++;
    console.log(`[cache] HIT  ${key}`);
    return cached.data as T;
  }

  const pending = inFlight.get(key);
  if (pending) return pending as Promise<T>;

  const request = (async () => {
    usage.realApiCalls++;
    usage.calls = [{ endpoint: key, at: new Date().toISOString() }, ...usage.calls].slice(0, 20);
    console.log(`[api-football] REAL CALL #${usage.realApiCalls} GET ${key} (uses 1 quota)`);

    const body = await callApi<T>(endpoint, query ? `?${query}` : "");
    await CacheEntry.updateOne(
      { key },
      { key, data: body.response, expiresAt: new Date(Date.now() + ttlSeconds * 1000) },
      { upsert: true },
    );
    return body.response;
  })().finally(() => inFlight.delete(key));

  inFlight.set(key, request);
  return request;
}

/** Calls /status. This endpoint does NOT use daily quota, so it is never cached. */
export async function getApiStatus(): Promise<ApiStatus> {
  console.log("[api-football] GET /status (free, no quota)");
  const body = await callApi<{
    subscription?: { plan?: string };
    requests?: { current?: number; limit_day?: number };
  }>("/status", "");

  const data = Array.isArray(body.response) ? {} : body.response;
  const current = data.requests?.current ?? 0;
  const limit = data.requests?.limit_day ?? 0;
  return {
    plan: data.subscription?.plan ?? "unknown",
    requestsToday: current,
    requestsLimit: limit,
    requestsRemaining: Math.max(limit - current, 0),
  };
}

/** Example helper: one league's info (cached 24h). More helpers come in later phases. */
export function getLeague(leagueId: number): Promise<unknown[]> {
  return cachedFetch<unknown[]>("/leagues", { id: leagueId, season: config.SEASON }, TTL.STATIC);
}

// ---------- Fixtures (Phase 3) ----------

export const SUPPORTED_LEAGUES: Record<number, string> = {
  39: "Premier League",
  140: "La Liga",
  135: "Serie A",
  78: "Bundesliga",
  61: "Ligue 1",
  2: "Champions League",
};

export interface Fixture {
  fixture: {
    id: number;
    date: string;
    status: { long: string; short: string; elapsed: number | null };
  };
  league: { id: number; name: string; country: string; logo: string };
  teams: {
    home: { id: number; name: string; logo: string };
    away: { id: number; name: string; logo: string };
  };
  goals: { home: number | null; away: number | null };
}

function onlySupported(fixtures: Fixture[]): Fixture[] {
  return fixtures.filter((f) => f.league.id in SUPPORTED_LEAGUES);
}

/** All fixtures on a date (YYYY-MM-DD), cached 1 hour. Filtered to our 6 leagues. */
export async function getFixturesByDate(date: string): Promise<Fixture[]> {
  return onlySupported(await cachedFetch<Fixture[]>("/fixtures", { date }, TTL.FIXTURES));
}

/** Matches being played right now in our 6 leagues, cached only 60 seconds. */
export async function getLiveFixtures(): Promise<Fixture[]> {
  const live = Object.keys(SUPPORTED_LEAGUES).join("-");
  return cachedFetch<Fixture[]>("/fixtures", { live }, TTL.LIVE);
}
