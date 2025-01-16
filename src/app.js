const express = require("express");
const cors = require("cors");
const morgan = require("./config/morgan");
const config = require("./config/config");
const { authRoutes, contactRoutes } = require("./routes");
const handleError = require("./middleware/error");
const ApiError = require("./utils/ApiError");
const httpStatus = require("http-status");
const passport = require("passport");
const strategy = require("./config/passport");

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// Middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cors());

// JWT Authentication
passport.use(strategy);
app.use(passport.initialize());

// Routes
app.use("/api/contacts", contactRoutes);
app.use("/api/auth", authRoutes);

// Route not found
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Route Not Found"));
});

app.use(handleError);

module.exports = app;
