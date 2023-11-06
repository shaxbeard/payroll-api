# Getting Started with this Project

1. Ensure that you have NodeJS installed
2. After you clone the repo, cd into the project root and enter `npm install` in the terminal.
3. Ensure that you have MySQL installed
4. Using MySQL, create a table called tbl_payroll in your local database/schema using this query:

CREATE TABLE `tbl_payroll` (
`id` int NOT NULL AUTO_INCREMENT,
`date` date DEFAULT NULL,
`hours_worked` double DEFAULT NULL,
`employee_id` int DEFAULT NULL,
`job_group` varchar(1) DEFAULT NULL,
`report_id` int DEFAULT NULL,
`uploaded_at` timestamp NULL DEFAULT NULL,
PRIMARY KEY (`id`)
);

5. Create a .env file in the project root and add the credentials for your local database to these ENV variables:

- PAYROLL_HOST=
- PAYROLL_USERNAME=
- PAYROLL_PASSWORD=
- PAYROLL_DATABASE

---

# Project Description

This project is a payroll system API with two endpoints.

1. The /upload endpoint allows users to upload a CSV file containing the number of hours worked per day per employee. Users can send a POST request containing a CSV file to the /upload endpoint, and the data will be stored in a database.

- NOTE - the CSV filename must be of the format time-report-x.csv, where x is the ID of the time report represented by an integer. For example, time-report-42.csv would represent a report with an ID of 42. Only one time report with the same ID will be allowed to be uploaded to the database.

- A sample input file named time-report-42.csv is included in this repo.

2. The /report endpoint generates a report detailing how much each employee should be paid in each biweekly pay period. Employees marked in job group A are paid $20/hr, and job group B is paid $30/hr.

# Future Plans

- Optimizations for the API will depend to some degree on how the front end collects and send data to the /upload endpoint, but more data validation in likely to be needed in the api.

- For example, unless the front end can guarentee that the CSV file has full and correct data in every row, then the api should perform this validation.

- Assuming that there will user authentication added to the front end, then the user data (id, email, etc) will likely need to be added as a new column to the table.

---
