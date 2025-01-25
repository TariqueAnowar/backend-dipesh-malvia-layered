const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("./config/morgan");
const config = require("./config/config");
const authRoutes = require("./routes/auth.routes");
const handleError = require("./middleware/error");
const ApiError = require("./utils/ApiError");
const httpStatus = require("http-status");
const passport = require("passport");
const strategy = require("./config/passport");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const {
  authLimiter,
  apiLimiter,
  sensitiveRoutesLimiter,
} = require("./middleware/rateLimiter");

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// enable cors
app.use(cors());
app.options("*", cors());

// JWT Authentication
passport.use(strategy);
app.use(passport.initialize());

// Rate Limiter
if (config.env === "production" || config.env === "development") {
  app.use("/api/auth", authLimiter);
  app.use("/api/admin", sensitiveRoutesLimiter);
  app.use("/api", apiLimiter);
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(httpStatus.OK).send("OK");
});

// Route not found
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Route Not Found"));
});

app.use(handleError);

module.exports = app;
