const express = require("express");
const { authenticateJWT, authorizeRole } = require("../middleware/auth");
const UserController = require("../controllers/user.controller");
const {
  updateUserSchema,
  deleteUserSchema,
} = require("../validation/user.validation");
const validate = require("../middleware/validate");
const router = express.Router();

// Admin only routes
router.use(authenticateJWT);
router.use(authorizeRole("admin"));

// Get all users
router.get("/users", UserController.getUsers);

// Update user
router.patch(
  "/users/:userId",
  validate(updateUserSchema),
  UserController.updateUser
);

// Delete user
router.delete(
  "/users/:userId",
  validate(deleteUserSchema),
  UserController.deleteUser
);

module.exports = router;
