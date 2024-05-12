-- CreateEnum
CREATE TYPE "ZodiacSign" AS ENUM ('Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "height" TEXT,
ADD COLUMN     "hometown" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "zodiac" "ZodiacSign";
