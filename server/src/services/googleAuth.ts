import { OAuth2Client } from "google-auth-library";
import { config } from "../config.js";

/** What we keep from a verified Google ID token. */
export interface GoogleProfile {
  googleId: string; // Google's permanent id for the person (the token's "sub")
  email: string; // lower-case
  emailVerified: boolean; // did GOOGLE confirm the person owns this address?
  name: string | null;
}

let client: OAuth2Client | null = null;

/**
 * Checks a Google ID token the browser sent us. The library does all the cryptography:
 *  - the signature, against Google's published public keys,
 *  - that the token was issued for OUR app (audience = GOOGLE_CLIENT_ID),
 *  - that it comes from Google (issuer) and has not expired.
 * It throws if anything is wrong.
 */
export async function verifyGoogleIdToken(idToken: string): Promise<GoogleProfile> {
  if (!config.googleEnabled) throw new Error("GOOGLE_CLIENT_ID is not set");
  client ??= new OAuth2Client(config.GOOGLE_CLIENT_ID);

  const ticket = await client.verifyIdToken({ idToken, audience: config.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email) throw new Error("the token has no sub or email");

  return {
    googleId: payload.sub,
    email: payload.email.trim().toLowerCase(),
    emailVerified: payload.email_verified === true,
    name: payload.name?.trim() || null,
  };
}
