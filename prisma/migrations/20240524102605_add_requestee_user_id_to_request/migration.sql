/*
  Warnings:

  - Added the required column `requesteeUserId` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Request_userId_key";

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "requesteeUserId" TEXT NOT NULL;
