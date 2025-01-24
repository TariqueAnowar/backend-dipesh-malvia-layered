const rateLimit = require("express-rate-limit");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

// Strict limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  skipSuccessfulRequests: true,
  handler: (req, res, next) => {
    throw new ApiError(
      httpStatus.TOO_MANY_REQUESTS,
      "Too many authentication attempts, please try again after 15 minutes"
    );
  },
});

// General API limiter (more permissive)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // higher limit for regular endpoints
  handler: (req, res, next) => {
    throw new ApiError(
      httpStatus.TOO_MANY_REQUESTS,
      "Too many requests from this IP, please try again after 15 minutes"
    );
  },
});

// Very strict limiter for sensitive operations
const sensitiveRoutesLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // very limited attempts
  handler: (req, res, next) => {
    throw new ApiError(
      httpStatus.TOO_MANY_REQUESTS,
      "Too many sensitive operations, please try again after 1 hour"
    );
  },
});

module.exports = {
  authLimiter,
  apiLimiter,
  sensitiveRoutesLimiter,
};
