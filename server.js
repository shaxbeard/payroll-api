const express = require("express");
const uploadRoute = require("./routes/upload");

const app = express();
const PORT = 2972;

app.use("/", uploadRoute);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});
