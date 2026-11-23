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
});

export const config = envSchema.parse(process.env);
