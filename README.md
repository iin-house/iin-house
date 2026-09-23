# iin house — Creator Subscription Platform

Premium creator subscription platform with content protection, pay-per-view, Razorpay payments, and admin moderation tools.

## Stack

- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js (Credentials)
- **Payments**: Razorpay (India), Stripe (international)
- **Storage**: AWS S3 / Cloudflare R2 (signed URLs)
- **Email**: Resend
- **UI**: Tailwind CSS + custom design system

## Quick Start

```bash
# 1. Clone and install
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your DATABASE_URL and NEXTAUTH_SECRET

# 3. Run database
npx prisma migrate dev
npm run db:seed

# 4. Start dev server
npm run dev
```

Open http://localhost:3000

## Default Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@iinhouse.com | admin123 | Admin |
| creator@iinhouse.com | creator123 | Creator |
| sub@iinhouse.com | sub123 | Subscriber |

## Commands

```bash
npm run dev        # Start dev server (port 3000)
npm run build      # Build for production
npm run start      # Start production server
npm run test       # Run tests (vitest)
npm run db:seed    # Seed demo data
npm run db:studio  # Open Prisma Studio
```

## Docker

```bash
docker-compose up -d
```

## License

MIT
