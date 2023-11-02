const express = require("express");
const UploadController = require("../controllers/UploadController");
const router = express.Router();

router.post(
  "/upload",
  UploadController.uploadMiddleware,
  UploadController.uploadCSV
);

module.exports = router;
