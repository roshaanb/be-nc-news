const express = require("express");
const {
  handlePSQLErrors,
  handlesCustomErrors,
  handle500,
} = require("./controllers/errors.controllers.js");
const apiRouter = require("./routes/api-router.js");

const app = express();
app.use(express.json());

app.use("/api", apiRouter);

app.use(handlePSQLErrors);
app.use(handlesCustomErrors);
app.use(handle500);

module.exports = app;
