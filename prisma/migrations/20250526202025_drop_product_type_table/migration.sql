/*
  Warnings:

  - You are about to drop the `ProductType` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ClothingType" AS ENUM ('CLOTHING', 'TSHIRT', 'FOOTWEAR', 'PANTS', 'HAT');

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_productTypeId_fkey";

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "clothingType" "ClothingType" NOT NULL DEFAULT 'CLOTHING';

-- DropTable
DROP TABLE "ProductType";
