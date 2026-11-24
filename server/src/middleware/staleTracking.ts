import { AsyncLocalStorage } from "node:async_hooks";
import type { NextFunction, Request, Response } from "express";

/**
 * Remembers, for the request being handled, whether any answer came from saved-but-expired data.
 * AsyncLocalStorage gives every request its own little box that the cache code can reach without
 * passing it through every function.
 */
const box = new AsyncLocalStorage<{ stale: boolean }>();

/** Called by the cache when it serves expired data. */
export function markStale(): void {
  const store = box.getStore();
  if (store) store.stale = true;
}

/**
 * Express middleware: when the answer used stale data, the response gets the header `X-Data-Stale: true`
 * (the body keeps its normal shape) and is marked `no-store` so nobody keeps it.
 */
export function trackStale(_req: Request, res: Response, next: NextFunction): void {
  const store = { stale: false };
  const send = res.json.bind(res);
  res.json = (body: unknown) => {
    if (store.stale) {
      res.setHeader("X-Data-Stale", "true");
      res.setHeader("Cache-Control", "no-store");
    }
    return send(body);
  };
  box.run(store, next);
}
