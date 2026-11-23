import { config } from "../config.js";

const BASE_URL = "https://v3.football.api-sports.io";

export interface ApiStatus {
  plan: string;
  requestsToday: number;
  requestsLimit: number;
  requestsRemaining: number;
}

interface StatusResponse {
  errors: unknown;
  response: {
    subscription?: { plan?: string };
    requests?: { current?: number; limit_day?: number };
  } | unknown[];
}

// API-Football can return errors inside the body even with HTTP 200.
function hasApiErrors(errors: unknown): boolean {
  if (Array.isArray(errors)) return errors.length > 0;
  if (errors && typeof errors === "object") return Object.keys(errors).length > 0;
  return false;
}

/** Calls /status. This endpoint does NOT use daily quota. */
export async function getApiStatus(): Promise<ApiStatus> {
  if (!config.API_FOOTBALL_KEY) {
    throw new Error("API_FOOTBALL_KEY is missing in server/.env");
  }

  console.log("[api-football] GET /status (free, no quota)");
  const res = await fetch(`${BASE_URL}/status`, {
    headers: { "x-apisports-key": config.API_FOOTBALL_KEY },
  });
  if (!res.ok) throw new Error(`API-Football responded with HTTP ${res.status}`);

  const body = (await res.json()) as StatusResponse;
  if (hasApiErrors(body.errors)) {
    throw new Error(`API-Football error: ${JSON.stringify(body.errors)}`);
  }

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
