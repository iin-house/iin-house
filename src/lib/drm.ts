/**
 * DRM provider adapter (Gumlet, BuyDRM/KeyOS, etc.)
 * Keeps DRM logic isolated so the rest of the codebase doesn't care which vendor is used.
 */
export interface DRMLicenseResponse { token: string; expiry: string; }

export class DRMService {
  private provider: string;
  constructor(provider: string) { this.provider = provider; }

  async requestLicense(contentId: string, userId: string, drmScheme: string): Promise<DRMLicenseResponse> {
    switch (this.provider) {
      case "gumlet": return this.gumletLicense(contentId, userId);
      case "keyos": return this.keyosLicense(contentId, userId, drmScheme);
      default: return { token: `dev-${contentId}-${userId}`, expiry: new Date(Date.now() + 3600_000).toISOString() };
    }
  }

  async gumletLicense(contentId: string, userId: string): Promise<DRMLicenseResponse> {
    const res = await fetch(`${process.env.DRM_PROVIDER || "https://api.gumlet.com"}/v1/drm/license`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.DRM_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ content_id: contentId, user_id: userId }),
    });
    if (!res.ok) throw new Error("DRM license failed");
    return res.json();
  }

  async keyosLicense(_contentId: string, _userId: string, _drmScheme: string): Promise<DRMLicenseResponse> {
    throw new Error("BuyDRM integration pending");
  }
}

export const drm = new DRMService(process.env.DRM_PROVIDER || "dev");
