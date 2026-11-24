import type { NextFunction, Request, Response } from "express";

/**
 * Marks responses as "never store". Used for anything that depends on WHO is asking (login state, favourites).
 * Vercel sits in front of the API now, and a shared cache must never keep one user's answer and give it to another.
 */
export function noStore(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader("Cache-Control", "no-store");
  next();
}
