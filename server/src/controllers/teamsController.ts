import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { getTeam } from "../services/apiFootball.js";

const paramsSchema = z.object({ id: z.coerce.number().int().positive() });

export async function teamById(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsed = paramsSchema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid team id" });
    return;
  }
  try {
    const team = await getTeam(parsed.data.id);
    if (!team) {
      res.status(404).json({ error: "Team not found" });
      return;
    }
    res.json(team);
  } catch (err) {
    next(err);
  }
}
