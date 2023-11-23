exports.handlePSQLErrors = (err, req, res, next) => {
  const psqlErrorCodes = {
    "22P02": { status: 400, msg: "Invalid article id" },
    "P0002": { status: 404, msg: "Article not found" },
  };
  if (err.code) {
    res
      .status(psqlErrorCodes[err.code].status)
      .send({ msg: psqlErrorCodes[err.code].msg });
  } else {
    next(err);
  }
};

exports.handlesCustomErrors = (err, req, res, next) => {
  if (err.status) {
    const { status, msg } = err;
    res.status(status).send({ msg });
  } else {
    next(err);
  }
};

exports.handle500 = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
};
