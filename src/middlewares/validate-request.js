const { validationResult } = require("express-validator");
const createHttpError = require("http-errors");

const validateRequest = (validationRules = []) => [
  ...validationRules,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty())
      throw createHttpError(400, "Invalid arguments", {
        errors: errors.array(),
      });

    next();
  },
];

module.exports = validateRequest;
