/*
  Warnings:

  - You are about to alter the column `acid` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `DoublePrecision`.
  - You are about to alter the column `alcohol` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `DoublePrecision`.
  - You are about to alter the column `sugar` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(4,2)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "acid" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "alcohol" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "sugar" SET DATA TYPE DOUBLE PRECISION;
