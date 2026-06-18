const prisma = require("../config/prisma");
const path = require("path");

const {
  generateSignedPDF,
} = require("../services/pdfService");

const {
  createAuditLog,
} = require("../services/auditService");

const createSignature = async (
  req,
  res
) => {
  try {
    const {
  fieldId,
  documentId,
  signerId,
  page,
  imageData,
  x,
  y,
  pageWidth,
  pageHeight,
  width,
  height,
} = req.body;

    const document =
      await prisma.document.findUnique({
        where: {
          id: documentId,
        },
      });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const signer =
      await prisma.signer.findUnique({
        where: {
          id: signerId,
        },
      });

    if (!signer) {
      return res.status(404).json({
        message: "Signer not found",
      });
    }

    if (
      signer.status === "SIGNED"
    ) {
      return res.status(400).json({
        message:
          "You have already completed signing.",
      });
    }

    const field =
      await prisma.signatureField.findUnique({
        where: {
          id: fieldId,
        },
      });

    if (!field) {
      return res.status(404).json({
        message: "Field not found",
      });
    }

    if (
      field.signerId !== signerId
    ) {
      return res.status(403).json({
        message:
          "This field is not assigned to you.",
      });
    }

    if (field.isSigned) {
      return res.status(400).json({
        message:
          "This field has already been signed.",
      });
    }

    const signature =
  await prisma.signature.create({
    data: {
      page: field.page,

      x: field.x,
      y: field.y,

      width: field.width,
      height: field.height,

      imageData,

      document: {
        connect: {
          id: documentId,
        },
      },

      signer: {
        connect: {
          id: signerId,
        },
      },

      field: {
        connect: {
          id: fieldId,
        },
      },
    },
  });

    await prisma.signatureField.update({
      where: {
        id: fieldId,
      },
      data: {
        isSigned: true,
      },
    });

    const remainingFields =
      await prisma.signatureField.count({
        where: {
          documentId,
          signerId,
          isSigned: false,
        },
      });

    if (
      remainingFields === 0
    ) {
      await prisma.signer.update({
        where: {
          id: signerId,
        },
        data: {
          status: "SIGNED",
          signedAt: new Date(),
        },
      });
    }

    const signatures =
      await prisma.signature.findMany({
        where: {
          documentId,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

    const signedFileName =
      `signed-${Date.now()}.pdf`;

    const pdfPath =
      path.join(
        __dirname,
        "../uploads",
        document.fileUrl
      );

    const generatedPdf =
      await generateSignedPDF({
        pdfPath,
        signatures,
        outputFileName:
          signedFileName,
      });

    await prisma.document.update({
      where: {
        id: documentId,
      },
      data: {
        signedFileUrl:
          generatedPdf,
        status: "SIGNED",
      },
    });

    await createAuditLog(
      documentId,
      "DOCUMENT_SIGNED",
      signer.email
    );

    return res.status(201).json({
      success: true,
      signature,
      signedFile:
        generatedPdf,
    });
  } catch (error) {
    console.log(
      "Signature Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create signature",
    });
  }
};

const getSignatures = async (
  req,
  res
) => {
  try {
    const signatures =
      await prisma.signature.findMany({
        where: {
          documentId:
            req.params.documentId,
        },

        include: {
          signer: {
            select: {
              id: true,
              email: true,
            },
          },

          field: true,
        },

        orderBy: {
          createdAt: "asc",
        },
      });

    return res.json(
      signatures
    );
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message:
        "Failed to fetch signatures",
    });
  }
};

const deleteSignature =
  async (req, res) => {
    try {
      const signature =
        await prisma.signature.findUnique({
          where: {
            id:
              req.params.signatureId,
          },

          include: {
            field: true,
          },
        });

      if (!signature) {
        return res.status(404).json({
          message:
            "Signature not found",
        });
      }

      const document =
        await prisma.document.findUnique({
          where: {
            id:
              signature.documentId,
          },
        });

      if (
        document.ownerId !==
        req.user.id
      ) {
        return res.status(403).json({
          message:
            "Only owner can remove signatures",
        });
      }

      await prisma.signature.delete({
        where: {
          id:
            signature.id,
        },
      });

      if (
        signature.fieldId
      ) {
        await prisma.signatureField.update({
          where: {
            id:
              signature.fieldId,
          },

          data: {
            isSigned:
              false,
          },
        });
      }

      await prisma.signer.update({
        where: {
          id:
            signature.signerId,
        },

        data: {
          status:
            "PENDING",

          signedAt:
            null,
        },
      });

      const remainingSignatures =
        await prisma.signature.findMany({
          where: {
            documentId:
              signature.documentId,
          },

          orderBy: {
            createdAt:
              "asc",
          },
        });

      if (
        remainingSignatures.length ===
        0
      ) {
        await prisma.document.update({
          where: {
            id:
              document.id,
          },

          data: {
            signedFileUrl:
              null,

            status:
              "PENDING",
          },
        });

        await createAuditLog(
          document.id,
          "LAST_SIGNATURE_REMOVED",
          req.user.email
        );

        return res.json({
          success: true,
          message:
            "Last signature removed. Document reset.",
        });
      }

      const signedFileName =
        `signed-${Date.now()}.pdf`;

      const pdfPath =
        path.join(
          __dirname,
          "../uploads",
          document.fileUrl
        );

      const generatedPdf =
        await generateSignedPDF({
          pdfPath,
          signatures:
            remainingSignatures,
          outputFileName:
            signedFileName,
        });

      await prisma.document.update({
        where: {
          id:
            document.id,
        },

        data: {
          signedFileUrl:
            generatedPdf,
          status:
            "SIGNED",
        },
      });

      await createAuditLog(
        document.id,
        "SIGNATURE_REMOVED",
        req.user.email
      );

      return res.json({
        success: true,
        message:
          "Signature removed successfully",
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        message:
          "Failed to remove signature",
      });
    }
  };

module.exports = {
  createSignature,
  getSignatures,
  deleteSignature,
};