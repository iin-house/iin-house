import { describe, it, expect } from 'vitest';
import { cleanupExpiredResets } from '@/lib/cleanup';

describe('cleanupExpiredResets', () => {
  it('returns a number', async () => {
    const result = await cleanupExpiredResets();
    expect(typeof result).toBe('number');
  });
});
