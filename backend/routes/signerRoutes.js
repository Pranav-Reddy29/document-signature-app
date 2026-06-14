const express = require("express");

const router = express.Router();

const {
  createSigner,
  getDocumentSigners,
} = require(
  "../controllers/signerController"
);

router.post("/", createSigner);

router.get(
  "/:documentId",
  getDocumentSigners
);

module.exports = router;