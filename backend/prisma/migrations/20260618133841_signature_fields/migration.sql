/*
  Warnings:

  - You are about to drop the column `status` on the `Signature` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Signature" DROP COLUMN "status",
ADD COLUMN     "fieldType" TEXT NOT NULL DEFAULT 'SIGNATURE',
ADD COLUMN     "height" DOUBLE PRECISION,
ADD COLUMN     "width" DOUBLE PRECISION;
