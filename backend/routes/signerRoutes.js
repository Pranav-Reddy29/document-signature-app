const express = require("express");

const router =
  express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  createSigner,
  getSigners,
  getSignerById,
  completeSigning,
} = require(
  "../controllers/signerController"
);

router.post(
  "/",
  protect,
  createSigner
);

router.get(
  "/:documentId",
  protect,
  getSigners
);

router.get(
  "/public/:signerId",
  getSignerById
);

router.put(
  "/complete/:signerId",
  completeSigning
);

module.exports = router;