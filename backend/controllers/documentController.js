const prisma = require("../config/prisma");

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

const deleteDocument =
  async (req, res) => {
    try {
      await prisma.document.delete({
        where: {
          id: req.params.id,
        },
      });

      res.json({
        message:
          "Document deleted",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Delete failed",
      });
    }
  };

module.exports = {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
};