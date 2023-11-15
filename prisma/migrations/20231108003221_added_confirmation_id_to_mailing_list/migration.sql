/*
  Warnings:

  - A unique constraint covering the columns `[confirmationId]` on the table `MailingList` will be added. If there are existing duplicate values, this will fail.
  - The required column `confirmationId` was added to the `MailingList` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "MailingList" ADD COLUMN     "confirmationId" TEXT NOT NULL,
ADD COLUMN     "hasConfirmed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "MailingList_confirmationId_key" ON "MailingList"("confirmationId");
