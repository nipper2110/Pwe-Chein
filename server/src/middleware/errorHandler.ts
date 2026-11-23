import type { NextFunction, Request, Response } from "express";

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
    res.status(clientStatus).json({ error: "Invalid request body" });
    return;
  }
  const message = err instanceof Error ? err.message : "Unknown error";
  console.error("[error]", message);
  res.status(500).json({ error: message });
}
