import "dotenv/config";
import { z } from "zod";

// Validate environment variables once at startup.
const envSchema = z.object({
  PORT: z.coerce.number().default(5001),
  API_FOOTBALL_KEY: z.string().default(""),
  SEASON: z.coerce.number().default(2024),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is missing in server/.env"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters (see .env.example)"),
  NODE_ENV: z.string().default("development"),
  // The OAuth client ID from Google Cloud Console. Empty = Google sign-in is switched off (nothing crashes).
  GOOGLE_CLIENT_ID: z.string().trim().default(""),
  // How many proxies sit between the internet and Express. See index.ts. Production default: 2.
  // An empty value (e.g. a blank line copied from .env.example) counts as "not set", not as 0.
  TRUST_PROXY_HOPS: z.preprocess((v) => (v === "" ? undefined : v), z.coerce.number().int().min(0).max(5).optional()),
  // Turns on GET /api/_ip, a temporary helper to check what IP Express sees after deploying.
  DEBUG_IP_ENDPOINT: z
    .string()
    .default("false")
    .transform((v) => v.toLowerCase() === "true"),
});

const parsed = envSchema.parse(process.env);

export const config = {
  ...parsed,
  /**
   * Proxies in front of Express. In production the chain is:
   *   browser -> Vercel (rewrite of /api/*) -> Render's load balancer -> Express
   * Vercel puts the visitor's IP in X-Forwarded-For, and Render's load balancer adds the address it
   * saw (Vercel's) on the right. So Express must trust 2 hops to read the visitor's IP.
   * Locally there is no proxy, so 0 (never trust X-Forwarded-For, which anyone can fake).
   */
  googleEnabled: parsed.GOOGLE_CLIENT_ID !== "",
  trustProxyHops: parsed.TRUST_PROXY_HOPS ?? (parsed.NODE_ENV === "production" ? 2 : 0),
};
