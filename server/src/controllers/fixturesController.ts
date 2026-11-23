import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { getFixturesByDate, getLiveFixtures } from "../services/apiFootball.js";
import { isValidTimeZone } from "../utils/timezone.js";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must look like YYYY-MM-DD"),
  // Optional so old links keep working; defaults to UTC.
  timezone: z.string().refine(isValidTimeZone, "timezone must be a valid IANA name, e.g. Asia/Yangon").default("UTC"),
});

export async function fixturesByDate(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsed = querySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid query" });
    return;
  }
  try {
    res.json(await getFixturesByDate(parsed.data.date, parsed.data.timezone));
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
