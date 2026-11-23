import { Schema, model } from "mongoose";

export interface ICacheEntry {
  key: string;
  data: unknown;
  expiresAt: Date;
}

const cacheEntrySchema = new Schema<ICacheEntry>({
  key: { type: String, required: true, unique: true },
  // Mixed = any JSON shape; API-Football responses differ per endpoint.
  data: { type: Schema.Types.Mixed, required: true },
  // TTL index: MongoDB deletes the document automatically once expiresAt has passed.
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export const CacheEntry = model<ICacheEntry>("CacheEntry", cacheEntrySchema);
