const express = require("express");
const { authenticateJWT, authorizeRole } = require("../middleware/auth");
const UserController = require("../controllers/user.controller");
const { updateProfileSchema } = require("../validation/user.validation");
const validate = require("../middleware/validate");

const router = express.Router();

// Protected routes for both admin and normal users
router.use(authenticateJWT);

// Get own profile - accessible by both roles
router.get(
  "/profile",
  authorizeRole("user", "admin"),
  UserController.getProfile
);

// Update own profile - accessible by both roles
router.patch(
  "/profile",
  authorizeRole("user", "admin"),
  validate(updateProfileSchema),
  UserController.updateProfile
);

module.exports = router;
