import type { Request } from "express";
import { ipKeyGenerator, rateLimit } from "express-rate-limit";

// Counters live in this server's memory: they reset when the server restarts or Render's free
// instance goes to sleep. That is fine for one instance. With several instances we would need a shared store.
const MINUTE = 60 * 1000;

interface LimiterOptions {
  windowMs: number;
  limit: number;
  /** Shown to the user, followed by how long to wait. */
  message: string;
  /** Count only failed requests (status 400+), so normal successful use is never limited. */
  onlyFailures?: boolean;
  /** Group requests by something other than the visitor's IP. */
  key?: (req: Request) => string;
}

function limiter({ windowMs, limit, message, onlyFailures = false, key }: LimiterOptions) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7", // sends RateLimit-* and Retry-After headers
    legacyHeaders: false,
    skipSuccessfulRequests: onlyFailures,
    keyGenerator: key ?? ((req) => ipKeyGenerator(req.ip ?? "unknown")),
    handler: (_req, res) => {
      const seconds = Number(res.getHeader("Retry-After") ?? Math.ceil(windowMs / 1000));
      const minutes = Math.max(1, Math.ceil(seconds / 60));
      res.status(429).json({ error: `${message} Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.` });
    },
  });
}

// "visitor + email" key for login: someone trying many passwords on ONE account is stopped quickly,
// even if they switch IP addresses slowly, and one person's typos never lock out anyone else.
const ipAndEmail = (req: Request): string => {
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase().slice(0, 254) : "";
  return `${ipKeyGenerator(req.ip ?? "unknown")}|${email}`;
};

/** Every /api route: a generous ceiling that normal browsing never reaches. */
export const apiLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 300,
  message: "Too many requests.",
});

/** Routes that can spend our 100 daily API-Football requests on data we have not cached yet. */
export const quotaLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 60,
  message: "You are loading data too fast.",
});

/** The costliest ones: any match id, team id or followed team can be a brand-new API request. */
export const strictLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 40,
  message: "You are opening too many matches and teams.",
});

/** Login: 5 wrong passwords per account per 15 minutes... */
export const loginAccountLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 5,
  message: "Too many failed logins for this account.",
  onlyFailures: true,
  key: ipAndEmail,
});

/** ...and 20 failed logins per visitor in total, so trying many different emails does not help either. */
export const loginIpLimiter = limiter({
  windowMs: 15 * MINUTE,
  limit: 20,
  message: "Too many failed logins.",
  onlyFailures: true,
});

/** Sign-up: accounts cost CPU (bcrypt) and database space. */
export const registerLimiter = limiter({
  windowMs: 60 * MINUTE,
  limit: 5,
  message: "Too many accounts created from this connection.",
});
