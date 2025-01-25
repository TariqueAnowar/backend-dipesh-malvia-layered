const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");
const connectToDatabase = require("./config/database");

let server;

// Configurable retry settings
const MAX_RETRIES = process.env.DB_MAX_RETRIES || 3;
const RETRY_DELAY_MS = process.env.DB_RETRY_DELAY_MS || 1000;

const startServer = async () => {
  try {
    const isConnected = await connectToDatabase(MAX_RETRIES, RETRY_DELAY_MS);
    if (!isConnected) {
      logger.error("Failed to connect to database. Server will not start.");
      process.exit(1);
    }

    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  } catch (error) {
    logger.error("Error starting server:", error.message);
    process.exit(1);
  }
};

startServer();

// Handle application shutdown
const shutdown = async (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info("Server closed");
      try {
        await mongoose.connection.close();
        logger.info("Database connection closed");
        process.exit(0);
      } catch (error) {
        logger.error("Error during database shutdown:", error.message);
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  shutdown("UNCAUGHT_EXCEPTION or UNHANDLED_REJECTION");
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
