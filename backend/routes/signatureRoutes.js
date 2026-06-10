const express = require("express");

const router =
  express.Router();

const {
  createSignature,
  getSignatures,
} = require(
  "../controllers/signatureController"
);

router.post(
  "/",
  createSignature
);

router.get(
  "/:documentId",
  getSignatures
);

module.exports = router;