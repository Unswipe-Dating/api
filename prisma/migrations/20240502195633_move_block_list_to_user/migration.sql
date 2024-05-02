/*
  Warnings:

  - You are about to drop the column `blockedListUserIds` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "blockedListUserIds";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "blockedListUserIds" TEXT[];
