import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { getMatch } from "../services/apiFootball.js";

const paramsSchema = z.object({ id: z.coerce.number().int().positive() });

export async function matchById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsed = paramsSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid match id" });
    return;
  }
  try {
    const match = await getMatch(parsed.data.id);
    if (!match) {
      res.status(404).json({ error: "Match not found" });
      return;
    }
    res.json(match);
  } catch (err) {
    next(err);
  }
}
