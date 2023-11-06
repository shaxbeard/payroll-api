const db = require("../database");

exports.getReport = (req, res) => {
  // Query to calculate pay periods and amountPaid
  const sqlQuery = `
    SELECT
      employee_id,
      CASE
          WHEN DAY(date) <= 15 THEN DATE_FORMAT(date, '%Y-%m-01')
          ELSE DATE_FORMAT(date, '%Y-%m-16')
      END AS pay_period_start,
      CASE
          WHEN DAY(date) <= 15 THEN DATE_FORMAT(LAST_DAY(date - INTERVAL 1 DAY), '%Y-%m-15')
          ELSE LAST_DAY(date)
      END AS pay_period_end,
      SUM(hours_worked * CASE job_group WHEN 'A' THEN 20 WHEN 'B' THEN 30 ELSE 0 END) AS amount_paid
    FROM payroll.tbl_payroll
    GROUP BY employee_id, pay_period_start, pay_period_end
  `;

  db.query(sqlQuery, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res
        .status(500)
        .json({ error: "An error occurred while generating the report." });
    } else {
      // Format the results to nest the 2 pay periods inside of a payPeriod property
      // and to convert the amountPaid to a dollar format
      const formattedResults = results.map(result => ({
        employeeId: result.employee_id,
        payPeriod: {
          startDate: result.pay_period_start,
          endDate: result.pay_period_end,
        },
        amountPaid: `$${result.amount_paid.toFixed(2)}`,
      }));

      // Sort the formattedResults first by employeeId and then by startDate
      formattedResults.sort((a, b) => {
        // First, compare by employeeId
        if (a.employeeId < b.employeeId) return -1;
        if (a.employeeId > b.employeeId) return 1;

        // If employeeId is the same, compare by startDate
        if (a.payPeriod.startDate < b.payPeriod.startDate) return -1;
        if (a.payPeriod.startDate > b.payPeriod.startDate) return 1;

        return 0; // If they are equal in both employeeId and startDate
      });

      // Return the formatted results as JSON
      res.json({ payrollReport: { employeeReports: formattedResults } });
    }
  });
};
