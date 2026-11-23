import "dotenv/config";
import { z } from "zod";

// Validate environment variables once at startup.
const envSchema = z.object({
  PORT: z.coerce.number().default(5001),
  API_FOOTBALL_KEY: z.string().default(""),
  SEASON: z.coerce.number().default(2024),
});

export const config = envSchema.parse(process.env);
