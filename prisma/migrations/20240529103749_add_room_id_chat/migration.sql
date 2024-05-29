/*
  Warnings:

  - Added the required column `roomId` to the `Chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN     "roomId" TEXT NOT NULL;
