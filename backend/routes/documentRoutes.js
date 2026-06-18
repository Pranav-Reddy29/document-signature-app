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
  getPublicDocument,
  deleteDocument,
  downloadSignedDocument,
  viewSignedDocument,
  getAuditLogs,
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

/*
  IMPORTANT:
  Public routes must be
  before /:id route
*/

router.get(
  "/public/:id",
  getPublicDocument
);

router.get(
  "/audit/:documentId",
  protect,
  getAuditLogs
);

router.get(
  "/signed/view/:id",
  protect,
  viewSignedDocument
);

router.get(
  "/signed/download/:id",
  protect,
  downloadSignedDocument
);

/*
  Optional fallback route
  if old frontend URLs exist
*/

router.get(
  "/download/:id",
  protect,
  downloadSignedDocument
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