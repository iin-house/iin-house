import { describe, it, expect, vi } from 'vitest';
import { DRMService } from '@/lib/drm';

describe('DRMService', () => {
  it('returns a dev license in dev mode', async () => {
    const svc = new DRMService('dev');
    const res = await svc.requestLicense('content-1', 'user-1', 'widevine');
    expect(res.token).toBe('dev-content-1-user-1');
    expect(res.expiry).toBeTruthy();
  });

  it('throws on gumlet failure', async () => {
    const orig = globalThis.fetch;
    (globalThis as any).fetch = vi.fn(async () => new Response(null, { status: 500 }));
    const svc = new DRMService('gumlet');
    await expect(svc.requestLicense('c', 'u', 'widevine')).rejects.toThrow('DRM license failed');
    (globalThis as any).fetch = orig;
  });
});
