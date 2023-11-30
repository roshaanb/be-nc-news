const express = require("express");
const {
  handlesCustomErrors,
  handle500,
} = require("./controllers/errors.controllers.js");
const apiRouter = require("./routes/api.router.js");

const fs = require("fs/promises");

// app setup
const app = express();
app.use(express.json());

// routes
app.get("/api", (req, res, next) => {
  fs.readFile("./endpoints.json", "utf8").then((json) => {
    res.status(200).setHeader("Content-type", "application/json").send(json);
  });
});

app.use("/api", apiRouter);

// error handling
app.use(handlesCustomErrors);
app.use(handle500);

// handling route errors.
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = app;
