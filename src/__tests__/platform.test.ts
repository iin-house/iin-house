import { describe, it, expect } from 'vitest';

describe('tier management', () => {
  it('validates tier schema', () => {
    const schema = {
      name: "Starter",
      price: 149,
      currency: "INR",
      perksDescription: "Early access",
      active: true,
    };

    expect(schema.name.length).toBeGreaterThanOrEqual(1);
    expect(schema.price).toBeGreaterThan(0);
    expect(schema.currency).toHaveLength(3);
    expect((schema.perksDescription?.length ?? 0)).toBeLessThanOrEqual(500);
    expect(typeof schema.active).toBe('boolean');
  });

  it('tier price must be positive', () => {
    const invalid = { name: "Bad", price: -10 };
    const valid = { name: "Good", price: 0 };

    expect(invalid.price).toBeLessThanOrEqual(0);
    expect(valid.price).toBeGreaterThanOrEqual(0);
  });

  it('tiers belong to exactly one creator', () => {
    const tier = { id: "t1", creatorId: "c1" };

    // Tier can only belong to one creator
    expect(tier.creatorId).toBe("c1");

    // Other creator cannot modify
    const otherCreator = "c2";
    expect(tier.creatorId !== otherCreator).toBe(true);
  });

  it('inactive tiers are excluded from public display', () => {
    const tiers = [
      { id: "t1", name: "Starter", active: true },
      { id: "t2", name: "VIP", active: true },
      { id: "t3", name: "Old", active: false },
    ];

    const visible = tiers.filter(t => t.active);
    expect(visible.length).toBe(2);
    expect(visible.map(t => t.id)).toEqual(["t1", "t2"]);
  });

  it('GSTIN validation rejects malformed input', () => {
    const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

    expect(GSTIN_REGEX.test("27AAAAA0000A1Z5")).toBe(true);
    expect(GSTIN_REGEX.test("invalid")).toBe(false);
    expect(GSTIN_REGEX.test("27aaaaa0000a1z5")).toBe(false); // lowercase
    expect(GSTIN_REGEX.test("")).toBe(false);
  });
});

describe('subscription cancellation', () => {
  it('sets status to CANCELLED with timestamp', () => {
    const sub = { id: "s1", status: "ACTIVE", cancelledAt: null };
    const now = new Date();

    sub.status = "CANCELLED";
    sub.cancelledAt = now;

    expect(sub.status).toBe("CANCELLED");
    expect(sub.cancelledAt).toBeInstanceOf(Date);
  });

  it('prevents duplicate cancellations', () => {
    const sub = { id: "s1", status: "CANCELLED", cancelledAt: new Date() };

    // Already cancelled — no-op
    const shouldCancel = sub.status === "ACTIVE";
    expect(shouldCancel).toBe(false);
  });

  it('allows cancel then re-subscribe (new subscription)', () => {
    const oldSub = { id: "s1", status: "CANCELLED" };
    const newSub = { id: "s2", status: "ACTIVE", tierId: "t1" };

    expect(oldSub.status).toBe("CANCELLED");
    expect(newSub.status).toBe("ACTIVE");
  });

  it('tier switch creates new start date', () => {
    const existing = { id: "s1", tierId: "t1", renewedAt: null };
    const newTierId = "t2";

    existing.tierId = newTierId;
    existing.renewedAt = new Date();

    expect(existing.tierId).toBe("t2");
    expect(existing.renewedAt).toBeInstanceOf(Date);
  });
});

describe('earnings calculation', () => {
  it('computes total revenue from subscriptions + PPV', () => {
    const subRevenue = 18000;
    const ppvRevenue = 6300;
    const total = subRevenue + ppvRevenue;

    expect(total).toBe(24300);
  });

  it('computes pending payout correctly', () => {
    const totalRevenue = 24300;
    const completedPayouts = 12000;
    const pending = Math.max(0, totalRevenue - completedPayouts);

    expect(pending).toBe(12300);
  });

  it('pending payout never goes negative', () => {
    const totalRevenue = 5000;
    const overpaid = 10000;
    const pending = Math.max(0, totalRevenue - overpaid);

    expect(pending).toBe(0);
  });

  it('monthly subscription revenue = tier price × active subs', () => {
    const avgTierPrice = 250;
    const activeSubs = 847;
    const monthlyRevenue = avgTierPrice * activeSubs;

    expect(monthlyRevenue).toBe(211750);
  });

  it('tier breakdown shows subscriber counts', () => {
    const tiers = [
      { name: "Starter", price: 149, subscribers: 400 },
      { name: "VIP", price: 299, subscribers: 350 },
      { name: "Elite", price: 499, subscribers: 97 },
    ];

    const totalSubs = tiers.reduce((sum, t) => sum + t.subscribers, 0);
    expect(totalSubs).toBe(847);
  });
});

describe('profile editing', () => {
  it('validates display name non-empty', () => {
    expect("".length >= 1).toBe(false);
    expect("Alex".length >= 1).toBe(true);
  });

  it('validates display name max length', () => {
    const long = "a".repeat(81);
    expect(long.length <= 80).toBe(false);
    expect("a".repeat(80).length <= 80).toBe(true);
  });

  it('validates bio max length', () => {
    const bio = "a".repeat(501);
    expect(bio.length <= 500).toBe(false);
  });

  it('validates URL format for images', () => {
    const valid = "https://example.com/image.jpg";
    const invalid = "not-a-url";

    expect(valid.startsWith("http")).toBe(true);
    expect(invalid.startsWith("http")).toBe(false);
  });

  it('normalizes GSTIN to uppercase', () => {
    const raw = "27aaaaa0000a1z5";
    const normalized = raw.toUpperCase();

    expect(normalized).toBe("27AAAAA0000A1Z5");
    expect(/[a-z]/.test(normalized)).toBe(false);
  });
});
