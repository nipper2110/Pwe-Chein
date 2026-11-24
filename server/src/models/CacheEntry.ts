import { Schema, model } from "mongoose";

export interface ICacheEntry {
  key: string;
  data: unknown;
  /**
   * When MongoDB deletes the entry (the TTL index below). This is LATER than `freshUntil`: expired entries are kept
   * for a while so we can still show them ("stale") when API-Football is unavailable.
   */
  expiresAt: Date;
  /** Until when the data counts as fresh. Missing on old entries: for those, `expiresAt` was also the fresh time. */
  freshUntil?: Date;
}

const cacheEntrySchema = new Schema<ICacheEntry>({
  key: { type: String, required: true, unique: true },
  // Mixed = any JSON shape; API-Football responses differ per endpoint.
  data: { type: Schema.Types.Mixed, required: true },
  freshUntil: { type: Date },
  // TTL index: MongoDB deletes the document automatically once expiresAt has passed.
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
});

export const CacheEntry = model<ICacheEntry>("CacheEntry", cacheEntrySchema);
