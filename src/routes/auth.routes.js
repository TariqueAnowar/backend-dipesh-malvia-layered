const express = require("express");
const AuthController = require("../controllers/auth.controller");
const { authenticateJWT } = require("../middleware/auth");
const validate = require("../middleware/validate");
const {
  registerSchema,
  loginSchema,
  logoutSchema,
  refreshTokensSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../validation/auth.validation");

const router = express.Router();

router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);

router.post("/logout", validate(logoutSchema), AuthController.logout);
router.post(
  "/refresh-tokens",
  validate(refreshTokensSchema),
  AuthController.refreshTokens
);
router.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  AuthController.resetPassword
);
router.post(
  "/send-verification-email",
  authenticateJWT,
  AuthController.sendVerificationEmail
);
router.get(
  "/verify-email",
  validate(verifyEmailSchema),
  AuthController.verifyEmail
);

module.exports = router;
