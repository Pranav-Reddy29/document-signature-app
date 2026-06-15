const nodemailer =
  require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user:
        process.env.EMAIL_USER,
      pass:
        process.env.EMAIL_PASS,
    },
  });

const sendSignerInvite =
  async (
    email,
    documentId,
    signerId
  ) => {
    const signingLink =
      `http://localhost:5173/sign/${documentId}/${signerId}`;

    await transporter.sendMail({
      from:
        process.env.EMAIL_USER,

      to: email,

      subject:
        "Document Signature Request",

      html: `
        <h2>You have been invited to sign a document</h2>

        <p>Please click the link below:</p>

        <a href="${signingLink}">
          Sign Document
        </a>
      `,
    });
  };

module.exports = {
  sendSignerInvite,
};