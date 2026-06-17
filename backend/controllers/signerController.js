const prisma = require("../config/prisma");

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

      const signer =
        await prisma.signer.create({
          data: {
            email,
            documentId,
          },
        });

      try {
        await sendSignerInvite(
          email,
          documentId,
          signer.id
        );
      } catch (emailError) {
        console.log(
          "Email Error:",
          emailError
        );
      }

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

          orderBy: {
            createdAt: "desc",
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
            status:
              "SIGNED",
          },
        });

      res.json(signer);
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to update signer",
      });
    }
  };

module.exports = {
  createSigner,
  getSigners,
  completeSigning,
};