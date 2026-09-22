/**
 * Content protection layers:
 *  1. Watermarking (server-side on upload) — embeds a subtle invisible overlay
 *  2. Signed URLs — time-limited, token-gated access to media
 *  3. Rate limiting — blunt scraping via Upstash Redis (falls back to in-memory in dev)
 */

import sharp from "sharp";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const ttl = Number(process.env.SIGNED_URL_TTL_SECONDS || 3600);

// --- Watermarking ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function applyWatermark(buffer: Buffer): Promise<any> {
  const secret = process.env.WATERMARK_SECRET || "dev";
  const uid = crypto.createHmac("sha256", secret).update("watermark").digest("hex").slice(0, 12);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="40" opacity="0.25">
    <text x="10" y="28" font-family="monospace" font-size="14" fill="white">iinhouse:${uid}</text>
  </svg>`;

  return sharp(buffer as Buffer)
    .composite([{ input: Buffer.from(svg), top: 10, left: 10 }])
    .png()
    .toBuffer();
}

// --- Signed URLs ---

export function signMediaUrl(key: string, userId: string): string {
  const secret = process.env.WATERMARK_SECRET || "dev";
  const sig = crypto.createHmac("sha256", secret).update(`${key}:${userId}:${Date.now()}`).digest("hex");
  return `/api/media/${key}?user=${encodeURIComponent(userId)}&sig=${sig}&ts=${Date.now()}`;
}

export function verifyMediaUrl(key: string, userId: string, sig: string, ts: number): boolean {
  const secret = process.env.WATERMARK_SECRET || "dev";
  const expected = crypto.createHmac("sha256", secret).update(`${key}:${userId}:${ts}`).digest("hex");
  if (crypto.timingSafeEqual ? crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected)) : sig === expected) {
    const age = Date.now() - ts;
    return age < ttl * 1000;
  }
  return false;
}

// --- Rate limiter (Upstash Redis or in-memory fallback) ---

const LIMIT = 100;
const WINDOW = 60_000;

async function getRateLimiter() {
  try {
    const { Redis } = await import("@upstash/redis");
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || "",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    });
    if (process.env.UPSTASH_REDIS_REST_URL) return { type: "redis" as const, redis };
  } catch {
    // Redis not configured, fall through to in-memory
  }
  return null;
}

const memoryHits = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(ip: string): Promise<boolean> {
  const limiter = await getRateLimiter();

  if (limiter?.type === "redis") {
    const key = `ratelimit:${ip}`;
    const count = await limiter.redis.incr(key);
    if (count === 1) {
      await limiter.redis.expire(key, Math.floor(WINDOW / 1000));
    }
    return count <= LIMIT;
  }

  // In-memory fallback (dev only)
  const now = Date.now();
  const entry = memoryHits.get(ip);
  if (!entry || now > entry.resetAt) {
    memoryHits.set(ip, { count: 1, resetAt: now + WINDOW });
    return true;
  }
  if (entry.count >= LIMIT) return false;
  entry.count++;
  return true;
}

// --- Middleware helper ---

export function contentProtectionMiddleware(req: NextRequest, userId: string): NextResponse | null {
  // The actual rate limit check is done in the API route that uses this
  // Return null to allow the request, or a Response to block it
  return null;
}
