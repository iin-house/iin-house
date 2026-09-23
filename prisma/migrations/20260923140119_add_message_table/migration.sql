/*
  Warnings:

  - You are about to drop the column `content` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `isPPV` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `isPaid` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `mediaUrl` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `recipientId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `unlocked` on the `Message` table. All the data in the column will be lost.
  - Added the required column `body` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `receiverId` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_recipientId_fkey";

-- DropIndex
DROP INDEX "Message_recipientId_sentAt_idx";

-- DropIndex
DROP INDEX "Message_senderId_recipientId_idx";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "content",
DROP COLUMN "isPPV",
DROP COLUMN "isPaid",
DROP COLUMN "mediaUrl",
DROP COLUMN "price",
DROP COLUMN "readAt",
DROP COLUMN "recipientId",
DROP COLUMN "sentAt",
DROP COLUMN "unlocked",
ADD COLUMN     "body" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "encrypted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "receiverId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "MessageRead" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageRead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MessageRead_userId_idx" ON "MessageRead"("userId");

-- CreateIndex
CREATE INDEX "MessageRead_messageId_idx" ON "MessageRead"("messageId");

-- CreateIndex
CREATE INDEX "Message_senderId_receiverId_idx" ON "Message"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "Message_receiverId_createdAt_idx" ON "Message"("receiverId", "createdAt");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageRead" ADD CONSTRAINT "MessageRead_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
