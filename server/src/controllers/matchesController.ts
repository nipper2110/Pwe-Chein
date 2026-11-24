import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { sendError } from "../utils/httpError.js";
import { getMatch } from "../services/apiFootball.js";

const paramsSchema = z.object({ id: z.coerce.number().int().positive() });

export async function matchById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsed = paramsSchema.safeParse(req.params);
  if (!parsed.success) {
    sendError(res, 400, "INVALID_MATCH_ID", "Invalid match id");
    return;
  }
  try {
    const match = await getMatch(parsed.data.id);
    if (!match) {
      sendError(res, 404, "MATCH_NOT_FOUND", "Match not found");
      return;
    }
    res.json(match);
  } catch (err) {
    next(err);
  }
}
