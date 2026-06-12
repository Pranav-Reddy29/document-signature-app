const prisma = require("../config/prisma");

const createSignature = async (req, res) => {
  try {
    const {
      documentId,
      x,
      y,
      page,
      imageData,
    } = req.body;

    const signature =
      await prisma.signature.create({
        data: {
          x,
          y,
          page,
          imageData,

          document: {
            connect: {
              id: documentId,
            },
          },

          signer: {
            connect: {
              id: "dc8c5fd7-25f1-49cd-82b7-4b28e5b1b53b",
            },
          },
        },
      });

    res.status(201).json(signature);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create signature",
      error: error.message,
    });
  }
};

const getSignatures = async (req, res) => {
  try {
    const signatures =
      await prisma.signature.findMany({
        where: {
          documentId:
            req.params.documentId,
        },
      });

    res.json(signatures);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Failed to fetch signatures",
    });
  }
};

module.exports = {
  createSignature,
  getSignatures,
};