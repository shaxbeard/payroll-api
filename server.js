const express = require("express");
const multer = require("multer");
const uuid = require("uuid");

const app = express();
const PORT = 2972;

//Config Multer for file uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, "time-report-" + uuid.v4() + ".csv");
  },
});

// Initialize upload
const upload = multer({ storage: storage });

app.post("/upload", upload.single("csvFile"), (req, res) => {
  const filePath = req.file.path;

  console.log(req.file);
  res.send("test");
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});
