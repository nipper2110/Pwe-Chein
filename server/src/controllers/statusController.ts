import type { NextFunction, Request, Response } from "express";
import { config } from "../config.js";
import { getApiStatus } from "../services/apiFootball.js";

export function health(_req: Request, res: Response): void {
  res.json({ ok: true, season: config.SEASON });
}

export async function status(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await getApiStatus());
  } catch (err) {
    next(err);
  }
}
