const express =
  require("express");

const router =
  express.Router();

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
  createSigner
);

router.get(
  "/:documentId",
  getSigners
);

router.get(
  "/single/:signerId",
  getSignerById
);

router.put(
  "/complete/:signerId",
  completeSigning
);

module.exports = router;