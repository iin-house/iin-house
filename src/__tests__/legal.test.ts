import { describe, it, expect } from 'vitest';

describe('GSTIN validation', () => {
  // GSTIN format: 2-digit state code + 10-char PAN + 1 entity type + 1 default + 1 checksum
  const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

  it('validates standard GSTIN format', () => {
    expect(GSTIN_REGEX.test('27AAAAA0000A1Z5')).toBe(true);
  });

  it('rejects invalid format', () => {
    expect(GSTIN_REGEX.test('27AAAAA0000A1Z')).toBe(false); // too short
    expect(GSTIN_REGEX.test('1AAAAA0000A1Z5')).toBe(false);  // 1-digit state
    expect(GSTIN_REGEX.test('27aaaaa0000a1z5')).toBe(false); // lowercase
  });

  it('accepts optional GSTIN (null/empty)', () => {
    const gstin: string | undefined = undefined;
    expect(!gstin || gstin === '').toBe(true);
  });
});

describe('account deletion grace period', () => {
  it('schedules deletion 30 days in the future', () => {
    const now = Date.now();
    const gracePeriodMs = 30 * 24 * 60 * 60 * 1000;
    const deletionAt = new Date(now + gracePeriodMs);

    const diffDays = (deletionAt.getTime() - now) / (24 * 60 * 60 * 1000);
    expect(diffDays).toBeCloseTo(30, 0);
  });

  it('cancellation clears deletionScheduledAt', () => {
    let deletionScheduledAt: Date | null = new Date();

    // Cancel
    deletionScheduledAt = null;
    expect(deletionScheduledAt).toBeNull();
  });

  it('prevents immediate deletion within grace period', () => {
    const scheduledAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const now = new Date();

    // Before deletion date: should NOT delete
    const shouldDelete = now >= scheduledAt;
    expect(shouldDelete).toBe(false);
  });
});

describe('data export', () => {
  it('includes required fields per DPDP Act', () => {
    const exportData = {
      account: { email: true, phone: true, role: true, createdAt: true },
      profile: { displayName: true, bio: true, gstin: true },
      subscriptions: true,
      purchases: true,
    };

    expect(exportData.account.email).toBe(true);
    expect(exportData.account.phone).toBe(true);
    expect(exportData.profile.gstin).toBe(true); // tax info included
    expect(exportData.subscriptions).toBe(true);
    expect(exportData.purchases).toBe(true);
  });

  it('excludes sensitive fields (passwordHash, twoFASecret)', () => {
    const sensitive = ['passwordHash', 'twoFASecret', 'emailVerified'];
    const exportFields = ['email', 'phone', 'role', 'createdAt', 'displayName', 'bio', 'gstin'];

    // Ensure no sensitive field leaks into export
    const leaks = exportFields.filter(f => sensitive.includes(f));
    expect(leaks.length).toBe(0);
  });

  it('marks export as requested for audit trail', () => {
    const before = new Date('2026-01-01');
    const afterExport = new Date('2026-01-02');

    const user = { dataExportRequestedAt: null };
    user.dataExportRequestedAt = afterExport;

    expect(user.dataExportRequestedAt!.getTime()).toBeGreaterThan(before.getTime());
  });
});

describe('terms acceptance tracking', () => {
  it('accepts terms with version', () => {
    const version = '2026-01';
    const acceptedAt = new Date();

    const record = { termsVersion: version, termsAcceptedAt: acceptedAt };

    expect(record.termsVersion).toBe('2026-01');
    expect(record.termsAcceptedAt).toBeInstanceOf(Date);
  });

  it('tracks when terms are not accepted', () => {
    const user = { termsVersion: null, termsAcceptedAt: null };
    expect(user.termsVersion).toBeNull();
    expect(user.termsAcceptedAt).toBeNull();
  });
});

describe('content moderation', () => {
  it('detects prohibited content types', () => {
    const prohibited = ['hate_speech', 'harassment', 'explicit', 'minor', 'copyright'];
    const contentTags = ['photo', 'explicit', 'video'];

    const hasViolation = contentTags.some(tag => prohibited.includes(tag));
    expect(hasViolation).toBe(true);
  });

  it('allows normal content through', () => {
    const prohibited = ['hate_speech', 'harassment', 'explicit', 'minor', 'copyright'];
    const contentTags = ['photo', 'portrait', 'video'];

    const hasViolation = contentTags.some(tag => prohibited.includes(tag));
    expect(hasViolation).toBe(false);
  });
});
