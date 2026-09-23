import { describe, it, expect } from 'vitest';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  tierSchema,
  contentPostSchema,
  reportSchema,
} from '@/lib/validation';

describe('registerSchema', () => {
  const validBase = {
    displayName: 'Test User',
    password: 'Str0ng!Pass123',
    role: 'SUBSCRIBER',
  };

  it('accepts valid email registration', () => {
    const result = registerSchema.safeParse({ ...validBase, email: 'test@example.com', phone: '' });
    expect(result.success).toBe(true);
  });

  it('accepts valid phone registration', () => {
    const result = registerSchema.safeParse({ ...validBase, email: '', phone: '+919876543210' });
    expect(result.success).toBe(true);
  });

  it('accepts both email and phone', () => {
    const result = registerSchema.safeParse({ ...validBase, email: 'test@example.com', phone: '+919876543210' });
    expect(result.success).toBe(true);
  });

  it('rejects when neither email nor phone provided', () => {
    const result = registerSchema.safeParse({ ...validBase, email: '', phone: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('email');
    }
  });

  it('rejects short password', () => {
    const result = registerSchema.safeParse({ ...validBase, email: 'test@example.com', password: 'short1A' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('password');
    }
  });

  it('rejects empty displayName', () => {
    const result = registerSchema.safeParse({ ...validBase, email: 'test@example.com', displayName: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid role', () => {
    const result = registerSchema.safeParse({ ...validBase, email: 'test@example.com', role: 'ADMIN' });
    expect(result.success).toBe(false);
  });
});

describe('loginSchema', () => {
  it('accepts valid email and password', () => {
    const result = loginSchema.safeParse({ identifier: 'user@test.com', password: 'Str0ng!Pass123' });
    expect(result.success).toBe(true);
  });

  it('accepts phone number as identifier', () => {
    const result = loginSchema.safeParse({ identifier: '+919876543210', password: 'Str0ng!Pass123' });
    expect(result.success).toBe(true);
  });

  it('rejects empty identifier', () => {
    const result = loginSchema.safeParse({ identifier: '', password: 'Str0ng!Pass123' });
    expect(result.success).toBe(false);
  });

  it('accepts any non-empty password (server validates strength)', () => {
    const result = loginSchema.safeParse({ identifier: 'u@t.com', password: 'x' });
    expect(result.success).toBe(true);
  });
});

describe('forgotPasswordSchema', () => {
  it('accepts valid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'user@example.com' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'not-an-email' });
    expect(result.success).toBe(false);
  });
});

describe('resetPasswordSchema', () => {
  it('accepts valid token and password', () => {
    const result = resetPasswordSchema.safeParse({ token: 'abc123', password: 'Str0ng!Pass123' });
    expect(result.success).toBe(true);
  });

  it('rejects empty token', () => {
    const result = resetPasswordSchema.safeParse({ token: '', password: 'Str0ng!Pass123' });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = resetPasswordSchema.safeParse({ token: 'abc123', password: 'short' });
    expect(result.success).toBe(false);
  });
});

describe('tierSchema', () => {
  it('accepts valid tier', () => {
    const result = tierSchema.safeParse({
      name: 'Gold',
      description: 'Premium tier',
      price: 499,
      interval: 'MONTHLY',
    });
    expect(result.success).toBe(true);
  });

  it('accepts zero price', () => {
    const result = tierSchema.safeParse({
      name: 'Free',
      description: 'No cost',
      price: 0,
      interval: 'MONTHLY',
    });
    expect(result.success).toBe(true);
  });

  it('rejects negative price', () => {
    const result = tierSchema.safeParse({
      name: 'Bad',
      description: 'Bad tier',
      price: -1,
      interval: 'MONTHLY',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing name', () => {
    const result = tierSchema.safeParse({
      name: '',
      price: 100,
      interval: 'MONTHLY',
    });
    expect(result.success).toBe(false);
  });
});

describe('contentPostSchema', () => {
  it('accepts valid public post', () => {
    const result = contentPostSchema.safeParse({
      title: 'My Post',
      body: 'Content here',
      isPPV: false,
    });
    expect(result.success).toBe(true);
  });

  it('requires ppvPrice when isPPV is true', () => {
    const result = contentPostSchema.safeParse({
      title: 'My Post',
      body: 'Content',
      isPPV: true,
      ppvPrice: undefined,
    });
    expect(result.success).toBe(false);
  });

  it('accepts PPV post with price', () => {
    const result = contentPostSchema.safeParse({
      title: 'Exclusive',
      body: 'Premium content',
      isPPV: true,
      ppvPrice: 99,
    });
    expect(result.success).toBe(true);
  });
});

describe('reportSchema', () => {
  it('accepts valid report', () => {
    const result = reportSchema.safeParse({
      targetId: 'content-1',
      reason: 'SPAM',
      description: 'This is spam content.',
    });
    expect(result.success).toBe(true);
  });

  it('requires a description', () => {
    const result = reportSchema.safeParse({
      targetId: 'content-1',
      reason: 'SPAM',
      description: '',
    });
    expect(result.success).toBe(false);
  });
});
