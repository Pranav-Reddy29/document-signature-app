const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const authRoutes = require(
  "./routes/authRoutes"
);

const documentRoutes =
  require(
    "./routes/documentRoutes"
  );

const signatureRoutes =
  require(
    "./routes/signatureRoutes"
  );

  const signerRoutes =
  require("./routes/signerRoutes");

const signatureFieldRoutes =
  require(
    "./routes/signatureFieldRoutes"
  );

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    )
  )
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/documents",
  documentRoutes
);

app.use(
  "/api/signatures",
  signatureRoutes
);

app.use(
  "/api/signers",
  signerRoutes
);

app.use(
  "/signed",
  express.static(
    path.join(
      __dirname,
      "signed"
    )
  )
);

app.use(
  "/api/signature-fields",
  signatureFieldRoutes
);

app.use(
  "/api/signature-fields",
  require("./routes/signatureFieldRoutes")
);

app.get("/", (req, res) => {
  res.send(
    "Document Signature API Running"
  );
});

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});