/**
 * In-memory sliding-window rate limiter.
 *
 * Each key tracks an array of timestamps. On every check we drop
 * entries outside the window, then count remaining hits.
 *
 * A background cleanup runs every 60 seconds to evict stale buckets.
 */

interface Bucket {
  hits: number[];
}

const BUCKETS = new Map<string, Bucket>();
const CLEANUP_INTERVAL_MS = 60_000;

let cleanupTimer: ReturnType<typeof setInterval> | null = null;

function prune(): void {
  const now = Date.now();
  for (const entry of Array.from(BUCKETS.entries())) {
    const k = entry[0];
    const bucket = entry[1];
    const w = windowMs(k);
    bucket.hits = bucket.hits.filter((t: number) => now - t < w);
    if (bucket.hits.length === 0) BUCKETS.delete(k);
  }
}

function windowMs(key: string): number {
  const match = key.match(/:(\d+)$/);
  return match ? Number(match[1]) : 60_000;
}

function ensureBucket(key: string): Bucket {
  let bucket = BUCKETS.get(key);
  if (!bucket) {
    bucket = { hits: [] };
    BUCKETS.set(key, bucket);
  }
  return bucket;
}

if (typeof globalThis !== "undefined" && typeof (globalThis as any).window === "undefined" && !cleanupTimer) {
  cleanupTimer = setInterval(prune, CLEANUP_INTERVAL_MS);
}

/**
 * Check whether `key` has exceeded `maxRequests` calls within `windowMsArg`.
 *
 * @returns `true` when the request is allowed, `false` when rate-limited.
 */
export function checkRateLimit(key: string, maxRequests: number, windowMsArg: number): boolean {
  const bucket = ensureBucket(`${key}:${windowMsArg}`);
  const now = Date.now();

  // Drop expired hits
  bucket.hits = bucket.hits.filter((t: number) => now - t < windowMsArg);

  if (bucket.hits.length >= maxRequests) {
    return false;
  }

  bucket.hits.push(now);
  return true;
}

/**
 * Remaining requests for the current window.
 */
export function remainingRequests(key: string, maxRequests: number, windowMsArg: number): number {
  const bucket = BUCKETS.get(`${key}:${windowMsArg}`);
  if (!bucket) return maxRequests;
  const now = Date.now();
  const alive = bucket.hits.filter((t: number) => now - t < windowMsArg).length;
  return Math.max(0, maxRequests - alive);
}

/**
 * When the current window expires (ms from now).
 */
export function resetAfter(key: string, windowMsArg: number): number {
  const bucket = BUCKETS.get(`${key}:${windowMsArg}`);
  if (!bucket || bucket.hits.length === 0) return windowMsArg;
  const oldest = Math.min.apply(null, bucket.hits);
  return Math.max(0, windowMsArg - (Date.now() - oldest));
}

export function getBucketSize(): number {
  return BUCKETS.size;
}
