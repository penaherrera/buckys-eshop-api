/*
  Warnings:

  - You are about to drop the column `name` on the `Detail` table. All the data in the column will be lost.
  - Added the required column `color` to the `Detail` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Detail" DROP COLUMN "name",
ADD COLUMN     "color" TEXT NOT NULL;
