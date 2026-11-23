import mongoose from "mongoose";
import { config } from "./config.js";

export async function connectDb(): Promise<void> {
  await mongoose.connect(config.MONGODB_URI);
  console.log("[db] connected to MongoDB");
}
