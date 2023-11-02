const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "s4mudg3e",
  database: "payroll",
});

db.connect(err => {
  if (err) {
    console.error("Database connection error: " + err.message);
  } else {
    console.log("Connected to MySQL database");
  }
});

module.exports = db;
