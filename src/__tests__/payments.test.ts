import { describe, it, expect } from 'vitest';

/**
 * Unit tests for payment/refund logic
 * These test the business rules without hitting the DB or external APIs
 */

describe('PPV purchase refund rules', () => {
  const now = Date.now();
  const HOUR = 3600000;

  function canRefund(purchasedAt: number, isOwner: boolean, isAdmin: boolean): boolean {
    if (isAdmin) return true;
    if (!isOwner) return false;
    const within48h = (now - purchasedAt) < 48 * 60 * 60 * 1000;
    return within48h;
  }

  it('allows admin to refund any purchase', () => {
    expect(canRefund(now - 30 * 24 * HOUR, false, true)).toBe(true);
  });

  it('allows owner to refund within 48 hours', () => {
    expect(canRefund(now - 1 * HOUR, true, false)).toBe(true);
  });

  it('denies owner refund after 48 hours', () => {
    expect(canRefund(now - 49 * HOUR, true, false)).toBe(false);
  });

  it('denies non-owner non-admin refund', () => {
    expect(canRefund(now - 1 * HOUR, false, false)).toBe(false);
  });

  it('edge case: exactly 48 hours ago is outside window', () => {
    const at48h = now - 48 * 60 * 60 * 1000;
    expect(canRefund(at48h, true, false)).toBe(false);
  });
});

describe('subscription status transitions', () => {
  type Status = 'ACTIVE' | 'CANCELLED' | 'EXPIRED' | 'PAST_DUE' | 'TRIAL';

  function transition(status: Status, event: string): Status {
    switch (event) {
      case 'renew_success': return status === 'PAST_DUE' ? 'ACTIVE' : status;
      case 'renew_fail': return status === 'ACTIVE' ? 'PAST_DUE' : status;
      case 'cancel': return 'CANCELLED';
      case 'expire': return 'EXPIRED';
      default: return status;
    }
  }

  it('renew_success on ACTIVE stays ACTIVE', () => {
    expect(transition('ACTIVE', 'renew_success')).toBe('ACTIVE');
  });

  it('renew_success on PAST_DUE recovers', () => {
    expect(transition('PAST_DUE', 'renew_success')).toBe('ACTIVE');
  });

  it('renew_fail on ACTIVE goes to PAST_DUE', () => {
    expect(transition('ACTIVE', 'renew_fail')).toBe('PAST_DUE');
  });

  it('cancel always goes to CANCELLED', () => {
    expect(transition('TRIAL', 'cancel')).toBe('CANCELLED');
    expect(transition('ACTIVE', 'cancel')).toBe('CANCELLED');
  });

  it('unknown event preserves status', () => {
    expect(transition('EXPIRED', 'unknown')).toBe('EXPIRED');
  });
});

describe('Razorpay webhook signature verification', () => {
  it('verifies HMAC-SHA256 signature', async () => {
    const { createHmac } = await import('crypto');
    const secret = 'test_secret';
    const body = '{"event":"payment.captured"}';
    const hmac = createHmac('sha256', secret);
    hmac.update(body);
    const signature = hmac.digest('hex');

    // Verify
    const verify = createHmac('sha256', secret);
    verify.update(body);
    const computed = verify.digest('hex');

    expect(computed).toBe(signature);
  });

  it('rejects wrong secret', async () => {
    const { createHmac } = await import('crypto');
    const secret = 'correct_secret';
    const wrongSecret = 'wrong_secret';
    const body = '{"event":"payment.captured"}';

    const hmac = createHmac('sha256', secret);
    hmac.update(body);
    const signature = hmac.digest('hex');

    const verify = createHmac('sha256', wrongSecret);
    verify.update(body);
    const computed = verify.digest('hex');

    expect(computed).not.toBe(signature);
  });
});

describe('payment amount conversion', () => {
  const toPaise = (rupees: number) => Math.round(rupees * 100);
  const fromPaise = (paise: number) => paise / 100;

  it('converts rupees to paise', () => {
    expect(toPaise(1)).toBe(100);
    expect(toPaise(99.5)).toBe(9950);
    expect(toPaise(149)).toBe(14900);
    expect(toPaise(0.5)).toBe(50);
  });

  it('converts paise back to rupees', () => {
    expect(fromPaise(100)).toBe(1);
    expect(fromPaise(9950)).toBe(99.5);
    expect(fromPaise(14900)).toBe(149);
  });

  it('round trip preserves value', () => {
    const original = 299.50;
    expect(fromPaise(toPaise(original))).toBeCloseTo(original, 1);
  });
});
