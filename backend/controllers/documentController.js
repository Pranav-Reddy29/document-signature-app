const prisma = require(
  "../config/prisma"
);

const uploadDocument = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message:
          "No file uploaded",
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
            req.user,
        },
      });

    res.status(201).json(
      document
    );
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message:
        "Upload failed",
    });
  }
};

module.exports = {
  uploadDocument,
};