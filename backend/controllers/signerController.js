const prisma = require("../config/prisma");
const crypto = require("crypto");

const createSigner = async (req, res) => {
  try {
    const { email, documentId } = req.body;

    const token =
      crypto.randomBytes(32).toString("hex");

    const signer =
      await prisma.signer.create({
        data: {
          email,
          documentId,
          token,
        },
      });

    res.status(201).json(signer);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Failed to create signer",
    });
  }
};

const getDocumentSigners =
  async (req, res) => {
    try {
      const signers =
        await prisma.signer.findMany({
          where: {
            documentId:
              req.params.documentId,
          },
        });

      res.json(signers);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "Failed to fetch signers",
      });
    }
  };

module.exports = {
  createSigner,
  getDocumentSigners,
};