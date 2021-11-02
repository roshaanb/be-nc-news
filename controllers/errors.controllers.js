exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    console.log(err);
    res.status(400).send({ msg: "Invalid input" });
  } else {
    next(err);
  }
};

exports.handlesCustomErrors = (err, req, res, next) => {
  if (err.status) {
    console.log("here");
    const { status, msg } = err;
    res.status(status).send({ msg });
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
