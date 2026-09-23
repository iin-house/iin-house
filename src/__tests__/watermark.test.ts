import { describe, it, expect } from 'vitest';
import { signMediaUrl, verifyMediaUrl } from '@/lib/watermark';

describe('signMediaUrl', () => {
  it('returns a signed URL string', () => {
    const url = signMediaUrl('my-key', 'user-1');
    expect(url).toBeTruthy();
    expect(typeof url).toBe('string');
    expect(url).toContain('/api/media/my-key');
    expect(url).toContain('user=user-1');
    expect(url).toContain('sig=');
    expect(url).toContain('ts=');
  });

  it('includes URL-encoded user ID', () => {
    const url = signMediaUrl('key', 'user@email.com');
    expect(url).toContain('user=user%40email.com');
  });
});

describe('verifyMediaUrl', () => {
  it('returns true for a valid recently-signed URL', () => {
    const url = signMediaUrl('my-key', 'user-1');
    const params = new URL(url, 'http://localhost').searchParams;
    const sig = params.get('sig')!;
    const ts = parseInt(params.get('ts')!, 10);

    expect(verifyMediaUrl('my-key', 'user-1', sig, ts)).toBe(true);
  });

  it('returns false for a tampered signature', () => {
    const ts = Date.now();
    const badSig = 'a'.repeat(64); // must match HMAC hex length
    expect(verifyMediaUrl('my-key', 'user-1', badSig, ts)).toBe(false);
  });

  it('returns false for wrong user', () => {
    const url = signMediaUrl('my-key', 'user-1');
    const params = new URL(url, 'http://localhost').searchParams;
    const sig = params.get('sig')!;
    const ts = parseInt(params.get('ts')!, 10);

    expect(verifyMediaUrl('my-key', 'other-user', sig, ts)).toBe(false);
  });

  it('returns false for expired timestamps', () => {
    const oldTs = Date.now() - 7200_000;
    const fakeSig = 'a'.repeat(64); // SHA-256 hex is 64 chars
    expect(verifyMediaUrl('my-key', 'user-1', fakeSig, oldTs)).toBe(false);
  });
});
