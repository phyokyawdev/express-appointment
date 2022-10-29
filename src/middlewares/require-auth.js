const passport = require("passport");
const createError = require("http-errors");

/**
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
function requireAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) return next(err);

    if (!user) return next(createError(401, "Not Authorized"));

    req.user = user;
    next();
  })(req, res, next);
}

module.exports = requireAuth;
