import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { sendError } from "../utils/httpError.js";
import { getTeam } from "../services/apiFootball.js";

const paramsSchema = z.object({ id: z.coerce.number().int().positive() });

export async function teamById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsed = paramsSchema.safeParse(req.params);
  if (!parsed.success) {
    sendError(res, 400, "INVALID_TEAM_ID", "Invalid team id");
    return;
  }
  try {
    const team = await getTeam(parsed.data.id);
    if (!team) {
      sendError(res, 404, "TEAM_NOT_FOUND", "Team not found");
      return;
    }
    res.json(team);
  } catch (err) {
    next(err);
  }
}
