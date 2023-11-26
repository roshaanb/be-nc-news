const express = require("express");
const {
  handlePSQLErrors,
  handlesCustomErrors,
  handle500,
} = require("./controllers/errors.controllers.js");
const apiRouter = require("./routes/api-router.js");

// app setup
const app = express();
app.use(express.json());

// routes
app.use("/api", apiRouter);

// error handling
app.use(handlesCustomErrors);
app.use(handle500);

module.exports = app;
