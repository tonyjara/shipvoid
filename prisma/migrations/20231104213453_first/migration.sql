/*
  Warnings:

  - You are about to drop the `AudioFile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Coupons` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Scribe` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScribeChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionCreditsActions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SubscriptionItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AudioFile" DROP CONSTRAINT "AudioFile_scribeId_fkey";

-- DropForeignKey
ALTER TABLE "AudioFile" DROP CONSTRAINT "AudioFile_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Coupons" DROP CONSTRAINT "Coupons_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "Scribe" DROP CONSTRAINT "Scribe_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "ScribeChat" DROP CONSTRAINT "ScribeChat_scribeId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_productId_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionCreditsActions" DROP CONSTRAINT "SubscriptionCreditsActions_subscriptionId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionItem" DROP CONSTRAINT "SubscriptionItem_priceId_fkey";

-- DropForeignKey
ALTER TABLE "SubscriptionItem" DROP CONSTRAINT "SubscriptionItem_subscriptionId_fkey";

-- DropTable
DROP TABLE "AudioFile";

-- DropTable
DROP TABLE "Coupons";

-- DropTable
DROP TABLE "Scribe";

-- DropTable
DROP TABLE "ScribeChat";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "SubscriptionCreditsActions";

-- DropTable
DROP TABLE "SubscriptionItem";
