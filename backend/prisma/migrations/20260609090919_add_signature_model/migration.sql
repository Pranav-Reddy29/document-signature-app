-- CreateTable
CREATE TABLE "Signature" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "signerId" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "page" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Signature_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Signature" ADD CONSTRAINT "Signature_signerId_fkey" FOREIGN KEY ("signerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
