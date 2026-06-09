const express = require(
  "express"
);

const router =
  express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  createSignature,
  getSignatures,
} = require(
  "../controllers/signatureController"
);

router.post(
  "/",
  protect,
  createSignature
);

router.get(
  "/:documentId",
  protect,
  getSignatures
);

module.exports = router;