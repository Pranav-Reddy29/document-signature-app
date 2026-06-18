const express = require("express");

const router = express.Router();

const protect = require(
  "../middleware/authMiddleware"
);

const {
  createField,
  getFields,
  getSignerFields,
  deleteField,
} = require(
  "../controllers/signatureFieldController"
);

/*
  Owner creates a signature field
*/
router.post(
  "/",
  protect,
  createField
);

/*
  Get all fields for a document
*/
router.get(
  "/document/:documentId",
  getFields
);

/*
  Get fields assigned to a signer
*/
router.get(
  "/document/:documentId/signer/:signerId",
  getSignerFields
);

/*
  Owner deletes a field
*/
router.delete(
  "/:fieldId",
  protect,
  deleteField
);

module.exports = router;