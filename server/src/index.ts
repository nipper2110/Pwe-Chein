import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { connectDb } from "./db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import routes from "./routes/index.js";

const app = express();

app.disable("x-powered-by"); // do not advertise "Express" to attackers
// "trust proxy" tells Express how many proxies in front of it are ours. A number N means: ignore everything
// in X-Forwarded-For except the entries our own N proxies wrote, and take the visitor's IP from there.
//  - too LOW  -> req.ip is a proxy's address, so ALL visitors share one rate-limit bucket;
//  - too HIGH -> req.ip is whatever the visitor typed into X-Forwarded-For, so they can fake their IP.
// Never use `true` (trust everything). Check the real number after deploying with GET /api/_ip (see TODO.md).
app.set("trust proxy", config.trustProxyHops);
console.log(`[proxy] trusting ${config.trustProxyHops} proxy hop(s) for the visitor's IP`);

// In production the browser talks to Vercel only (it rewrites /api/* to us), so requests are same-origin and
// CORS is not needed. Leaving it off means no other website can read our API responses from a browser.
// In development the Vite dev server proxies /api too; this just keeps direct calls from the dev origin working.
if (config.NODE_ENV !== "production") app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json({ limit: "10kb" })); // our JSON bodies are tiny; refuse huge ones
app.use(cookieParser());
app.use("/api", apiLimiter);
app.use("/api", routes);
app.use(errorHandler);

// Connect to the database first, then start accepting requests.
connectDb()
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server running on http://localhost:${config.PORT}`);
    });
  })
  .catch((err: unknown) => {
    console.error("[db] connection failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  });
