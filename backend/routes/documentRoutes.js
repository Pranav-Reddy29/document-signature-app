const express = require("express");

const router =
  express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const upload = require(
  "../middleware/uploadMiddleware"
);

const {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
} = require(
  "../controllers/documentController"
);

router.post(
  "/upload",
  protect,
  upload.single("pdf"),
  uploadDocument
);

router.get(
  "/",
  protect,
  getDocuments
);

router.get(
  "/:id",
  protect,
  getDocumentById
);

router.delete(
  "/:id",
  protect,
  deleteDocument
);

module.exports = router;