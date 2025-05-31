/*
  Warnings:

  - You are about to drop the column `secure_url` on the `Image` table. All the data in the column will be lost.
  - Added the required column `secureUrl` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "secure_url",
ADD COLUMN     "secureUrl" TEXT NOT NULL;
