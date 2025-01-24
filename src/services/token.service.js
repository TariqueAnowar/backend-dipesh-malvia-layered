const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const httpStatus = require("http-status");
const config = require("../config/config");
const UserService = require("./user.service");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../constants/tokenTypes");
const TokenRepository = require("../repositories/token.repository");

/**
 * Generate a token
 * @param {string} userId - The ID of the user
 * @param {Date} expires - The expiration date of the token
 * @param {string} type - The type of the token
 * @param {string} secret - The secret key for the token
 * @returns {string} The generated token
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: dayjs().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token - The token to save
 * @param {string} userId - The ID of the user
 * @param {Date} expires - The expiration date of the token
 * @param {string} type - The type of the token
 * @param {boolean} blacklisted - Whether the token is blacklisted
 * @returns {Promise<Token>} The saved token
 */
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenData = {
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  };
  return await TokenRepository.create(tokenData);
};

/**
 * Verify a token
 * @param {string} token - The token to verify
 * @param {string} type - The type of the token
 * @returns {Promise<Token>} The verified token
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await TokenRepository.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Token not found");
  }
  return tokenDoc;
};

/**
 * Generate authentication tokens
 * @param {User} user - The user to generate tokens for
 * @returns {Promise<Object>} The generated tokens
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = dayjs().add(
    config.jwt.accessExpirationMinutes,
    "minute"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    tokenTypes.ACCESS
  );

  const refreshTokenExpires = dayjs().add(
    config.jwt.refreshExpirationDays,
    "day"
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    tokenTypes.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await UserService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No users found with this email");
  }
  const expires = dayjs().add(
    config.jwt.resetPasswordExpirationMinutes,
    "minutes"
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    tokenTypes.RESET_PASSWORD
  );
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user) => {
  const expires = dayjs().add(
    config.jwt.verifyEmailExpirationMinutes,
    "minutes"
  );
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    tokenTypes.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
  return verifyEmailToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateVerifyEmailToken,
  generateResetPasswordToken,
};
