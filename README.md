# iin house — Creator Subscription Platform

A full-stack creator subscription platform built per the InHouse spec.

## Quickstart

```bash
npm install
# Edit .env with your DATABASE_URL and NEXTAUTH_SECRET
npm run db:push
npm run db:seed
npm run dev
```

App: http://localhost:3000

### Demo accounts (after seed)
- **Admin**: `admin@iinhouse.com` / `admin123`
- **Creator**: `creator@iinhouse.com` / `creator123`
- **Subscriber**: `sub@iinhouse.com` / `sub123`

## Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js API routes + Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js (credentials, JWT)
- **Media**: S3-compatible object storage + signed URLs
- **Content protection**: Server-side watermarking + DRM provider adapter (Gumlet/BuyDRM ready)
- **Charts**: recharts
- **Validation**: Zod

## Features (mapped to spec)

### Creator side
- Profile & public page with bio, tiers, preview content
- Content upload (photo / video / audio / text)
- Subscription tier management (multi-tier, perks, currency)
- Pay-per-view content (with PPV price field)
- Direct messaging with subscribers (paid & free)
- Content scheduling
- Watermarking on all delivered media (server-side via `lib/watermark.ts`)
- Earnings dashboard (revenue, subs, churn, payout history)
- Payout requests (UPI / Bank / Crypto methods)

### Subscriber side
- Discovery feed at `/feed` (verified creators only)
- Subscribe / unsubscribe / tier switching (`/api/subscriptions`)
- PPV unlock via `/api/ppv/unlock`
- DMs with creators
- Public creator profiles at `/profile/[id]`

### Admin
- KYC queue with approve/reject (`/admin/kyc`)
- Content moderation queue (`/admin/moderation`)
- Contract & revenue-split management (`/admin/contracts`)
- Payout approval queue (`/admin/payouts`)
- Platform analytics (`/admin/analytics`)
- Compliance checklist (`/admin/compliance`)
- Compliance & audit logging (every action via `lib/audit.ts`)

### Content protection (per spec Section 5A)
- **Layer 1**: AES-encrypted HLS/DASH streaming ready (configurable per provider)
- **Layer 2**: DRM provider adapter (Gumlet or BuyDRM/KeyOS) at `/api/drm/license`
- **Layer 3**: Forensic watermarking on upload — server-side overlay via `lib/watermark.ts`
- **Layer 4**: Token-gated signed URLs for all media via `/api/media`

## Project structure

```
src/
  app/
    (auth)/                          Login + register with role selection
      login/page.tsx
      register/{page,actions}.tsx
    feed/page.tsx                    Public discovery feed
    profile/[id]/page.tsx            Public creator profile
    creator/
      dashboard/page.tsx             Stats + recent subs + quick actions
      upload/page.tsx                Drag-drop uploader
      tiers/page.tsx                 Multi-tier management
      earnings/page.tsx              Revenue chart + payout history
      payouts/page.tsx               Request payout + history
      messages/page.tsx              Creator-side DMs
    subscriber/
      messages/page.tsx              Subscriber-side DMs
    admin/
      dashboard/page.tsx             Admin overview
      kyc/page.tsx                   KYC queue
      moderation/page.tsx            Flag review
      contracts/page.tsx             Revenue splits + contracts
      payouts/page.tsx               Payout approval
      analytics/page.tsx             Platform stats
      compliance/page.tsx            IT Rules 2021 checklist
    api/
      auth/[...nextauth]/route.ts    NextAuth config (credentials + JWT)
      media/route.ts                 Signed URL generator
      upload/route.ts                Upload endpoint (multipart-ready)
      drm/license/route.ts           DRM provider integration
      health/route.ts                Liveness probe
      me/route.ts                    Session check
      flags/route.ts                 Report content
      ppv/unlock/route.ts            PPV purchase
      subscriptions/route.ts         Subscribe / unsubscribe
      tiers/route.ts                 Tier CRUD
      content/[id]/route.ts          Publish / remove content
      creator/stats/route.ts         Creator dashboard data
      subscriber/stats/route.ts      Subscriber stats
    terms/page.tsx                   Terms of Service
    privacy/page.tsx                 Privacy Policy
    contact/page.tsx                 Grievance officer + contact
  lib/
    db.ts                            Prisma singleton
    auth.ts                          Password hashing
    auth-guards.ts                   withAuth, withRole helpers
    storage.ts                       S3 signed URLs
    watermark.ts                     Server-side watermark + signed URLs + rate limiting
    payments.ts                      Adapter for CCBill/Segpay/crypto (you wire the real one)
    drm.ts                           DRM provider adapter
    audit.ts                         Audit log helper
    stats.ts                         Aggregated stats
    utils.ts                         cn() helper
  components/
    Providers.tsx                    SessionProvider wrapper
  middleware.ts                      Route protection + role-based redirects
prisma/
  schema.prisma                      Full 10-table schema with optimized indexes
  seed.ts                            Demo users + creator profile
```

## Configuration

### Environment variables (`.env`)

```
DATABASE_URL=postgresql://user:pass@host:5432/iin_house
NEXTAUTH_SECRET=                    # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Storage (R2 / S3 / Backblaze / MinIO — any S3-compatible)
S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
S3_PUBLIC_URL=

# Watermark signing
WATERMARK_SECRET=
SIGNED_URL_TTL_SECONDS=3600

# DRM provider (optional — defaults to "dev" mode)
DRM_PROVIDER=gumlet
DRM_API_KEY=
```

### Payment provider

`lib/payments.ts` is an adapter — you plug in the real API for your chosen rail (CCBill / Segpay / crypto). All UI flows already work — they call the service. Set `PAYMENT_PROVIDER` in `.env` once you've decided.

## What's NOT in scope (flagged in spec)

The spec lists two **OPEN** items that require external decisions:

1. **Payment processor backup plan** (Section 5) — Stripe is non-viable per their May 2026 policy. Code is ready for any provider. **This is on you to decide & wire.**
2. **DRM vendor** (Section 5A, layer 2) — recommended Gumlet or BuyDRM. Adapter is ready, just needs the API key once chosen.
3. **Legal review** (Section 6, HIGH PRIORITY) — engage India-focused counsel familiar with this category before public launch. The compliance checklist at `/admin/compliance` enumerates the IT Rules 2021 obligations.

## Scripts

- `npm run dev` — Next.js dev server
- `npm run build` — Prisma generate + Next.js production build
- `npm run start` — Start production server
- `npm run db:push` — Apply Prisma schema to DB
- `npm run db:seed` — Seed demo users
- `npm run db:studio` — Open Prisma Studio
- `npm run lint` — ESLint

## Notes for production

- Replace the in-memory rate limiter in `lib/watermark.ts` with Redis
- Move secrets out of `.env` into a secret manager
- Add Sentry or equivalent for observability
- Add CDN edge caching rules for static assets (default 1-year immutable)
- Add CSP headers and rate-limit middleware on auth endpoints
- Configure backups for PostgreSQL
- Watermark on the *original* upload, not the served version — pre-signed PlayReady/Widevine pipelines ideally process at rest
