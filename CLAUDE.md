# iin house — Creator Subscription Platform

This file is the source of truth for Claude Code sessions in this repo.
It overrides the global rules and must be respected exactly.

## Stack
- Next.js 14 (App Router) + React 18 + Tailwind CSS
- PostgreSQL + Prisma ORM
- NextAuth.js (credentials + JWT)
- Stripe (recommended payment rail)
- S3-compatible object storage (R2 / S3 / B2 / MinIO)
- Gumlet or BuyDRM for DRM
- Upstash Redis for rate limiting

## Key Commands
```bash
npm run dev         # Next.js dev server
npm run build       # Prisma generate + Next.js build
npm run db:push     # Apply Prisma schema
npm run db:seed     # Seed demo users
npm run db:studio   # Prisma Studio
npm test            # Vitest test runner
npm run lint        # ESLint
```

## Conventions
- File size: 200-400 lines typical, 800 max. Many small files.
- Layout: organize by feature/domain, not by type.
- Validation: Zod at API boundaries.
- Auth: use `withAuth` and `withRole` from `src/lib/auth-guards.ts`.
- Audit: log admin/creator mutations via `src/lib/audit.ts`.
- Enums: status fields are `String` in Prisma, validated at runtime in services.
- Never touch `prisma/migrations` by hand.
- Never commit secrets.

## Environment
Copy `.env.example` to `.env` and fill every empty value before starting.
Never commit `.env`.

## Rules Override
The global rules in `~/.claude/rules/` apply unless this file says otherwise.
Immutability rule is overridden: this codebase mutates objects in places (e.g.
Prisma writes, array push). Do not refactor for immutability unless explicitly asked.
Default test coverage target: 80%. Coverage below that needs a documented reason.
