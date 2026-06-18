const prisma = require(
  "../config/prisma"
);

const createAuditLog =
  async (
    documentId,
    action,
    userEmail = null
  ) => {
    return prisma.auditLog.create({
      data: {
        documentId,
        action,
        userEmail,
      },
    });
  };

module.exports = {
  createAuditLog,
};