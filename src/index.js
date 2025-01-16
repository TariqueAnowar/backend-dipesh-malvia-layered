const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");

let server;
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info("Connected to MongoDB");
    server = app.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error.message || error}`);
    process.exit(1);
  });

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
