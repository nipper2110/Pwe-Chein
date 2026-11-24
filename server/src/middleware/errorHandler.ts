import type { NextFunction, Request, Response } from "express";
import { UpstreamError, sendError } from "../utils/httpError.js";

// Errors thrown by Express's body parser (e.g. broken JSON) carry a 4xx `status`.
function clientErrorStatus(err: unknown): number | null {
  if (typeof err === "object" && err !== null && "status" in err) {
    const status = (err as { status: unknown }).status;
    if (typeof status === "number" && status >= 400 && status < 500) return status;
  }
  return null;
}

// Express recognises an error handler by its 4 parameters.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const clientStatus = clientErrorStatus(err);
  if (clientStatus) {
    // The caller's mistake: give a short message, not the parser's internal one.
    sendError(res, clientStatus, "INVALID_BODY", "Invalid request body");
    return;
  }
  // The real reason goes to our logs only. Browsers get a generic message, so internal details
  // (database or upstream API errors) are never leaked.
  console.error("[error]", err instanceof Error ? err.message : "Unknown error");
  if (err instanceof UpstreamError) {
    sendError(res, 502, "UPSTREAM_ERROR", "Could not load data from the football data provider");
    return;
  }
  sendError(res, 500, "SERVER_ERROR", "Server error");
}
