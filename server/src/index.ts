import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { connectDb } from "./db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import routes from "./routes/index.js";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
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
