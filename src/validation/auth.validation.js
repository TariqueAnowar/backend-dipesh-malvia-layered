const Joi = require("joi");
const { password } = require("./custom.validation");

const registerSchema = {
  body: Joi.object({
    name: Joi.string().required(),
    password: Joi.string().min(8).required().custom(password),
    email: Joi.string().email().required(),
  }),
};
const loginSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};
const logoutSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokensSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required(),
  }),
};

const verifyEmailSchema = {
  query: Joi.object({
    token: Joi.string().required(),
  }),
};

const forgotPasswordSchema = {
  body: Joi.object({
    email: Joi.string().email().required(),
  }),
};

const resetPasswordSchema = {
  query: Joi.object({
    token: Joi.string().required(),
  }),
};

module.exports = {
  registerSchema,
  loginSchema,
  logoutSchema,
  refreshTokensSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
