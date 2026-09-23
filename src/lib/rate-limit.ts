/**
 * Rate limiting via Upstash Redis REST API
 *
 * Usage:
 *   const result = await rateLimit(`user:${userId}:create-post`, 10, "1 m");
 *   if (!result.success) return { error: `Too many requests. Try again in ${result.retryAfter}s.` };
 */

type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
  retryAfter?: number;
};

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

function isConfigured(): boolean {
  return !!(UPSTASH_URL && UPSTASH_TOKEN);
}

async function redisEval(script: string, keys: string[], args: (string | number)[]): Promise<any> {
  if (!isConfigured()) return null;

  try {
    const response = await fetch(`${UPSTASH_URL}/eval`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${UPSTASH_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ script, keys, args }),
    });

    if (!response.ok) return null;
    const json = await response.json();
    return json.result;
  } catch {
    return null;
  }
}

async function redisGet(key: string): Promise<string | null> {
  if (!isConfigured()) return null;
  try {
    const res = await fetch(`${UPSTASH_URL}/get/${encodeURIComponent(key)}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.result;
  } catch {
    return null;
  }
}

async function redisSet(key: string, value: string, ttlSeconds: number): Promise<void> {
  if (!isConfigured()) return;
  try {
    await fetch(`${UPSTASH_URL}/set/${encodeURIComponent(key)}/${encodeURIComponent(value)}/EX/${ttlSeconds}`, {
      headers: { Authorization: `Bearer ${UPSTASH_TOKEN}` },
    });
  } catch {
    // Silently fail — rate limiting degrades gracefully
  }
}

/**
 * Rate limit a key with a sliding window
 */
export async function rateLimit(key: string, limit: number, windowSeconds: number): Promise<RateLimitResult> {
  if (!isConfigured()) {
    // Rate limiting disabled — allow all requests
    return { success: true, remaining: limit, resetAt: Date.now() + windowSeconds * 1000 };
  }

  const now = Math.floor(Date.now() / 1000);

  // Lua script: sliding window rate limit
  const script = `
    local key = KEYS[1]
    local now = tonumber(ARGV[1])
    local window = tonumber(ARGV[2])
    local limit = tonumber(ARGV[3])

    local bucket = redis.call('HMGET', key, 'hits', 'window_start')
    local hits = tonumber(bucket[1]) or 0
    local window_start = tonumber(bucket[2]) or 0

    -- Reset window if expired
    if now - window_start >= window then
      hits = 0
      window_start = now
    end

    -- Increment
    hits = hits + 1
    redis.call('HMSET', key, 'hits', hits, 'window_start', window_start)
    redis.call('EXPIRE', key, window)

    local remaining = math.max(0, limit - hits)
    local reset_at = window_start + window

    if hits > limit then
      return {0, remaining, reset_at}
    end

    return {1, remaining, reset_at}
  `;

  const result = await redisEval(script, [key], [now, windowSeconds, limit]);

  if (result === null) {
    // Redis unavailable — allow request (fail open)
    return { success: true, remaining: limit, resetAt: Date.now() + windowSeconds * 1000 };
  }

  const [allowed, remaining, resetAt] = result;
  const success = allowed === 1;

  return {
    success,
    remaining,
    resetAt: resetAt * 1000,
    retryAfter: !success ? Math.max(1, resetAt - now) : undefined,
  };
}

// ── Predefined limiters ─────────────────────────────────────

export async function limitAuthAttempts(identifier: string) {
  return rateLimit(`auth:${identifier}`, 5, 300); // 5 attempts per 5 min
}

export async function limitPasswordReset(identifier: string) {
  return rateLimit(`pwdreset:${identifier}`, 3, 3600); // 3 per hour
}

export async function limitEmailVerification(identifier: string) {
  return rateLimit(`emailverify:${identifier}`, 5, 3600); // 5 per hour
}

export async function limitContentCreate(userId: string) {
  return rateLimit(`content:create:${userId}`, 30, 3600); // 30 posts per hour
}

export async function limitMessageSend(userId: string) {
  return rateLimit(`message:send:${userId}`, 60, 60); // 60 messages per minute
}

export async function limitMediaUpload(userId: string) {
  return rateLimit(`media:upload:${userId}`, 20, 3600); // 20 uploads per hour
}

export async function limitSubscriptionCreate(userId: string) {
  return rateLimit(`subscription:create:${userId}`, 10, 3600); // 10 subs per hour
}

export async function limitApi(key: string) {
  return rateLimit(`api:${key}`, 100, 60); // 100 requests per minute
}
