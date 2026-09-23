-- Day 3: Legal compliance fields

-- GSTIN on creator profile for Indian tax compliance
ALTER TABLE "CreatorProfile" ADD COLUMN "gstin" TEXT;

-- Terms acceptance tracking (DPDP Act)
ALTER TABLE "User" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "termsVersion" TEXT;

-- Data export & deletion requests (DPDP Act)
ALTER TABLE "User" ADD COLUMN "dataExportRequestedAt" TIMESTAMP(3);
ALTER TABLE "User" ADD COLUMN "deletionScheduledAt" TIMESTAMP(3);

CREATE INDEX "User_deletionScheduledAt_idx" ON "User"("deletionScheduledAt");
