-- AlterTable
ALTER TABLE "Signature" ADD COLUMN     "fieldId" TEXT;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "SignatureField"("id") ON DELETE SET NULL ON UPDATE CASCADE;
