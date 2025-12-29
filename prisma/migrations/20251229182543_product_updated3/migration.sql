/*
  Warnings:

  - The `acid` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `alcohol` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `sugar` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "acid",
ADD COLUMN     "acid" DECIMAL(3,2) NOT NULL DEFAULT 0,
DROP COLUMN "alcohol",
ADD COLUMN     "alcohol" DECIMAL(3,2) NOT NULL DEFAULT 0,
DROP COLUMN "sugar",
ADD COLUMN     "sugar" DECIMAL(3,2) NOT NULL DEFAULT 0;
