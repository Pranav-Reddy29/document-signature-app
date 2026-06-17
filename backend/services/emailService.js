const nodemailer = require("nodemailer");

const transporter =
  nodemailer.createTransport({
    service: "gmail",

    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const sendSignerInvite =
  async (
    email,
    documentId,
    signerId
  ) => {
    const signingLink =
      `${process.env.FRONTEND_URL}/sign/${documentId}/${signerId}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,

      to: email,

      subject:
        "Document Signature Request",

      html: `
        <h2>You have been invited to sign a document</h2>

        <p>Please click the button below:</p>

        <a
          href="${signingLink}"
          style="
            background:#2563eb;
            color:white;
            padding:12px 20px;
            text-decoration:none;
            border-radius:6px;
          "
        >
          Sign Document
        </a>
      `,
    });
  };

module.exports = {
  sendSignerInvite,
};