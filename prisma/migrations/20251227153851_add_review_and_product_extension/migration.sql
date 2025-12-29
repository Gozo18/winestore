-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "acid" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "alcohol" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "attribute" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "sort" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "sugar" DECIMAL(5,2) NOT NULL DEFAULT 0,
ADD COLUMN     "sweetCat" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "year" INTEGER NOT NULL DEFAULT 2020,
ALTER COLUMN "category" SET DEFAULT '';

-- CreateTable
CREATE TABLE "Review" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "productId" UUID NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "isVerifiedPurchase" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
