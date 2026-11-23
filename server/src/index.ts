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
// On Render there is one proxy in front of us. Without this, every visitor would share the proxy's IP
// and the rate limiter would count them all as one person. Only trusted in production, because
// otherwise anyone could fake their IP with an X-Forwarded-For header.
if (config.NODE_ENV === "production") app.set("trust proxy", 1);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
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
