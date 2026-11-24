import type { Response } from "express";

/**
 * Stable error codes. The browser turns these into messages in the user's language,
 * so the codes must never change. The English `error` text is only for logs and debugging.
 */
export type ErrorCode =
  | "NOT_LOGGED_IN"
  | "SESSION_EXPIRED"
  | "INVALID_CREDENTIALS"
  | "EMAIL_TAKEN"
  | "VALIDATION"
  | "INVALID_MATCH_ID"
  | "INVALID_TEAM_ID"
  | "INVALID_DATE"
  | "INVALID_TIMEZONE"
  | "UNSUPPORTED_LEAGUE"
  | "MATCH_NOT_FOUND"
  | "TEAM_NOT_FOUND"
  | "FAVORITES_LIMIT"
  | "INVALID_BODY"
  | "RATE_LIMITED"
  | "UPSTREAM_ERROR"
  | "SERVER_ERROR";

/** Sends `{ error, code, ...extra }`. `extra` carries values the message needs, e.g. { max: 20 }. */
export function sendError(
  res: Response,
  status: number,
  code: ErrorCode,
  message: string,
  extra: Record<string, unknown> = {},
): void {
  res.status(status).json({ error: message, code, ...extra });
}

/** Thrown when API-Football fails or returns errors. Becomes a 502 instead of a generic 500. */
export class UpstreamError extends Error {}
