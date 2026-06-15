const express = require("express");

const router =
  express.Router();

const {
  createSigner,
  getSigners,
} = require(
  "../controllers/signerController"
);

router.post(
  "/",
  createSigner
);

router.get(
  "/:documentId",
  getSigners
);

module.exports = router;