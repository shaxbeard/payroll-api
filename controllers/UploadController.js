const csvParser = require("csv-parser");
const fs = require("fs");
const moment = require("moment");
const multer = require("multer");
const uuid = require("uuid");
const db = require("../database");

// Config Multer for file uploads
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, "time-report-" + uuid.v4() + ".csv");
  },
});

const upload = multer({ storage: storage });

module.exports = {
  uploadCSV: (req, res) => {
    const filePath = req.file.path;
    console.log(req.file);

    //Validation on the input filename here
    const reportFilename = req.file.originalname;

    //////////////////////////////////////////////////////////////////////////////////////
    // Check if the report ID already exists in the database
    const reportId = Number(reportFilename.split("-")[2].slice(0, -4));
    console.log("This is the report ID --", reportId);
    const checkQuery = "SELECT * FROM tbl_payroll WHERE report_id = ?";
    db.query(checkQuery, [reportId], (checkError, checkResults) => {
      if (checkError) {
        console.error("Error checking for existing report ID:", checkError);
        return res
          .status(500)
          .json({ error: "An error occurred while checking the report ID." });
      }

      if (checkResults.length > 0) {
        // Report ID already exists, return an error response
        return res
          .status(400)
          .json({ error: "Report with the same ID already exists." });
      }
      // Report ID is unique, proceed with processing the file

      ////////////////////////////////////////////////////////////////////////////////////////
      // Process the CSV file
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", row => {
          //Input validation needed here - don't allow CSV files with missing data on any row

          // Helper function to replace spaces with underscores
          function replaceSpacesWithUnderscores(header) {
            return header.replace(/\s/g, "_");
          }

          // Process each row, replacing spaces with underscores in column headers
          for (const key in row) {
            const newKey = replaceSpacesWithUnderscores(key);
            if (key !== newKey) {
              row[newKey] = row[key];
              delete row[key];
            }
          }

          // Parse and format the date from 'DD/MM/YYYY' to 'YYYY-MM-DD'
          const formattedDate = moment(row.date, "DD/MM/YYYY").format(
            "YYYY-MM-DD"
          );
          // Update the row with the formatted date
          row.date = formattedDate;

          /////////////////////////////////////////////////////////////////////////////////////
          // Insert data into tbl_payroll table
          const query =
            "INSERT INTO tbl_payroll (date, hours_worked, employee_id, job_group, report_id, uploaded_at) VALUES (?, ?, ?, ?, ?, ?)";
          const values = [
            row.date,
            row.hours_worked,
            row.employee_id,
            row.job_group,
            reportId,
            new Date(),
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
          res.status(200).json({
            message: "CSV file uploaded and data inserted into MySQL",
          });
        });
    });
  },
  uploadMiddleware: upload.single("csvFile"),
};
