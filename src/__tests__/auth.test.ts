import { describe, it, expect } from 'vitest';
import { hashPassword, isStrongPassword } from '@/lib/auth';

describe('hashPassword', () => {
  it('returns a non-empty string', async () => {
    const result = await hashPassword('TestPass123');
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(20);
  });

  it('returns different hashes for same input', async () => {
    const a = await hashPassword('TestPass123');
    const b = await hashPassword('TestPass123');
    expect(a).not.toBe(b);
  });
});

describe('isStrongPassword', () => {
  const valid = 'Str0ng!Pass';
  const cases: { pw: string; expected: boolean; reason: string }[] = [
    { pw: '', expected: false, reason: 'empty string' },
    { pw: 'short1A', expected: false, reason: 'too short (7 chars)' },
    { pw: 'alllowercase1', expected: false, reason: 'no uppercase' },
    { pw: 'ALLUPPERCASE1', expected: false, reason: 'no lowercase' },
    { pw: 'NoNumbersHere', expected: false, reason: 'no digits' },
    { pw: 'Str0ng!Pass', expected: true, reason: 'valid' },
    { pw: 'Abcdefghi1', expected: true, reason: 'minimum length with mixed case and digit' },
  ];

  for (const c of cases) {
    it(`returns ${c.expected} for "${c.pw}" (${c.reason})`, () => {
      expect(isStrongPassword(c.pw)).toBe(c.expected);
    });
  }
});
