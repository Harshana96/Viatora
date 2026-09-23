-- AlterTable
ALTER TABLE "Enquiry" ADD COLUMN     "arrivalMonth" INTEGER,
ADD COLUMN     "estimatedTotal" DECIMAL(65,30),
ADD COLUMN     "groupSizeRangeId" TEXT;

-- AlterTable
ALTER TABLE "TourDay" ADD COLUMN     "alternativeHotelIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "optionalActivities" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "TourPackage" ADD COLUMN     "importantInfo" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "GroupSizeRange" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "minSize" INTEGER NOT NULL,
    "maxSize" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GroupSizeRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Season" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "months" INTEGER[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingRule" (
    "id" TEXT NOT NULL,
    "packageId" TEXT NOT NULL,
    "groupSizeRangeId" TEXT NOT NULL,
    "seasonId" TEXT NOT NULL,
    "pricePerPerson" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PricingRule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PricingRule_packageId_groupSizeRangeId_seasonId_key" ON "PricingRule"("packageId", "groupSizeRangeId", "seasonId");

-- AddForeignKey
ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_groupSizeRangeId_fkey" FOREIGN KEY ("groupSizeRangeId") REFERENCES "GroupSizeRange"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "TourPackage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_groupSizeRangeId_fkey" FOREIGN KEY ("groupSizeRangeId") REFERENCES "GroupSizeRange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingRule" ADD CONSTRAINT "PricingRule_seasonId_fkey" FOREIGN KEY ("seasonId") REFERENCES "Season"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
