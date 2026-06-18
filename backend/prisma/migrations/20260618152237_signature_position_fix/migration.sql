/*
  Warnings:

  - You are about to drop the column `xPercent` on the `Signature` table. All the data in the column will be lost.
  - You are about to drop the column `yPercent` on the `Signature` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Signature" DROP COLUMN "xPercent",
DROP COLUMN "yPercent",
ADD COLUMN     "pageHeight" DOUBLE PRECISION,
ADD COLUMN     "pageWidth" DOUBLE PRECISION,
ADD COLUMN     "x" DOUBLE PRECISION,
ADD COLUMN     "y" DOUBLE PRECISION;
