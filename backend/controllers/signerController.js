const prisma =
  require("../config/prisma");

const crypto =
  require("crypto");

const {
  sendSignerInvite,
} = require(
  "../services/emailService"
);

const createSigner =
  async (req, res) => {
    try {
      const {
        email,
        documentId,
      } = req.body;

      const token =
        crypto
          .randomBytes(32)
          .toString("hex");

      const signer =
        await prisma.signer.create({
          data: {
            email,
            documentId,
            token,
          },
        });

      await sendSignerInvite(
        email,
        documentId,
        signer.id
      );

      res.status(201).json(
        signer
      );
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to create signer",
      });
    }
  };

const getSigners =
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
        message:
          "Failed to fetch signers",
      });
    }
  };

module.exports = {
  createSigner,
  getSigners,
};