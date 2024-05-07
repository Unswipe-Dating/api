/*
  Warnings:

  - Added the required column `challengeVerificationStatus` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiry` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requesteeProfileId` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requesterProfileId` to the `Request` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Request` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REJECTED', 'MATCHED', 'BUSY');

-- CreateEnum
CREATE TYPE "ChallengeVerificationStatus" AS ENUM ('VERIFIED', 'NOT_VERIFIED');

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "challenge" JSONB,
ADD COLUMN     "challengeVerification" JSONB,
ADD COLUMN     "challengeVerificationStatus" "ChallengeVerificationStatus" NOT NULL,
ADD COLUMN     "expiry" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "requesteeProfileId" TEXT NOT NULL,
ADD COLUMN     "requesterProfileId" TEXT NOT NULL,
ADD COLUMN     "status" "RequestStatus" NOT NULL;
