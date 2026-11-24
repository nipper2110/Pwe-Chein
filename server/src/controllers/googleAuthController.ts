import type { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";
import { setAuthCookie } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { type GoogleProfile, verifyGoogleIdToken } from "../services/googleAuth.js";
import { sendError } from "../utils/httpError.js";
import { LANGUAGES } from "../utils/languages.js";
import { config } from "../config.js";
import { publicUser } from "./authController.js";

const bodySchema = z.object({
  credential: z.string().min(20).max(4096), // the Google ID token (a long JWT string)
  language: z.enum(LANGUAGES).optional(), // the language the visitor is using; saved if this creates a new account
});

const isDuplicateKeyError = (err: unknown): boolean =>
  typeof err === "object" && err !== null && "code" in err && (err as { code: unknown }).code === 11000;

type Verifier = (idToken: string) => Promise<GoogleProfile>;

/**
 * POST /api/auth/google  { credential, language? }
 * The verifier is passed in so tests can use a fake one; the app uses the real Google check.
 *
 * Who is this?
 *  1. Someone already signed in with this Google account (found by googleId)  -> log them in.
 *  2. Else an account with the same email exists:
 *       - only if GOOGLE says the email is verified, link the Google account to it;
 *       - if that account is already linked to a DIFFERENT Google account, refuse.
 *  3. Else create a new account (only for a Google-verified email).
 * An unverified email is never linked and never used to create an account: anyone can claim an address
 * they do not own on Google, and trusting it would let them take over (or squat) that address here.
 */
export function createGoogleLogin(verify: Verifier, isEnabled: () => boolean): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!isEnabled()) {
      sendError(res, 503, "GOOGLE_NOT_CONFIGURED", "Google sign-in is not set up on this server");
      return;
    }
    const body = bodySchema.safeParse(req.body);
    if (!body.success) {
      sendError(res, 400, "VALIDATION", "A Google credential is required");
      return;
    }

    let profile: GoogleProfile;
    try {
      profile = await verify(body.data.credential);
    } catch (err) {
      console.error("[google] token rejected:", err instanceof Error ? err.message : err);
      sendError(res, 401, "INVALID_GOOGLE_TOKEN", "Google sign-in failed. Please try again");
      return;
    }

    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        // 1. Already known by Google id
        let user = await User.findOne({ googleId: profile.googleId });
        let created = false;

        if (!user) {
          if (!profile.emailVerified) {
            sendError(res, 409, "GOOGLE_EMAIL_UNVERIFIED", "Google has not verified this email address");
            return;
          }
          // 2. Same email already registered (with a password, or an older Google link)
          user = await User.findOne({ email: profile.email });
          if (user) {
            if (user.googleId && user.googleId !== profile.googleId) {
              sendError(res, 409, "GOOGLE_ACCOUNT_CONFLICT", "This email is already linked to a different Google account");
              return;
            }
            user.googleId = profile.googleId; // link. The password (if any) keeps working
            await user.save();
          } else {
            // 3. Brand new account
            try {
              user = await User.create({
                name: (profile.name ?? profile.email.split("@")[0]).slice(0, 50),
                email: profile.email,
                googleId: profile.googleId,
                ...(body.data.language ? { language: body.data.language } : {}),
              });
              created = true;
            } catch (err) {
              if (isDuplicateKeyError(err) && attempt === 0) continue; // someone created it a moment ago: look again
              throw err;
            }
          }
        }

        setAuthCookie(res, String(user._id));
        res.status(created ? 201 : 200).json({ user: publicUser(user) });
        return;
      }
    } catch (err) {
      next(err);
    }
  };
}

export const googleLogin = createGoogleLogin(verifyGoogleIdToken, () => config.googleEnabled);
