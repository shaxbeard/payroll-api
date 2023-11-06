const mysql = require("mysql2");
require("dotenv").config();

console.log(
  "THis is my env variable for payroll_database --",
  process.env.PAYROLL_DATABASE
);

const db = mysql.createConnection({
  host: process.env.PAYROLL_HOST,
  user: process.env.PAYROLL_USERNAME,
  password: process.env.PAYROLL_PASSWORD,
  database: process.env.PAYROLL_DATABASE,
});

db.connect(err => {
  if (err) {
    console.error("Database connection error: " + err.message);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;
