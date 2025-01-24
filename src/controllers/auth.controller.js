const TokenService = require("../services/token.service");
const UserService = require("../services/user.service");
const AuthService = require("../services/auth.service");
const EmailService = require("../services/email.service");
const httpStatus = require("http-status");
const asyncHandler = require("express-async-handler");

class AuthController {
  register = asyncHandler(async (req, res, next) => {
    const user = await UserService.createUser(req.body);
    const tokens = await TokenService.generateAuthTokens(user);
    return res.status(httpStatus.CREATED).json({ user, tokens });
  });

  login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await AuthService.loginUserWithEmailAndPassword(
      email,
      password
    );
    const tokens = await TokenService.generateAuthTokens(user);
    res.status(httpStatus.OK).json({ user, tokens });
  });

  logout = asyncHandler(async (req, res) => {
    await AuthService.logout(req.body.refreshToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  refreshTokens = asyncHandler(async (req, res) => {
    const tokens = await AuthService.refreshAuth(req.body.refreshToken);
    res.status(httpStatus.OK).send({ tokens });
  });

  forgotPassword = asyncHandler(async (req, res) => {
    const resetPasswordToken = await TokenService.generateResetPasswordToken(
      req.body.email
    );
    await EmailService.sendResetPasswordEmail(
      req.body.email,
      resetPasswordToken
    );
    res.status(httpStatus.NO_CONTENT).send();
  });

  resetPassword = asyncHandler(async (req, res) => {
    await AuthService.resetPassword(req.query.token, req.body.password);
    res.status(httpStatus.NO_CONTENT).send();
  });

  sendVerificationEmail = asyncHandler(async (req, res) => {
    const verifyEmailToken = await TokenService.generateVerifyEmailToken(
      req.user
    );
    await EmailService.sendVerificationEmail(req.user.email, verifyEmailToken);
    res.status(httpStatus.NO_CONTENT).send();
  });

  verifyEmail = asyncHandler(async (req, res) => {
    await AuthService.verifyEmail(req.query.token);
    res.status(httpStatus.NO_CONTENT).send();
  });

  // ... other controller methods
}

module.exports = new AuthController();
