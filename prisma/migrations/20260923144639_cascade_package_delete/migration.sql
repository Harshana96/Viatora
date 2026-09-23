-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_packageId_fkey";

-- DropForeignKey
ALTER TABLE "PricingRule" DROP CONSTRAINT "PricingRule_packageId_fkey";

-- DropForeignKey
ALTER TABLE "TourDay" DROP CONSTRAINT "TourDay_packageId_fkey";

-- DropForeignKey
ALTER TABLE "TourDayPlace" DROP CONSTRAINT "TourDayPlace_tourDayId_fkey";

-- AddForeignKey
ALTER TABLE "TourDay" ADD CONSTRAINT "TourDay_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "TourPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TourDayPlace" ADD CONSTRAINT "TourDayPlace_tourDayId_fkey" FOREIGN KEY ("tourDayId") REFERENCES "TourDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "TourPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "TourPackage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
