const express = require("express");
const createError = require("http-errors");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const { requireAuth } = require("../middlewares");
const router = express.Router();

router.post("/signup", async (req, res, next) => {
  passport.authenticate("signup", async (err, user, info) => {
    try {
      if (err) throw err;
      if (!user) return next(createError(409, info.message));

      res.json({
        message: "Signup successful",
        user: req.user,
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, info) => {
    try {
      if (err) throw err;
      if (!user) return next(createError(401, "Invalid email or password"));

      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);

        const token = createToken(user);
        return res.json({ token });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.get("/profile", requireAuth, (req, res, next) => {
  res.json({
    message: "You made it to the secure route",
    user: req.user,
  });
});

module.exports = router;

/**
 *
 * @param {*} user  user model
 * @returns  jwt signed token
 */
function createToken(user) {
  const body = { _id: user._id, email: user.email, role: user.role };
  const token = jwt.sign({ user: body }, keys.jwtKey);
  return token;
}
