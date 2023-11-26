exports.handlesCustomErrors = (err, req, res, next) => {
  console.log("custom", err)
  if (err.statusCode) {
    const { statusCode, msg } = err;
    res.status(statusCode).send({ msg });
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  console.log("5000", err)
  res.status(500).send({ msg: "Internal server error" });
};
