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

/**
 * GET /api/_ip (only when DEBUG_IP_ENDPOINT=true). Shows what Express believes about the caller's IP,
 * to check the "trust proxy" hop count after deploying. Turn it off again afterwards.
 */
export function whoami(req: Request, res: Response): void {
  res.json({
    ip: req.ip, // the address rate limits will use: this should be YOUR public IP
    ips: req.ips, // the addresses Express trusts, nearest proxy last
    trustProxyHops: config.trustProxyHops,
    forwardedFor: req.headers["x-forwarded-for"] ?? null, // the raw header Express received
    socketAddress: req.socket.remoteAddress ?? null, // the proxy that connected to us
  });
}
