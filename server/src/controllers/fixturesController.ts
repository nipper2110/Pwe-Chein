import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { getFixturesByDate, getLiveFixtures } from "../services/apiFootball.js";

const dateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must look like YYYY-MM-DD"),
});

export async function fixturesByDate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsed = dateSchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid date" });
    return;
  }
  try {
    res.json(await getFixturesByDate(parsed.data.date));
  } catch (err) {
    next(err);
  }
}

export async function liveFixtures(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await getLiveFixtures());
  } catch (err) {
    next(err);
  }
}
