import { describe, it, expect, vi, beforeEach } from 'vitest';
import { rateLimit, limitAuthAttempts, limitPasswordReset } from '@/lib/rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('allows all requests when Redis is not configured', async () => {
    const result = await rateLimit('test-key', 3, 60);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(3);
  });

  it('returns a resetAt timestamp in the future', async () => {
    const result = await rateLimit('test-key', 3, 60);
    expect(result.resetAt).toBeGreaterThan(Date.now());
  });

  it('accepts arbitrary keys for per-user/IP isolation', async () => {
    const r1 = await rateLimit('user-1', 3, 60);
    const r2 = await rateLimit('user-2', 3, 60);
    expect(r1.success).toBe(true);
    expect(r2.success).toBe(true);
  });
});

describe('limitAuthAttempts', () => {
  it('returns a rate-limit result', async () => {
    const result = await limitAuthAttempts('test-identifier');
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('remaining');
  });
});

describe('limitPasswordReset', () => {
  it('returns a rate-limit result', async () => {
    const result = await limitPasswordReset('test@example.com');
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('remaining');
  });
});
