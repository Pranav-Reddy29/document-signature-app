const prisma = require("../config/prisma");

const path = require("path");
const fs = require("fs");

const {
  createAuditLog,
} = require(
  "../services/auditService"
);

const uploadDocument = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const document =
      await prisma.document.create({
        data: {
          title:
            req.file.originalname,

          fileUrl:
            req.file.filename,

          ownerId:
            req.user.id,
        },
      });

    await createAuditLog(
      document.id,
      "DOCUMENT_UPLOADED",
      req.user.email
    );

    res.status(201).json(
      document
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Upload failed",
    });
  }
};

const getDocuments = async (
  req,
  res
) => {
  try {
    const documents =
      await prisma.document.findMany({
        where: {
          ownerId:
            req.user.id,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    res.json(documents);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed to fetch documents",
    });
  }
};

const getDocumentById =
  async (req, res) => {
    try {
      const document =
        await prisma.document.findUnique({
          where: {
            id:
              req.params.id,
          },
        });

      if (!document) {
        return res.status(404).json({
          message:
            "Document not found",
        });
      }

      res.json(document);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch document",
      });
    }
  };

const deleteDocument = async (
  req,
  res
) => {
  try {
    const document =
      await prisma.document.findUnique({
        where: {
          id: req.params.id,
        },
      });

    if (!document) {
      return res.status(404).json({
        message:
          "Document not found",
      });
    }

    /*
      Delete original PDF
    */
    if (document.fileUrl) {
      const originalPath =
        path.join(
          __dirname,
          "..",
          "uploads",
          document.fileUrl
        );

      if (
        fs.existsSync(
          originalPath
        )
      ) {
        fs.unlinkSync(
          originalPath
        );
      }
    }

    /*
      Delete signed PDF
    */
    if (
      document.signedFileUrl
    ) {
      const signedPath =
        path.join(
          __dirname,
          "..",
          "signed",
          document.signedFileUrl
        );

      if (
        fs.existsSync(
          signedPath
        )
      ) {
        fs.unlinkSync(
          signedPath
        );
      }
    }

    /*
      Delete database records
      in correct order
    */
    await prisma.$transaction([
      prisma.signature.deleteMany({
        where: {
          documentId:
            req.params.id,
        },
      }),

      prisma.signatureField.deleteMany({
        where: {
          documentId:
            req.params.id,
        },
      }),

      prisma.signer.deleteMany({
        where: {
          documentId:
            req.params.id,
        },
      }),

      prisma.auditLog.deleteMany({
        where: {
          documentId:
            req.params.id,
        },
      }),

      prisma.document.delete({
        where: {
          id:
            req.params.id,
        },
      }),
    ]);

    return res.json({
      success: true,
      message:
        "Document deleted successfully",
    });
  } catch (error) {
    console.log(
      "DELETE DOCUMENT ERROR:",
      error
    );

    return res.status(500).json({
      message:
        "Delete failed",
    });
  }
};

const downloadSignedDocument =
  async (req, res) => {
    try {
      console.log(
        "DOWNLOAD REQUEST:",
        req.params.id
      );

      const document =
        await prisma.document.findUnique({
          where: {
            id:
              req.params.id,
          },
        });

      console.log(
        "DOCUMENT:",
        document
      );

      if (!document) {
        return res.status(404).json({
          message:
            "Document not found",
        });
      }

      if (
        !document.signedFileUrl
      ) {
        return res.status(404).json({
          message:
            "Signed PDF not found",
        });
      }

      const filePath =
        path.join(
          __dirname,
          "..",
          "signed",
          document.signedFileUrl
        );

      console.log(
        "FILE PATH:",
        filePath
      );

      if (
        !fs.existsSync(
          filePath
        )
      ) {
        return res.status(404).json({
          message:
            "Signed file does not exist",
        });
      }

      return res.download(
        filePath
      );
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Download failed",
      });
    }
  };

const viewSignedDocument =
  async (req, res) => {
    try {
      const document =
        await prisma.document.findUnique({
          where: {
            id:
              req.params.id,
          },
        });

      if (
        !document ||
        !document.signedFileUrl
      ) {
        return res.status(404).json({
          message:
            "Signed PDF not found",
          });
      }

      res.json({
        url:
          `${import.meta.env.VITE_API_URL}/signed/${document.signedFileUrl}`,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch signed PDF",
      });
    }
  };

const getAuditLogs =
  async (req, res) => {
    try {
      const logs =
        await prisma.auditLog.findMany({
          where: {
            documentId:
              req.params.documentId,
          },

          orderBy: {
            createdAt: "desc",
          },
        });

      res.json(logs);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch logs",
      });
    }
  };

  const getPublicDocument =
  async (req, res) => {
    try {
      const document =
        await prisma.document.findUnique({
          where: {
            id: req.params.id,
          },
        });

      if (!document) {
        return res.status(404).json({
          message:
            "Document not found",
        });
      }

      res.json({
        id: document.id,
        title: document.title,
        fileUrl: document.fileUrl,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch document",
      });
    }
  };

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  getPublicDocument,
  deleteDocument,
  downloadSignedDocument,
  viewSignedDocument,
  getAuditLogs,
};
