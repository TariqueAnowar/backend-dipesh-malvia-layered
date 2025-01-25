const mongoose = require("mongoose");
const config = require("./config");
const logger = require("./logger");

const connectToDatabase = async (retries = 2, retryDelayMs = 1000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(config.mongoose.url, config.mongoose.options);
      logger.info("Connected to MongoDB");

      return true; // Indicate successful connection
    } catch (error) {
      logger.error(`Connection attempt ${attempt} failed: ${error.message}`);

      if (attempt === retries) {
        logger.error("Max retry attempts reached. Exiting...");
        return false; // Indicate failed connection
      }

      // Wait before retrying (exponential backoff)
      await new Promise((resolve) =>
        setTimeout(resolve, retryDelayMs * attempt)
      );
    }
  }
};

module.exports = connectToDatabase;
