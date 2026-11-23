import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { COOKIE_NAME, cookieOptions, setAuthCookie } from "../middleware/auth.js";
import { User } from "../models/User.js";

const BCRYPT_COST = 12; // how slow hashing is on purpose; slow = hard to brute-force

const registerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(50, "Name is too long"),
  email: z.string().trim().toLowerCase().email("Enter a valid email").max(254),
  // bcrypt only uses the first 72 bytes, so longer passwords are not allowed.
  password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password is too long"),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required").max(72),
});

// Used when the email does not exist, so a login attempt takes the same time either way
// (otherwise attackers could find out which emails are registered by timing the response).
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", BCRYPT_COST);

const publicUser = (u: { _id: unknown; name: string; email: string }) => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
});

function sendValidationError(res: Response, error: z.ZodError): void {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fields[key] ??= issue.message;
  }
  res.status(400).json({ error: Object.values(fields)[0] ?? "Invalid input", fields });
}

const isDuplicateKeyError = (err: unknown): boolean =>
  typeof err === "object" && err !== null && "code" in err && (err as { code: unknown }).code === 11000;

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);
  const { name, email, password } = parsed.data;

  try {
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    const user = await User.create({ name, email, passwordHash });
    setAuthCookie(res, String(user._id));
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      res.status(409).json({ error: "An account with this email already exists", fields: { email: "Already registered" } });
      return;
    }
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);
  const { email, password } = parsed.data;

  try {
    const user = await User.findOne({ email });
    const ok = await bcrypt.compare(password, user?.passwordHash ?? DUMMY_HASH);
    if (!user || !ok) {
      // Same message for "no such email" and "wrong password" on purpose.
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }
    setAuthCookie(res, String(user._id));
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

export function logout(_req: Request, res: Response): void {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  res.json({ ok: true });
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      // The account was deleted but the cookie is still valid: clean it up.
      res.clearCookie(COOKIE_NAME, cookieOptions);
      res.status(401).json({ error: "Not logged in" });
      return;
    }
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}
