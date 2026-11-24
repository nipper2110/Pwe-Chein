import type { CookieOptions, NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import { sendError } from "../utils/httpError.js";

export const COOKIE_NAME = "pwechein_token";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const isProd = config.NODE_ENV === "production";

// httpOnly: JavaScript in the browser can never read the token (protects against XSS theft).
// In production the client (Vercel) and server (Render) are on different sites, so the cookie
// needs sameSite "none" + secure (HTTPS only). In development "lax" is enough.
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};

export function signToken(userId: string): string {
  return jwt.sign({}, config.JWT_SECRET, { subject: userId, expiresIn: "7d", algorithm: "HS256" });
}

export function setAuthCookie(res: Response, userId: string): void {
  res.cookie(COOKIE_NAME, signToken(userId), { ...cookieOptions, maxAge: WEEK_MS });
}

declare global {
  // Adds `req.userId` to Express's Request type.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

/** Middleware: lets the request through only if it carries a valid login cookie. */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const token: unknown = req.cookies?.[COOKIE_NAME];
  if (typeof token !== "string") {
    sendError(res, 401, "NOT_LOGGED_IN", "Not logged in");
    return;
  }
  try {
    const payload = jwt.verify(token, config.JWT_SECRET, { algorithms: ["HS256"] });
    if (typeof payload === "string" || typeof payload.sub !== "string") throw new Error("bad payload");
    req.userId = payload.sub;
    next();
  } catch {
    sendError(res, 401, "SESSION_EXPIRED", "Session expired. Please log in again.");
  }
}
