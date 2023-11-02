const express = require("express");
const multer = require("multer");
const uuid = require("uuid");
const UploadController = require("../controllers/UploadController");

const router = express.Router();

//Config Multer for file uploads
const storage = multer.diskStorage({
  // destination: "../uploads/",
  destination: function (req, file, cb) {
    cb(null, "../uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "time-report-" + uuid.v4() + ".csv");
  },
});

// Initialize upload
const upload = multer({ storage: storage });

router.post("/upload", upload.single("csvFile"), UploadController.uploadCSV);

module.exports = router;
