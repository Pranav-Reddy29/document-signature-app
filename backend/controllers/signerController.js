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

const getSignerById =
  async (req, res) => {
    try {
      const signer =
        await prisma.signer.findUnique({
          where: {
            id:
              req.params.signerId,
          },
        });

      if (!signer) {
        return res.status(404).json({
          message:
            "Signer not found",
        });
      }

      res.json(signer);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to fetch signer",
      });
    }
  };

const completeSigning =
  async (req, res) => {
    try {
      const signer =
        await prisma.signer.update({
          where: {
            id:
              req.params.signerId,
          },
          data: {
            status: "SIGNED",
            signedAt:
              new Date(),
          },
        });

      res.json(signer);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to complete signing",
      });
    }
  };

module.exports = {
  createSigner,
  getSigners,
  getSignerById,
  completeSigning,
};