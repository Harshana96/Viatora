-- CreateEnum
CREATE TYPE "TravelType" AS ENUM ('ADVENTURE', 'CULTURAL', 'BEACH', 'WILDLIFE', 'HONEYMOON', 'FAMILY', 'WELLNESS');

-- AlterTable
ALTER TABLE "TourPackage" ADD COLUMN     "travelType" "TravelType";
