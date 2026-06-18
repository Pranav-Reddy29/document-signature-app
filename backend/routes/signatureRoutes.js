const express = require("express");

const router =
  express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  createSignature,
  getSignatures,
  deleteSignature,
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

router.delete(
  "/:signatureId",
  protect,
  deleteSignature
);

module.exports = router;