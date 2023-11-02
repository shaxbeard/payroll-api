const express = require("express");
const ReportController = require("../controllers/ReportController");
const router = express.Router();

router.get("/report", ReportController.getReport);

module.exports = router;
