const express = require("express");
const mongoose = require("mongoose");
const App = require("./app");
const dbConnection = require("./config/dbConnection");
const dotenv = require("dotenv").config();

let server;

// Connect to database before starting server
const startServer = async () => {
  try {
    const app = express();

    // const isConnected = await dbConnection();

    // if (!isConnected) {
    //   console.error("Failed to connect to database. Server will not start.");
    //   process.exit(1);
    // }

    await App(app);

    const PORT = process.env.PORT || 8000;

    server = app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

// Handle application shutdown
const shutdown = async (signal) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  // Stop accepting new requests
  server.close(() => {
    console.log("HTTP server closed !");
  });

  try {
    // Close database connection
    await mongoose.connection.close();
    console.log("Database connection closed !");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error.message);
    process.exit(1);
  }
};

// Handle database connection events
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected !");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error.message);
});

// Handle different termination signals
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Start the server
startServer();
