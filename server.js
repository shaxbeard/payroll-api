const express = require("express");
const multer = require("multer");
const csvParser = require("csv-parser");
const uuid = require("uuid");
const mysql = require("mysql2");
const fs = require("fs");
const moment = require("moment");

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

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "s4mudg3e",
  database: "payroll",
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error("Database connection error: " + err.message);
  } else {
    console.log("Connected to MySQL database");
  }
});

// const headerMapping = {
//   date: "date",
//   "hours worked": "hours_worked",
//   "employee id": "employee_id",
//   "job group": "job_group",
// };

app.post("/upload", upload.single("csvFile"), (req, res) => {
  const filePath = req.file.path;
  console.log(req.file);
  // res.send("test");

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on("data", row => {
      // Rename the column headers using the mapping
      // for (const originalHeader in headerMapping) {
      //   const dbColumnName = headerMapping[originalHeader];
      //   row[dbColumnName] = row[originalHeader];
      //   delete row[originalHeader];
      // }

      // Parse and format the date from 'DD/MM/YYYY' to 'YYYY-MM-DD'
      const formattedDate = moment(row.date, "DD/MM/YYYY").format("YYYY-MM-DD");
      // Update the row with the formatted date
      row.date = formattedDate;

      // Insert data into MySQL database
      const query =
        "INSERT INTO tbl_payroll (date, hours_worked, employee_id, job_group) VALUES (?, ?, ?, ?)";
      const values = [
        row.date,
        row.hours_worked,
        row.employee_id,
        row.job_group,
      ];

      db.query(query, values, (err, result) => {
        if (err) {
          console.error("Error inserting data into MySQL: " + err.message);
        } else {
          console.log("Data inserted into MySQL");
        }
      });
    })
    .on("end", () => {
      // Remove the uploaded CSV file
      fs.unlinkSync(filePath);
      res
        .status(200)
        .json({ message: "CSV file uploaded and data inserted into MySQL" });
    });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});
