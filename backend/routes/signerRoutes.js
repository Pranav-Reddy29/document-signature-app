const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  createSigner,
  getSigners,
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

router.put(
  "/complete/:signerId",
  completeSigning
);

module.exports = router;