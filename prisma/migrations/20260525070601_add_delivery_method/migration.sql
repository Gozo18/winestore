-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryMethod" TEXT NOT NULL DEFAULT 'Osobně na prodejně';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deliveryMethod" TEXT;
