import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { COOKIE_NAME, cookieOptions, setAuthCookie } from "../middleware/auth.js";
import { User, type IUser } from "../models/User.js";
import { sendError } from "../utils/httpError.js";
import { LANGUAGES } from "../utils/languages.js";

const BCRYPT_COST = 12; // how slow hashing is on purpose; slow = hard to brute-force

// The messages below are CODES, not sentences: the browser translates them (see client validation.* texts).
const registerSchema = z.object({
  name: z.string().trim().min(1, "name_required").max(50, "name_too_long"),
  email: z.string().trim().toLowerCase().email("invalid_email").max(254, "invalid_email"),
  // bcrypt only uses the first 72 bytes, so longer passwords are not allowed.
  password: z.string().min(8, "password_too_short").max(72, "password_too_long"),
  language: z.enum(LANGUAGES).optional(), // the language the visitor was using when they signed up
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("invalid_email"),
  password: z.string().min(1, "password_required").max(72, "password_required"),
});

const languageSchema = z.object({ language: z.enum(LANGUAGES, { message: "invalid_language" }) });

// Used when the email does not exist, so a login attempt takes the same time either way
// (otherwise attackers could find out which emails are registered by timing the response).
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", BCRYPT_COST);

const publicUser = (u: { _id: unknown } & Pick<IUser, "name" | "email" | "language">) => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  language: u.language ?? null,
});

function sendValidationError(res: Response, error: z.ZodError): void {
  const fields: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    fields[key] ??= issue.message;
  }
  sendError(res, 400, "VALIDATION", Object.values(fields)[0] ?? "Invalid input", { fields });
}

const isDuplicateKeyError = (err: unknown): boolean =>
  typeof err === "object" && err !== null && "code" in err && (err as { code: unknown }).code === 11000;

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);
  const { name, email, password, language } = parsed.data;

  try {
    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    const user = await User.create({ name, email, passwordHash, ...(language ? { language } : {}) });
    setAuthCookie(res, String(user._id));
    res.status(201).json({ user: publicUser(user) });
  } catch (err) {
    if (isDuplicateKeyError(err)) {
      sendError(res, 409, "EMAIL_TAKEN", "An account with this email already exists", { fields: { email: "email_taken" } });
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
      sendError(res, 401, "INVALID_CREDENTIALS", "Invalid email or password");
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
      sendError(res, 401, "NOT_LOGGED_IN", "Not logged in");
      return;
    }
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}

/** PUT /api/auth/language - remember the user's language so it follows them to other devices. */
export async function setLanguage(req: Request, res: Response, next: NextFunction): Promise<void> {
  const parsed = languageSchema.safeParse(req.body);
  if (!parsed.success) return sendValidationError(res, parsed.error);

  try {
    const user = await User.findByIdAndUpdate(req.userId, { language: parsed.data.language }, { new: true });
    if (!user) {
      res.clearCookie(COOKIE_NAME, cookieOptions);
      sendError(res, 401, "NOT_LOGGED_IN", "Not logged in");
      return;
    }
    res.json({ user: publicUser(user) });
  } catch (err) {
    next(err);
  }
}
