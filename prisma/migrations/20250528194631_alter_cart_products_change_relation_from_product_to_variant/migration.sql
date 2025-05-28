/*
  Warnings:

  - You are about to drop the column `productId` on the `CartProducts` table. All the data in the column will be lost.
  - Added the required column `variantId` to the `CartProducts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CartProducts" DROP CONSTRAINT "CartProducts_productId_fkey";

-- AlterTable
ALTER TABLE "CartProducts" DROP COLUMN "productId",
ADD COLUMN     "variantId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CartProducts" ADD CONSTRAINT "CartProducts_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "Variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
