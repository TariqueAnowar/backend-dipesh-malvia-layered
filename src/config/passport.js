const { Strategy, ExtractJwt } = require("passport-jwt");
const UserService = require("../services/user.service");
const config = require("./config");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.jwt.secret,
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await UserService.getUserById(payload.sub);
    if (!user) {
      return done(new ApiError(httpStatus.NOT_FOUND, "User not found"), false);
    }
    return done(null, user);
  } catch (error) {
    return done(
      new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Internal server error"),
      false
    );
  }
};

const strategy = new Strategy(opts, jwtVerify);

module.exports = strategy;
