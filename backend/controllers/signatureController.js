const prisma = require(
  "../config/prisma"
);

const createSignature =
  async (req, res) => {
    try {
      const {
        documentId,
        x,
        y,
        page,
      } = req.body;

      const signature =
        await prisma.signature.create({
          data: {
            x,
            y,
            page,

            document: {
              connect: {
                id: documentId,
              },
            },

            signer: {
              connect: {
                id: req.user.id,
              },
            },
          },
        });

      res.status(201).json(
        signature
      );
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message:
          "Failed to create signature",
      });
    }
  };

const getSignatures =
  async (req, res) => {
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