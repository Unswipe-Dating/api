/*
  Warnings:

  - Added the required column `status` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChatStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "status" "ChatStatus" NOT NULL;
