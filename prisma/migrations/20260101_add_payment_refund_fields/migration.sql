-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- AlterEnum
BEGIN;
CREATE TYPE "Visibility_new" AS ENUM ('PUBLIC', 'SUBSCRIBERS', 'PPV');
ALTER TABLE "ContentPost" ALTER COLUMN "visibility" DROP DEFAULT;
ALTER TABLE "ContentPost" ALTER COLUMN "visibility" TYPE "Visibility_new" USING ("visibility"::text::"Visibility_new");
ALTER TYPE "Visibility" RENAME TO "Visibility_old";
ALTER TYPE "Visibility_new" RENAME TO "Visibility";
DROP TYPE "Visibility_old";
ALTER TABLE "ContentPost" ALTER COLUMN "visibility" SET DEFAULT 'PUBLIC';
COMMIT;

-- DropIndex
DROP INDEX "EmailVerification_token_idx";

-- DropIndex
DROP INDEX "PasswordReset_token_idx";

-- AlterTable
ALTER TABLE "CreatorProfile" DROP COLUMN "payoutMethod",
ALTER COLUMN "revenueSplitPct" SET DATA TYPE DECIMAL(65,30);

-- AlterTable
ALTER TABLE "PPVPurchase" ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "refunded" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refundedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "AgeVerification";

-- CreateIndex
CREATE INDEX "PPVPurchase_paymentId_idx" ON "PPVPurchase"("paymentId");

-- CreateIndex
CREATE INDEX "Payout_creatorId_status_idx" ON "Payout"("creatorId", "status");

-- CreateIndex
CREATE INDEX "Subscription_creatorId_status_idx" ON "Subscription"("creatorId", "status");

-- AddForeignKey
ALTER TABLE "Dispute" ADD CONSTRAINT "Dispute_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

