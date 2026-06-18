-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "userEmail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
