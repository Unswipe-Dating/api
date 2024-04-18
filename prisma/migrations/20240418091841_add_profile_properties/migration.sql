/*
  Warnings:

  - You are about to drop the column `published` on the `Profile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DatingPreference" AS ENUM ('MEN', 'WOMEN', 'NONBINARY');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "published",
ADD COLUMN     "blockedListUserIds" TEXT[],
ADD COLUMN     "completed" BOOLEAN,
ADD COLUMN     "datingPreference" "DatingPreference",
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "interests" JSONB,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "photoURLs" TEXT[],
ADD COLUMN     "pronouns" TEXT,
ADD COLUMN     "showTruncatedName" BOOLEAN,
ALTER COLUMN "title" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profileId" TEXT;
