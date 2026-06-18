-- DropForeignKey
ALTER TABLE "Signature" DROP CONSTRAINT "Signature_signerId_fkey";

-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "signedFileUrl" TEXT;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_signerId_fkey" FOREIGN KEY ("signerId") REFERENCES "Signer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
