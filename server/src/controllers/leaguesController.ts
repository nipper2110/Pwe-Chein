import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { sendError } from "../utils/httpError.js";
import { SUPPORTED_LEAGUES, getStandings, getTopScorers } from "../services/apiFootball.js";

// Only our 6 leagues are allowed, so nobody can make us spend requests on other leagues.
const paramsSchema = z.object({
  id: z.coerce.number().refine((id) => id in SUPPORTED_LEAGUES, "Unsupported league id"),
});

function parseId(req: Request, res: Response): number | null {
  const parsed = paramsSchema.safeParse(req.params);
  if (!parsed.success) {
    sendError(res, 400, "UNSUPPORTED_LEAGUE", parsed.error.issues[0]?.message ?? "Invalid league id");
    return null;
  }
  return parsed.data.id;
}

export async function standings(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id = parseId(req, res);
  if (id === null) return;
  try {
    res.json(await getStandings(id));
  } catch (err) {
    next(err);
  }
}

export async function topScorers(req: Request, res: Response, next: NextFunction): Promise<void> {
  const id = parseId(req, res);
  if (id === null) return;
  try {
    res.json(await getTopScorers(id));
  } catch (err) {
    next(err);
  }
}
