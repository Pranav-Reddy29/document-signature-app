-- CreateTable
CREATE TABLE "SignatureField" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "signerId" TEXT NOT NULL,
    "page" INTEGER NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "width" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "isSigned" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignatureField_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SignatureField" ADD CONSTRAINT "SignatureField_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignatureField" ADD CONSTRAINT "SignatureField_signerId_fkey" FOREIGN KEY ("signerId") REFERENCES "Signer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
