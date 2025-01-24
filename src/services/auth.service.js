const httpStatus = require("http-status");
const TokenService = require("./token.service");
const UserService = require("./user.service");
const ApiError = require("../utils/ApiError");
const { tokenTypes } = require("../constants/tokenTypes");
const TokenRepository = require("../repositories/token.repository");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email, password) => {
  const user = await UserService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (refreshToken) => {
  const refreshTokenDoc = await TokenService.verifyToken(
    refreshToken,
    tokenTypes.REFRESH
  );
  await refreshTokenDoc.deleteOne();
};

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  const refreshTokenDoc = await TokenService.verifyToken(
    refreshToken,
    tokenTypes.REFRESH
  );
  const user = await UserService.getUserById(refreshTokenDoc.user);
  if (!user) {
    throw new Error();
  }
  await refreshTokenDoc.deleteOne();
  return TokenService.generateAuthTokens(user);
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  const resetPasswordTokenDoc = await TokenService.verifyToken(
    resetPasswordToken,
    tokenTypes.RESET_PASSWORD
  );
  const user = await UserService.getUserById(resetPasswordTokenDoc.user);
  if (!user) {
    throw new Error();
  }
  await UserService.updateUserById(user.id, { password: newPassword });
  await TokenRepository.deleteMany({
    user: user.id,
    type: tokenTypes.RESET_PASSWORD,
  });
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise}
 */
const verifyEmail = async (verifyEmailToken) => {
  const verifyEmailTokenDoc = await TokenService.verifyToken(
    verifyEmailToken,
    tokenTypes.VERIFY_EMAIL
  );
  const user = await UserService.getUserById(verifyEmailTokenDoc.user);
  if (!user) {
    throw new Error();
  }
  await TokenRepository.deleteMany({
    user: user.id,
    type: tokenTypes.VERIFY_EMAIL,
  });
  await UserService.updateUserById(user.id, { isEmailVerified: true });
};

module.exports = {
  loginUserWithEmailAndPassword,
  logout,
  refreshAuth,
  verifyEmail,
  resetPassword,
};
