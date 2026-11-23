import type { NextFunction, Request, Response } from "express";

// Express recognises an error handler by its 4 parameters.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  const message = err instanceof Error ? err.message : "Unknown error";
  console.error("[error]", message);
  res.status(500).json({ error: message });
}
