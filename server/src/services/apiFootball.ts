import { config } from "../config.js";
import { CacheEntry } from "../models/CacheEntry.js";
import { todayIn } from "../utils/timezone.js";

const BASE_URL = "https://v3.football.api-sports.io";

// Cache lifetimes in seconds (from CLAUDE.md).
export const TTL = {
  STATIC: 24 * 60 * 60, // leagues, teams, players
  STANDINGS: 6 * 60 * 60, // standings, top scorers
  FIXTURES: 60 * 60, // today's fixtures when nothing is live
  FIXTURES_PAST: 7 * 24 * 60 * 60, // finished days never change
  FIXTURES_FUTURE: 6 * 60 * 60, // future days only change if a match is rescheduled
  FIXTURES_TODAY_LIVE: 5 * 60, // today while a match is being played
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
  // A number, or a function that picks the TTL after looking at the fresh data.
  ttl: number | ((data: T) => number),
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
    const ttlSeconds = typeof ttl === "function" ? ttl(body.response) : ttl;
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

const LIVE_STATUSES = new Set(["1H", "HT", "2H", "ET", "BT", "P", "LIVE", "INT"]);

/**
 * How long to cache a day's fixtures, based on the date:
 * - past day: 7 days (finished, never changes)
 * - future day: 6 hours
 * - today: 5 minutes if one of our matches is live, otherwise 1 hour
 * "Today" is the current date in the user's time zone, because `date` is a date in that zone.
 */
export function fixturesTtl(date: string, fixtures: Fixture[], timezone: string, now: Date = new Date()): number {
  const today = todayIn(timezone, now);
  if (date < today) return TTL.FIXTURES_PAST;
  if (date > today) return TTL.FIXTURES_FUTURE;
  const anyLive = onlySupported(fixtures).some((f) => LIVE_STATUSES.has(f.fixture.status.short));
  return anyLive ? TTL.FIXTURES_TODAY_LIVE : TTL.FIXTURES;
}

/**
 * All fixtures on a date (YYYY-MM-DD) in the given time zone. Cache time depends on the date.
 * The time zone is part of the request params, so it is part of the cache key too:
 * "2026-11-24 in Asia/Yangon" and "2026-11-24 in UTC" are different lists of matches.
 */
export async function getFixturesByDate(date: string, timezone: string): Promise<Fixture[]> {
  const all = await cachedFetch<Fixture[]>("/fixtures", { date, timezone }, (data) => fixturesTtl(date, data, timezone));
  return onlySupported(all);
}

/** Matches being played right now in our 6 leagues, cached only 60 seconds. */
export async function getLiveFixtures(): Promise<Fixture[]> {
  const live = Object.keys(SUPPORTED_LEAGUES).join("-");
  return cachedFetch<Fixture[]>("/fixtures", { live }, TTL.LIVE);
}

// ---------- Standings & top scorers (Phase 4) ----------

export interface StandingRow {
  rank: number;
  team: { id: number; name: string; logo: string };
  points: number;
  goalsDiff: number;
  group: string;
  form: string | null;
  description: string | null;
  all: { played: number; win: number; draw: number; lose: number; goals: { for: number; against: number } };
}

export interface StandingsResult {
  league: { id: number; name: string; logo: string; season: number; standings: StandingRow[][] };
}

export interface TopScorer {
  player: { id: number; name: string; photo: string };
  statistics: {
    team: { id: number; name: string; logo: string };
    games: { appearences: number | null };
    goals: { total: number | null; assists: number | null };
  }[];
}

/** League table(s) for the configured SEASON, cached 6 hours. Some leagues have several groups. */
export async function getStandings(leagueId: number): Promise<StandingRow[][]> {
  const data = await cachedFetch<StandingsResult[]>(
    "/standings",
    { league: leagueId, season: config.SEASON },
    TTL.STANDINGS,
  );
  return data[0]?.league.standings ?? [];
}

/** Top 20 scorers for the configured SEASON, cached 6 hours. */
export function getTopScorers(leagueId: number): Promise<TopScorer[]> {
  return cachedFetch<TopScorer[]>("/players/topscorers", { league: leagueId, season: config.SEASON }, TTL.STANDINGS);
}

// ---------- Match details (Phase 5) ----------

export interface MatchEvent {
  time: { elapsed: number; extra: number | null };
  team: { id: number; name: string; logo: string };
  player: { id: number | null; name: string | null };
  // For substitutions: `player` is the player going OFF and `assist` is the player coming ON.
  assist: { id: number | null; name: string | null };
  type: string; // "Goal" | "Card" | "subst" | "Var"
  detail: string;
}

export interface LineupPlayer {
  player: { id: number; name: string; number: number | null; pos: string | null };
}

export interface Lineup {
  team: { id: number; name: string; logo: string };
  coach: { id: number | null; name: string | null };
  formation: string | null;
  startXI: LineupPlayer[];
  substitutes: LineupPlayer[];
}

export interface TeamStatistics {
  team: { id: number; name: string; logo: string };
  statistics: { type: string; value: number | string | null }[];
}

export interface MatchDetail extends Fixture {
  score: { halftime: { home: number | null; away: number | null }; fulltime: { home: number | null; away: number | null } };
  fixture: Fixture["fixture"] & { venue: { name: string | null; city: string | null }; referee: string | null };
  league: Fixture["league"] & { round: string };
  events: MatchEvent[];
  lineups: Lineup[];
  statistics: TeamStatistics[];
}

const FINISHED_STATUSES = new Set(["FT", "AET", "PEN"]);

/** Finished matches never change (7 days). Live: 60s. Anything else (not started etc.): 1 hour. */
function matchTtl(data: MatchDetail[]): number {
  const status = data[0]?.fixture.status.short;
  if (!status) return 5 * 60; // unknown id: remember "not found" only briefly
  if (FINISHED_STATUSES.has(status)) return TTL.FINISHED_MATCH;
  if (LIVE_STATUSES.has(status)) return TTL.LIVE;
  return TTL.FIXTURES;
}

/**
 * One match with its events, lineups and statistics. A single API request returns all of them.
 * Returns null if the match does not exist or is not in one of our 6 leagues.
 */
export async function getMatch(fixtureId: number): Promise<MatchDetail | null> {
  const data = await cachedFetch<MatchDetail[]>("/fixtures", { id: fixtureId }, matchTtl);
  const match = data[0];
  if (!match || !(match.league.id in SUPPORTED_LEAGUES)) return null;
  return match;
}

// ---------- Team page (Phase 6) ----------

export interface TeamInfo {
  team: { id: number; name: string; code: string | null; country: string | null; founded: number | null; logo: string };
  venue: { name: string | null; city: string | null; capacity: number | null; image: string | null };
}

export interface TeamSummary {
  league: { id: number; name: string; logo: string };
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  cleanSheets: number;
  formation: string | null; // the most used formation
  formationPlayed: number;
}

export interface TeamPage extends TeamInfo {
  season: number;
  summary: TeamSummary | null; // null if the team has no match in one of our 6 leagues
  recent: Fixture[]; // newest first
  upcoming: Fixture[]; // soonest first
}

interface TeamStatsResponse {
  league: { id: number; name: string; logo: string };
  fixtures: { played: { total: number }; wins: { total: number }; draws: { total: number }; loses: { total: number } };
  goals: { for: { total: { total: number } }; against: { total: { total: number } } };
  clean_sheet: { total: number };
  lineups: { formation: string; played: number }[];
}

/**
 * The league whose stats we summarise: the team's most played league among our 6,
 * preferring the domestic league over the Champions League (id 2).
 */
function mainLeagueId(season: Fixture[]): number | null {
  const counts = new Map<number, number>();
  for (const f of season) {
    if (f.league.id in SUPPORTED_LEAGUES) counts.set(f.league.id, (counts.get(f.league.id) ?? 0) + 1);
  }
  const domestic = [...counts].filter(([id]) => id !== 2).sort((a, b) => b[1] - a[1])[0];
  if (domestic) return domestic[0];
  return counts.has(2) ? 2 : null;
}

/** Season totals for one team in one league (1 request, cached 24h). */
async function getTeamSummary(teamId: number, leagueId: number): Promise<TeamSummary> {
  const stats = await cachedFetch<TeamStatsResponse>(
    "/teams/statistics",
    { team: teamId, league: leagueId, season: config.SEASON },
    TTL.STATIC,
  );
  const top = [...stats.lineups].sort((a, b) => b.played - a.played)[0];
  return {
    league: { id: stats.league.id, name: stats.league.name, logo: stats.league.logo },
    played: stats.fixtures.played.total,
    wins: stats.fixtures.wins.total,
    draws: stats.fixtures.draws.total,
    losses: stats.fixtures.loses.total,
    goalsFor: stats.goals.for.total.total,
    goalsAgainst: stats.goals.against.total.total,
    cleanSheets: stats.clean_sheet.total,
    formation: top?.formation ?? null,
    formationPlayed: top?.played ?? 0,
  };
}

// Competitions that are not competitive matches. The API's fixture data has no "type" field,
// so we go by name. Real examples: "Friendlies Clubs", "Premier League - Summer Series".
// The Community Shield is a real trophy match, so it is NOT excluded.
const NON_COMPETITIVE = /friendl|summer series|pre-?season|testimonial/i;

export const isCompetitive = (f: Fixture): boolean => !NON_COMPETITIVE.test(f.league.name);

/**
 * Team info + recent results + next fixtures.
 * Free plan: "last" and "next" are blocked, and only seasons 2022-2024 are allowed.
 * So we fetch the team's whole season ONCE (cached 24h) and pick recent/upcoming ourselves.
 * Returns null if the team does not exist.
 */
export async function getTeam(teamId: number): Promise<TeamPage | null> {
  const info = (await cachedFetch<TeamInfo[]>("/teams", { id: teamId }, TTL.STATIC))[0];
  if (!info) return null;

  // Friendlies and pre-season tours are removed here, after the cache, so no extra API request is needed.
  const season = (await cachedFetch<Fixture[]>("/fixtures", { team: teamId, season: config.SEASON }, TTL.STATIC)).filter(
    isCompetitive,
  );
  const byDate = (a: Fixture, b: Fixture): number => a.fixture.date.localeCompare(b.fixture.date);

  // The summary is a bonus: if it fails, the rest of the page should still load.
  const leagueId = mainLeagueId(season);
  let summary: TeamSummary | null = null;
  if (leagueId !== null) {
    try {
      summary = await getTeamSummary(teamId, leagueId);
    } catch (err) {
      console.error("[team] summary failed:", err instanceof Error ? err.message : err);
    }
  }

  return {
    ...info,
    season: config.SEASON,
    summary,
    recent: season.filter((f) => FINISHED_STATUSES.has(f.fixture.status.short)).sort(byDate).reverse().slice(0, 5),
    upcoming: season.filter((f) => ["NS", "TBD"].includes(f.fixture.status.short)).sort(byDate).slice(0, 5),
  };
}
