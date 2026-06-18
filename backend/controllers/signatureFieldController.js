const prisma = require("../config/prisma");

const createField = async (
  req,
  res
) => {
  try {
    const {
      documentId,
      signerId,
      page,
      x,
      y,
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

    if (
      document.ownerId !==
      req.user.id
    ) {
      return res.status(403).json({
        message:
          "Only document owner can create signature fields",
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
      signer.documentId !==
      documentId
    ) {
      return res.status(400).json({
        message:
          "Signer does not belong to this document",
      });
    }

    const field =
      await prisma.signatureField.create({
        data: {
          documentId,
          signerId,

          page:
            Number(page),

          x:
            Number(x),

          y:
            Number(y),

          width:
            Number(width),

          height:
            Number(height),
        },
        include: {
          signer: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

    return res.status(201).json({
      success: true,
      field,
    });
  } catch (error) {
    console.log(
      "Create Field Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to create signature field",
    });
  }
};

const getFields = async (
  req,
  res
) => {
  try {
    const {
      documentId,
    } = req.params;

    const fields =
      await prisma.signatureField.findMany({
        where: {
          documentId,
        },

        include: {
          signer: {
            select: {
              id: true,
              email: true,
              status: true,
            },
          },
        },

        orderBy: {
          createdAt:
            "asc",
        },
      });

    return res.json(
      fields
    );
  } catch (error) {
    console.log(
      "Get Fields Error:",
      error
    );

    return res.status(500).json({
      message:
        "Failed to fetch signature fields",
    });
  }
};

const getSignerFields =
  async (req, res) => {
    try {
      const {
        documentId,
        signerId,
      } = req.params;

      const fields =
        await prisma.signatureField.findMany({
          where: {
            documentId,
            signerId,
          },

          orderBy: {
            createdAt:
              "asc",
          },
        });

      return res.json(
        fields
      );
    } catch (error) {
      console.log(
        "Get Signer Fields Error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch signer fields",
      });
    }
  };

const deleteField =
  async (req, res) => {
    try {
      const field =
        await prisma.signatureField.findUnique({
          where: {
            id:
              req.params.fieldId,
          },

          include: {
            document: true,
          },
        });

      if (!field) {
        return res.status(404).json({
          message:
            "Field not found",
        });
      }

      if (
        field.document.ownerId !==
        req.user.id
      ) {
        return res.status(403).json({
          message:
            "Only document owner can remove fields",
        });
      }

      if (
        field.isSigned
      ) {
        return res.status(400).json({
          message:
            "Cannot remove a signed field. Remove signature first.",
        });
      }

      await prisma.signatureField.delete({
        where: {
          id:
            field.id,
        },
      });

      return res.json({
        success: true,
        message:
          "Signature field removed successfully",
      });
    } catch (error) {
      console.log(
        "Delete Field Error:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to delete signature field",
      });
    }
  };

module.exports = {
  createField,
  getFields,
  getSignerFields,
  deleteField,
};