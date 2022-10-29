function handleError(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err.status === 400) {
    return res.status(err.status).send({ errors: err.errors });
  }

  if (err.expose) {
    return res.status(err.status).send({ error: err.message });
  }

  console.log(err);
  res.status(500).send({ error: "Something went wrong" });
}

module.exports = handleError;
