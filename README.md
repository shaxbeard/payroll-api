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

---

# How did you test that your implementation was correct?

- I created a primary test case by manually calculating the pay periods and amountPaid data for the sample time-report-42.csv file. My test was then simply to match the results of my manual calculation with the output of the report from the api.

---

# If this application was destined for a production environment, what would you add or change?

- Becuase this application calculates money that will be paid out, it is crucial that it does not have bugs that will cause erroneous payouts or fail to make payouts. Before deploying to production, this app should undergo thorough testing, including some sort of beta release to a subset of actual users where it can be monitored under real-world usage before it goes out to all users at scale.

- This may be out of scope for an evaluation of the api, but I would seriously reconsider the use of CSV files for data intake altogether. Can we not offer the users a front end that will collect data in a structured and web-native manner instead of having users enter submit data through CSV files?

- Optimizations for the API will depend to some degree on how the front end collects and send data to the /upload endpoint, but more data validation in likely to be needed in the api. For example, unless the front end can guarentee that the CSV file has full and correct data in every row, then the api should perform this validation.

- Assuming that there will user authentication added to the front end, then the user data (id, email, etc) will likely need to be added as a new column to the table so that there is a record of who actually uploaded each individual time report

---

# What compromises did you have to make as a result of the time constraints of this challenge?

- I had to compromise on testing and data validation. It took me about 3 hours of development time just to stand the project up and get the endpoints working to satisfy the basic requirements. As I was working, I developed a preliminary list of topics for validation that should be implemented given more time. For example:

- What if the user submits a file with just one or two empty cells that should have data?
- What if the data is complete in the CSV but the data types are set incorrectly by the user?
- What if the filename is valid like "time-report-42.csv" but the contents of the file are completely wrong - say, the file is the lunch order for hamburgers and tacos instead of having any of the correct columns?
- What if the data in a CSV file is correct and complete, but the filename is incorrect - like "lunch-order-12242023"?
- Et cetera...
