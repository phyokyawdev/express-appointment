const express = require("express");
require("express-async-errors");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const apiRouter = require("./routes");
const { handleError } = require("./middlewares");
require("./services/passport");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// routes
app.use("/api", apiRouter);
app.all("*", async (req, res, next) => {
  next(createError(404, "Route not exist"));
});

// error handler
app.use(handleError);

module.exports = app;
