const passport = require("passport");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const authenticateJWT = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user || info) {
      return next(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          "Unauthorized access: Please authenticate"
        )
      );
    }
    // Attach user to request body
    req.user = user;
    // Proceed to the next middleware
    next();
  })(req, res, next);
};

module.exports = authenticateJWT;
