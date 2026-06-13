/*
  Warnings:

  - You are about to drop the column `x` on the `Signature` table. All the data in the column will be lost.
  - You are about to drop the column `y` on the `Signature` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Signature" DROP COLUMN "x",
DROP COLUMN "y",
ADD COLUMN     "xPercent" DOUBLE PRECISION,
ADD COLUMN     "yPercent" DOUBLE PRECISION;
