const Joi = require("joi");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");

const validate = (schemas) => (req, res, next) => {
  const validationOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
  };
  const validationResults = {};

  // Validate each part of the request
  ["params", "query", "body"].forEach((key) => {
    if (schemas[key]) {
      const { error, value } = schemas[key].validate(
        req[key],
        validationOptions
      );
      if (error) {
        const errorMessage = error.details
          .map((detail) => detail.message)
          .join(", ");
        return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
      }
      validationResults[key] = value;
    }
  });

  // Assign validated values back to the request object
  Object.assign(req, validationResults);
  next();
};

module.exports = validate;
