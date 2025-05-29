/*
  Warnings:

  - You are about to drop the column `stripePaymentIntendId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `stripePaymentIntendId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeChargeId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "stripePaymentIntendId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "stripePaymentIntendId",
ADD COLUMN     "stripeChargeId" TEXT NOT NULL;
