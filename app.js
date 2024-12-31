const express = require("express");
const cors = require("cors");
const contactRoutes = require("./routes/contact.routes");
const userRoutes = require("./routes/user.routes");
const { errorHandler } = require("./middleware/errorHandler");

module.exports = async (app) => {
  // Middleware
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));
  app.use(cors());

  // Routes
  app.use("/api/contacts", contactRoutes);
  app.use("/api/users", userRoutes);

  // Route not found
  app.use((req, res) => {
    res.status(404).json({
      message: "Route not found",
      path: req.originalUrl,
      method: req.method,
    });
  });

  // error handling
  app.use(errorHandler);
};
