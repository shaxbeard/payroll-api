const express = require("express");
const uploadRoute = require("./routes/upload");
const reportRoute = require("./routes/report");

const app = express();
const PORT = 2972;

app.use("/", uploadRoute);
app.use("/", reportRoute);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});
