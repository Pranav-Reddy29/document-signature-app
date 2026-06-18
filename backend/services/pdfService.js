const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");

const generateSignedPDF = async ({
  pdfPath,
  signatures,
  outputFileName,
}) => {
  try {
    const pdfBytes =
      fs.readFileSync(pdfPath);

    const pdfDoc =
      await PDFDocument.load(
        pdfBytes
      );

    const pages =
      pdfDoc.getPages();

    for (const sign of signatures) {
      const page =
        pages[
          Number(sign.page) - 1
        ];

      if (!page) continue;

      /*
        Skip old signatures
        that don't have coordinates
      */
      if (
        sign.x == null ||
        sign.y == null
      ) {
        console.log(
          "Skipping invalid signature:",
          sign.id
        );
        continue;
      }

      let signatureImage;

      if (
        sign.imageData?.startsWith(
          "data:image/png"
        )
      ) {
        const pngBytes =
          Buffer.from(
            sign.imageData.split(",")[1],
            "base64"
          );

        signatureImage =
          await pdfDoc.embedPng(
            pngBytes
          );
      } else {
        const jpgBytes =
          Buffer.from(
            sign.imageData.split(",")[1],
            "base64"
          );

        signatureImage =
          await pdfDoc.embedJpg(
            jpgBytes
          );
      }

      const pdfWidth =
        page.getWidth();

      const pdfHeight =
        page.getHeight();

      /*
        React PDF rendered width
      */
      const frontendWidth =
        900;

      const scale =
        pdfWidth /
        frontendWidth;

      const pdfSignatureWidth =
        Number(
          sign.width || 180
        ) * scale;

      const pdfSignatureHeight =
        Number(
          sign.height || 80
        ) * scale;

      /*
        Actual stored coordinates
      */
      const pdfX =
        Number(sign.x) *
        scale;

      const pdfY =
        pdfHeight -
        Number(sign.y) *
          scale;

      console.log(
        "SIGNATURE DEBUG"
      );

      console.log({
        page:
          sign.page,

        storedX:
          sign.x,

        storedY:
          sign.y,

        pdfWidth,
        pdfHeight,

        pdfX,
        pdfY,

        pdfSignatureWidth,
        pdfSignatureHeight,
      });

      page.drawImage(
        signatureImage,
        {
          x:
            pdfX -
            pdfSignatureWidth /
              2,

          y:
            pdfY -
            pdfSignatureHeight /
              2,

          width:
            pdfSignatureWidth,

          height:
            pdfSignatureHeight,
        }
      );
    }

    const signedPdfBytes =
      await pdfDoc.save();

    const signedFolder =
      path.join(
        __dirname,
        "../signed"
      );

    if (
      !fs.existsSync(
        signedFolder
      )
    ) {
      fs.mkdirSync(
        signedFolder,
        {
          recursive: true,
        }
      );
    }

    const outputPath =
      path.join(
        signedFolder,
        outputFileName
      );

    fs.writeFileSync(
      outputPath,
      signedPdfBytes
    );

    console.log(
      "Signed PDF Saved:",
      outputPath
    );

    return outputFileName;
  } catch (error) {
    console.log(
      "PDF Generation Error:",
      error
    );

    throw error;
  }
};

module.exports = {
  generateSignedPDF,
};