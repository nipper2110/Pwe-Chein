import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { getApiStatus, getUsageStats } from "../services/apiFootball.js";

export function health(_req: Request, res: Response): void {
  res.json({ ok: true, season: config.SEASON });
}

export async function status(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // `usage` counts real API calls made by THIS server since it started.
    res.json({ ...(await getApiStatus()), usage: getUsageStats() });
  } catch (err) {
    next(err);
  }
}
